import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Route, RouterStateSnapshot } from '@angular/router';
import { EnabledModuleService, LoadModulesService } from '../services';

export declare type OnlyFn = (route: ActivatedRouteSnapshot | Route, state?: RouterStateSnapshot) => string;

export function isFunction<T>(value: any): value is T {
  return typeof value === 'function';
}

export const ModuleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const enabledModule = inject(EnabledModuleService);
  const enabledModuleData = route.data["enabledModule"];
  const typeConditionModule = route.data["typeConditionModule"];

  const moduleName: string | string[] = isFunction<OnlyFn>(enabledModuleData)
    ? enabledModuleData(route, state)
    : enabledModuleData;

  if (!typeConditionModule) {
    return enabledModule.hasModule(moduleName as string);
  }

  switch (typeConditionModule) {
    case "any":
      return enabledModule.hasAnyModules(moduleName as string[]);
    case "all":
      return enabledModule.hasAllModules(moduleName as string[]);
    default:
      return false;
  }

  // Guards in Angular return a boolean Observable indicating whether navigation to a particular route is allowed. These Observables are usually `finite`, as they emit a single boolean value and then complete.

  // `Finite Observables` are those that emit a limited number of values and then complete.
  // Some common examples of `finite Observables` include: HTTP requests, User input events.

  // So, In guards, it's recommended to avoid calling subscribe() directly, instead return the Observable. And Angular can manage the subscription and unsubscription process for you, thus preventing potential memory leaks.
}