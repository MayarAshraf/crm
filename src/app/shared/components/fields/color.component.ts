import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { ColorPickerModule } from 'primeng/colorpicker';

@Component({
  selector: 'formly-color-field',
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
      @if (props.description) {<p class="mb-3 text-xs">{{ props.description }}</p>}

      <p-colorPicker styleClass="block"
        [formControl]="formControl"
        [formlyAttributes]="field"
        [inline]="props.inline"
        [format]="props.format ?? 'hex'"
        (onChange)="props.change && props.change(field, $event)"></p-colorPicker>

      @if (showError && formControl.errors) {
        <small class="p-error" role="alert">
          <formly-validation-message [field]="field"></formly-validation-message>
        </small>
      }
    </div>
  `,
  standalone: true,
  imports: [FormlyModule, ColorPickerModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorComponent extends FieldType<FieldTypeConfig> { }
