import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { Campaign } from "@modules/Marketing/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import {
  BoxCardComponent,
  CachedLabelsService,
  CachedListsService,
  ChartBarComponent,
  ChratPieComponent,
} from "@shared";
import { CampaignProfileProgressInfoComponent } from "../campaign-profile-progress-info/campaign-profile-progress-info.component";

@Component({
  selector: "app-campaign-insight",
  standalone: true,
  imports: [
    ChratPieComponent,
    ChartBarComponent,
    BoxCardComponent,
    CampaignProfileProgressInfoComponent,
    TranslateModule,
  ],
  templateUrl: "./campaign-insight.component.html",
  styleUrl: "./campaign-insight.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignInsightComponent {
  campaign = input.required<Campaign>();
  #cachedLists = inject(CachedListsService);
  #cachedLabels = inject(CachedLabelsService);

  ngOnInit() {
    this.#cachedLists.updateLists(["dynamic_list:statuses"]);
  }

  getStatuses(id: number) {
    return this.#cachedLabels.getLabelById("dynamic_list:statuses", id);
  }

  leadOverStages = computed<{ labels: string[]; datasets: { label: string; data: number[] }[] }>(
    () => {
      const leadOverStages = this.campaign().insights.leads_over_stages;
      if (leadOverStages.length) {
        return {
          labels: leadOverStages.map(status =>
            this.#cachedLabels.getLabelById("dynamic_list:statuses", status.status_id),
          ) as string[],
          datasets: [
            {
              label: "count",
              data: leadOverStages.map(item => item.count),
            },
            {
              label: "cost",
              data: leadOverStages.map(item => item.cost),
            },
          ],
        };
      }
      return {} as { labels: string[]; datasets: { label: string; data: number[] }[] };
    },
  );

  leadOverAgents = computed<{ labels: string[]; data: number[] }>(() => {
    const leadsOverAgents = this.campaign().tables_data.assignees;
    if (leadsOverAgents.length) {
      return {
        labels: leadsOverAgents.map(item => item.name),
        data: leadsOverAgents.map(item => item.leads_count),
      };
    }
    return {} as { labels: string[]; data: number[] };
  });
}
