import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";
import { Campaign } from "@modules/Marketing/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import { MediaListComponent } from "@shared";
import { TabViewModule } from "primeng/tabview";
import { CampaignAssignessComponent } from "../campaign-assigness/campaign-assigness.component";
import { CampaignInsightComponent } from "../campaign-insight/campaign-insight.component";
import { CampaignLeadsComponent } from "../campaign-leads/campaign-leads.component";
import { CampaignNotesComponent } from "../campaign-notes/campaign-notes.component";
@Component({
  selector: "app-campaign-profile-tabs",
  standalone: true,
  imports: [
    TranslateModule,
    TabViewModule,
    CampaignInsightComponent,
    CampaignLeadsComponent,
    CampaignNotesComponent,
    CampaignAssignessComponent,
    MediaListComponent,
  ],
  templateUrl: "./campaign-profile-tabs.component.html",
  styleUrl: "./campaign-profile-tabs.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignProfileTabsComponent {
  campaign = model.required<Campaign>();
}
