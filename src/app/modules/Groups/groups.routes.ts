import { Routes } from '@angular/router';
import { constants } from '@shared';
import { ngxPermissionsGuard } from 'ngx-permissions';

export const groupsRoutes: Routes = [
  {
    path: 'groups',
    data: {
      breadcrumbs: [
        { label: "settings", url: "/settings" },
        { label: "groups" }
      ]
    },
    children: [
      {
        path: '',
        canActivate: [ngxPermissionsGuard],
        data: {
          permissions: {
            only: [constants.permissions['index-groups']],
            redirectTo: "403"
          }
        },
        loadComponent: () => import('./screens/groups/index/groups.component'),
        title: 'groups',
      },
    ],
  },
];
