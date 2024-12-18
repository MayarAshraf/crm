import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FieldType, FieldTypeConfig, FormlyModule } from "@ngx-formly/core";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputTextModule } from "primeng/inputtext";

@Component({
  selector: "formly-input-field",
  standalone: true,
  template: `
    <div class="p-field">
      <p-floatLabel>
        <input
          pInputText
          [type]="props.type || 'text'"
          [formControl]="formControl"
          [min]="props.min"
          [max]="props.max"
          [formlyAttributes]="field"
        />

        @if (props.label) {
          <label [ngClass]="props.labelClass + ' capitalize'">
            {{ props.label }}
            @if (props.required && props.hideRequiredMarker !== true) {
              <span class="text-red-500">*</span>
            }
          </label>
        }
      </p-floatLabel>

      @if (props.description) {
        <p class="mt-1 font-medium text-xs text-primary capitalize">
          {{ props.description }} <i class="fas fa-circle-info text-sm"></i>
        </p>
      }

      @if (showError && formControl.errors) {
        <small class="p-error" role="alert">
          <formly-validation-message [field]="field"></formly-validation-message>
        </small>
      }
    </div>
  `,
  imports: [NgClass, FloatLabelModule, InputTextModule, FormlyModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent extends FieldType<FieldTypeConfig> {}
