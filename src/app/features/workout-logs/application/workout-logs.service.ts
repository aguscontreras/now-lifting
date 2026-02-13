import { inject, Injectable } from '@angular/core';
import { RmCalculator } from '@core/domain';
import { WorkoutLogsRepository } from '@feat/workout-logs/data';
import { WorkoutLogsStore } from '@feat/workout-logs/state';
import { DummyLog, WorkoutLog } from '@feat/workout-logs/models';
import { Exercise } from '@feat/exercises/models';
import { ExercisesPerformanceRepository } from '@feat/exercises/data';

export type CreateWorkoutLogDTO = { exerciseId: Exercise['id'] } & DummyLog;

@Injectable({ providedIn: 'root' })
export class WorkoutLogService {
  private logsRepo = inject(WorkoutLogsRepository);
  private logsStore = inject(WorkoutLogsStore);
  private performanceRepo = inject(ExercisesPerformanceRepository);
  private rmCalculator = inject(RmCalculator);

  async loadForExercise(exerciseId: string) {
    const logs = await this.logsRepo.getByExerciseId(exerciseId);
    this.logsStore.set(logs);
  }

  async create(dto: CreateWorkoutLogDTO) {
    const log = new WorkoutLog(dto.exerciseId, dto.weight, dto.reps, dto.oneRm);

    log.oneRm = this.rmCalculator.calculate1RM(dto.weight, dto.reps);

    await this.logsRepo.create(log);
    await this.logsStore.add(log);
    await this.updateExercisePerformance(log.id);

    return log;
  }

  async update(id: WorkoutLog['id'], dto: Partial<WorkoutLog>) {
    await this.logsRepo.update(id, dto);
    await this.logsStore.update(id, dto);
  }

  async remove(_id: WorkoutLog['id']) {}

  private async updateExercisePerformance(logId: WorkoutLog['id']) {
    const log = await this.logsRepo.get(logId);

    // TODO: Tirar error?
    if (!log) return;

    const performance = await this.performanceRepo.get(log.exerciseId);

    // TODO: Tirar error?
    if (!performance) return;

    await this.performanceRepo.update(log.exerciseId, {
      lastPerformed: log.date,
      timesPerformed: performance.timesPerformed + 1,
      lastOneRm: log.oneRm,
      bestOneRm: Math.max(performance.bestOneRm, log.oneRm),
      initialOneRm: performance.initialOneRm || log.oneRm,
      previousOneRm: performance.lastOneRm,
    });
  }
}
