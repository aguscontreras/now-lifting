import { AfterViewInit, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
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
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import {
  ExercisesPerformanceStore,
  ExercisesStore,
} from '@feat/exercises/state';
import { addIcons } from 'ionicons';
import { add, removeOutline, trendingDown, trendingUp } from 'ionicons/icons';
import { WorkoutLogService } from '@feat/workout-logs/application';
import { WorkoutLogsStore } from '@feat/workout-logs/state';
import { CreateLogComponent } from '@feat/workout-logs/ui';
import { DummyLog, WorkoutLog } from '@feat/workout-logs/models';
import { Exercise, ExercisePerformance } from '@feat/exercises/models';
import { PerformanceColorPipe } from '@feat/exercises/pipes';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

echarts.use([LineChart, GridComponent, CanvasRenderer, LegendComponent]);

@Component({
  selector: 'app-exercise-detail',
  templateUrl: './exercise-detail.page.html',
  styleUrls: ['./exercise-detail.page.scss'],
  imports: [
    IonNote,
    CommonModule,
    NgxEchartsDirective,
    TranslateModule,
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
  private performanceStore = inject(ExercisesPerformanceStore);
  private route = inject(ActivatedRoute);
  private modalController = inject(ModalController);

  exercise$ = this.exercisesStore.active$;
  performance$ = this.performanceStore.active$;
  logs$ = this.logsStore.logView$;

  chartOption: echarts.EChartsCoreOption = {};

  constructor() {
    addIcons({ add, trendingUp, trendingDown, removeOutline });

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
        top: 20
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

  onSetGoal() {
    console.log('set goal');
  }
}
