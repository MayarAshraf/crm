import { Routes } from "@angular/router";
import { ModuleGuard, constants } from "@shared";
import { ngxPermissionsGuard } from "ngx-permissions";

export const locationsRoutes: Routes = [
  {
    path: "locations",
    canActivate: [ModuleGuard],
    data: { enabledModule: constants.modulesNames["Locations Module"] },
    children: [
      {
        path: "settings",
        canActivate: [ngxPermissionsGuard],
        title: "locations",
        data: {
          breadcrumbs: [
            { label: "settings", url: "/settings" },
            { label: "all_countries", url: "/locations/settings" },
          ],
          permissions: {
            only: [constants.permissions["index-locations"]],
            redirectTo: "403",
          },
        },
        children: [
          {
            path: "",
            loadComponent: () => import("./screens/locations/index/locations.component"),
          },
          {
            path: ":parent_id",
            loadComponent: () => import("./screens/locations/index/locations.component"),
          },
        ],
      },
    ],
  },
];
