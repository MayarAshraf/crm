import { Routes } from "@angular/router";
import { ModuleGuard, constants } from "@shared";
import { ngxPermissionsGuard } from "ngx-permissions";

export const tagsRoutes: Routes = [
  {
    path: "tags",
    canActivate: [ModuleGuard],
    data: {
      enabledModule: constants.modulesNames["Tags Module"],
      breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "tags" }],
    },
    children: [
      {
        path: "",
        canActivate: [ngxPermissionsGuard],
        data: {
          permissions: {
            only: [constants.permissions["index-tags"]],
            redirectTo: "403",
          },
        },
        loadComponent: () => import("./screens/index/tags.component"),
        title: "tags",
      },
    ],
  },
];
