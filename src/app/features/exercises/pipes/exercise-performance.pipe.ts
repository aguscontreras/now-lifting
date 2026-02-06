import { Pipe, PipeTransform } from '@angular/core';
import {
  ExercisePerformanceResult,
  ExerciseWithPerformance,
} from '@feat/exercises/models';

@Pipe({
  name: 'exercisePerformance',
})
export class ExercisePerformancePipe implements PipeTransform {
  transform(exercise: ExerciseWithPerformance): ExercisePerformanceResult {
    const { performance } = exercise;

    if (!performance) {
      return 'no-data';
    }

    if (performance.lastOneRm == 0) {
      return 'no-data';
    }

    if (performance.lastOneRm > performance.previousOneRm) {
      return 'improving';
    }

    if (performance.lastOneRm < performance.previousOneRm) {
      return 'declining';
    }

    return 'stable';
  }
}
