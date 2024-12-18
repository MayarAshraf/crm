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
import { RouterLink } from "@angular/router";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { ProjectsFiltersService } from "@modules/BrokerInventory/services/projects-filters.service";
import { Project } from "@modules/BrokerInventory/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import {
  BaseIndexComponent,
  CachedLabelsService,
  CachedListsService,
  constants,
  EnabledModuleService,
  FilterConfig,
  FiltersPanelComponent,
  PermissionsService,
  TableWrapperComponent,
} from "@shared";
import { ButtonModule } from "primeng/button";
import { filter, tap } from "rxjs";
import { ProjectCuComponent } from "../project-cu/project-cu.component";

@Component({
  selector: "app-projects",
  standalone: true,
  imports: [
    FiltersPanelComponent,
    TableWrapperComponent,
    RouterLink,
    ButtonModule,
    TranslateModule,
  ],
  templateUrl: "./projects.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProjectsComponent extends BaseIndexComponent<
  Project,
  ComponentType<ProjectCuComponent>
> {
  #enabledModule = inject(EnabledModuleService);
  #cachedLists = inject(CachedListsService);
  #userPermission = inject(PermissionsService);
  #cachedLabels = inject(CachedLabelsService);
  #projectsFilters = inject(ProjectsFiltersService);

  developer = viewChild.required<TemplateRef<any>>("developer");
  filtersPanel = viewChild<FiltersPanelComponent>("filtersPanel");

  countryId = this.#projectsFilters.countryId;
  regionId = this.#projectsFilters.regionId;
  cityId = this.#projectsFilters.cityId;

  showBasicFilters = signal(false);
  showAdvancedFilters = signal(false);

  projectsFilters = computed<FilterConfig[]>(() => this.#projectsFilters.getProjectsFilters());

  getLabelById(listKey: string, id: number) {
    return this.#cachedLabels.getLabelById(listKey, id);
  }

  mainLists = ["assignments:all_users_info", "broker_inventory:developers"];

  basicFiltersLists = ["broker_inventory:area_units", "locations:countries:ids:null"];

  advancedFiltersLists = ["marketing:currencies", "assignments:users"];

  cachedLists = computed(() => {
    let lists = [...this.mainLists];
    if (this.showBasicFilters()) {
      lists = [...lists, ...this.basicFiltersLists];
      this.countryId() && (lists = [...lists, `locations:regions:ids:${this.countryId()}`]);
      this.regionId() && (lists = [...lists, `locations:cities:ids:${this.regionId()}`]);
      this.cityId() && (lists = [...lists, `locations:areas:ids:${this.cityId()}`]);
      if (this.showAdvancedFilters()) {
        lists = [...lists, ...this.advancedFiltersLists];
      }
    }
    return lists;
  });

  cachedLists$ = toObservable(this.cachedLists).pipe(
    filter(e => e.length > 0),
    tap(list => this.#cachedLists.updateLists(list)),
  );

  loadCashedLists = toSignal(this.cachedLists$, { initialValue: [] });

  getLocation(location: string) {
    return this.filtersPanel()
      ?.chips()
      ?.find(c => c.name === location)?.value;
  }

  ngOnInit() {
    const countryId = this.getLocation("country_ids");
    const regionId = this.getLocation("region_ids");
    const cityId = this.getLocation("city_ids");
    countryId && this.countryId.set(countryId);
    regionId && this.regionId.set(regionId);
    cityId && this.cityId.set(cityId);

    this.dialogConfig = { ...this.dialogConfig, width: "900px" };

    this.permissions.set({
      index: this.#userPermission.hasPermission(
        constants.permissions["index-broker-inventory-projects"],
      ),
      create: this.#userPermission.hasPermission(
        constants.permissions["create-broker-inventory-project"],
      ),
      update: this.#userPermission.hasPermission(
        constants.permissions["update-broker-inventory-project"],
      ),
      delete: this.#userPermission.hasPermission(
        constants.permissions["delete-broker-inventory-project"],
      ),
    });

    this.moduleName = this.#enabledModule.hasModule(
      constants.modulesNames["Broker Inventory Module"],
    );

    this.dialogComponent = ProjectCuComponent;

    this.indexMeta = {
      ...this.indexMeta,
      indexTitle: this.translate.instant(_("projects")),
      indexIcon: "fa-solid fa-city",
      createBtnLabel: this.translate.instant(_("create_project")),
      endpoints: {
        index: "broker-inventory/projects/index",
        delete: "broker-inventory/projects/delete",
      },
      indexApiVersion: "v2",
      deleteApiVersion: "v2",
      indexTableKey: "PROJECTS_KEY",
      columns: [
        {
          title: this.translate.instant(_("id")),
          name: "id",
          searchable: false,
          orderable: false,
        },
        {
          title: this.translate.instant(_("name")),
          name: "value",
          searchable: true,
          orderable: false,
        },
        {
          title: this.translate.instant(_("developer")),
          name: "developer",
          render: this.developer(),
          searchable: false,
          orderable: false,
        },
        {
          title: this.translate.instant(_("created_at")),
          name: "created_at",
          searchable: false,
          orderable: false,
        },
        {
          title: this.translate.instant(_("creator")),
          name: "created_by",
          searchable: false,
          orderable: false,
        },
      ],
    };
  }

  refreshProjects(filters: Record<string, any>) {
    this.filtersData.update(oldFilters => ({ ...oldFilters, ...filters }));
  }
}
