import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { PaymentMethodCuComponent } from "./payment-method-cu.component";

@Component({
  selector: "app-broker-inventory-index-payment-methods",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexPaymentMethodsComponent extends BaseIndexComponent<
  any,
  ComponentType<PaymentMethodCuComponent>
> {
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(
        constants.permissions["index-broker-inventory-payment-methods"],
      ),
      create: this.#userPermission.hasPermission(
        constants.permissions["create-broker-inventory-payment-method"],
      ),
      update: this.#userPermission.hasPermission(
        constants.permissions["update-broker-inventory-payment-method"],
      ),
      delete: this.#userPermission.hasPermission(
        constants.permissions["delete-broker-inventory-payment-method"],
      ),
    });

    this.dialogComponent = PaymentMethodCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "broker_inventory/payment_methods",
        delete: "broker_inventory/payment_methods/delete",
      },
      indexTitle: this.translate.instant(_("payment_methods")),
      indexIcon: constants.icons.building,
      createBtnLabel: this.translate.instant(_("create_payment_method")),
      indexTableKey: "BI_PAYMENT_METHODS_KEY",
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
