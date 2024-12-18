import { Routes } from '@angular/router';

export const brokersRoutes: Routes = [
  {
    path: 'brokers',
    children: [
      {
        path: '',
        loadComponent: () => import('@abort503')
      },
      {
        path: 'show/:broker_id',
        loadComponent: () => import('@abort503')
      },
      {
        path: 'import',
        loadComponent: () => import('@abort503'),
      },
      {
        path: 'settings',
        loadComponent: () => import('@abort503'),
      },
    ],
  },
];
