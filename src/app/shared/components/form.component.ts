import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from "@ngx-formly/core";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-form",
  template: `
    @if (fields() && fields().length) {
      <form [formGroup]="form()" (ngSubmit)="onSubmit.emit(model())">
        <formly-form [model]="model()" [fields]="fields()" [form]="form()" [options]="options()" />

        @if (showFormActions()) {
          <div
            [ngClass]="'form-footer flex flex-wrap justify-content-end gap-2 ' + footerFormClass()"
          >
            @if (showResetButton()) {
              <button
                pButton
                type="button"
                class="p-button-secondary p-button-outlined"
                [ngClass]="resetButtonClass()"
                (click)="options().resetModel?.()"
                [label]="'clear_all' | translate"
              ></button>
              <!--In case we rely on "form.reset()" instead of "options.resetModel()", please note that if we call "reset" without an explicit value, its value reverts to its default value instead of "null".-->
            }

            @if (showSubmitButton()) {
              <button
                pButton
                class="submit-button p-button-success"
                type="submit"
                [ngClass]="submitButtonClass()"
                [loading]="submitBtnLoading()"
                [disabled]="isDisabled()"
                [label]="buttonLabel()"
                [icon]="iconLabel()"
              ></button>
            }
          </div>
        }
      </form>
    }
  `,
  styles: `
    .form-footer {
      position: sticky;
      bottom: 0;
      z-index: 5;
      background-color: #fff;
      border-top: 1px solid #ced4da;
      padding-block: 1rem;
    }

    .submit-button {
      background-color: #16a34a;
      padding-inline: 2rem;
      border: 0;

      &:hover {
        background-color: #12873d;
      }
    }
  `,
  standalone: true,
  imports: [NgClass, ButtonModule, FormlyModule, ReactiveFormsModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent<T> {
  fields = input.required<FormlyFieldConfig[]>();
  form = input<FormGroup<any>>({} as FormGroup);
  model = input<T>({} as T);
  options = input<FormlyFormOptions>({});
  buttonLabel = input<string>("");
  iconLabel = input<string>("");
  submitButtonClass = input<string>();
  resetButtonClass = input<string>();
  submitBtnLoading = input(false);
  isDisabled = input(false);
  showFormActions = input(true);
  showSubmitButton = input(true);
  showResetButton = input(false);
  footerFormClass = input("");

  onSubmit = output<T>();
}
