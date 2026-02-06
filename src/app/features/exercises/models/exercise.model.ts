import { MuscleGroupName } from '@core/domain';
import { ExercisePerformance } from './exercise-performance.model';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroupName;
  description?: string;
  link?: string;
}

export class Exercise implements Exercise {
  constructor(
    name: string,
    muscleGroup: MuscleGroupName,
    description?: string,
    link?: string,
  ) {
    this.id = crypto.randomUUID();
    this.name = name.trim();
    this.muscleGroup = muscleGroup;
    this.description = description;
    this.link = link;
  }
}

export interface ExerciseWithPerformance extends Exercise {
  performance?: ExercisePerformance;
}
