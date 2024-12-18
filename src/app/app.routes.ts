import { inject } from "@angular/core";
import { Router, Routes } from "@angular/router";
import { AuthLayoutComponent } from "@layout/auth-layout/auth-layout.component";
import { AuthGuard, LoadModulesService, LoginGuard } from "@shared";

export const routes: Routes = [
  { path: "", redirectTo: "/auth/login", pathMatch: "full" },
  {
    path: "auth",
    canActivate: [LoginGuard],
    canActivateChild: [LoginGuard],
    component: AuthLayoutComponent,
    loadChildren: () => import("@modules/Auth/auth.routes"),
  },
  {
    path: "",
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    loadComponent: () => import("@layout/content-layout/content-layout.component"),
    loadChildren: () => import("./child.routes"),
    data: {
      authGuardRedirect: "/auth/login",
    },
  },
  {
    path: "no-modules",
    canActivate: [
      () => {
        if (inject(LoadModulesService).enabledModules().length) {
          inject(Router).navigate(["/home"]);
          return false;
        }
        return true;
      },
    ],
    loadComponent: () => import("@pages/errors/no-modules/no-modules.component"),
  },
  {
    path: "403",
    loadComponent: () => import("@pages/errors/403/403.component"),
  },
  // Fallback when no routes is matched
  {
    path: "**",
    loadComponent: () => import("@pages/errors/404/404.component"),
  },
];

/*
The key differences between canActivate and canActivateChild are:

- canActivate is only executed when the parent component is not yet created For example, if we navigate to the parent route it will be called, if we then navigate to a child route it will not. If we directly navigate to the child route, the canActivate guard will also be executed.

- canActivateChild will always be executed while navigating to/between child routes. For example, if we're at a child route child/1 and we navigate to child/2, the guard will get executed. If we directly navigate to a child route, the guard will also get called. If we navigate to the parent route, the canActivateChild guard will not be fired.

- canActivate is executed before canActivateChild . If canActivate return false, canActivateChild will not be executed.

- because canActivate is guarding the parent route, the child parameters (and data) are not available on the ActivatedRouteSnapshot of the canActivate guard. To be able to access the child parameters, we have to drill down the child components on the RouterStateSnapshot.

- because the parent component gets created first, the canActivate guard will always be called first.

- if we directly navigate to a child component and the child guard returns a falsy value then the parent component will also not be created, because the navigation is cancelled when one of the guards return a falsy value.

- when the canActivate guard returns a falsy value, then the canActivateChild guard will not be called.

- the canActivateChild guard can be rewritten as a canActivate guard on every child route.
*/
