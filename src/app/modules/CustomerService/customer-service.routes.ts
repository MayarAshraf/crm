import { Routes } from "@angular/router";
import { ModuleGuard, constants } from "@shared";
import { ngxPermissionsGuard } from "ngx-permissions";

export const customerServiceRoutes: Routes = [
  {
    path: "customer-service",
    canActivate: [ModuleGuard],
    data: {
      enabledModule: constants.modulesNames["Customer Service Module"],
    },
    children: [
      {
        path: "cases",
        canActivate: [ngxPermissionsGuard],
        loadComponent: () => import("./screens/cases/index/cases.component"),
        title: "cases",
        data: {
          breadcrumbs: [{ label: "cases", url: "/cases" }],
          permissions: {
            only: [constants.permissions["index-tickets"]],
            redirectTo: "403",
          },
          stateKeys: {
            storedChipsKey: "cases-chips-key",
          },
        },
      },
      {
        path: "settings",
        children: [
          {
            path: "case-types",
            canActivate: [ngxPermissionsGuard],
            data: {
              breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "case_types" }],
              permissions: {
                only: [constants.permissions["view-case-types"]],
                redirectTo: "403",
              },
            },
            loadComponent: () => import("./screens/settings/case-types/case-types.component"),
            title: "case_types",
          },
          {
            path: "case-reasons",
            canActivate: [ngxPermissionsGuard],
            data: {
              breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "case_reasons" }],
              permissions: {
                only: [constants.permissions["view-case-reasons"]],
                redirectTo: "403",
              },
            },
            loadComponent: () => import("./screens/settings/case-reasons/case-reasons.component"),
            title: "case_reasons",
          },
          {
            path: "case-origins",
            canActivate: [ngxPermissionsGuard],
            data: {
              breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "case_origins" }],
              permissions: {
                only: [constants.permissions["view-case-origins"]],
                redirectTo: "403",
              },
            },
            loadComponent: () => import("./screens/settings/case-origins/case-origins.component"),
            title: "case_origins",
          },
          {
            path: "case-priorities",
            canActivate: [ngxPermissionsGuard],
            data: {
              breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "case_priorities" }],
              permissions: {
                only: [constants.permissions["view-case-priorities"]],
                redirectTo: "403",
              },
            },
            loadComponent: () =>
              import("./screens/settings/case-priorities/case-priorities.component"),
            title: "case_priorities",
          },
        ],
      },
    ],
  },
];
