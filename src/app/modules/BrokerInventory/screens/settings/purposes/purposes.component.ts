import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { PurposeModel } from "@modules/BrokerInventory/services/service-types";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { PurposeCuComponent } from "./purpose-cu.component";

@Component({
  selector: "app-broker-inventory-index-purposes",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexPurposesComponent extends BaseIndexComponent<
  PurposeModel,
  ComponentType<PurposeCuComponent>
> {
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(
        constants.permissions["index-broker-inventory-purposes"],
      ),
      create: this.#userPermission.hasPermission(
        constants.permissions["create-broker-inventory-purpose"],
      ),
      update: this.#userPermission.hasPermission(
        constants.permissions["update-broker-inventory-purpose"],
      ),
      delete: this.#userPermission.hasPermission(
        constants.permissions["delete-broker-inventory-purpose"],
      ),
    });

    this.dialogComponent = PurposeCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "broker_inventory/purposes",
        delete: "broker_inventory/purposes/delete",
      },
      indexTitle: this.translate.instant(_("purposes")),
      indexIcon: constants.icons.building,
      createBtnLabel: this.translate.instant(_("create_purpose")),
      indexTableKey: "BI_PURPOSES_KEY",
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
