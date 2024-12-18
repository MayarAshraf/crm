import { Routes } from '@angular/router';
import { constants } from '@shared';
import { ngxPermissionsGuard } from 'ngx-permissions';

export const usersRoutes: Routes = [
  {
    path: 'users',
    data: {
      breadcrumbs: [
        { label: "settings", url: "/settings" },
        { label: "users" }
      ]
    },
    children: [
      {
        path: '',
        canActivate: [ngxPermissionsGuard],
        loadComponent: () => import('./screens/users/users.component'),
        title: "users",
        data: {
          permissions: {
            only: [constants.permissions['index-users']],
            redirectTo: "403"
          }
        },
      },
    ],
  },
];
