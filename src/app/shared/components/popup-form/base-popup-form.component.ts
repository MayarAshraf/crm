import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateModule } from "@ngx-translate/core";
import { finalize } from "rxjs";
import { ApiService, GlobalApiResponse, RequestHeaders, RequestParams } from "../../services";
import { FormComponent } from "../form.component";

@Component({
  selector: "app-base-popup-form",
  standalone: true,
  template: `
    <ng-content></ng-content>
    <app-form
      [form]="form"
      [model]="model()"
      [fields]="fields()"
      submitButtonClass="py-1 transition-none"
      [buttonLabel]="'save' | translate"
      [submitBtnLoading]="isLoading()"
      (onSubmit)="submitForm()"
    />
  `,
  imports: [FormComponent, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasePopupFormComponent {
  public api = inject(ApiService);
  #destroyRef = inject(DestroyRef); // Current "context" (this class)

  form = new FormGroup({});
  model = input.required();
  fields = input.required<FormlyFieldConfig[]>();
  endpoint = input.required<string>();
  isLoading = signal<boolean>(false);
  headers = input<RequestHeaders>();
  params = input<RequestParams>();
  apiVersion = input<string>();

  updateUi = output<any>();

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
      return;
    }
    this.isLoading.set(true);

    this.api
      .request(
        "post",
        this.endpoint(),
        this.model(),
        this.headers(),
        this.params(),
        this.apiVersion(),
      )
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe((res: GlobalApiResponse) => {
        this.updateUi.emit(res.data);
      });
  }
}
