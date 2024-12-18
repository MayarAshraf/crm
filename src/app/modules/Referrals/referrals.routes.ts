import { Routes } from "@angular/router";
import { ModuleGuard, constants } from "@shared";
import { ngxPermissionsGuard } from "ngx-permissions";
export const referralRoutes: Routes = [
  {
    path: "referrals",
    canActivate: [ModuleGuard],
    data: { enabledModule: constants.modulesNames["Referrals Module"] },
    children: [
      {
        path: "",
        canActivate: [ngxPermissionsGuard],
        loadComponent: () => import("./screens/index/referrals.component"),
        title: "referrals",
        data: {
          breadcrumbs: [{ label: "referrals" }],
          permissions: {
            only: [constants.permissions["index-referrals"]],
            redirectTo: "403",
          },
          stateKeys: {
            storedChipsKey: "referrals-chips-key",
          },
        },
      },
    ],
  },
];
