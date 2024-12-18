import { Routes } from '@angular/router';
import { ModuleGuard, constants } from '@shared';

export const dashboardRoutes: Routes = [
  {
    path: '',
    canActivate: [ModuleGuard],
    data: {
      enabledModule: constants.modulesNames["Dashboard Module"]
    },
    children: [
      {
        path: 'home',
        loadComponent: () => import('./dashboard/dashboard.component'),
        title: "home"
      }
    ]
  }
];
