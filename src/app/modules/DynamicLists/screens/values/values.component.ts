import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject, input, numberAttribute } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { DynamicListModel } from "@modules/DynamicLists/services/service-types";
import {
  BaseIndexComponent,
  BreadcrumbService,
  CachedListsService,
  EnabledModuleService,
  KebabCasePipe,
  PluralPipe,
  TableWrapperComponent,
  constants,
} from "@shared";
import { DynamicListValueCuComponent } from "./value-cu.component";

@Component({
  selector: "app-index-dynamic-lists-values",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  providers: [KebabCasePipe, PluralPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexDynamicListValuesComponent extends BaseIndexComponent<
  DynamicListModel,
  ComponentType<DynamicListValueCuComponent>
> {
  #breadcrumbService = inject(BreadcrumbService);
  #kebabCase = inject(KebabCasePipe);
  #pluralaCase = inject(PluralPipe);
  #userPermission = inject(PermissionsService);
  #enabledModule = inject(EnabledModuleService);
  #cachedLists = inject(CachedListsService);

  list_id = input.required({ transform: numberAttribute });
  list_name = input<string>("");

  ngOnInit() {
    this.permissions.set(this.getPermissions() as { [key: string]: boolean });
    this.moduleName = this.#enabledModule.hasModule(constants.modulesNames["Dynamic Lists Module"]);
    this.#breadcrumbService.pushBreadcrumb({ label: this.list_name() });

    this.dialogComponent = DynamicListValueCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      indexTitle: `Manage ${this.list_name()}`,
      indexTableKey: `DYNAMIC_LIST_VALUES_${this.list_id()}_KEY`,
      endpoints: {
        index: `${constants.API_ENDPOINTS.dynamicListsIndex}/${this.list_id()}`,
        delete: "dynamic_lists/dynamic_list_values/delete",
      },
      indexIcon: "fas fa-list",
      createBtnLabel: this.translate.instant(_("create_new")),
      columns: [
        {
          name: "order",
          title: this.translate.instant(_("order")),
          searchable: false,
          orderable: false,
        },
        {
          name: "value",
          title: this.translate.instant(_("name")),
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
          name: "created_by",
          title: this.translate.instant(_("created_by")),
          searchable: false,
          orderable: false,
        },
      ],
    };
    this.#cachedLists.updateLists(["assignments:all_users_info"]);
  }

  getPermissions(): { [key: string]: boolean } | void {
    if (!this.list_id() || !this.list_name()) return;
    const crudsAllowToAll = ["Source"];
    const hasNotAllowToAll = !crudsAllowToAll.includes(this.list_name());
    const permissionCRUD = {
      index: this.#userPermission.hasPermission(
        "index-" + this.#pluralaCase.transform(this.#kebabCase.transform(this.list_name())),
      ),
      create: this.#userPermission.hasPermission(
        "create-" + this.#kebabCase.transform(this.list_name()),
      ),
      update: this.#userPermission.hasPermission(
        "update-" + this.#kebabCase.transform(this.list_name()),
      ),
      delete: this.#userPermission.hasPermission(
        "delete-" + this.#kebabCase.transform(this.list_name()),
      ),
    };
    const allowToAll = { index: true, create: true, update: true, delete: true };
    return hasNotAllowToAll ? permissionCRUD : allowToAll;
  }

  override openCreateRecordDialog() {
    const model = { list_id: this.list_id(), method: "create" };
    this.dialogConfig = { ...this.dialogConfig, data: model };
    super.openCreateRecordDialog();
  }
}
