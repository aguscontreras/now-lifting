import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonChip,
  IonButtons,
  IonButton,
  ModalController,
  NavController,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  ToastController,
  AlertController,
  IonCard,
  IonCardContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add,
  pencil,
  removeOutline,
  trash,
  trendingDown,
  trendingUp,
} from 'ionicons/icons';
import { MuscleGroupStore } from '@core/state';
import { MuscleGroup } from '@core/domain';
import { ExercisesService } from '@feat/exercises/application';
import { ExercisesStore } from '@feat/exercises/state';
import { CreateExerciseComponent } from '@feat/exercises/ui';
import { Exercise, ExercisePerformanceResult } from '@feat/exercises/models';
import { ExercisePerformancePipe } from '@feat/exercises/pipes';
import { MuscleGroupTranslatePipe } from '@shared/pipes';

@Component({
  selector: 'app-exercises-list',
  templateUrl: './exercises-list.page.html',
  styleUrl: './exercises-list.page.scss',
  imports: [
    IonCardContent,
    IonCard,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    CommonModule,
    IonButton,
    IonButtons,
    IonChip,
    IonIcon,
    IonLabel,
    IonItem,
    IonList,
    TranslatePipe,
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonHeader,
    MuscleGroupTranslatePipe,
    ExercisePerformancePipe,
  ],
})
export class ExercisesListPage {
  private exercisesStore = inject(ExercisesStore);
  private exercisesService = inject(ExercisesService);
  private muscleGroupsStore = inject(MuscleGroupStore);
  private translateService = inject(TranslateService);
  private navController = inject(NavController);
  private modalController = inject(ModalController);
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);

  @ViewChild('listSlidings') slidingContainer?: IonList;

  readonly muscleGroups$ = this.muscleGroupsStore.muscleGroups$;

  selectedMuscleGroupIds$ = new BehaviorSubject<Array<MuscleGroup['name']>>([]);

  exercises$ = combineLatest([
    this.exercisesStore.exercisesWithPerformance$,
    this.selectedMuscleGroupIds$,
  ]).pipe(
    map(([exercises, muscleGroups]) =>
      muscleGroups.length
        ? exercises.filter((e) => muscleGroups.includes(e.muscleGroup))
        : exercises,
    ),
  );

  constructor() {
    addIcons({ trendingUp, trendingDown, removeOutline, add, pencil, trash });
  }

  async onAddExercise() {
    const result = await this.openModal();

    if (result.role === 'create') {
      const id = result.data as Exercise['id'];
      const message = this.translateService.instant(
        'EXERCISES.LIST.CREATED_SUCCESS',
      );
      const text = this.translateService.instant('ACTIONS.VIEW');

      const toast = await this.toastController.create({
        message,
        color: 'success',
        buttons: [
          {
            text,
            handler: () => this.onViewExercise(id),
          },
        ],
      });

      toast.present();
    }
  }

  async onUpdateExercise(exercise: Exercise) {
    const result = await this.openModal(exercise);

    if (result.role === 'update') {
      const id = result.data as Exercise['id'];
      const message = this.translateService.instant(
        'EXERCISES.LIST.UPDATED_SUCCESS',
      );
      const text = this.translateService.instant('ACTIONS.VIEW');

      const toast = await this.toastController.create({
        message,
        color: 'success',
        buttons: [
          {
            text,
            handler: () => this.onViewExercise(id),
          },
        ],
      });

      toast.present();
    }
  }

  async onDeleteExercise(exercise: Exercise) {
    const alert = await this.alertController.create({
      header: this.translateService.instant(
        'EXERCISES.LIST.DELETE_CONFIRM_TITLE',
      ),
      message: this.translateService.instant(
        'EXERCISES.LIST.DELETE_CONFIRM_MESSAGE',
        { name: exercise.name },
      ),
      buttons: [
        {
          text: this.translateService.instant('ACTIONS.CANCEL'),
          role: 'cancel',
        },
        {
          text: this.translateService.instant('ACTIONS.DELETE'),
          role: 'destructive',
          handler: async () => {
            await this.exercisesService.remove(exercise.id);
            const toast = await this.toastController.create({
              message: this.translateService.instant(
                'EXERCISES.LIST.DELETED_SUCCESS',
              ),
              color: 'success',
              duration: 2000,
            });
            toast.present();
          },
        },
      ],
    });

    alert.present();
  }

  onViewExercise(id: Exercise['id']) {
    this.navController.navigateForward(['/exercises', id]);
  }

  onFilterChange(name: MuscleGroup['name'] | null) {
    const value = this.selectedMuscleGroupIds$.value;

    if (name && value.includes(name)) {
      this.selectedMuscleGroupIds$.next(value.filter((mg) => mg !== name));
      return;
    }

    this.selectedMuscleGroupIds$.next(
      name ? [...this.selectedMuscleGroupIds$.value, name] : [],
    );
  }

  isSelected(name: MuscleGroup['name']) {
    return this.selectedMuscleGroupIds$.value.includes(name);
  }

  async openModal(exercise?: Exercise) {
    const modal = await this.modalController.create({
      component: CreateExerciseComponent,
      componentProps: { exercise },
    });

    modal.present();
    const result = await modal.onWillDismiss();
    this.slidingContainer?.closeSlidingItems();
    return result;
  }

  getPerformanceIcon(result: ExercisePerformanceResult): string {
    switch (result) {
      case 'improving':
        return 'trending-up';
      case 'declining':
        return 'trending-down';
      case 'stable':
        return 'trending-up';
      default:
        return 'remove-outline';
    }
  }

  getPerformanceColor(result: ExercisePerformanceResult): string {
    switch (result) {
      case 'improving':
        return 'success';
      case 'declining':
        return 'danger';
      case 'stable':
        return 'default';
      default:
        return 'default';
    }
  }
}
