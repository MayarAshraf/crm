import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  inject,
  input,
  signal,
  viewChild,
} from "@angular/core";
import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { RouterLink } from "@angular/router";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { LocationsService } from "@modules/Locations/services/locations.service";
import {
  BaseIndexComponent,
  BreadcrumbItem,
  BreadcrumbService,
  EnabledModuleService,
  TableWrapperComponent,
  constants,
} from "@shared";
import { LazyLoadEvent } from "primeng/api";
import { filter, scan, switchMap, tap } from "rxjs";
import { LocationCuComponent } from "../location-cu.component";

@Component({
  selector: "app-index-locations",
  standalone: true,
  templateUrl: "./locations.component.html",
  imports: [RouterLink, TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexLocationsComponent extends BaseIndexComponent<any> {
  #breadcrumbService = inject(BreadcrumbService);
  #locationsService = inject(LocationsService);
  #userPermission = inject(PermissionsService);
  #enabledModule = inject(EnabledModuleService);

  parent_id = input<number>(0);
  locationName = viewChild.required<TemplateRef<any>>("locationName");
  editData!: { id: number; method: "create" | "update" };
  stateKey!: string;
  lazyLoadEvent = signal<LazyLoadEvent | undefined>(undefined);
  locationsTable = viewChild<TableWrapperComponent>("locationsTable");

  initialBreadcrumb: BreadcrumbItem[] = [
    { label: "settings", url: "/settings" },
    { label: "all_countries", url: "/locations/settings" },
  ];

  LoadId$ = toObservable(this.parent_id).pipe(
    filter(e => !!e),
    tap(id => {
      this.locationsTable()?.resetTable();
      this.lazyLoadEvent.set({} as LazyLoadEvent);
      this.loadRecords({} as LazyLoadEvent, { parent_id: +id });
      this.editData = { id: +id, method: "create" };
      this.dialogConfig = { ...this.dialogConfig, data: this.editData };
    }),
    switchMap(id => {
      return this.#locationsService.getLocationsBreadcrumb(+id).pipe(
        tap(data => {
          const breadcrumbs = data.map((item: { name: string; id: number }) => ({
            label: item.name,
            url: "/locations/settings/" + item.id,
          }));
          const updatedBreadcrumbs = [...this.initialBreadcrumb, ...breadcrumbs];
          this.#breadcrumbService.updateAllBreadcrumbs(updatedBreadcrumbs);
        }),
        takeUntilDestroyed(this.destroyRef),
      );
    }),
  );

  LoadIdReadOnly = toSignal(this.LoadId$, { initialValue: 0 });

  lazyLoadEvent$ = toObservable(this.lazyLoadEvent).pipe(
    scan(
      (acc: any, curr) => {
        if (acc.parent_id === +this.parent_id()) {
          return {
            ...acc,
            filters: curr,
            initialLoadRecord: true,
          };
        } else {
          return {
            ...acc,
            parent_id: +this.parent_id(),
            initialLoadRecord: false,
          };
        }
      },
      {
        parent_id: undefined,
        filters: {},
        initialLoadRecord: false,
      },
    ),
    filter(state => state.initialLoadRecord),
    tap(({ filters, parent_id }) => {
      this.loadRecords(filters, { parent_id: parent_id });
    }),
  );
  lazyLoadEventReadOnly = toSignal(this.lazyLoadEvent$, { initialValue: {} });

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["index-locations"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-location"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-location"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-location"]),
    });

    this.moduleName = this.#enabledModule.hasModule(constants.modulesNames["Locations Module"]);
    this.dialogComponent = LocationCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "locations/locations-by-parent-id",
        delete: "locations/delete",
      },
      indexTitle: this.translate.instant(_("locations")),
      indexIcon: "fas fa-list",
      createBtnLabel: this.translate.instant(_("create_location")),
      indexTableKey: undefined,
      columns: [
        {
          name: "name",
          title: this.translate.instant(_("title")),
          searchable: true,
          orderable: true,
          render: this.locationName(),
        },
        {
          name: "transportation_fees",
          title: this.translate.instant(_("transportation_fees")),
          searchable: true,
          orderable: false,
        },
        {
          name: "created_at",
          title: this.translate.instant(_("created_at")),
          searchable: false,
          orderable: false,
        },
        {
          name: "updated_at",
          title: this.translate.instant(_("last_updated_at")),
          searchable: false,
          orderable: false,
        },
      ],
    };
  }

  override openCreateRecordDialog() {
    super.openCreateRecordDialog(this.dialogConfig);
  }
}
