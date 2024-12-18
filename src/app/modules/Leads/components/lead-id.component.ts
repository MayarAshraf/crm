import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { TooltipModule } from "primeng/tooltip";
import { CopyButtonComponent } from "../../../shared/components/copy-button/copy-button.component";

@Component({
  selector: "app-lead-id",
  standalone: true,
  imports: [CopyButtonComponent, TooltipModule, TranslateModule],
  template: `
    <span class="flex align-items-center gap-1">
      <span
        class="flex align-items-center gap-1 text-xs"
        [pTooltip]="'lead_id' | translate"
        tooltipPosition="top"
      >
        <i class="fas fa-hashtag text-gray-400 mr-1"></i>
        <span class="font-medium">{{ leadId() }}</span>
      </span>
      <app-copy-button [text]="leadId() + ''" />
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadIdComponent {
  leadId = input.required<number>();
}
