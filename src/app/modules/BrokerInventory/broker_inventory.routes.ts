import { Routes } from "@angular/router";
import { ModuleGuard, constants } from "@shared";
import { ngxPermissionsGuard } from "ngx-permissions";

export const brokerInventoryRoutes: Routes = [
  {
    path: "broker-inventory",
    canActivate: [ModuleGuard],
    data: {
      enabledModule: constants.modulesNames["Broker Inventory Module"],
      breadcrumbs: [{ label: "inventory" }],
    },
    children: [
      {
        path: "",
        loadComponent: () => import("./screens/broker-inventory/broker-inventory.component"),
      },
      {
        path: "settings",
        children: [
          {
            path: "facilities",
            canActivate: [ngxPermissionsGuard],
            data: {
              breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "facilities" }],
              permissions: {
                only: [constants.permissions["index-broker-inventory-facilities"]],
                redirectTo: "403",
              },
            },
            loadComponent: () => import("./screens/settings/facilities/facilities.component"),
            title: "facilities",
          },
          {
            path: "amenities",
            data: {
              canActivate: [ngxPermissionsGuard],
              breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "amenities" }],
              permissions: {
                only: [constants.permissions["index-broker-inventory-amenities"]],
                redirectTo: "403",
              },
            },
            loadComponent: () => import("./screens/settings/amenities/amenities.component"),
            title: "amenities",
          },
          {
            path: "area-units",
            canActivate: [ngxPermissionsGuard],
            data: {
              breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "area_units" }],
              permissions: {
                only: [constants.permissions["index-broker-inventory-area-units"]],
                redirectTo: "403",
              },
            },
            loadComponent: () => import("./screens/settings/area-units/area-units.component"),
            title: "area_units",
          },
          {
            path: "bathrooms",
            canActivate: [ngxPermissionsGuard],
            data: {
              breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "bathrooms" }],
              permissions: {
                only: [constants.permissions["index-broker-inventory-bathrooms"]],
                redirectTo: "403",
              },
            },
            loadComponent: () => import("./screens/settings/bathrooms/bathrooms.component"),
            title: "bathrooms",
          },
          {
            path: "bedrooms",
            canActivate: [ngxPermissionsGuard],
            data: {
              breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "bedrooms" }],
              permissions: {
                only: [constants.permissions["index-broker-inventory-bedrooms"]],
                redirectTo: "403",
              },
            },
            loadComponent: () => import("./screens/settings/bedrooms/bedrooms.component"),
            title: "bedrooms",
          },
          {
            path: "finishing-types",
            canActivate: [ngxPermissionsGuard],
            data: {
              breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "finishing_types" }],
              permissions: {
                only: [constants.permissions["index-broker-inventory-finishing-types"]],
                redirectTo: "403",
              },
            },
            loadComponent: () =>
              import("./screens/settings/finishing-types/finishing-types.component"),
            title: "finishing_types",
          },
          {
            path: "purpose-types",
            canActivate: [ngxPermissionsGuard],
            data: {
              breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "purpose_types" }],
              permissions: {
                only: [constants.permissions["index-broker-inventory-purpose-types"]],
                redirectTo: "403",
              },
            },
            loadComponent: () => import("./screens/settings/purpose-types/purpose-types.component"),
            title: "purpose_types",
          },
          {
            path: "purposes",
            canActivate: [ngxPermissionsGuard],
            data: {
              breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "purposes" }],
              permissions: {
                only: [constants.permissions["index-broker-inventory-purposes"]],
                redirectTo: "403",
              },
            },
            loadComponent: () => import("./screens/settings/purposes/purposes.component"),
            title: "purposes",
          },
          {
            path: "furnishing-statuses",
            canActivate: [ngxPermissionsGuard],
            data: {
              breadcrumbs: [
                { label: "settings", url: "/settings" },
                { label: "furnishing_statuses" },
              ],
              permissions: {
                only: [constants.permissions["index-broker-inventory-furnishing-statuses"]],
                redirectTo: "403",
              },
            },
            loadComponent: () =>
              import("./screens/settings/furnishing-statuses/furnishing-statuses.component"),
            title: "furnishing_statuses",
          },
          {
            path: "offering-types",
            canActivate: [ngxPermissionsGuard],
            data: {
              breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "offering_types" }],
              permissions: {
                only: [constants.permissions["index-broker-inventory-offering-types"]],
                redirectTo: "403",
              },
            },
            loadComponent: () =>
              import("./screens/settings/offering-types/offering-types.component"),
            title: "offering_types",
          },
          {
            path: "payment-methods",
            canActivate: [ModuleGuard, ngxPermissionsGuard],
            loadComponent: () =>
              import("./screens/settings/payment-methods/payment-methods.component"),
            title: "payment_methods",
            data: {
              enabledModule: constants.modulesNames["Payments Module"],
              breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "payment_methods" }],
              permissions: {
                only: [constants.permissions["index-broker-inventory-payment-methods"]],
                redirectTo: "403",
              },
            },
          },
          {
            path: "positions",
            canActivate: [ngxPermissionsGuard],
            data: {
              breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "positions" }],
              permissions: {
                only: [constants.permissions["index-broker-inventory-positions"]],
                redirectTo: "403",
              },
            },
            loadComponent: () => import("./screens/settings/positions/positions.component"),
            title: "positions",
          },
          {
            path: "views",
            canActivate: [ngxPermissionsGuard],
            data: {
              breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "views" }],
              permissions: {
                only: [constants.permissions["index-broker-inventory-views"]],
                redirectTo: "403",
              },
            },
            loadComponent: () => import("./screens/settings/views/views.component"),
            title: "views",
          },
          {
            path: "floor-numbers",
            canActivate: [ngxPermissionsGuard],
            data: {
              breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "floor_numbers" }],
              permissions: {
                only: [constants.permissions["index-broker-inventory-floor-numbers"]],
                redirectTo: "403",
              },
            },
            loadComponent: () => import("./screens/settings/floor-numbers/floor-numbers.component"),
            title: "floor_numbers",
          },
          {
            path: "unit-matching-request-config",
            canActivate: [ngxPermissionsGuard],
            data: {
              breadcrumbs: [
                { label: "settings", url: "/settings" },
                { label: "unit_matching_request_config" },
              ],
              permissions: {
                only: [
                  constants.permissions["update-broker-inventory-unit-request-matching-config"],
                ],
                redirectTo: "403",
              },
            },
            loadComponent: () =>
              import(
                "./screens/settings/unit-matching-request-config/unit-matching-request-config.component"
              ),
            title: "unit_matching_request_config",
          },
          {
            path: "unit-config",
            data: {
              breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "unit_config" }],
            },
            loadComponent: () => import("./screens/settings/units-config/units-config.component"),
            title: "unit_config",
          },
          {
            path: "unit-requests",
            data: {
              canActivate: [ngxPermissionsGuard],
              breadcrumbs: [
                { label: "settings", url: "/settings" },
                { label: "unit_requests_config" },
              ],
              permissions: {
                only: [constants.permissions["update-broker-inventory-unit-request-config"]],
                redirectTo: "403",
              },
            },
            loadComponent: () =>
              import("./screens/settings/unit-request-config/unit-request-config.component"),
            title: "unit_requests_config",
          },
        ],
      },
      {
        path: "units",
        loadComponent: () => import("@abort503"),
      },
      {
        path: "units/:unit_id",
        loadComponent: () => import("@abort503"),
      },
      {
        path: "projects/index",
        canActivate: [ngxPermissionsGuard],
        loadComponent: () => import("./screens/projects/index/projects.component"),
        title: "projects",
        data: {
          breadcrumbs: [{ label: "inventory", url: "/broker-inventory" }, { label: "projects" }],
          permissions: {
            only: [constants.permissions["index-broker-inventory-projects"]],
            redirectTo: "403",
          },
          stateKeys: {
            storedChipsKey: "projects-chips-key",
          },
        },
      },
      {
        path: "projects/:project_id",
        loadComponent: () => import("@abort503"),
      },
      {
        path: "developers",
        canActivate: [ngxPermissionsGuard],
        loadComponent: () => import("./screens/developers/developers.component"),
        title: "developers",
        data: {
          breadcrumbs: [{ label: "inventory", url: "/broker-inventory" }, { label: "developers" }],
          permissions: {
            only: [constants.permissions["index-broker-inventory-developers"]],
            redirectTo: "403",
          },
        },
      },
      {
        path: "developers/:developer_id",
        loadComponent: () => import("@abort503"),
      },
      {
        path: "reservations",
        loadComponent: () => import("@abort503"),
      },
      {
        path: "reservations/:reservation_id",
        loadComponent: () => import("@abort503"),
      },
      {
        path: "blocks",
        loadComponent: () => import("@abort503"),
      },
      {
        path: "blocks/:block_id",
        loadComponent: () => import("@abort503"),
      },
      {
        path: "unit-requests/:unit_request_id",
        loadComponent: () => import("@abort503"),
      },
      {
        path: "import",
        loadComponent: () => import("@abort503"),
        children: [
          {
            path: "units",
            loadComponent: () => import("@abort503"),
          },
          {
            path: "projects",
            loadComponent: () => import("@abort503"),
          },
          {
            path: "developers",
            loadComponent: () => import("@abort503"),
          },
        ],
      },
    ],
  },
];
