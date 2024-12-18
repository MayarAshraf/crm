import { ChangeDetectionStrategy, Component, LOCALE_ID, inject } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FieldType, FieldTypeConfig, FormlyModule } from "@ngx-formly/core";
import { AutoFocusModule } from "primeng/autofocus";
import { InputNumberModule } from "primeng/inputnumber";

@Component({
  selector: "formly-input-number-field",
  template: `
    <div class="p-field">
      @if (props.label) {
        <label>
          {{ props.label }}
          @if (props.required && props.hideRequiredMarker !== true) {
            <span class="text-red-500">*</span>
          }
        </label>
      }
      @if (props.description) {
        <p class="mb-3 text-xs">{{ props.description }}</p>
      }

      <p-inputNumber
        pAutoFocus
        [autofocus]="props.focused"
        [formlyAttributes]="field"
        [formControl]="formControl"
        [class.ng-dirty]="showError"
        [placeholder]="props.placeholder"
        [required]="props.required ?? false"
        [mode]="props.mode ?? 'decimal'"
        [format]="props.format ?? true"
        [useGrouping]="props.useGrouping ?? true"
        [prefix]="props.prefix"
        [suffix]="props.suffix"
        [locale]="locale"
        [min]="props.min"
        [max]="props.max"
        [step]="props.step ?? 1"
        [allowEmpty]="props.allowEmpty ?? true"
        [showButtons]="props.showButtons"
        [buttonLayout]="props.buttonLayout"
        [autocomplete]="props.autocomplete"
        [inputId]="props.inputId"
        [inputStyleClass]="props.inputStyleClass"
        [styleClass]="props.styleClass"
        [showClear]="props.showClear"
        (onInput)="props.onInput && props.onInput(field, $event)"
        (onKeyDown)="props.onKeyDown && props.onKeyDown(field, $event)"
        (onBlur)="props.onBlur && props.onBlur(field, $event)"
      ></p-inputNumber>

      @if (showError && formControl.errors) {
        <small class="p-error" role="alert">
          <formly-validation-message [field]="field"></formly-validation-message>
        </small>
      }
    </div>
  `,
  standalone: true,
  imports: [FormlyModule, InputNumberModule, AutoFocusModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberComponent extends FieldType<FieldTypeConfig> {
  public locale = inject(LOCALE_ID);
}
