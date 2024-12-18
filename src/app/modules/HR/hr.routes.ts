import { Routes } from "@angular/router";
import { ModuleGuard, constants } from "@shared";
import { ngxPermissionsGuard } from "ngx-permissions";

export const hrRoutes: Routes = [
  {
    path: "hr",
    canActivate: [ModuleGuard],
    data: { enabledModule: constants.modulesNames["HR Module"] },
    children: [
      {
        path: "check-ins/index",
        canActivate: [ngxPermissionsGuard],
        loadComponent: () => import("./screens/check-ins/index/check-ins.component"),
        title: "check_ins",
        data: {
          breadcrumbs: [{ label: "check_ins" }],
          permissions: {
            only: [
              constants.permissions["index-hr-check-ins"],
              constants.permissions["index-hr-fake-incidents"],
            ],
            redirectTo: "403",
          },
          stateKeys: {
            storedChipsKey: "check-in-chips-key",
          },
        },
      },
    ],
  },
];
