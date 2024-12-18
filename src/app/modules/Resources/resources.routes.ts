import { Routes } from "@angular/router";
import { ModuleGuard, constants } from "@shared";
import { ngxPermissionsGuard } from "ngx-permissions";

export const resourcesRoutes: Routes = [
  {
    path: "resources",
    canActivate: [ModuleGuard],
    data: {
      enabledModule: constants.modulesNames["Resources Module"],
    },
    children: [
      {
        path: "",
        canActivate: [ngxPermissionsGuard],
        loadComponent: () => import("./screens/index/resources.component"),
        title: "resources",
        data: {
          breadcrumbs: [{ label: "resources" }],
          permissions: {
            only: [constants.permissions["index-resources"]],
            redirectTo: "403",
          },
          stateKeys: {
            storedChipsKey: "resources-chips-key",
          },
        },
      },
      {
        path: "show/:resource_id",
        loadComponent: () => import("@abort503"),
      },
      {
        path: "settings/types",
        canActivate: [ngxPermissionsGuard],
        data: {
          breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "resource_types" }],
          permissions: {
            only: [constants.permissions["index-resource-types"]],
            redirectTo: "403",
          },
        },
        loadComponent: () => import("./screens/settings/types/types.component"),
        title: "resource_types",
      },
    ],
  },
];
