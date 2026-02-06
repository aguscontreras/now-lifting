import { Injectable, inject } from '@angular/core';
import { Exercise, ExercisePerformance } from '@feat/exercises/models';
import {
  ExercisesPerformanceRepository,
  ExercisesRepository,
} from '@feat/exercises/data';
import { ExercisesStore } from '@feat/exercises/state';
import { ExercisesPerformanceStore } from '@feat/exercises/state';

export type CreateExerciseDto = Pick<
  Exercise,
  'name' | 'muscleGroup' | 'description' | 'link'
>;

@Injectable({
  providedIn: 'root',
})
export class ExercisesService {
  private exercisesStore = inject(ExercisesStore);
  private exercisesRepository = inject(ExercisesRepository);
  private exercisesPerformanceRepository = inject(ExercisesPerformanceRepository);
  private exercisesPerformanceStore = inject(ExercisesPerformanceStore);

  async create(dto: CreateExerciseDto) {
    const exercise = new Exercise(
      dto.name,
      dto.muscleGroup,
      dto.description,
      dto.link,
    );

    const performance = new ExercisePerformance(exercise.id);

    await this.exercisesRepository.create(exercise);
    await this.exercisesPerformanceRepository.create(performance);

    await this.exercisesStore.add(exercise);
    await this.exercisesPerformanceStore.add(performance);

    return exercise;
  }

  async update(id: Exercise['id'], dto: Partial<Exercise>) {
    await this.exercisesRepository.update(id, dto);
    await this.exercisesStore.update(id, dto);
  }

  async remove(id: Exercise['id']) {
    await this.exercisesRepository.delete(id);
    await this.exercisesStore.remove(id);
    await this.exercisesPerformanceRepository.delete(id);
    await this.exercisesPerformanceStore.remove(id);
  }
}
