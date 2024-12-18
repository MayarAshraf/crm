import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  model,
  output,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { InputTextareaModule } from "primeng/inputtextarea";
import { finalize } from "rxjs";
import { ApiService } from "../../services";

@Component({
  selector: "app-simple-bulk-dialog",
  standalone: true,
  template: `
    <p-dialog
      #dialog
      [(visible)]="visible"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      position="top"
      appendTo="body"
      styleClass="max-w-full"
      [style]="{ width: '450px' }"
    >
      <ng-template pTemplate="header">
        <p class="m-0 flex align-items-center gap-2">
          <i [class]="headerIcon()"></i>
          <span class="font-semibold">{{ headerTitle() | translate }}</span>
        </p>
      </ng-template>

      <textarea
        #textarea
        pInputTextarea
        [(ngModel)]="model()[dataKey()]"
        [placeholder]="placeholder() | translate"
        rows="7"
        class="w-full"
      ></textarea>

      <p class="mt-1 mb-0 font-medium text-xs text-primary">
        {{ description() | translate }}
      </p>

      <ng-template pTemplate="footer">
        <button
          pButton
          [label]="submitLabel() | translate"
          [loading]="isLoading()"
          [disabled]="!textarea.value || !textarea.value.trim().length"
          (click)="submit()"
        ></button>
      </ng-template>
    </p-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, InputTextareaModule, DialogModule, FormsModule, TranslateModule],
})
export class SimpleBulkDialogComponent {
  #api = inject(ApiService);
  #destroyRef = inject(DestroyRef);

  visible = model.required<boolean>();

  dataKey = input.required<string>();
  endpoint = input.required<string>();
  headerTitle = input("bulk_creation");
  headerIcon = input("fas fa-plus");
  placeholder = input("");
  description = input("");
  onBulkCreated = output<any[]>();

  model = signal<{ [key: string]: string | null }>({});
  submitLabel = signal("bulk_creation");
  isLoading = signal(false);

  submit() {
    this.isLoading.set(true);
    this.#api
      .request("post", this.endpoint(), this.model())
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(({ data }) => {
        this.visible.set(false);
        this.onBulkCreated.emit(data);
      });
  }
}
