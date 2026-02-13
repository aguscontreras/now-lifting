import { Injectable } from '@angular/core';
import { Table } from 'dexie';
import { db } from '@core/db';
import { WorkoutLog } from '@feat/workout-logs/models';
import { Exercise } from '@feat/exercises/models';

@Injectable({
  providedIn: 'root',
})
export class WorkoutLogsRepository {
  private table: Table<WorkoutLog, string> = db.workoutLogs;

  create(workoutLog: WorkoutLog) {
    return this.table.add(workoutLog);
  }

  get(id: WorkoutLog['id']) {
    return this.table.get(id);
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
