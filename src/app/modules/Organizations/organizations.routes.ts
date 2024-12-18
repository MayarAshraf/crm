import { Routes } from "@angular/router";
import { ModuleGuard, constants } from "@shared";
import { ngxPermissionsGuard } from "ngx-permissions";

export const organizationsRoutes: Routes = [
  {
    path: "",
    canActivate: [ModuleGuard],
    data: {
      enabledModule: constants.modulesNames["Organizations Module"],
    },
    children: [
      {
        path: "organizations",
        canActivate: [ngxPermissionsGuard],
        loadComponent: () => import("./screens/index/organizations.component"),
        title: "organizations",
        data: {
          breadcrumbs: [{ label: "organizations" }],
          permissions: {
            only: [constants.permissions["index-organizations"]],
            redirectTo: "403",
          },
          stateKeys: {
            storedChipsKey: "organizations-chips-key",
          },
        },
      },
    ],
  },
];
