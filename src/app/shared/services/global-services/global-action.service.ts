import { DestroyRef, Injectable, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ApiService, ConfirmService } from "@shared";

@Injectable({ providedIn: "root" })
export abstract class GlobalActionService {
  public api = inject(ApiService);
  #confirmService = inject(ConfirmService);
  #destroyRef = inject(DestroyRef); // Current "context" (this service)

  protected abstract updateUi(): void;

  protected deleteAction(endpoint: string, target: any, id: number, version = "v1") {
    this.#confirmService.confirmDelete({
      target,
      acceptCallback: () => {
        return this.api
          .request("post", endpoint, { id }, undefined, undefined, version)
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe({
            next: () => {
              this.updateUi();
            },
          });
      },
    });
  }
}
