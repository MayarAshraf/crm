import { Routes } from "@angular/router";
import { ModuleGuard, constants } from "@shared";
import { ngxPermissionsGuard } from "ngx-permissions";

export const interestsRoutes: Routes = [
  {
    path: "interests",
    canActivate: [ModuleGuard],
    data: {
      enabledModule: constants.modulesNames["Interests Module"],
      breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "interests" }],
    },
    children: [
      {
        path: "",
        canActivate: [ngxPermissionsGuard],
        data: {
          permissions: {
            only: [constants.permissions["index-interests"]],
            redirectTo: "403",
          },
        },
        loadComponent: () => import("./screens/index/interests.component"),
        title: "interests",
      },
    ],
  },
];
