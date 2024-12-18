import { ComponentType } from "@angular/cdk/portal";
import { DestroyRef, inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { createDialogConfig, MediaFile } from "@shared";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

interface Config<D> {
  data: D;
  component: ComponentType<unknown>;
  width?: string;
}

@Injectable({ providedIn: "root" })
export class OpenViewDialogService<T extends { id: number; media: MediaFile[] }> {
  #dialogRef = inject(DynamicDialogRef);
  #dialogService = inject(DialogService);
  #destroyRef = inject(DestroyRef);

  records = signal<T[]>([]);

  openViewRecordDialog<D>(config: Config<D>) {
    config.width = config.width || "750px";

    const dialogConfig = createDialogConfig({
      dismissableMask: true,
      width: config.width,
      data: config.data,
    });

    this.#dialogRef = this.#dialogService.open(config.component, dialogConfig);
    this.#dialogRef?.onClose.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(record => {
      if (!record) return;
      const selectedRecord = this.records().find(resorce => resorce.id === record.id);
      if (selectedRecord?.media.length !== record.media.length) {
        this.records.update(records =>
          records.map(item => (item.id === record.id ? { ...item, ...record } : item)),
        );
      }
    });
  }
}
