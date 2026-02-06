import { Injectable } from '@angular/core';
import { Table } from 'dexie';
import { db } from '@core/db';
import { ExercisePerformance } from '@feat/exercises/models';

@Injectable({
  providedIn: 'root',
})
export class ExercisesPerformanceRepository {
  private table: Table<ExercisePerformance, string> = db.performance;

  create(performance: ExercisePerformance) {
    return this.table.add(performance);
  }

  get(id: ExercisePerformance['exerciseId']) {
    return this.table.get(id);
  }

  update(id: ExercisePerformance['exerciseId'], patch: Partial<ExercisePerformance>) {
    return this.table.update(id, patch);
  }

  delete(id: ExercisePerformance['exerciseId']) {
    return this.table.delete(id);
  }

  getAll() {
    return this.table.toArray();
  }
}
