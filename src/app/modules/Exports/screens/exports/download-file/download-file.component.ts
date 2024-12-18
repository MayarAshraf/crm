import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ApiService } from "@shared";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";

@Component({
  selector: "app-download-file",
  standalone: true,
  imports: [DialogModule, ButtonModule],
  template: `
    <button
      pButton
      (click)="getDownloadUrl(rowData().id)"
      label="{{ rowData().file }}"
      icon="fas fa-cloud-arrow-down"
      iconPos="right"
      class="table-link-title"
    ></button>

    <p-dialog
      appendTo="body"
      header="Download"
      [(visible)]="visible"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [closeOnEscape]="false"
      styleClass="w-25rem"
    >
      @if (isLoading()) {
        <p class="progress-text m-0">Getting your Download Link</p>
      } @else {
        <p class="m-0">
          Your Download link is ready valid for
          @if (validMinutes()) {
            <b>{{ validMinutes() }}</b>
          }
          minutes, click Download to get your file.
        </p>
      }
      <ng-template pTemplate="footer">
        <button
          pButton
          class="p-button-sm w-full p-button-success"
          label="Download"
          [loading]="isLoading()"
          (click)="downloadFile()"
        ></button>
      </ng-template>
    </p-dialog>
  `,
  styles: `
    .progress-text::after {
      content: "";
      display: inline-block;
      animation: dotty steps(1) 1.5s infinite;
    }

     @keyframes dotty {
      0%   { content: "" }
      20%  { content: "." }
      40%  { content: ".." }
      60%  { content: "..." }
      80%  { content: "...." }
      100% { content: "" }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadFileComponent {
  #api = inject(ApiService);
  #destroyRef = inject(DestroyRef);

  rowData = input.required<any>();

  visible = signal(false);
  isLoading = signal(true);
  validMinutes = signal<number | null>(null);
  downloadUrl = signal("");

  getDownloadUrl(id: number) {
    this.visible.set(true);
    this.#api
      .request("post", "exports/exports/generate-download-link", { id }, undefined, undefined, "v2")
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(({ data }) => {
        this.isLoading.set(false);
        this.validMinutes.set(data.valid_for_minutes);
        this.downloadUrl.set(data.download_url);
      });
  }

  downloadFile() {
    window.open(this.downloadUrl());
  }
}
