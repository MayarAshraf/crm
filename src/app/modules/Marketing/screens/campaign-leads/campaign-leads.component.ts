import { ChangeDetectionStrategy, Component, computed, inject, model } from "@angular/core";
import { LeadsCampaign } from "@modules/Marketing/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import {
  CachedLabelsService,
  CachedListsService,
  CommaSeparatedLabelsComponent,
  constants,
  DateFormatterPipe,
} from "@shared";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
@Component({
  selector: "app-campaign-leads",
  standalone: true,
  imports: [
    TableModule,
    CommaSeparatedLabelsComponent,
    DateFormatterPipe,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TranslateModule,
  ],
  templateUrl: "./campaign-leads.component.html",
  styleUrl: "./campaign-leads.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignLeadsComponent {
  leads = model.required<LeadsCampaign[]>();
  #cachedLists = inject(CachedListsService);
  #cachedLabels = inject(CachedLabelsService);
  constants = constants;
  records = computed(() => {
    return this.leads().map(item => {
      return {
        ...item,
        status: this.#cachedLabels.getLabelById("dynamic_list:statuses", item.status_id),
        assigness: this.#cachedLabels.getLabelsByIds("assignments:users", item.assignees_ids),
      };
    });
  });

  ngOnInit() {
    this.#cachedLists.updateLists(["assignments:users", "dynamic_list:statuses"]);
  }

  getAssignments(ids: number[]) {
    return this.#cachedLabels.getLabelsByIds("assignments:users", ids);
  }

  getStatuses(id: number) {
    return this.#cachedLabels.getLabelById("dynamic_list:statuses", id);
  }
}
