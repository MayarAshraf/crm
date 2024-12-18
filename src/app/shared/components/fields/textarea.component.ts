import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FieldType, FieldTypeConfig, FormlyModule } from "@ngx-formly/core";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputTextareaModule } from "primeng/inputtextarea";

@Component({
  selector: "formly-textarea-input",
  standalone: true,
  template: `
    <div class="p-field">
      <p-floatLabel>
        <textarea
          pInputTextarea
          [formControl]="formControl"
          [formlyAttributes]="field"
          [rows]="props.rows"
        ></textarea>

        @if (props.label) {
          <label [ngClass]="props.labelClass">
            {{ props.label }}
            @if (props.required && props.hideRequiredMarker !== true) {
              <span class="text-red-500">*</span>
            }
          </label>
        }
      </p-floatLabel>

      @if (props.description) {
        <p class="mt-1 font-medium text-xs text-primary">
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
  imports: [NgClass, FloatLabelModule, InputTextareaModule, FormlyModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent extends FieldType<FieldTypeConfig> {}
