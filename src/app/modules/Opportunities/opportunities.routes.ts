import { Routes } from "@angular/router";
import { ModuleGuard, constants } from "@shared";
import { ngxPermissionsGuard } from "ngx-permissions";

export const opportunitiesRoutes: Routes = [
  {
    path: "opportunities",
    canActivate: [ModuleGuard],
    data: {
      enabledModule: constants.modulesNames["Opportunities Module"],
      breadcrumbs: [{ label: "deals" }],
    },
    children: [
      {
        path: "",
        loadComponent: () => import("./Opportunities/opportunities.component"),
        canActivate: [ngxPermissionsGuard],
        data: {
          permissions: {
            only: [constants.permissions["index-opportunities"]],
            redirectTo: "403",
          },
          stateKeys: {
            storedChipsKey: "opportunities-chips-key",
          },
        },
      },
      {
        path: "settings",
        children: [
          {
            path: "lost-reasons",
            canActivate: [ModuleGuard],
            data: {
              breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "lost_reasons" }],
            },
            loadComponent: () => import("./screens/lost-reasons/lost-reasons.component"),
            title: "lost_reasons",
          },
        ],
      },
    ],
  },
];
