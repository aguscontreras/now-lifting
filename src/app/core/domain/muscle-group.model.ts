export interface MuscleGroup {
  name: MuscleGroupName;
  bodySegment: BodySegmentName;
  description?: string;
}

export type BodySegmentName = 'upper' | 'lower';

export type MuscleGroupName =
  | 'chest'
  | 'back'
  | 'legs'
  | 'glutes'
  | 'arms'
  | 'shoulders'
  | 'core';

export class MuscleGroup implements MuscleGroup {
  constructor(
    name: MuscleGroupName,
    bodySegmentId: BodySegmentName,
    description?: string,
  ) {
    this.name = name;
    this.bodySegment = bodySegmentId;
    this.description = description;
  }
}
