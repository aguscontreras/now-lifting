import { inject, Injectable } from '@angular/core';
import { ExercisesPerformanceRepository, ExercisesRepository } from '@feat/exercises/data';
import { ExercisesPerformanceStore, ExercisesStore } from '@feat/exercises/state';

@Injectable({ providedIn: 'root' })
export class ExerciseHydrationService {
  private exercisesRepository = inject(ExercisesRepository);
  private exercisesStore = inject(ExercisesStore);
  private exercisesPerformanceRepository = inject(ExercisesPerformanceRepository);
  private exercisesPerformanceStore = inject(ExercisesPerformanceStore);

  async hydrate() {
    const exercises = await this.exercisesRepository.getAll();
    const performances = await this.exercisesPerformanceRepository.getAll();
    await this.exercisesStore.set(exercises);
    await this.exercisesPerformanceStore.set(performances);
  }
}
