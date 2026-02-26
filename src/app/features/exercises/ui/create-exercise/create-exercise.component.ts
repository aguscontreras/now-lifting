import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  IonContent,
  IonItem,
  IonButtons,
  IonButton,
  IonToolbar,
  IonHeader,
  ModalController,
  IonInput,
  IonList,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonToast,
} from '@ionic/angular/standalone';
import { MuscleGroupStore } from '@core/state';
import { MuscleGroupName } from '@core/domain';
import { MuscleGroupTranslatePipe } from '@shared/pipes';
import { ExercisesService } from '@feat/exercises/application';
import { Exercise } from '@feat/exercises/models';

@Component({
  selector: 'app-create-exercise',
  templateUrl: './create-exercise.component.html',
  styleUrl: './create-exercise.component.scss',
  imports: [
    CommonModule,
    MuscleGroupTranslatePipe,
    IonToast,
    ReactiveFormsModule,
    IonTextarea,
    IonList,
    IonInput,
    IonHeader,
    IonToolbar,
    IonButton,
    IonButtons,
    IonItem,
    IonContent,
    IonSelect,
    IonSelectOption,
    TranslateModule,
  ],
})
export class CreateExerciseComponent implements OnInit {
  @Input() exercise?: Exercise;

  private modalController = inject(ModalController);
  private exercisesService = inject(ExercisesService);
  private muscleGroupsStore = inject(MuscleGroupStore);
  private formBuilder = inject(FormBuilder);

  readonly form = this.createForm();

  readonly muscleGroups$ = this.muscleGroupsStore.muscleGroups$;

  showErrorToast = false;

  private createForm() {
    return this.formBuilder.nonNullable.group({
      name: ['', Validators.required],
      muscleGroup: ['' as MuscleGroupName, Validators.required],
      description: ['', Validators.maxLength(200)],
      link: [''],
    });
  }

  ngOnInit(): void {
    if (this.exercise) {
      this.form.patchValue(this.exercise);
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.showErrorToast = true;
      throw new Error('Form is invalid');
    }

    if (!this.exercise) {
      this.createExercise();
    } else {
      this.updateExercise();
    }
  }

  private async createExercise() {
    const dto = this.form.getRawValue();

    try {
      const exercise = await this.exercisesService.create(dto);
      this.confirm(exercise.id, 'create');
    } catch (error) {}
  }

  private async updateExercise() {
    const dto = this.form.getRawValue();

    try {
      await this.exercisesService.update(
        this.exercise!.id,
        dto,
      );

      this.confirm(this.exercise!.id, 'update');
    } catch (error) {}
  }

  cancel(action = 'cancel') {
    return this.modalController.dismiss(null, action);
  }

  confirm(result: Exercise['id'], action: 'create' | 'update') {
    return this.modalController.dismiss(result, action);
  }
}
