import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ITEM_BI_UNIT } from "@modules/BrokerInventory/services/service-types";
import { ImportFormComponent } from "@modules/Imports/components/import-form/import-form.component";

@Component({
  selector: "app-import-units",
  standalone: true,
  imports: [ImportFormComponent],
  template: `
    <app-import-form
      docsType="units"
      importEndpoint="imports/imports/import-units"
      uploadEndpoint="imports/imports/upload"
      [importModel]="ITEM_UNIT"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportUnitsComponent {
  ITEM_UNIT = ITEM_BI_UNIT;
}
