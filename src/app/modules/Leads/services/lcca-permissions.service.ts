import { Injectable, inject } from "@angular/core";
import { PermissionsService } from "@shared";

@Injectable({ providedIn: "root" })
export class LccaPermissionsService {
  #userPermission = inject(PermissionsService);

  checkPermission(leadTypeId: number, permissionSlug: string, isPlural: boolean = false) {
    const replacements: { [key: number]: string } = {
      1: isPlural ? "leads" : "lead",
      2: isPlural ? "contacts" : "contact",
      3: isPlural ? "customers" : "customer",
      4: isPlural ? "accounts" : "account",
    };

    const replacement = replacements[leadTypeId];

    if (!replacement) return false;

    return this.#userPermission.hasPermission(`${permissionSlug.replace("??", replacement)}`);
  }
}
