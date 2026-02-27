import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { filter, Observable, of, switchMap } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  IonHeader,
  IonContent,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonText,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonChip,
  IonButton,
  IonGrid,
  IonIcon,
  IonCardContent,
  ModalController,
  AlertController,
  NavController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { pencil, trash } from 'ionicons/icons';
import { RmCalculator } from '@core/domain';
import { WorkoutLogsStore } from '@feat/workout-logs/state';
import { WorkoutLogService } from '@feat/workout-logs/application';
import { DummyLog, WorkoutLog } from '@feat/workout-logs/models';
import { Exercise } from '@feat/exercises/models';
import { ExercisesRepository } from '@feat/exercises/data';
import { MuscleGroupTranslatePipe } from '@shared/pipes';
import { CreateLogComponent } from '../create-log';

@Component({
  selector: 'app-log-detail',
  templateUrl: './log-detail.page.html',
  styleUrl: './log-detail.page.scss',
  imports: [
    IonCardContent,
    IonIcon,
    IonGrid,
    IonButton,
    IonChip,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonCol,
    IonRow,
    IonText,
    CommonModule,
    MuscleGroupTranslatePipe,
    IonTitle,
    IonBackButton,
    IonButtons,
    IonToolbar,
    IonContent,
    IonHeader,
    TranslateModule,
  ],
})
export class LogDetailPage {
  private route = inject(ActivatedRoute);
  private logsStore = inject(WorkoutLogsStore);
  private exercisesRepo = inject(ExercisesRepository);
  private logsService = inject(WorkoutLogService);
  private rmCalculator = inject(RmCalculator);
  private modalController = inject(ModalController);
  private alertController = inject(AlertController)
  private navController = inject(NavController);
  private toastController = inject(ToastController);
  private translateService = inject(TranslateService);

  log$ = this.logsStore.active$;
  exercise$: Observable<Exercise | undefined>;
  rmsByReps$: Observable<
    {
      reps: number;
      weight: number;
    }[]
  >;

  feelingButtons = Array(5)
    .fill(0)
    .map((_, index) => index + 1);

  constructor() {
    addIcons({ pencil, trash });

    this.exercise$ = this.log$.pipe(
      filter(Boolean),
      switchMap((e) => this.exercisesRepo.get(e.exerciseId)),
    );

    this.rmsByReps$ = this.log$.pipe(
      filter(Boolean),
      switchMap((e) => of(this.rmCalculator.getRmByReps(e.oneRm))),
    );
  }

  ionViewWillEnter() {
    const id = this.route.snapshot.params['logId'];
    console.log(id);
    this.logsStore.setActive(id);
  }

  onFeelingScaleUpdate(log: WorkoutLog, feelingScale: number) {
    this.logsService.update(log.id, { feelingScale });
  }

  async onUpdateLog(log: WorkoutLog) {
    const result = await this.openLogModal(log);

    if (result.role === 'update') {
      const { reps, weight } = result.data as DummyLog;

      this.logsService.update(log.id, {
        reps,
        weight,
      });
    }
  }

  private async openLogModal(log?: WorkoutLog) {
    const modal = await this.modalController.create({
      component: CreateLogComponent,
      cssClass: ['floating', 'fixed-width'],
      componentProps: {
        log,
      },
    });

    await modal.present();
    return modal.onDidDismiss();
  }

  async onDeleteLog(log: WorkoutLog) {
    const alertHeader = this.translateService.instant(
      'EXERCISES.DETAIL.DELETE_LOG_TITLE',
    );
    const alertMessage = this.translateService.instant(
      'EXERCISES.DETAIL.DELETE_LOG_MESSAGE',
    );

    const alert = await this.alertController.create({
      header: alertHeader,
      message: alertMessage,
      buttons: [
        {
          text: this.translateService.instant('COMMON.CANCEL'),
          role: 'cancel',
        },
        {
          text: this.translateService.instant('COMMON.DELETE'),
          role: 'destructive',
          handler: () => this.deleteLog(log),
        },
      ],
    });

    alert.present();
  }

  private async deleteLog(log: WorkoutLog) {
    try {
      await this.logsService.remove(log);
      const toastMessage = this.translateService.instant(
        'EXERCISES.DETAIL.DELETE_LOG_SUCCESS',
      );
      const toast = await this.toastController.create({
        message: toastMessage,
        color: 'success',
      });

      await toast.present();
      this.navController.back();
    } catch (error) {
      const toastMessage = this.translateService.instant(
        'EXERCISES.DETAIL.DELETE_LOG_ERROR',
      );
      const toast = await this.toastController.create({
        message: toastMessage,
        color: 'success',
      });

      await toast.present();
    }
  }
}
