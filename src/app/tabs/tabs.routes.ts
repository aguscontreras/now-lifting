import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'exercises',
        loadChildren: () => import('../features/exercises/exercises.routes').then(m => m.routes),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'exercises',
    pathMatch: 'full',
  },
];
