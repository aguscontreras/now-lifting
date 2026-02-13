import { Pipe, PipeTransform } from '@angular/core';
import { WithRelativePerformance } from '@core/domain';

@Pipe({
  name: 'performanceIcon',
})
export class PerformanceIconPipe implements PipeTransform {
  transform(
    performance: WithRelativePerformance,
  ): 'remove-outline' | 'trending-up' | 'trending-down' {
    return !performance.oneRmDiff
      ? 'remove-outline'
      : performance.oneRmDiff > 0
        ? 'trending-up'
        : performance.oneRmDiff < 0
          ? 'trending-down'
          : 'remove-outline';
  }
}
