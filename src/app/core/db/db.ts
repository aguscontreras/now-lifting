import Dexie, { type Table } from 'dexie';
import { MuscleGroup } from '@core/domain';
import { Exercise, ExercisePerformance } from '@feat/exercises/models';
import { WorkoutLog } from '@feat/workout-logs/models';

export class DB extends Dexie {
  muscleGroups!: Table<MuscleGroup, string>;
  exercises!: Table<Exercise, string>;
  performance!: Table<ExercisePerformance, string>;
  workoutLogs!: Table<WorkoutLog, string>;

  constructor() {
    super('now-lifting', { autoOpen: true });
  }

  init() {
    return new Promise(async (resolve, reject) => {
      try {
        this.version(1).stores({
          muscleGroups: 'name, bodySegment',
          exercises: 'id, name, muscleGroup',
          performance: 'exerciseId',
          workoutLogs: 'id, date, exerciseId, oneRm',
        });

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export const db = new DB();
