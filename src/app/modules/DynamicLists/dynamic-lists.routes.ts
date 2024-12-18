import { ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from "@angular/router";
import { KebabCasePipe, ModuleGuard, PluralPipe, constants } from "@shared";
import { ngxPermissionsGuard } from "ngx-permissions";

export function namePermissionGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const kebabCase = new KebabCasePipe();
  const plural = new PluralPipe();

  const listGuradsRoutes = [
    constants.permissions["index-industries"],
    constants.permissions["index-company-sizes"],
    constants.permissions["index-jobs"],
    constants.permissions["index-departments"],
    constants.permissions["index-account-types"],
    constants.permissions["index-statuses"],
    constants.permissions["index-salutations"],
    constants.permissions["index-ratings"],
    constants.permissions["index-wallets"],
    constants.permissions["index-contact-methods"],
    constants.permissions["index-lead-lists"],
    constants.permissions["index-lead-classifications"],
    constants.permissions["index-lead-qualities"],
  ];

  const currentListName =
    "index-" + plural.transform(kebabCase.transform(route.params["list_name"]));
  const slugPermission = listGuradsRoutes.find(item => item === currentListName);

  return slugPermission
    ? constants.permissions[slugPermission as keyof typeof constants.permissions]
    : "no-permissions";
}

export const dynamicListsRoutes: Routes = [
  {
    path: "dynamic-lists",
    canActivate: [ModuleGuard],
    data: { enabledModule: constants.modulesNames["Dynamic Lists Module"] },
    children: [
      {
        path: ":list_id/:list_name",
        canActivate: [ngxPermissionsGuard],
        data: {
          breadcrumbs: [{ label: "settings", url: "/settings" }],
          permissions: {
            only: namePermissionGuard,
            redirectTo: "403",
          },
        },
        loadComponent: () => import("./screens/values/values.component"),
        title: "dynamic_lists",
      },
    ],
  },
];
