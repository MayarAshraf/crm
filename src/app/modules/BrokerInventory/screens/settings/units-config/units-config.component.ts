import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, TemplateRef, inject, viewChild } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { UnitSettingsService } from "@modules/BrokerInventory/services/broker-inventory-unit-settings.service";
import { TypeUnitConfig, UnitConfig } from "@modules/BrokerInventory/services/service-types";
import { BaseIndexComponent, ManipulateTitlePipe, TableWrapperComponent, constants } from "@shared";
import { InputSwitchChangeEvent, InputSwitchModule } from "primeng/inputswitch";
import { map } from "rxjs";

@Component({
  selector: "app-index-unit-config",
  standalone: true,
  templateUrl: "./units-config.component.html",
  imports: [
    ManipulateTitlePipe,
    NgTemplateOutlet,
    FormsModule,
    TableWrapperComponent,
    InputSwitchModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexUnitsConfigComponent extends BaseIndexComponent<UnitConfig> {
  #updateUnitConfigTypes = inject(UnitSettingsService);

  field = viewChild.required<TemplateRef<any>>("field");
  fullCreation = viewChild.required<TemplateRef<any>>("fullCreation");
  required = viewChild.required<TemplateRef<any>>("required");

  TypeUnitConfig = TypeUnitConfig;

  ngOnInit() {
    this.permissions.set({
      index: true,
      create: true,
      update: true,
      delete: true,
    });

    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "broker_inventory/units/config",
      },
      indexTitle: this.translate.instant(_("unit_config")),
      indexTableKey: `UNIT_CONFIG_KEY`,
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
    this.loadUnitsConfig();
  }

  loadUnitsConfig() {
    this.isLoading.set(true);

    this.api
      .request("post", `${this.indexMeta.endpoints.index}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(response => {
        this.records.set(response.data);
        this.isLoading.set(false);
      });
  }

  update($event: InputSwitchChangeEvent, type: string, row: UnitConfig) {
    const model = {
      id: row.id,
      update_type: type,
      update_value: $event.checked,
    };
    this.#updateUnitConfigTypes
      .updateUnitConfig(model)
      .pipe(
        map(({ data }) => data),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(record => {
        if (type === this.TypeUnitConfig.ISREQUIRED) {
          this.updateRecord(record);
        }
      });
  }
}
