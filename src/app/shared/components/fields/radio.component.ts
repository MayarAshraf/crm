import { AsyncPipe, NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { FieldType, FieldTypeConfig, FormlyModule } from "@ngx-formly/core";
import { RadioButtonModule } from "primeng/radiobutton";
import { Observable, of } from "rxjs";

@Component({
  selector: "formly-radio-field",
  template: `
    <div class="p-field">
      @if (props.label) {
        <label class="mb-3">
          {{ props.label }}
          @if (props.required && props.hideRequiredMarker !== true) {
            <span class="text-red-500">*</span>
          }
        </label>
      }

      @if (props.description) {
        <p class="mb-3 text-xs">{{ props.description }}</p>
      }

      <div
        [ngClass]="{ 'flex-column': props.direction === 'column' }"
        class="flex column-gap-3 row-gap-2"
      >
        @for (option of options$ | async; track option.value) {
          <p-radioButton
            [formControl]="option.disabled ? disabledControl : formControl"
            [formlyAttributes]="field"
            [name]="field.name || id"
            [label]="option.label"
            [value]="option.value"
            (onClick)="props.change && props.change(field, $event)"
          />
        }
      </div>

      @if (showError && formControl.errors) {
        <small class="p-error" role="alert">
          <formly-validation-message [field]="field"></formly-validation-message>
        </small>
      }
    </div>
  `,
  standalone: true,
  imports: [NgClass, AsyncPipe, FormlyModule, RadioButtonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioComponent extends FieldType<FieldTypeConfig> {
  get options$(): Observable<any[]> {
    return Array.isArray(this.props.options)
      ? of(this.props.options)
      : this.props.options ?? of([]);
  }

  get disabledControl() {
    return new FormControl({ value: this.formControl.value, disabled: true });
  }
}
