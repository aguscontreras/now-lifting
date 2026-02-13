import { WithRelativePerformance } from "@core/domain";

export interface DummyLog {
  weight: number;
  reps: number;
  oneRm: number;
}

export interface WorkoutLog extends DummyLog {
  id: string;
  date: Date;
  exerciseId: string;
  time?: number;
  notes?: string;
}

export interface WorkoutLogView extends WithRelativePerformance {
  log: WorkoutLog;
}

export class WorkoutLog implements WorkoutLog {
  constructor(exerciseId: string, weight: number, reps: number, oneRm = 0) {
    this.id = crypto.randomUUID();
    this.exerciseId = exerciseId;
    this.date = new Date();
    this.reps = reps;
    this.weight = weight;
    this.oneRm = oneRm;
  }
}
