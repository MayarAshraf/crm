import { Routes } from "@angular/router";
import { ModuleGuard, constants } from "@shared";
import { ngxPermissionsGuard } from "ngx-permissions";

export const companiesRoutes: Routes = [
  {
    path: "companies",
    canActivate: [ModuleGuard],
    data: {
      enabledModule: constants.modulesNames["Companies Module"],
      breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "companies" }],
    },
    children: [
      {
        path: "",
        canActivate: [ngxPermissionsGuard],
        data: {
          permissions: {
            only: [constants.permissions["index-companies"]],
            redirectTo: "403",
          },
        },
        loadComponent: () => import("./screens/companies/companies.component"),
        title: "companies",
      },
    ],
  },
];
