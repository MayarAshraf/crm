import { Injectable, inject } from "@angular/core";
import { LoadModulesService } from "./load-modules.service";

@Injectable({
  providedIn: "root",
})
export class EnabledModuleService {
  #userModules = inject(LoadModulesService).enabledModules;

  hasModule(moduleName: string) {
    return this.#userModules().includes(moduleName);
  }

  hasAnyModules(moduleNames: string[]) {
    return moduleNames.some(moduleName => this.#userModules().includes(moduleName));
  }

  hasAllModules(moduleNames: string[]) {
    return moduleNames.every(moduleName => this.#userModules().includes(moduleName));
  }
}
