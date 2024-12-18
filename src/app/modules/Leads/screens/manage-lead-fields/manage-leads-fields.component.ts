import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ManageleadField, leadFields } from "@modules/Leads/services/service-types";
import { CacheService, constants } from "@shared";
import { Observable, map } from "rxjs";
import { IndexTypeLeadFieldsComponent } from "./type-lead-fields/type-lead-fields.component";

@Component({
  selector: "app-settings-manage-lead",
  standalone: true,
  templateUrl: "./manage-leads-fields.component.html",
  imports: [AsyncPipe, IndexTypeLeadFieldsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ManageLeadComponent {
  #cacheService = inject(CacheService);

  LeadFields$: Observable<leadFields[]> = this.#cacheService
    .getData(constants.API_ENDPOINTS.getLeadsFields, "get")
    .pipe(
      map((data: ManageleadField[]) => {
        return data.reduce((acc, curr) => {
          const existingType = acc.find(item => item.type_lead_name === curr.lead_type);
          if (existingType) {
            // If the type already exists, add the current entry to its data array
            existingType.data.push(curr);
          } else {
            // If the type doesn't exist, create a new entry
            acc.push({
              type_lead_name: curr.lead_type,
              data: [curr],
            });
          }
          return acc;
        }, [] as leadFields[]);
      }),
    );
}
