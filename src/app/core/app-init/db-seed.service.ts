import { Injectable } from "@angular/core";
import { MUSCLE_GROUPS } from "@core/seed";
import { MuscleGroupRepository } from "@core/repositories";

@Injectable({ providedIn: 'root' })
export class DbSeedService {
  constructor(private muscleGroupRepo: MuscleGroupRepository) {}

  async seed() {
    const count = await this.muscleGroupRepo.count();
    if (count > 0) return;

    await this.muscleGroupRepo.bulkAdd(MUSCLE_GROUPS);
  }
}
