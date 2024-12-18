import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, input, model, signal } from "@angular/core";
import { LeadActionsComponent } from "@modules/Leads/screens/lead-profile-header/lead-actions/lead-actions.component";
import { LeadsService } from "@modules/Leads/services/leads.service";
import { Lead } from "@modules/Leads/services/service-types";
import { EntitySelectComponent, constants } from "@shared";
import { TableModule } from "primeng/table";
import { LeadTableInfoComponent } from "../lead-table-info/lead-table-info.component";

@Component({
  selector: "app-lead-table-row",
  standalone: true,
  templateUrl: "./lead-table-row.component.html",
  styleUrl: "./lead-table-row.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    TableModule,
    LeadActionsComponent,
    EntitySelectComponent,
    LeadTableInfoComponent,
  ],
})
export class LeadTableRowComponent {
  leadsService = inject(LeadsService);

  constants = constants;
  isExpanded = signal(false);
  isListLayout = model(true);
  displayStatusSelect = input(true);
  rowData = model.required<Lead>();
  displayActions = input<boolean>(true);
  settings = input<any>([]);

  withSelection = input(true);
}
