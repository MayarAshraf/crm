import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { TranslateService } from "@ngx-translate/core";
import { AlertService, AuthService } from "@shared";
import localForage from "localforage";
import { ProfileItemComponent } from "../profile-item/profile-item.component";

@Component({
  selector: "app-utilities",
  standalone: true,
  templateUrl: "./utilities.component.html",
  styleUrl: "./utilities.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, ProfileItemComponent],
})
export class UtilitiesComponent {
  #authService = inject(AuthService);
  #alert = inject(AlertService);
  #destroyRef = inject(DestroyRef); // Current "context" (this component)
  #translate = inject(TranslateService);

  utilitiesItems = signal([
    {
      id: "clear-DB",
      label: this.#translate.instant(_("refresh_app_lists")),
      subtitle: this.#translate.instant(_("clear_all_cached_lists")),
      icon: "fas fa-broom",
    },
    {
      id: "update-permissions",
      label: this.#translate.instant(_("refresh_permissions")),
      subtitle: this.#translate.instant(_("update_user_permissions")),
      icon: "fas fa-user-shield",
    },
  ]);

  clearDB() {
    localForage.clear();
    this.#alert.setMessage({
      severity: "success",
      detail: "Database cleared successfully.",
    });
  }

  updatePermissions() {
    this.#authService
      .getUserPermissions()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(permissions => this.#authService.updateUserPermissions(permissions));
  }
}
