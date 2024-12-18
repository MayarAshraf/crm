import { Routes } from "@angular/router";
import { ModuleGuard, constants } from "@shared";
import { ngxPermissionsGuard } from "ngx-permissions";

export const leadsRoutes: Routes = [
  {
    path: "leads",
    canActivate: [ModuleGuard],
    data: { enabledModule: constants.modulesNames["Leads Module"] },
    children: [
      {
        path: "workspace",
        canActivate: [ngxPermissionsGuard],
        title: "workspace",
        data: {
          permissions: {
            only: [
              constants.permissions["index-leads"],
              constants.permissions["index-contacts"],
              constants.permissions["index-customers"],
              constants.permissions["index-accounts"],
            ],
            redirectTo: "403",
          },
          stateKeys: {
            storedChipsKey: "workspace-chips-key",
            storedSettingsKey: "workspace-settings-key",
          },
          breadcrumbs: [{ label: "workspace" }],
        },
        loadComponent: () => import("./workspace/workspace.component"),
      },
      {
        path: "leadId/:leadId",
        loadComponent: () => import("./screens/lead-profile/lead-profile.component"),
      },
      {
        path: "duplicates-manager",
        loadComponent: () => import("./components/duplicates-manager/duplicates-manager.component"),
        data: {
          permissions: {
            only: [
              constants.permissions["index-duplicate-leads"],
              constants.permissions["index-duplicate-contacts"],
              constants.permissions["index-duplicate-customers"],
              constants.permissions["index-duplicate-accounts"],
            ],
            redirectTo: "403",
          },
          stateKeys: {
            storedChipsKey: "duplicates-chips-key",
          },
          breadcrumbs: [{ label: "duplicates manager" }],
        },
      },
      {
        path: "import",
        loadComponent: () => import("@abort503"),
      },
      {
        path: "settings",
        children: [
          {
            path: "fields-config",
            loadComponent: () => import("@abort503"),
          },
          {
            path: "manage-lead-fields",
            data: {
              breadcrumbs: [
                { label: "settings", url: "/settings" },
                { label: "manage_lead_fields" },
              ],
            },
            loadComponent: () =>
              import("./screens/manage-lead-fields/manage-leads-fields.component"),
            title: "manage_lead_fields",
          },
        ],
      },
    ],
  },
];
