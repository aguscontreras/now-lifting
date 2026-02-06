import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'muscleGroupTranslate',
  pure: false,
})
export class MuscleGroupTranslatePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: string): string {
    if (!value) return '';

    const key = `MUSCLE_GROUPS.${value.toUpperCase()}`;
    return this.translate.instant(key);
  }
}
