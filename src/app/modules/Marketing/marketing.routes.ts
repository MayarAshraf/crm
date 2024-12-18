import { Routes } from "@angular/router";
import { ModuleGuard, constants } from "@shared";
import { ngxPermissionsGuard } from "ngx-permissions";

export const marketingRoutes: Routes = [
  {
    path: "marketing",
    canActivate: [ModuleGuard],
    data: {
      enabledModule: constants.modulesNames["Marketing Module"],
      breadcrumbs: [{ label: "marketing" }],
    },
    children: [
      {
        path: "",
        loadComponent: () => import("./campaigns/campaigns.component"),
        canActivate: [ngxPermissionsGuard],

        data: {
          permissions: {
            only: constants.permissions["index-campaigns"],
            redirectTo: "403",
          },
          stateKeys: {
            storedChipsKey: "campaign-chips-key",
          },
        },
      },
      {
        path: "show/:campaign_id",
        loadComponent: () => import("@abort503"),
      },
      {
        path: "settings",
        children: [
          {
            path: "types",
            data: {
              breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "campaign_types" }],
              canActivate: [ngxPermissionsGuard],
              permissions: {
                only: [constants.permissions["index-campaign-types"]],
                redirectTo: "403",
              },
            },
            loadComponent: () => import("./screens/settings/types/campaign-types.component"),
            title: "campaign_types",
          },
          {
            path: "statuses",
            data: {
              breadcrumbs: [
                { label: "settings", url: "/settings" },
                { label: "campaign_statuses" },
              ],
              canActivate: [ngxPermissionsGuard],
              permissions: {
                only: [constants.permissions["index-campaign-statuses"]],
                redirectTo: "403",
              },
            },
            loadComponent: () => import("./screens/settings/statuses/campaign-statuses.component"),
            title: "campaign_statuses",
          },
          {
            path: "lead-campaign-statuses",
            data: {
              breadcrumbs: [
                { label: "settings", url: "/settings" },
                { label: "lead_campaign_statuses" },
              ],
              canActivate: [ngxPermissionsGuard],
              permissions: {
                only: [constants.permissions["index-lead-campaign-statuses"]],
                redirectTo: "403",
              },
            },
            loadComponent: () =>
              import("./screens/settings/lead-campaign-statuses/lead-campaign-statuses.component"),
            title: "lead_campaign_statuses",
          },
        ],
      },
    ],
  },
];
