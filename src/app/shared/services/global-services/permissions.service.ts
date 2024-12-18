import { Injectable, inject } from "@angular/core";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class PermissionsService {
  #userPermissions = inject(AuthService).userPermissions;

  hasPermission(permission: string) {
    return this.#userPermissions()?.includes(permission) as boolean;
  }

  hasAnyPermissions(permissions: string[]) {
    return permissions.some(permission => this.#userPermissions()?.includes(permission)) as boolean;
  }

  hasAllPermissions(permissions: string[]) {
    return permissions.every(
      permission => this.#userPermissions()?.includes(permission),
    ) as boolean;
  }
}
