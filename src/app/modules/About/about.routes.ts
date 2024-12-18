import { Routes } from "@angular/router";
import { ModuleGuard, constants } from "@shared";
import { ngxPermissionsGuard } from "ngx-permissions";

export const AboutRoutes: Routes = [
  {
    path: "about",
    canActivate: [ModuleGuard],
    data: {
      enabledModule: constants.modulesNames["About Module"],
    },
    children: [
      {
        path: "sections",
        canActivate: [ngxPermissionsGuard],
        data: {
          breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "about_sections" }],
          permissions: {
            only: [constants.permissions["index-about-sections"]],
            redirectTo: "403",
          },
        },
        loadComponent: () => import("./screens/index/about.component"),
        title: "about_sections",
      },
    ],
  },
];
