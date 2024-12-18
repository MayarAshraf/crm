import { Routes } from '@angular/router';

export const contractsRoutes: Routes = [
  {
    path: 'contracts',
    children: [
      {
        path: '',
        loadComponent: () => import('@abort503')
      },
      {
        path: 'show/:contract_id',
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
