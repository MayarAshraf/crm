import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'formly-password-field',
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

      <p-password [formControl]="formControl"
                  [formlyAttributes]="field"
                  [placeholder]="props.placeholder ?? ''"
                  [required]="props.required ?? false"
                  [class.ng-dirty]="showError"
                  [feedback]="props.feedback"
                  [toggleMask]="props.toggleMask"
                  [showClear]="false"
                  styleClass="w-full"></p-password>

      @if (showError && formControl.errors) {
        <small class="p-error" role="alert">
          <formly-validation-message [field]="field"></formly-validation-message>
        </small>
      }
    </div>
  `,
  standalone: true,
  imports: [FormlyModule, PasswordModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordComponent extends FieldType<FieldTypeConfig> { }
