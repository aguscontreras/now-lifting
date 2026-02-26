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

  update(
    exerciseId: ExercisePerformance['exerciseId'],
    performance: Partial<ExercisePerformance>,
  ) {
    this.store.update(updateEntities(exerciseId, performance));
  }

  remove(exerciseId: ExercisePerformance['exerciseId']) {
    this.store.update(deleteEntities(exerciseId));
  }

  set(performance: ExercisePerformance[]) {
    this.store.update(setEntities(performance));
  }

  setActive(exerciseId: ExercisePerformance['exerciseId'] | null) {
    this.store.update(setActiveId(exerciseId));
  }
}
