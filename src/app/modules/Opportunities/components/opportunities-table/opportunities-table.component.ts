import { CurrencyPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, input, model } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { LeadIdComponent } from "@modules/Leads/components/lead-id.component";
import { LeadNameComponent } from "@modules/Leads/components/lead-name/lead-name.component";
import LeadProfileComponent from "@modules/Leads/screens/lead-profile/lead-profile.component";
import { LccaPermissionsService } from "@modules/Leads/services/lcca-permissions.service";
import { LeadsService } from "@modules/Leads/services/leads.service";
import { Lead } from "@modules/Leads/services/service-types";
import { OpportunityCuComponent } from "@modules/Opportunities/screens/opportunity-cu.component";
import { IOpportunity } from "@modules/Opportunities/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import {
  BaseIndexComponent,
  CachedLabelsService,
  CommaSeparatedLabelsComponent,
  ConfirmService,
  constants,
  CustomLayoutSkeletonComponent,
  DateFormatterPipe,
  EnabledModuleService,
  EntitySelectComponent,
  PermissioneVisibilityDirective,
  PermissionsService,
  RangePipe,
  Setting,
  TableWrapperComponent,
  TruncateTextPipe,
} from "@shared";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-opportunities-table",
  standalone: true,
  imports: [
    TooltipModule,
    TruncateTextPipe,
    TableWrapperComponent,
    LeadNameComponent,
    PermissioneVisibilityDirective,
    CurrencyPipe,
    ButtonModule,
    EntitySelectComponent,
    CommaSeparatedLabelsComponent,
    DateFormatterPipe,
    LeadIdComponent,
    TranslateModule,
    CustomLayoutSkeletonComponent,
    RangePipe,
  ],
  templateUrl: "./opportunities-table.component.html",
  styleUrl: "./opportunities-table.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunitiesTableComponent extends BaseIndexComponent<IOpportunity> {
  #enabledModule = inject(EnabledModuleService);
  #lccaPermissions = inject(LccaPermissionsService);
  #cachedLabels = inject(CachedLabelsService);
  leadsService = inject(LeadsService);
  #userPermission = inject(PermissionsService);
  #confirmService = inject(ConfirmService);

  settings = model<Setting[]>([]);

  indexTableKey = input.required<string>();
  withScreenHeader = input(true);
  showActions = input(true);

  constants = constants;

  isVisible(name: string) {
    return this.settings()?.find((i: { name: string }) => i.name === name)?.value;
  }

  getLabelsByIds(listKey: string, ids: number[]) {
    return this.#cachedLabels.getLabelsByIds(listKey, ids);
  }

  getLabelById(listKey: string, id: number) {
    return this.#cachedLabels.getLabelById(listKey, id);
  }

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["index-opportunities"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-opportunity"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-opportunity"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-opportunity"]),
    });

    this.dialogConfig = { ...this.dialogConfig, dismissableMask: true, width: "700px" };

    this.dialogComponent = OpportunityCuComponent;

    this.moduleName = this.#enabledModule.hasModule(constants.modulesNames["Opportunities Module"]);

    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "opportunities/opportunities",
        delete: "opportunities/opportunities/delete",
      },
      indexApiVersion: "v2",
      deleteApiVersion: "v2",
      createBtnLabel: this.translate.instant(_("create_deal")),
      indexTableKey: this.indexTableKey(),
      columns: [
        {
          title: "",
          name: "id",
          searchable: false,
        },
        {
          title: "",
          name: "name",
          searchable: true,
        },
        {
          title: "",
          name: "opportunitable.full_name",
          searchable: true,
        },
        {
          title: "",
          name: "opportunitable.title",
          searchable: true,
        },
        {
          title: "",
          name: "opportunitable.company",
          searchable: true,
        },
        {
          title: "",
          name: "opportunitable.last_activity.notes",
          searchable: false,
        },
        {
          title: "",
          name: "interests",
          searchable: false,
        },
        {
          title: "",
          name: "tags",
          searchable: false,
        },
        {
          title: "",
          name: "amount",
          searchable: false,
        },
        {
          title: "",
          name: "assignees",
          searchable: false,
        },
        {
          title: "",
          name: "pipeline_stage_id",
          searchable: false,
        },
        {
          title: "",
          name: "opportunitable.created_at",
          searchable: false,
        },
      ],
    };
  }

  confirmDelete(rowData: IOpportunity) {
    this.#confirmService.confirmDelete({
      acceptCallback: () => this.deleteRecord(rowData),
    });
  }

  openLeadDialog(lead: Lead) {
    const lead$ = this.leadsService.getLeadDetails(lead.id);

    const dialogConfig = {
      ...this.dialogConfig,
      width: "980px",
      data: lead$,
    };

    this.dialogService.open(LeadProfileComponent, dialogConfig);
  }

  onPipelineStageChange(event: any, rowData: IOpportunity) {
    rowData.pipeline_stage_id = event.pipeline_stage_id;
  }

  checkPermission(lead: Lead, name: string) {
    return this.#lccaPermissions.checkPermission(lead.lead_type_id, name);
  }
}
