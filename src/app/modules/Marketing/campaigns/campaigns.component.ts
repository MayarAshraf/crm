import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FilterCampaignService } from "@modules/Marketing/services/filter-campaign.service";
import { TranslateModule } from "@ngx-translate/core";
import {
  BaseIndexComponent,
  CachedLabelsService,
  CachedListsService,
  ConfirmService,
  constants,
  EnabledModuleService,
  FilterConfig,
  FiltersPanelComponent,
  PermissioneVisibilityDirective,
  PermissionsService,
  TableWrapperComponent,
} from "@shared";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { filter, tap } from "rxjs";
import { CampaignCuComponent } from "../screens/campaign-cu.component";
import { CampaignProfileDialogComponent } from "../screens/campaign-profile-dialog/campaign-profile-dialog.component";
import { Campaign } from "../services/service-types";
@Component({
  selector: "app-campaign",
  standalone: true,
  imports: [
    TableWrapperComponent,
    PermissioneVisibilityDirective,
    FiltersPanelComponent,
    ButtonModule,
    TooltipModule,
    TagModule,
    TranslateModule,
  ],
  templateUrl: "./campaigns.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CampaignComponent extends BaseIndexComponent<any> {
  #enabledModule = inject(EnabledModuleService);
  #cachedLists = inject(CachedListsService);
  #userPermission = inject(PermissionsService);
  #campaignFilter = inject(FilterCampaignService);
  campaignFilters = computed<FilterConfig[]>(() => this.#campaignFilter.getCampaignFilters());
  #confirmService = inject(ConfirmService);
  #cachedLabels = inject(CachedLabelsService);

  showBasicFilters = signal(false);
  showAdvancedFilters = signal(false);

  constants = constants;

  basicFiltersLists = [
    "marketing:campaigns_types",
    "marketing:campaigns_statuses",
    "assignments:users",
  ];

  cachedLists = computed(() => {
    let lists: string[] = [];
    if (this.showBasicFilters()) {
      lists = [...lists, ...this.basicFiltersLists];
    }
    return lists;
  });

  cachedLists$ = toObservable(this.cachedLists).pipe(
    filter(e => e.length > 0),
    tap(list => this.#cachedLists.updateLists(list)),
  );

  loadCashedLists = toSignal(this.cachedLists$, { initialValue: [] });

  ngOnInit() {
    this.#cachedLists.updateLists(["marketing:campaign_statuses", "marketing:campaigns_types"]);

    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["index-campaigns"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-campaign"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-campaign"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-campaign"]),
      view: this.#userPermission.hasPermission(constants.permissions["view-campaign-details"]),
    });

    this.moduleName = this.#enabledModule.hasModule(constants.modulesNames["Marketing Module"]);

    this.indexMeta = {
      ...this.indexMeta,
      indexTitle: this.translate.instant(_("marketing")),
      createBtnLabel: this.translate.instant(_("new_campaign")),
      indexIcon: "fas fa-bullhorn",
      indexApiVersion: "v2",
      deleteApiVersion: "v2",
      endpoints: { index: "marketing/campaigns", delete: "marketing/campaigns/delete" },
      indexTableKey: "CAMPAIGNS_KEY",
      columns: [
        {
          title: "",
          name: "id",
          searchable: false,
          orderable: false,
        },
        {
          title: "",
          name: "campaign_name",
          searchable: true,
          orderable: false,
        },
        {
          title: "",
          name: "campaign_type_id",
          searchable: false,
          orderable: false,
        },
        {
          title: "",
          name: "campaign_status_id",
          searchable: false,
          orderable: false,
        },
      ],
    };

    this.dialogConfig = {
      ...this.dialogConfig,
      width: "650px",
    };

    this.dialogComponent = CampaignCuComponent;
  }

  getCampaignStatus(id: number) {
    return this.#cachedLabels.getLabelById("marketing:campaign_statuses", id);
  }

  getCampaignsTypes(id: number) {
    return this.#cachedLabels.getLabelById("marketing:campaigns_types", id);
  }

  refreshCampaign(filters: Record<string, any>) {
    this.filtersData.update(oldFilters => ({ ...oldFilters, ...filters }));
  }

  confirmDelete(rowData: any) {
    this.#confirmService.confirmDelete({
      acceptCallback: () => this.deleteRecord(rowData),
    });
  }

  openProfileCampaign(campaign: Campaign) {
    const dialogConfig = {
      ...this.dialogConfig,
      dismissableMask: true,
      width: "1200px",
      data: campaign,
    };
    this.dialogRef = this.dialogService.open(CampaignProfileDialogComponent, dialogConfig);
    this.dialogRef?.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
