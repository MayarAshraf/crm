import { ChangeDetectionStrategy, Component, computed, inject, input, model } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { InterestsInputsService } from "@modules/Interests/services/interests-inputs.service";
import { LeadsService } from "@modules/Leads/services/leads.service";
import { Lead } from "@modules/Leads/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import {
  CachedListsService,
  CommaSeparatedLabelsComponent,
  PopupFormComponent,
  constants,
} from "@shared";

@Component({
  selector: "app-lead-interests",
  standalone: true,
  template: `
    @if (withItemLable()) {
      <span class="item-label"> {{ "interests" | translate }}</span>
    }

    <app-popup-form
      [fields]="fields()"
      [model]="model()"
      [endpoint]="constants.API_ENDPOINTS.updateCustomDataNoPermission"
      apiVersion="v2"
      [payload]="{
        id: lead().id,
        update_type: 'interests',
        update_value: model().interests
      }"
      [btnLabel]="!lead().interests_ids?.length ? 'add_interests' : ''"
      [btnTooltip]="lead().interests_ids?.length ? 'edit_interests' : 'add_interests'"
      (updateUi)="updateUi($event)"
    >
      <span topForm class="block text-primary text-xs font-medium mb-3">{{
        "interests" | translate
      }}</span>
      <app-comma-separated-labels [items]="interests()" [tooltip]="'interests' | translate" />
    </app-popup-form>
  `,
  imports: [PopupFormComponent, CommaSeparatedLabelsComponent, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadInterestsComponent {
  #leadsService = inject(LeadsService);
  #interestsInputs = inject(InterestsInputsService);
  #cachedLists = inject(CachedListsService);
  constants = constants;

  lead = model.required<Lead>();
  withItemLable = input(true);

  interests = computed(() => {
    const interests = this.#cachedLists.loadLists().get("interests:interests");
    return (
      interests?.filter((i: { value: number }) => this.lead().interests_ids?.includes(i.value)) ||
      []
    );
  });

  model = computed(() => ({ interests: this.lead().interests_ids }));

  fields = computed(() => [
    this.#interestsInputs.interestsSelectField({
      key: "interests",
      props: {
        label: _("interests"),
        multiple: true,
      },
    }),
  ]);

  updateUi(lead: Lead) {
    this.lead.update(lead => ({ ...lead, interests_ids: this.model().interests }));
    this.#leadsService.updateLeadInList(this.lead());
  }
}
