import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  model,
  output,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { ApiService } from "@gService/api.service";
import { ConfirmService } from "@gService/confirm.service";
import { TranslateService } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { ImageModule } from "primeng/image";
import { finalize } from "rxjs";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { MediaFile } from "../fields/multi-files/multi-files.component";

@Component({
  selector: "app-media-list",
  standalone: true,
  imports: [ButtonModule, ImageModule, ConfirmDialogComponent],
  template: `
    <app-confirm-dialog
      key="mediaConfirmDialog"
      styleClass="media-confirm-dialog"
      [appendTo]="target()"
    />

    @if (files()) {
      <ul class="list-none p-0 m-0 flex flex-wrap align-items-center gap-3">
        @for (file of files(); track $index; let i = $index) {
          <li class="relative w-7rem h-7rem" title="{{ file.file_name }}">
            <button
              type="button"
              pButton
              class="p-button-rounded p-button-outlined border-none text-700 hover:text-primary bg-white shadow-2 w-1.5rem h-1.5rem absolute p-0 z-5 opacity-100"
              style="top: -0.75rem; right: -0.75rem"
              icon="pi pi-times text-xs"
              [loading]="loadingStates()[file.id]"
              (click)="removeFile(file.id)"
            ></button>
            <p-image
              [src]="file.file"
              [alt]="file.file_name"
              imageClass="w-7rem h-7rem img-cover"
              [preview]="true"
            />
          </li>
        } @empty {
          <span class="text-sm">No media files</span>
        }
      </ul>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaListComponent {
  #api = inject(ApiService);
  #confirmService = inject(ConfirmService);
  #destroyRef = inject(DestroyRef);
  #translate = inject(TranslateService);

  onRemoveFile = output<any>();
  target = input();
  loadingStates = signal<{ [key: number]: boolean }>({});
  dataSource = model<any>();
  files = computed<MediaFile[]>(() => this.dataSource().media);

  removeFile(id: number) {
    this.#confirmService.confirmDelete({
      message: this.#translate.instant(_("confirm_proceed")),
      key: "mediaConfirmDialog",
      acceptCallback: () => {
        this.loadingStates.set({ [id]: true });

        this.#api
          .request("post", "global/media/delete", { id }, undefined, undefined, "v2")
          .pipe(
            finalize(() => this.loadingStates.set({ [id]: false })),
            takeUntilDestroyed(this.#destroyRef),
          )
          .subscribe(() => {
            const media = this.files()?.filter(file => file.id !== id);
            this.dataSource.update(r => ({ ...r, media }));
            this.onRemoveFile.emit(this.dataSource());
          });
      },
    });
  }
}
