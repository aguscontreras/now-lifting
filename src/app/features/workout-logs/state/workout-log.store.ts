import { Injectable } from '@angular/core';
import { createStore } from '@ngneat/elf';
import {
  withActiveId,
  withEntities,
  selectAllEntities,
  selectActiveEntity,
  addEntities,
  updateEntities,
  deleteEntities,
  setActiveId,
  setEntities,
  resetActiveId,
} from '@ngneat/elf-entities';

import { WorkoutLog, WorkoutLogView } from '@feat/workout-logs/models';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkoutLogsStore {
  private store = createStore(
    { name: 'workout-logs' },
    withEntities<WorkoutLog>(),
    withActiveId(),
  );

  logs$ = this.store.pipe(selectAllEntities());
  active$ = this.store.pipe(selectActiveEntity());
  logView$ = this.store.pipe(selectAllEntities()).pipe(
    map((logs) => {
      return logs.map<WorkoutLogView>((log, index) => {
        const previous = logs[index + 1];
        const oneRmDiff = previous ? log.oneRm - previous.oneRm : null;

        return {
          log,
          oneRmDiff,
          improved: oneRmDiff ? oneRmDiff > 0 : false,
        };
      });
    }),
  );

  add(log: WorkoutLog) {
    this.store.update(addEntities(log, { prepend: true }));
  }

  update(id: WorkoutLog['id'], log: Partial<WorkoutLog>) {
    this.store.update(updateEntities(id, log));
  }

  remove(id: WorkoutLog['id']) {
    this.store.update(deleteEntities(id));
  }

  set(logs: WorkoutLog[]) {
    this.store.update(setEntities(logs));
  }

  setActive(id: WorkoutLog['id'] | null) {
    this.store.update(setActiveId(id));
  }

  clearActive() {
    this.store.update(resetActiveId());
  }

  clear() {
    this.store.update(setEntities([]));
  }
}
