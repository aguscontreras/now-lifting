import { inject, LOCALE_ID, provideAppInitializer } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { db } from '@core/db';
import { DbSeedService } from '@core/app-init';
import { MuscleGroupLoader } from '@core/app-init';
import { ExerciseHydrationService } from '@feat/exercises/application';
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';

registerLocaleData(localeEs);
registerLocaleData(localeEn);

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: LOCALE_ID,
      useFactory: () => {
        const supported = ['es', 'en'];
        const userLang = navigator.language?.split('-')[0];
        return supported.includes(userLang) ? userLang : 'es';
      },
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({
      toastDuration: 3000,
    }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideAppInitializer(db.init.bind(db)),
    provideHttpClient(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
      }),
      fallbackLang: 'es',
      lang: 'es',
    }),
    provideAppInitializer(() => {
      const dbSeedService = inject(DbSeedService);
      const muscleGroupLoader = inject(MuscleGroupLoader);
      return dbSeedService.seed().then(() => muscleGroupLoader.load());
    }),
    provideAppInitializer(() => {
      const exercisesHydration = inject(ExerciseHydrationService);
      return exercisesHydration.hydrate();
    }),
  ],
});
