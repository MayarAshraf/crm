import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { ITEM_CAMPAIGN } from "@modules/Marketing/services/service-types";
import { NotesComponent } from "@modules/Notes/components/notes/notes.component";

@Component({
  selector: "app-campaign-notes",
  standalone: true,
  imports: [NotesComponent],
  templateUrl: "./campaign-notes.component.html",
  styleUrl: "./campaign-notes.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignNotesComponent {
  campaignId = input.required<number>();
  ITEM_CAMPAIGN = ITEM_CAMPAIGN;
}
