import { ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from "@angular/router";
import { ModuleGuard, constants } from "@shared";
import { ngxPermissionsGuard } from "ngx-permissions";

export function moduleNameGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const listGuradsRoutes = [
    constants.modulesNames["Activities Module"],
    constants.modulesNames["Events Module"],
    constants.modulesNames["Assignments Module"],
    constants.modulesNames["Calendar Module"],
    constants.modulesNames["Integrations Module"],
    constants.modulesNames["Lead Generation Module"],
    constants.modulesNames["Opportunities Module"],
    constants.modulesNames["Tasks Module"],
    constants.modulesNames["HR Module"],
    constants.modulesNames["Leads Module"],
    constants.modulesNames["Broker Inventory Module"],
  ];

  const slugPermission = listGuradsRoutes.find(item => item === route.params["moduleSetting"]);
  return slugPermission
    ? constants.modulesNames[slugPermission as keyof typeof constants.modulesNames]
    : "no-permissions";
}

export const settingsRoutes: Routes = [
  {
    path: "settings",
    canActivate: [ModuleGuard],
    data: {
      enabledModule: constants.modulesNames["Settings Module"],
      breadcrumbs: [{ label: "settings" }],
    },
    children: [
      {
        path: "",
        loadComponent: () => import("./screens/index/settings-index.component"),
        title: "settings",
      },
      {
        path: "documentations",
        loadComponent: () => import("./screens/docs/docs.component"),
        children: [
          {
            path: "search-leads-documentation",
            canActivate: [ngxPermissionsGuard],
            data: {
              breadcrumbs: [
                { label: "settings", url: "/settings" },
                { label: "search_leads_documentation" },
              ],
              permissions: {
                only: [constants.permissions["access-web-form-routings-technical-documentation"]],
                redirectTo: "403",
              },
            },
            loadComponent: () =>
              import(
                "./screens/docs/search-leads-documentation/search-leads-documentation.component"
              ),
            title: "search_leads_documentation",
          },
          {
            path: "store-client-documentation",
            data: {
              breadcrumbs: [
                { label: "settings", url: "/settings" },
                { label: "store_call_documentation" },
              ],
            },
            loadComponent: () =>
              import("./screens/docs/store-call-documentation/store-call-documentation.component"),
            title: "store_call_documentation",
          },
          {
            path: "store-note-documentation",
            data: {
              breadcrumbs: [
                { label: "settings", url: "/settings" },
                { label: "store_note_documentation" },
              ],
            },
            loadComponent: () =>
              import("./screens/docs/store-note-documentation/store-note-documentation.component"),
            title: "store_note_documentation",
          },
          {
            path: "search-leads-documentation",
            data: {
              breadcrumbs: [
                { label: "settings", url: "/settings" },
                { label: "search_leads_documentation" },
              ],
            },
            loadComponent: () =>
              import(
                "./screens/docs/search-leads-documentation/search-leads-documentation.component"
              ),
            title: "search_leads_documentation",
          },
        ],
      },
      {
        path: "manage-global-settings/:moduleSetting",
        canActivate: [ModuleGuard],
        loadComponent: () =>
          import("./screens/manage-global-settings/manage-global-settings.component"),
        title: "manage_global_settings",
        data: {
          enabledModule: moduleNameGuard,
          breadcrumbs: [{ label: "settings", url: "/settings" }],
        },
      },
      {
        path: "system-logs",
        canActivate: [ModuleGuard],
        loadComponent: () => import("@modules/Logger/system-logs/system-logs.component"),
        title: "system_logs",
        data: {
          enabledModule: constants.modulesNames["Logger Module"],
          breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "system_logs" }],
        },
      },
    ],
  },
];
