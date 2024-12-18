import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ImportFormComponent } from "@modules/Imports/components/import-form/import-form.component";
import { ITEM_LEAD } from "@modules/Leads/services/service-types";

@Component({
  selector: "app-import-leads",
  standalone: true,
  imports: [ImportFormComponent],
  template: `
    <app-import-form
      docsType="leads"
      importEndpoint="imports/imports/import-leads"
      uploadEndpoint="imports/imports/upload"
      [importModel]="ITEM_LEAD"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportLeadsComponent {
  ITEM_LEAD = ITEM_LEAD;
}
