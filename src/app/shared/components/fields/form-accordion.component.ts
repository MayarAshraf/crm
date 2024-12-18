import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FieldType, FormlyModule } from "@ngx-formly/core";
import { AccordionModule } from "primeng/accordion";

@Component({
  selector: "formly-form-accordion",
  template: `
    <p-accordion
      [multiple]="props.multiple"
      [style]="props.style"
      [styleClass]="props.styleClass"
      (onClose)="props.onClose && props.onClose($event)"
      (onOpen)="props.onOpen && props.onOpen($event)"
    >
      @for (tab of field.fieldGroup; track $index) {
        <p-accordionTab
          iconPos="start"
          [selected]="tab.props?.selected"
          [disabled]="tab.props?.accordionDisabled"
        >
          <ng-template pTemplate="header">
            <div class="flex gap-2 align-items-center">
              <i [class]="tab.props?.icon"></i>
              <span>{{ tab.props?.header }}</span>
            </div>
          </ng-template>
          <formly-field [field]="tab"></formly-field>
        </p-accordionTab>
      }
    </p-accordion>
  `,
  styles: `
    :host ::ng-deep {
      .p-accordion-header-link {
        display: inline-flex;
        color: var(--primary-color) !important;
        font-weight: 500 !important;
        padding: 0.5rem 0 !important;
        border: 0 !important;
        border-radius: 0 !important;
        background-color: transparent !important;
        box-shadow: none !important;

        &:hover {
          color: var(--highlight-text-color) !important;
        }
      }

      .p-accordion-content {
        padding: 1rem 1rem 0 1rem;
        border: 0;
        border-radius: 0;
        background-color: transparent;
        color: inherit;
      }
    }
  `,
  standalone: true,
  imports: [FormlyModule, AccordionModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormAccordionComponent extends FieldType {}
