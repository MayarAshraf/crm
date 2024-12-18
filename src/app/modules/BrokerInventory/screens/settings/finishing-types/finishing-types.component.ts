import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { FinishingTypeModel } from "@modules/BrokerInventory/services/service-types";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { FinishingTypeCuComponent } from "./finishing-type-cu.component";

@Component({
  selector: "app-broker-inventory-index-finishing-types",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexFinishingTypesComponent extends BaseIndexComponent<
  FinishingTypeModel,
  ComponentType<FinishingTypeCuComponent>
> {
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(
        constants.permissions["index-broker-inventory-finishing-types"],
      ),
      create: this.#userPermission.hasPermission(
        constants.permissions["create-broker-inventory-finishing-type"],
      ),
      update: this.#userPermission.hasPermission(
        constants.permissions["update-broker-inventory-finishing-type"],
      ),
      delete: this.#userPermission.hasPermission(
        constants.permissions["delete-broker-inventory-finishing-type"],
      ),
    });

    this.dialogComponent = FinishingTypeCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "broker_inventory/finishing_types",
        delete: "broker_inventory/finishing_types/delete",
      },
      indexTitle: this.translate.instant(_("finishing_type")),
      indexIcon: constants.icons.building,
      createBtnLabel: this.translate.instant(_("create_finishing_type")),
      indexTableKey: "BI_FINISHING_TYPES_KEY",
      columns: [
        {
          name: "order",
          title: this.translate.instant(_("order")),
          searchable: false,
          orderable: true,
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
          name: "creator.full_name",
          title: this.translate.instant(_("created_by")),
          searchable: false,
          orderable: false,
        },
      ],
    };
  }
}
