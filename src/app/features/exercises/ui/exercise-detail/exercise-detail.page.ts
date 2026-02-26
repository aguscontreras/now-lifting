import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import {
  ModalController,
  AlertController,
  ToastController,
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
  IonListHeader,
  IonCardContent,
  IonTextarea,
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
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { WorkoutLogService } from '@feat/workout-logs/application';
import { WorkoutLogsStore } from '@feat/workout-logs/state';
import { CreateLogComponent } from '@feat/workout-logs/ui';
import { DummyLog, WorkoutLog } from '@feat/workout-logs/models';
import {
  ExercisesPerformanceStore,
  ExercisesStore,
} from '@feat/exercises/state';
import { Exercise, ExercisePerformance } from '@feat/exercises/models';
import { PerformanceColorPipe } from '@feat/exercises/pipes';
import { ExercisesService } from '@feat/exercises/application';
import { SetGoalComponent } from '@feat/exercises/ui';

echarts.use([LineChart, GridComponent, CanvasRenderer, LegendComponent]);

@Component({
  selector: 'app-exercise-detail',
  templateUrl: './exercise-detail.page.html',
  styleUrls: ['./exercise-detail.page.scss'],
  imports: [
    FormsModule,
    IonTextarea,
    IonCardContent,
    IonListHeader,
    CommonModule,
    NgxEchartsDirective,
    TranslateModule,
    IonNote,
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
  providers: [provideEchartsCore({ echarts })],
})
export class ExerciseDetailPage implements AfterViewInit {
  private logsService = inject(WorkoutLogService);
  private logsStore = inject(WorkoutLogsStore);
  private exercisesStore = inject(ExercisesStore);
  private exercisesService = inject(ExercisesService);
  private performanceStore = inject(ExercisesPerformanceStore);
  private route = inject(ActivatedRoute);
  private modalController = inject(ModalController);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);
  private translateService = inject(TranslateService);

  @ViewChild('logsList') logsList?: IonList;

  exercise$ = this.exercisesStore.active$;
  performance$ = this.performanceStore.active$;
  logs$ = this.logsStore.logView$;

  chartOption: echarts.EChartsCoreOption = {};

  constructor() {
    addIcons({ add, trendingUp, trendingDown, removeOutline, trash, pencil });

    combineLatest([this.performance$, this.logs$])
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: ([performance, viewLogs]) => {
          const logs = viewLogs.map((e) => e.log);
          this.setGraphic(performance, logs);
        },
      });
  }

  ngAfterViewInit(): void {
    this.setGraphic();
  }

  ionViewWillEnter() {
    const id = this.route.snapshot.params['id'];
    this.exercisesStore.setActive(id);
    this.performanceStore.setActive(id);
    this.logsService.loadForExercise(id);
  }

  private setGraphic(performance?: ExercisePerformance, logs?: WorkoutLog[]) {
    if (!performance || !logs) return;

    const documentStyle = getComputedStyle(document.documentElement);
    const slice = (logs || []).reverse().slice(-7);

    const dateLabels = slice.map(({ date }) =>
      new Intl.DateTimeFormat(window.navigator.language, {
        dateStyle: 'short',
      }).format(date),
    );

    const logsData = slice.map((e) => e.oneRm);
    const goalData = Array(slice.length).fill(performance?.oneRmGoal) || [];
    const goal = this.translateService.instant('EXERCISES.DETAIL.GOAL');
    const progress = this.translateService.instant('EXERCISES.DETAIL.PROGRESS');

    this.chartOption = {
      legend: {
        data: [goal, progress],
        top: 20,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: dateLabels,
          axisLabel: { rotate: 45 },
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: goal,
          data: goalData,
          type: 'line',
          showSymbol: false,
          smooth: false,
          lineStyle: {
            color: documentStyle.getPropertyValue('--ion-color-secondary'),
          },
        },
        {
          name: progress,
          data: logsData,
          type: 'line',
          smooth: false,
          lineStyle: {
            color: documentStyle.getPropertyValue('--ion-color-warning'),
          },
          showSymbol: false,
        },
      ],
    };
  }

  onUpdateNote({ id, description }: Exercise) {
    this.exercisesService.update(id, {
      description: description,
    });
  }

  async onSetGoal({ id }: Exercise, { oneRmGoal }: ExercisePerformance) {
    const modal = await this.modalController.create({
      component: SetGoalComponent,
      cssClass: ['floating', 'fixed-width'],
      componentProps: {
        goal: oneRmGoal,
      },
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();

    if (role === 'confirm') {
      await this.exercisesService.setOneRmGoal(id, data.goal);
    }
  }

  async onAddLog(exercise: Exercise) {
    const result = await this.openLogModal();

    if (result.role === 'create') {
      const dummyLog = result.data as DummyLog;

      this.logsService.create({
        exerciseId: exercise.id,
        ...dummyLog,
      });
    }
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
    return modal.onDidDismiss().finally(() => this.logsList?.closeSlidingItems());
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
    alert.onDidDismiss().finally(() => this.logsList?.closeSlidingItems());
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
