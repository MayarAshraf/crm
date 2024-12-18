import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, input, model } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import LeadProfileComponent from "@modules/Leads/screens/lead-profile/lead-profile.component";
import { LccaPermissionsService } from "@modules/Leads/services/lcca-permissions.service";
import { LeadsService } from "@modules/Leads/services/leads.service";
import { Lead } from "@modules/Leads/services/service-types";
import { PhonesComponent } from "@modules/Phones/components/phones/phones/phones.component";
import { TranslateModule } from "@ngx-translate/core";
import {
  BaseIndexComponent,
  CustomLayoutSkeletonComponent,
  EnabledModuleService,
  FiltersData,
  RangePipe,
  TableWrapperComponent,
  TruncateTextPipe,
  constants,
} from "@shared";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { filter, of, tap } from "rxjs";
import { LeadIdComponent } from "../lead-id.component";
import { LeadMoreTogglerComponent } from "../lead-more-toggler.component";
import { LeadNameComponent } from "../lead-name/lead-name.component";
import { LeadTableRowComponent } from "../lead-table-row/lead-table-row.component";

@Component({
  selector: "app-leads-table",
  standalone: true,
  templateUrl: "./leads-table.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    TooltipModule,
    TruncateTextPipe,
    LeadTableRowComponent,
    TableModule,
    TableWrapperComponent,
    PhonesComponent,
    LeadNameComponent,
    TranslateModule,
    LeadMoreTogglerComponent,
    RangePipe,
    LeadIdComponent,
    CustomLayoutSkeletonComponent,
  ],
})
export default class LeadsTableComponent extends BaseIndexComponent<any> {
  leadsService = inject(LeadsService);
  #lccaPermissions = inject(LccaPermissionsService);
  #enabledModule = inject(EnabledModuleService);

  constants = constants;

  leadList = this.leadsService.leadList;
  totalLeads = this.leadsService.totalLeads;
  leadsFiltered = this.leadsService.leadsFiltered;

  leadList$ = toObservable(this.records).pipe(
    filter(e => e.length > 0),
    tap(records => {
      const leads = records.map(({ record }) => record);
      this.leadsService.leadList.set(leads);
      this.leadsService.totalLeads.set(this.totalRecords());
      this.leadsService.leadsFiltered.set(this.recordsFiltered());
    }),
  );

  leadListReadonly = toSignal(this.leadList$, { initialValue: [] });

  withSelection = input(false);
  indexTableKey = input.required<string>();
  selection = model<Lead[]>();
  settings = model<{ label: string; name: string; value: boolean }[]>([]);

  ngOnInit() {
    this.withMultiLayout.set(true);
    this.dialogComponent = LeadProfileComponent;
    this.dialogConfig = { ...this.dialogConfig, dismissableMask: true, width: "980px" };

    this.filtersData.update(
      oldFilters =>
        ({
          ...oldFilters,
          load: ["last_activity", "phones"],
        }) as FiltersData,
    );

    this.moduleName = this.#enabledModule.hasModule(constants.modulesNames["Leads Module"]);
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: { index: "leads/leads" },
      indexApiVersion: "v3",
      indexTableKey: this.indexTableKey(),
      columns: [
        {
          name: "id",
          searchable: true,
        },
        {
          name: "full_name",
          searchable: true,
        },
        {
          name: "company",
          searchable: true,
        },
        {
          name: "title",
          searchable: true,
        },
      ],
    };
  }

  openLeadDialog(lead: Lead) {
    const lead$ = of(lead);
    this.openUpdateRecordDialog(lead$);
  }

  onSelectionChange(value: Lead[] = []) {
    this.selection.set(value);
  }

  checkPermission(lead: Lead, name: string) {
    return this.#lccaPermissions.checkPermission(lead?.lead_type_id, name);
  }
}
