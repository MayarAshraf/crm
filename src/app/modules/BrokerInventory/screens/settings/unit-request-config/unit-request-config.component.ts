import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, TemplateRef, inject, viewChild } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { UnitSettingsService } from "@modules/BrokerInventory/services/broker-inventory-unit-settings.service";
import { TypeUnitConfig, UnitRequestConfig } from "@modules/BrokerInventory/services/service-types";
import { BaseIndexComponent, ManipulateTitlePipe, TableWrapperComponent, constants } from "@shared";
import { InputSwitchChangeEvent, InputSwitchModule } from "primeng/inputswitch";
import { map } from "rxjs";

@Component({
  selector: "app-index-unit-request-config",
  standalone: true,
  templateUrl: "./unit-request-config.component.html",
  imports: [
    NgTemplateOutlet,
    FormsModule,
    ManipulateTitlePipe,
    TableWrapperComponent,
    InputSwitchModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexUnitRequestConfigComponent extends BaseIndexComponent<UnitRequestConfig> {
  #updateUnitRequestConfigTypes = inject(UnitSettingsService);

  constants = constants;

  field = viewChild.required<TemplateRef<any>>("field");
  fullCreation = viewChild.required<TemplateRef<any>>("fullCreation");
  required = viewChild.required<TemplateRef<any>>("required");

  TypeunitRequestConfig = TypeUnitConfig;
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(
        constants.permissions["update-broker-inventory-unit-request-config"],
      ),
    });

    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "broker_inventory/unit_requests/config",
      },
      indexTitle: this.translate.instant(_("unit_request_config")),
      indexTableKey: `UNIT_REQUEST_CONFIG_KEY`,
      indexIcon: constants.icons.building,
      columns: [
        { name: "field", title: "", render: this.field() },
        {
          name: "full-creation",
          title: this.translate.instant(_("full_creation")),
          render: this.fullCreation(),
        },
        { name: "Required", title: this.translate.instant(_("required")), render: this.required() },
      ],
    };
    this.loadUnitsRequestConfig();
  }

  loadUnitsRequestConfig() {
    this.isLoading.set(true);

    this.api
      .request("post", `${this.indexMeta.endpoints.index}`, {})
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(response => {
        this.records.set(response.data);
        this.isLoading.set(false);
      });
  }

  update($event: InputSwitchChangeEvent, type: string, row: UnitRequestConfig) {
    const model = {
      id: row.id,
      update_type: type,
      update_value: $event.checked,
    };
    this.#updateUnitRequestConfigTypes
      .updatetUnitRequestConfig(model)
      .pipe(
        map(({ data }) => data),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(record => {
        if (type === this.TypeunitRequestConfig.ISREQUIRED) {
          this.updateRecord(record);
        }
      });
  }

  get checkUpdateField() {
    return this.#userPermission.hasPermission(
      constants.permissions["update-broker-inventory-unit-request-config"],
    );
  }
}
