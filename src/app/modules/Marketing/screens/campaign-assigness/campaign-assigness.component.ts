import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { assignessCampaign } from "@modules/Marketing/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";

@Component({
  selector: "app-campaign-assigness",
  standalone: true,
  imports: [TableModule, InputTextModule, IconFieldModule, InputIconModule, TranslateModule],
  templateUrl: "./campaign-assigness.component.html",
  styleUrl: "./campaign-assigness.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignAssignessComponent {
  assigness = input.required<assignessCampaign[]>();
}
