import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arraySlice',
  pure: false,
})
export class ArraySlicePipe implements PipeTransform {
  transform<T>(value: Array<T> | null, limit: number = 0): Array<T> {
    if (!value) {
      return [];
    }

    if (limit === 0) {
      return value;
    }

    return value.slice(0, limit);
  }
}
