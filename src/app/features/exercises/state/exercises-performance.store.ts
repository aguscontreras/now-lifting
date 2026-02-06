import { Injectable } from '@angular/core';
import { createStore } from '@ngneat/elf';
import {
  withActiveId,
  withEntities,
  selectAllEntities,
  selectActiveEntity,
  addEntities,
  updateEntities,
  deleteEntities,
  setActiveId,
  setEntities,
} from '@ngneat/elf-entities';

import { ExercisePerformance } from '@feat/exercises/models';

@Injectable({
  providedIn: 'root',
})
export class ExercisesPerformanceStore {
  private store = createStore(
    { name: 'exercises-performance' },
    withEntities<ExercisePerformance, 'exerciseId'>({ idKey: 'exerciseId' }),
    withActiveId(),
  );

  performances$ = this.store.pipe(selectAllEntities());
  active$ = this.store.pipe(selectActiveEntity());

  add(performance: ExercisePerformance) {
    this.store.update(addEntities(performance));
  }

  update(performance: ExercisePerformance) {
    this.store.update(updateEntities(performance.exerciseId, performance));
  }

  remove(id: ExercisePerformance['exerciseId']) {
    this.store.update(deleteEntities(id));
  }

  set(performance: ExercisePerformance[]) {
    this.store.update(setEntities(performance));
  }

  setActive(id: ExercisePerformance['exerciseId'] | null) {
    this.store.update(setActiveId(id));
  }
}
