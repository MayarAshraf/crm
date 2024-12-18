import { ComponentType } from "@angular/cdk/portal";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  TemplateRef,
  viewChild,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { ReferralsFiltersService } from "@modules/Referrals/services/referrals-filters.service";
import { Referral } from "@modules/Referrals/services/service-type";
import { TranslateModule } from "@ngx-translate/core";
import {
  BaseIndexComponent,
  CachedLabelsService,
  CachedListsService,
  constants,
  DateFormatterPipe,
  EnabledModuleService,
  FilterConfig,
  FiltersPanelComponent,
  PermissioneVisibilityDirective,
  PermissionsService,
  TableWrapperComponent,
} from "@shared";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { filter, tap } from "rxjs";
import { ReferralCuComponent } from "../referral-cu.component";
import { ReferralsDialogComponent } from "../referrals-dialog/referrals-dialog.component";

@Component({
  selector: "app-referrals",
  standalone: true,
  imports: [
    FiltersPanelComponent,
    TableWrapperComponent,
    PermissioneVisibilityDirective,
    TooltipModule,
    ButtonModule,
    DateFormatterPipe,
    TranslateModule,
  ],
  templateUrl: "./referrals.component.html",
  styleUrl: "./referrals.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ReferralsComponent extends BaseIndexComponent<
  Referral,
  ComponentType<ReferralCuComponent>
> {
  #enabledModule = inject(EnabledModuleService);
  #cachedLists = inject(CachedListsService);
  #userPermission = inject(PermissionsService);
  #referralsFilters = inject(ReferralsFiltersService);
  #cachedLabels = inject(CachedLabelsService);

  creator = viewChild.required<TemplateRef<any>>("creator");
  createdAt = viewChild.required<TemplateRef<any>>("createdAt");

  showBasicFilters = signal(false);
  showAdvancedFilters = signal(true);

  referralsFilters = computed<FilterConfig[]>(() => this.#referralsFilters.getReferralsFilters());

  getLabelById(listKey: string, id: number) {
    return this.#cachedLabels.getLabelById(listKey, id);
  }

  mainLists = ["assignments:all_users_info"];

  basicFiltersLists = ["assignments:users"];

  cachedLists = computed(() => {
    let lists = [...this.mainLists];
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
    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["index-referrals"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-referral"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-referral"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-referral"]),
      view: this.#userPermission.hasPermission(constants.permissions["view-referral"]),
    });

    this.moduleName = this.#enabledModule.hasModule(constants.modulesNames["Referrals Module"]);

    this.dialogComponent = ReferralCuComponent;

    this.indexMeta = {
      ...this.indexMeta,
      indexTitle: this.translate.instant(_("referrals")),
      indexIcon: "fas fa-people-robbery",
      createBtnLabel: this.translate.instant(_("create_referral")),
      endpoints: { index: "referrals/referrals/index", delete: "referrals/referrals/delete" },
      indexApiVersion: "v2",
      deleteApiVersion: "v2",
      indexTableKey: "REFERRALS_KEY",
      columns: [
        {
          title: this.translate.instant(_("id")),
          name: "id",
          searchable: false,
          orderable: false,
        },
        {
          title: this.translate.instant(_("name")),
          name: "referral",
          searchable: true,
          orderable: false,
        },
        {
          title: this.translate.instant(_("created_at")),
          name: "created_at",
          render: this.createdAt(),
          searchable: false,
          orderable: false,
        },
        {
          title: this.translate.instant(_("creators")),
          name: "created_by",
          render: this.creator(),
          searchable: false,
          orderable: false,
        },
      ],
    };
  }

  refreshReferrals(filters: Record<string, any>) {
    this.filtersData.update(oldFilters => ({ ...oldFilters, ...filters }));
  }

  openReferral(referral: Referral) {
    const dialogConfig = {
      ...this.dialogConfig,
      dismissableMask: true,
      data: referral,
    };
    this.dialogService.open(ReferralsDialogComponent, dialogConfig);
  }
}
