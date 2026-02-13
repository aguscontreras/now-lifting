import { Pipe, PipeTransform } from '@angular/core';
import { WithRelativePerformance } from '@core/domain';

@Pipe({
  name: 'performanceColor',
})
export class PerformanceColorPipe implements PipeTransform {
  transform(
    performance: WithRelativePerformance,
  ): 'success' | 'danger' | 'default' {
    return !performance.oneRmDiff
      ? 'default'
      : performance.oneRmDiff > 0
        ? 'success'
        : performance.oneRmDiff < 0
          ? 'danger'
          : 'default';
  }
}
