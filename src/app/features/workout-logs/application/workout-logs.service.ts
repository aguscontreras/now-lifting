import { inject, Injectable } from '@angular/core';
import { WorkoutLogsRepository } from '@feat/workout-logs/data';
import { WorkoutLogsStore } from '@feat/workout-logs/state';
import { DummyLog, WorkoutLog } from '@feat/workout-logs/models';
import { Exercise, ExercisePerformance } from '@feat/exercises/models';
import { ExercisesPerformanceRepository } from '@feat/exercises/data';
import { ExercisesPerformanceStore } from '@feat/exercises/state';

export type CreateWorkoutLogDTO = { exerciseId: Exercise['id'] } & DummyLog;

@Injectable({ providedIn: 'root' })
export class WorkoutLogService {
  private logsRepo = inject(WorkoutLogsRepository);
  private logsStore = inject(WorkoutLogsStore);
  private performanceRepo = inject(ExercisesPerformanceRepository);
  private performanceStore = inject(ExercisesPerformanceStore);

  async loadForExercise(exerciseId: string) {
    const logs = await this.logsRepo.getByExerciseId(exerciseId);
    this.logsStore.set(logs);
  }

  async create(dto: CreateWorkoutLogDTO) {
    const log = new WorkoutLog(dto.exerciseId, dto.weight, dto.reps, dto.oneRm);
    await this.logsRepo.create(log);
    const createdLog = await this.logsRepo.get(log.id);

    if (!createdLog) {
      throw new Error('Log not found');
    }

    this.logsStore.add(createdLog);
    this.updatePerformanceOnUpdate(createdLog);
  }

  async update(id: WorkoutLog['id'], dto: Partial<WorkoutLog>) {
    await this.logsRepo.update(id, dto);
    const updatedLog = await this.logsRepo.get(id);

    if (!updatedLog) {
      throw new Error('Log not found');
    }

    this.logsStore.update(id, updatedLog);
    this.updatePerformanceOnUpdate(updatedLog);
  }

  async remove(log: WorkoutLog) {
    await this.logsRepo.delete(log.id);
    await this.logsStore.remove(log.id);
    this.updatePerformanceOnDelete(log.exerciseId);
  }

  private async updatePerformanceOnUpdate(log: WorkoutLog) {
    const exerciseId = log.exerciseId;
    const count = await this.logsRepo.getCount(exerciseId);
    const performance =
      (await this.performanceRepo.get(exerciseId)) ??
      new ExercisePerformance(exerciseId);

    const dto: Partial<ExercisePerformance> = {
      lastPerformed: log.date,
      timesPerformed: count,
      lastOneRm: log.oneRm,
      bestOneRm: Math.max(performance.bestOneRm ?? 0, log.oneRm),
      initialOneRm: performance.initialOneRm || log.oneRm,
      previousOneRm: performance.lastOneRm ?? null,
    };

    await this.performanceRepo.update(exerciseId, dto);
    await this.performanceStore.update(exerciseId, dto);
  }

  private async updatePerformanceOnDelete(
    exerciseId: WorkoutLog['exerciseId'],
  ) {
    const count = await this.logsRepo.getCount(exerciseId);

    if (count === 0) {
      const dto = new ExercisePerformance(exerciseId);
      await this.performanceRepo.update(exerciseId, dto);
      await this.performanceStore.update(exerciseId, dto);
      return;
    }

    const performance =
      (await this.performanceRepo.get(exerciseId)) ??
      new ExercisePerformance(exerciseId);
    const maxOneRm = await this.logsRepo.getMaxOneRm(exerciseId);
    const [last, secondLast] = await this.logsRepo.getSortedByDate(
      exerciseId,
      2,
    );
    const [first] = await this.logsRepo.getFirstByDate(exerciseId);

    let dto: Partial<ExercisePerformance> = {
      lastPerformed: last?.date ?? null,
      timesPerformed: count,
      bestOneRm: maxOneRm ?? performance.bestOneRm,
      lastOneRm: last?.oneRm ?? 0,
      previousOneRm: secondLast?.oneRm ?? 0,
      initialOneRm: first?.oneRm ?? 0,
    };

    await this.performanceRepo.update(exerciseId, dto);
    await this.performanceStore.update(exerciseId, dto);
  }
}
