import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { PurposeTypeModel } from "@modules/BrokerInventory/services/service-types";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { PurposeTypeCuComponent } from "./purpose-type-cu.component";

@Component({
  selector: "app-broker-inventory-index-purpose-types",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexPurposeTypesComponent extends BaseIndexComponent<
  PurposeTypeModel,
  ComponentType<PurposeTypeCuComponent>
> {
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(
        constants.permissions["index-broker-inventory-purpose-types"],
      ),
      create: this.#userPermission.hasPermission(
        constants.permissions["create-broker-inventory-purpose-type"],
      ),
      update: this.#userPermission.hasPermission(
        constants.permissions["update-broker-inventory-purpose-type"],
      ),
      delete: this.#userPermission.hasPermission(
        constants.permissions["delete-broker-inventory-purpose-type"],
      ),
    });

    this.dialogComponent = PurposeTypeCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "broker_inventory/purpose_types",
        delete: "broker_inventory/purpose_types/delete",
      },
      indexTitle: this.translate.instant(_("purpose_types")),
      indexIcon: constants.icons.building,
      createBtnLabel: this.translate.instant(_("create_purpose_type")),
      indexTableKey: "BI_PURPOSE_TYPES_KEY",
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
