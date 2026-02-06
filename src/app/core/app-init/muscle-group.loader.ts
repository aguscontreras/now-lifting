import { Injectable } from "@angular/core";
import { MuscleGroupRepository } from "@core/repositories";
import { MuscleGroupStore } from "@core/state";

@Injectable({ providedIn: 'root' })
export class MuscleGroupLoader {
  constructor(
    private repo: MuscleGroupRepository,
    private store: MuscleGroupStore,
  ) {}

  async load() {
    const groups = await this.repo.getAll();
    this.store.setAll(groups);
  }
}
