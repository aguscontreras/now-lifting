import { Pipe, PipeTransform } from '@angular/core';
import { KG_TO_LB, WeightUnit } from '@core/domain';

@Pipe({
  name: 'weight',
  standalone: true,
})
export class WeightPipe implements PipeTransform {
  transform(value: number | null | undefined, unit: WeightUnit = 'kg'): string {
    if (!value) return '';
    const rounded = Math.round(unit === 'lb' ? value * KG_TO_LB : value);
    return rounded + ' ' + unit;
  }
}
