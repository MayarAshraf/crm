import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { environment } from "@env";
import { FieldType, FieldTypeConfig, FormlyModule } from "@ngx-formly/core";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputTextModule } from "primeng/inputtext";
import { SelectComponent } from "./select/select.component";

@Component({
  selector: "app-input-group",
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

      <p-inputGroup>
        <p-inputGroupAddon>
          @if (props.icon) {
            <i [class]="props.icon"></i>
          } @else {
            <span> {{ props.flagGroup }}</span>
          }
        </p-inputGroupAddon>
        <input
          [type]="props.type || 'text'"
          pInputText
          [placeholder]="props.placeholder"
          class="shadow-none border-300 capitalize"
          [formControl]="formControl"
          [formlyAttributes]="field"
        />
      </p-inputGroup>

      @if (showError && formControl.errors) {
        <small class="p-error" role="alert">
          <formly-validation-message [field]="field"></formly-validation-message>
        </small>
      }
    </div>
  `,
  standalone: true,
  imports: [
    FormlyModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputTextModule,
    SelectComponent,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputGroupComponent extends FieldType<FieldTypeConfig> {
  url = environment.API_URL;
}
