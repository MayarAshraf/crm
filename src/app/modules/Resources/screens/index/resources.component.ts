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
import { OpenViewDialogService } from "@gService/open-view-dialog.service";
import { ResourcesFiltersService } from "@modules/Resources/services/resources-filters.service";
import { Resource } from "@modules/Resources/services/service-type";
import {
  BaseIndexComponent,
  CachedListsService,
  ConfirmService,
  constants,
  EnabledModuleService,
  FilterConfig,
  FiltersPanelComponent,
  PermissionsService,
  TableWrapperComponent,
} from "@shared";
import { ButtonModule } from "primeng/button";
import { ImageModule } from "primeng/image";
import { filter, tap } from "rxjs";
import { ResourceCuComponent } from "../resource-cu.component";
import { ResourceViewComponent } from "./resource-view/resource-view.component";

@Component({
  selector: "app-resources",
  standalone: true,
  imports: [FiltersPanelComponent, ImageModule, TableWrapperComponent, ButtonModule],
  templateUrl: "./resources.component.html",
  styleUrl: "./resources.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ResourcesComponent extends BaseIndexComponent<
  Resource,
  ComponentType<ResourceCuComponent>
> {
  #enabledModule = inject(EnabledModuleService);
  #cachedLists = inject(CachedListsService);
  #userPermission = inject(PermissionsService);
  #resourcesFilters = inject(ResourcesFiltersService);
  #confirmService = inject(ConfirmService);
  #openViewDialog = inject(OpenViewDialogService);

  image = viewChild.required<TemplateRef<any>>("image");
  title = viewChild.required<TemplateRef<any>>("title");

  showBasicFilters = signal(false);
  showAdvancedFilters = signal(true);

  resourcesFilters = computed<FilterConfig[]>(() => this.#resourcesFilters.getResourcesFilters());

  basicFiltersLists = ["resources:resource_types"];

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
    this.#openViewDialog.records = this.records;

    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["index-resources"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-resource"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-resource"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-resource"]),
    });

    this.moduleName = this.#enabledModule.hasModule(constants.modulesNames["Resources Module"]);

    this.dialogComponent = ResourceCuComponent;
    this.dialogConfig = { ...this.dialogConfig, width: "650px" };

    this.indexMeta = {
      ...this.indexMeta,
      indexTitle: this.translate.instant(_("resources")),
      indexIcon: "fas fa-folder-open",
      createBtnLabel: this.translate.instant(_("create_resource")),
      endpoints: { index: "resources/resources", delete: "resources/resources/delete" },
      indexTableKey: "RESOURCES_KEY",
      columns: [
        {
          title: this.translate.instant(_("image")),
          name: "featured_image",
          render: this.image(),
          searchable: false,
          orderable: false,
        },
        {
          title: this.translate.instant(_("title")),
          name: "title",
          render: this.title(),
          searchable: true,
          orderable: false,
        },
        {
          title: this.translate.instant(_("created_at")),
          name: "created_at",
          searchable: true,
          orderable: false,
        },
      ],
    };
  }

  refreshResources(filters: Record<string, any>) {
    this.filtersData.update(oldFilters => ({ ...oldFilters, ...filters }));
  }

  confirmDelete(rowData: any) {
    this.#confirmService.confirmDelete({
      acceptCallback: () => this.deleteRecord(rowData),
    });
  }

  openViewRecordDialog(data: Resource) {
    this.#openViewDialog.openViewRecordDialog({ data, component: ResourceViewComponent });
  }
}
