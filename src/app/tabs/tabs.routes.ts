import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'exercises',
        loadComponent: () =>
          import('../features/exercises/ui/exercises-list/exercises-list.page').then(
            (m) => m.ExercisesListPage,
          ),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'exercises',
    pathMatch: 'full',
  },
];
