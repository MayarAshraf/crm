import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";
import { Lead } from "@modules/Leads/services/service-types";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { TooltipModule } from "primeng/tooltip";
import { LeadTableInfoComponent } from "./lead-table-info/lead-table-info.component";

@Component({
  selector: "app-lead-more-toggler",
  standalone: true,
  imports: [OverlayPanelModule, LeadTableInfoComponent, ButtonModule, TooltipModule, DividerModule],
  template: `
    @if (!isListLayout()) {
      <button
        pButton
        (click)="op.toggle($event)"
        icon="fas fa-arrow-right"
        class="ml-auto p-button-rounded bg-gray-400 hover:bg-gray-800 focus:bg-gray-800 shadow-none border-none w-1.5rem h-1.5rem p-0 text-sm"
      ></button>
    }
    <p-overlayPanel #op>
      <h4 class="m-0 text-primary text-sm">{{ lead().full_name || "Unnamed Lead" }}</h4>
      <p-divider styleClass="my-2"></p-divider>
      <app-lead-table-info
        [(lead)]="lead"
        [(isListLayout)]="isListLayout"
        [settings]="settings()"
      />
      <ng-content select="[additional-info]" />
    </p-overlayPanel>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadMoreTogglerComponent {
  lead = model.required<Lead>();
  isListLayout = model<boolean>(true);
  settings = input<{ label: string; name: string; value: boolean }[]>([]);
}
