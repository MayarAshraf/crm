import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, input, model, output } from "@angular/core";
import { Lead } from "@modules/Leads/services/service-types";
import { TruncateTextPipe } from "@shared";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-lead-name",
  standalone: true,
  imports: [NgTemplateOutlet, TruncateTextPipe, TooltipModule],
  template: `
    @if (checkPermission()) {
      <button
        (click)="nameClicked.emit(lead())"
        [pTooltip]="lead().full_name || 'Unnamed Lead'"
        [escape]="false"
        tooltipPosition="top"
        class="table-link-title"
      >
        <ng-container *ngTemplateOutlet="leadTemplate; context: { $implicit: lead() }" />
      </button>
    } @else {
      <h2
        [pTooltip]="lead().full_name || 'Unnamed Lead'"
        [escape]="false"
        tooltipPosition="top"
        class="m-0"
        style="line-height: 18px"
      >
        <ng-container *ngTemplateOutlet="leadTemplate; context: { $implicit: lead() }" />
      </h2>
    }

    <ng-template #leadTemplate let-lead>
      <span [innerHTML]="lead.full_name || 'Unnamed Lead' | truncateText: 15">
        @if (isOpenInNewTab()) {
          <i class="pi pi-external-link text-xs"></i>
        }
      </span>
      <span class="block text-sm">
        @if (isTitleDisplayed() && lead.title) {
          <span [innerHTML]="lead.title"></span>
        }
        @if (isTitleDisplayed() && lead.title && isCompanyDisplayed() && lead.company) {
          <strong>At</strong>
        }
        @if (isCompanyDisplayed() && lead.company) {
          <span [innerHTML]="lead.company"></span>
        }
      </span>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadNameComponent {
  lead = model.required<Lead>();
  checkPermission = input<boolean | undefined>(true);
  isCompanyDisplayed = input(true);
  isTitleDisplayed = input(true);
  isOpenInNewTab = input(false);
  nameClicked = output<Lead>();
}
