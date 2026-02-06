import { inject, Injectable } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
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
  resetActiveId,
} from '@ngneat/elf-entities';

import { ExercisesPerformanceStore } from '@feat/exercises/state';
import { Exercise, ExerciseWithPerformance } from '@feat/exercises/models';

@Injectable({
  providedIn: 'root',
})
export class ExercisesStore {
  private store = createStore(
    { name: 'exercises' },
    withEntities<Exercise>(),
    withActiveId(),
  );

  private performanceStore = inject(ExercisesPerformanceStore);

  exercises$ = this.store.pipe(selectAllEntities());
  active$ = this.store.pipe(selectActiveEntity());

  exercisesWithPerformance$: Observable<ExerciseWithPerformance[]> =
    combineLatest([this.exercises$, this.performanceStore.performances$]).pipe(
      map(([exercises, performances]) =>
        exercises.map((ex) => ({
          ...ex,
          performance: performances.find((p) => p.exerciseId === ex.id),
        })),
      ),
    );

  add(exercise: Exercise) {
    this.store.update(addEntities(exercise));
  }

  update(id: Exercise['id'], exercise: Partial<Exercise>) {
    this.store.update(updateEntities(id, exercise));
  }

  remove(id: Exercise['id']) {
    this.store.update(deleteEntities(id));
  }

  set(exercises: Exercise[]) {
    this.store.update(setEntities(exercises));
  }

  setActive(id: Exercise['id'] | null) {
    this.store.update(setActiveId(id));
  }

  clearActive() {
    this.store.update(resetActiveId());
  }
}
