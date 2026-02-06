import { Injectable } from '@angular/core';
import { createStore } from '@ngneat/elf';
import {
  withEntities,
  selectAllEntities,
  withActiveId,
  setActiveId,
  setEntities,
} from '@ngneat/elf-entities';

import { MuscleGroup } from '@core/domain';

@Injectable({
  providedIn: 'root',
})
export class MuscleGroupStore {
  private store = createStore(
    { name: 'muscleGroups' },
    withEntities<MuscleGroup, 'name'>({ idKey: 'name' }),
    withActiveId(),
  );

  muscleGroups$ = this.store.pipe(selectAllEntities());

  setAll(groups: MuscleGroup[]) {
    this.store.update(setEntities(groups));
  }

  setActive(name: MuscleGroup['name'] | null) {
    this.store.update(setActiveId(name));
  }
}
