import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { RouterLink } from "@angular/router";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { DeveloperModel } from "@modules/BrokerInventory/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import {
  BaseIndexComponent,
  CachedListsService,
  constants,
  EnabledModuleService,
  PermissionsService,
  TableWrapperComponent,
} from "@shared";
import { ButtonModule } from "primeng/button";
import { filter, tap } from "rxjs";
import { DeveloperCuComponent } from "./developer-cu.component";

@Component({
  selector: "app-developers",
  standalone: true,
  imports: [TableWrapperComponent, RouterLink, ButtonModule, TranslateModule],
  templateUrl: "./developers.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DevelopersComponent extends BaseIndexComponent<
  DeveloperModel,
  ComponentType<DeveloperCuComponent>
> {
  #enabledModule = inject(EnabledModuleService);
  #cachedLists = inject(CachedListsService);
  #userPermission = inject(PermissionsService);

  showBasicFilters = signal(false);
  showAdvancedFilters = signal(true);

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
      index: this.#userPermission.hasPermission(
        constants.permissions["index-broker-inventory-developers"],
      ),
      create: this.#userPermission.hasPermission(
        constants.permissions["create-broker-inventory-developer"],
      ),
      update: this.#userPermission.hasPermission(
        constants.permissions["update-broker-inventory-developer"],
      ),
      delete: this.#userPermission.hasPermission(
        constants.permissions["delete-broker-inventory-developer"],
      ),
    });

    this.moduleName = this.#enabledModule.hasModule(
      constants.modulesNames["Broker Inventory Module"],
    );

    this.dialogComponent = DeveloperCuComponent;

    this.indexMeta = {
      ...this.indexMeta,
      indexTitle: this.translate.instant(_("developers")),
      indexIcon: "fas fa-list",
      createBtnLabel: this.translate.instant(_("create_developer")),
      endpoints: {
        index: "broker-inventory/developers/index",
        delete: "broker-inventory/developers/delete",
      },
      indexApiVersion: "v2",
      deleteApiVersion: "v2",
      indexTableKey: "DEVELOPERS_KEY",
      columns: [
        {
          title: this.translate.instant(_("id")),
          name: "id",
          searchable: true,
          orderable: false,
        },
        {
          title: this.translate.instant(_("developer")),
          name: "developer",
          searchable: true,
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

  refreshDevelopers(filters: Record<string, any>) {
    this.filtersData.update(oldFilters => ({ ...oldFilters, ...filters }));
  }
}
