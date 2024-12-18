import { Routes } from "@angular/router";
import { ModuleGuard, constants } from "@shared";
import { ngxPermissionsGuard } from "ngx-permissions";

export const importsRoutes: Routes = [
  {
    path: "imports",
    children: [
      {
        path: "",
        children: [
          {
            path: "assignment-rules",
            canActivate: [ModuleGuard, ngxPermissionsGuard],
            data: {
              enabledModule: constants.modulesNames["Assignments Module"],
              breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "assignment_rules" }],
              permissions: {
                only: [constants.permissions["index-assignment-rules"]],
                redirectTo: "403",
              },
            },
            loadComponent: () => import("./screens/assignment-rules/assignment-rules.component"),
            title: "assignment_rules",
          },
          {
            path: "web-form-routings",
            canActivate: [ngxPermissionsGuard],
            data: {
              breadcrumbs: [
                { label: "settings", url: "/settings" },
                { label: "web_form_routings" },
              ],
              permissions: {
                only: [constants.permissions["index-web-form-routings"]],
                redirectTo: "403",
              },
            },
            loadComponent: () => import("./screens/web-form-routings/web-form-routings.component"),
            title: "web_form_routings",
          },
          {
            path: "fblgi-routings",
            canActivate: [ngxPermissionsGuard],
            data: {
              breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "fblgi_routings" }],
              permissions: {
                only: [constants.permissions["index-fblgi-routings"]],
                redirectTo: "403",
              },
            },
            loadComponent: () => import("./screens/fblgi-routings/fblgi-routings.component"),
            title: "fblgi_routings",
          },
        ],
      },
    ],
  },
];
