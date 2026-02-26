import { inject, Injectable } from '@angular/core';
import { Table } from 'dexie';
import { db } from '@core/db';
import { RmCalculator } from '@core/domain';
import { WorkoutLog } from '@feat/workout-logs/models';
import { Exercise } from '@feat/exercises/models';

@Injectable({
  providedIn: 'root',
})
export class WorkoutLogsRepository {
  private table: Table<WorkoutLog, string> = db.workoutLogs;
  private rmCalculator = inject(RmCalculator);

  constructor() {
    this.table.hook('creating', (_primKey, log) => {
      log.oneRm = this.rmCalculator.calculate1RM(log.weight!, log.reps!);
    });

    this.table.hook('updating', (modifications, _primKey, obj) => {
      let log: Pick<WorkoutLog, 'reps' | 'weight' | 'oneRm'> = {
        reps: (modifications as Partial<WorkoutLog>).reps ?? obj.reps,
        weight: (modifications as Partial<WorkoutLog>).weight ?? obj.weight,
        oneRm: obj.oneRm,
      };

      log.oneRm = this.rmCalculator.calculate1RM(log.weight!, log.reps!);

      return log;
    });
  }

  create(workoutLog: WorkoutLog) {
    return this.table.add(workoutLog);
  }

  get(id: WorkoutLog['id']) {
    return this.table.get(id);
  }

  getCount(exerciseId: Exercise['id']) {
    return this.table.where('exerciseId').equals(exerciseId).count();
  }

  getSortedByDate(exerciseId: Exercise['id'], limit = 0) {
    return this.table
      .where('exerciseId')
      .equals(exerciseId)
      .sortBy('date')
      .then((e) => e.reverse())
      .then((e) => {
        return limit > 0 ? e.slice(0, limit) : e;
      });
  }

  getFirstByDate(exerciseId: Exercise['id']) {
    return this.table
      .where('exerciseId')
      .equals(exerciseId)
      .sortBy('date')
      .then((e) => e.reverse())
      .then((e) => e.slice(-1));
  }

  getMaxOneRm(exerciseId: Exercise['id']) {
    return this.table
      .where('exerciseId')
      .equals(exerciseId)
      .sortBy('oneRm', (e) => e.reverse()[0].oneRm ?? 0);
  }

  getByExerciseId(exerciseId: Exercise['id']) {
    return this.table
      .where('exerciseId')
      .equals(exerciseId)
      .reverse()
      .sortBy('date');
  }

  update(id: WorkoutLog['id'], patch: Partial<WorkoutLog>) {
    return this.table.update(id, patch);
  }

  delete(id: WorkoutLog['id']) {
    return this.table.delete(id);
  }

  getAll() {
    return this.table.toArray();
  }
}
