import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonRow,
  IonGrid,
  IonCol,
  IonCardTitle,
  IonCardSubtitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonItemSliding,
  IonLabel,
  IonItemOptions,
  IonItemOption,
  IonNote,
} from '@ionic/angular/standalone';
import {
  ExercisesPerformanceStore,
  ExercisesStore,
} from '@feat/exercises/state';
import { addIcons } from 'ionicons';
import { add, removeOutline, trendingDown, trendingUp } from 'ionicons/icons';
import { WorkoutLogService } from '@feat/workout-logs/application';
import { WorkoutLogsStore } from '@feat/workout-logs/state';
import { CreateLogComponent } from '@feat/workout-logs/ui';
import { DummyLog } from '@feat/workout-logs/models';
import { Exercise } from '@feat/exercises/models';
import { PerformanceColorPipe } from '@feat/exercises/pipes';

@Component({
  selector: 'app-exercise-detail',
  templateUrl: './exercise-detail.page.html',
  styleUrls: ['./exercise-detail.page.scss'],
  imports: [
    IonNote,
    CommonModule,
    IonItemOption,
    IonItemOptions,
    IonLabel,
    IonItem,
    IonList,
    IonIcon,
    IonButton,
    IonBackButton,
    IonButtons,
    IonCardSubtitle,
    IonCardTitle,
    IonCol,
    IonGrid,
    IonRow,
    IonCardHeader,
    IonCard,
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonItemSliding,
    PerformanceColorPipe,
  ],
})
export class ExerciseDetailPage {
  private logsService = inject(WorkoutLogService);
  private logsStore = inject(WorkoutLogsStore);
  private exercisesStore = inject(ExercisesStore);
  private performanceStore = inject(ExercisesPerformanceStore);
  private route = inject(ActivatedRoute);
  private modalController = inject(ModalController);

  exercise$ = this.exercisesStore.active$;
  performance$ = this.performanceStore.active$;
  logs$ = this.logsStore.logView$;

  constructor() {
    addIcons({ add, trendingUp, trendingDown, removeOutline });
  }

  ionViewWillEnter() {
    const id = this.route.snapshot.params['id'];
    this.exercisesStore.setActive(id);
    this.performanceStore.setActive(id);
    this.logsService.loadForExercise(id);
  }

  async onAddLog(exercise: Exercise) {
    const modal = await this.modalController.create({
      component: CreateLogComponent,
      cssClass: ['floating', 'fixed-width'],
      componentProps: {
        exercise,
      },
    });

    await modal.present();

    const result = await modal.onDidDismiss();

    if (result.role === 'create') {
      const dummyLog = result.data as DummyLog;

      this.logsService.create({
        exerciseId: exercise.id,
        ...dummyLog,
      });
    }
  }

  onSetGoal() {
    console.log('set goal');
  }
}
