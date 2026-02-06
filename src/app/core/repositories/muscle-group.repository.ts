import { Injectable } from '@angular/core';
import { Table } from 'dexie';
import { db } from '@core/db';
import { MuscleGroup } from '@core/domain';

@Injectable({ providedIn: 'root' })
export class MuscleGroupRepository {
  private table: Table<MuscleGroup, string> = db.muscleGroups;

  getAll(): Promise<MuscleGroup[]> {
    return this.table.orderBy('bodySegment').reverse().toArray();
  }

  count(): Promise<number> {
    return this.table.count();
  }

  bulkAdd(groups: MuscleGroup[]): Promise<void> {
    return this.table.bulkAdd(groups).then(() => undefined);
  }
}
