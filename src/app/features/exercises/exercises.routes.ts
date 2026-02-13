import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ui/exercises-list/exercises-list.page').then(
        (m) => m.ExercisesListPage,
      ),
  },
  {
    path: ':id',
    loadComponent: () => import('./ui/exercise-detail/exercise-detail.page').then((m) => m.ExerciseDetailPage),
  },
];
