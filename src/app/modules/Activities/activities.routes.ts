import { Routes } from "@angular/router";
import { ModuleGuard, constants } from "@shared";

export const activitiesRoutes: Routes = [
  {
    path: "activity",
    canActivate: [ModuleGuard],
    data: {
      enabledModule: constants.modulesNames["Activities Module"],
    },
    loadComponent: () => import("./settings/manage-activity-type/manage-activity-type.component"),
    children: [
      {
        path: "settings/activity-type",
        data: {
          breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "activity_type" }],
        },
        loadComponent: () =>
          import("./settings/manage-activity-type/manage-activity-type.component"),
        title: "activity_type",
      },
    ],
  },
];
