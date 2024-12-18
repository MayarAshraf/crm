import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { EditorModule } from 'primeng/editor';

@Component({
  selector: 'formly-editor-field',
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
      @if (props.description) {<p class="mb-3 text-xs">{{ props.description }}</p>}

      <p-editor [formControl]="formControl"
          [formlyAttributes]="field"
          [placeholder]="props.placeholder ?? ''"
          [style]="{ height: '220px' }"></p-editor>

      @if (showError && formControl.errors) {
        <small class="p-error" role="alert">
          <formly-validation-message [field]="field"></formly-validation-message>
        </small>
      }
    </div>
  `,
  standalone: true,
  imports: [EditorModule, FormlyModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorComponent extends FieldType<FieldTypeConfig> { }
