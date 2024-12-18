import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { FieldType, FormlyModule } from "@ngx-formly/core";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { StepsModule } from "primeng/steps";

@Component({
  selector: "formly-form-steps",
  standalone: true,
  imports: [StepsModule, FormlyModule, ButtonModule, TranslateModule],
  template: `
    <div class="p-field">
      <p-steps
        [model]="steps"
        [readonly]="true"
        [activeIndex]="activeIndex()"
        styleClass="overflow-x-auto mb-2 pb-2"
      />

      @for (field of field.fieldGroup; track $index) {
        <div [hidden]="activeIndex() !== $index" class="pt-4 px-3 border-1 border-300 border-round">
          <formly-field [field]="field"></formly-field>
        </div>
      }

      <div class="flex align-items-center justify-content-end gap-2 mt-3">
        @if (activeIndex() > 0) {
          <button
            type="button"
            pButton
            [label]="'previous' | translate"
            (click)="activeIndex.set(activeIndex() - 1)"
            class="text-sm py-2 p-button-outlined"
          ></button>
        }
        @if (activeIndex() !== (field.fieldGroup || []).length - 1) {
          <button
            type="button"
            pButton
            [label]="'next' | translate"
            [disabled]="!isCurrentStepValid()"
            (click)="isCurrentStepValid() && activeIndex.set(activeIndex() + 1)"
            class="text-sm py-2"
          ></button>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormStepsComponent extends FieldType {
  activeIndex = signal(0);

  get steps() {
    return this.field.fieldGroup?.map((field, index) => ({
      label: field.props?.label || `Step ${index + 1}`,
    }));
  }

  isCurrentStepValid() {
    const currentStepField = this.field.fieldGroup?.[this.activeIndex()];
    return currentStepField?.props?.isValid ? currentStepField.props.isValid() : true;
  }
}
