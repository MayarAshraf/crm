import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateModule } from "@ngx-translate/core";
import { MenuItem } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { Dialog, DialogModule } from "primeng/dialog";
import { finalize } from "rxjs";
import { ApiService } from "../../services";
import { FormComponent } from "../form.component";

@Component({
  selector: "app-bulk-dialog",
  standalone: true,
  templateUrl: "./bulk-dialog.component.html",
  styleUrl: "./bulk-dialog.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, DialogModule, FormComponent, TranslateModule],
})
export class BulkDialogComponent {
  #api = inject(ApiService);
  #destroyRef = inject(DestroyRef); // Current "context" (this component)

  dialog = viewChild.required<Dialog>("dialog");

  coordinates = input({ left: "0", right: "0" });
  selectedAction = model.required<MenuItem | null>();
  selection = model.required<any[]>();
  headerTitle = computed(() => this.selectedAction()?.label);
  headerIcon = computed(() => this.selectedAction()?.icon);

  form = new FormGroup({});
  model = input.required<any>();
  fields = input.required<FormlyFieldConfig[]>();
  endpoint = input.required<string>();
  isLoading = signal(false);

  onAddBulkAction = output();

  submit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
      return;
    }
    this.isLoading.set(true);
    this.#api
      .request("post", this.endpoint(), this.model())
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(() => {
        this.dialog().visibleChange.emit(false);
        this.onAddBulkAction.emit();
      });
  }
}
