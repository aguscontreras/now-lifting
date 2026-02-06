import { Injectable } from '@angular/core';
import { Table } from 'dexie';
import { db } from '@core/db';
import { MuscleGroupName } from '@core/domain';
import { Exercise } from '@feat/exercises/models';

@Injectable({
  providedIn: 'root',
})
export class ExercisesRepository {
  private table: Table<Exercise, string> = db.exercises;
  
  create(exercise: Exercise) {
    return this.table.add(exercise);
  }

  get(id: Exercise['id']) {
    return this.table.get(id);
  }

  getByMuscularGroup(muscleGroupName: MuscleGroupName) {
    return this.table.where('muscleGroupName').equals(muscleGroupName);
  }

  update(id: Exercise['id'], patch: Partial<Exercise>) {
    return this.table.update(id, patch);
  }

  delete(id: Exercise['id']) {
    return this.table.delete(id);
  }

  getAll() {
    return this.table.toArray();
  }
}
