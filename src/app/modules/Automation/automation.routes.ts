import { Routes } from "@angular/router";
import { ModuleGuard, constants } from "@shared";
import { ngxPermissionsGuard } from "ngx-permissions";

export const automationRulesRoutes: Routes = [
  {
    path: "automation",
    canActivate: [ModuleGuard],
    data: {
      enabledModule: constants.modulesNames["Automation Module"],
    },
    children: [
      {
        path: "rules",
        canActivate: [ngxPermissionsGuard],
        data: {
          breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "automation_rules" }],
          permissions: {
            only: [constants.permissions["index-automation-rules"]],
            redirectTo: "403",
          },
        },
        loadComponent: () => import("./screens/rules/rules.component"),
        title: "automation_rules",
      },
    ],
  },
];
