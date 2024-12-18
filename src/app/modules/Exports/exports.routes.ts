import { Routes } from "@angular/router";
import { ModuleGuard, constants } from "@shared";
import { ngxPermissionsGuard } from "ngx-permissions";
export const exportsRoutes: Routes = [
  {
    path: "exports",
    canActivate: [ModuleGuard, ngxPermissionsGuard],
    data: {
      enabledModule: constants.modulesNames["Exports Module"],
      permissions: {
        only: [constants.permissions["index-exported-files"]],
        redirectTo: "403",
      },
    },
    children: [
      {
        path: "exports",
        loadComponent: () => import("./screens/exports/index/exports.component"),
        title: "exports",
        data: {
          breadcrumbs: [{ label: "exports" }],
          stateKeys: {
            storedChipsKey: "exports-chips-key",
          },
        },
      },
      {
        path: "exports_requests",
        loadComponent: () => import("./screens/exports-requests/exports-requests.component"),
        title: "export_requests",
        data: {
          breadcrumbs: [{ label: "export_requests" }],
          stateKeys: {
            storedChipsKey: "exports-requests-chips-key",
          },
        },
      },
    ],
  },
];
