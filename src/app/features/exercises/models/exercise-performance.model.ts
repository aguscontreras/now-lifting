export interface ExercisePerformance {
  exerciseId: string;
  lastPerformed: Date | null;
  timesPerformed: number;
  bestOneRm: number;
  initialOneRm: number;
  lastOneRm: number;
  previousOneRm: number;
  oneRmGoal: number;
}

export type ExercisePerformanceResult = 'improving' | 'declining' | 'stable' | 'no-data';

export class ExercisePerformance implements ExercisePerformance {
  constructor(exerciseId: string) {
    this.exerciseId = exerciseId;
    this.oneRmGoal = 0;
    this.lastPerformed = null;
    this.timesPerformed = 0;
    this.bestOneRm = 0;
    this.initialOneRm = 0;
    this.lastOneRm = 0;
    this.previousOneRm = 0;
  }
}
