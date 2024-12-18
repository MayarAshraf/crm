import { ChangeDetectionStrategy, Component, computed, inject, input, model } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { LeadsService } from "@modules/Leads/services/leads.service";
import { Lead } from "@modules/Leads/services/service-types";
import { TagsInputsService } from "@modules/Tags/services/tags-lists-inputs.service";
import { TranslateModule } from "@ngx-translate/core";
import {
  CachedListsService,
  CommaSeparatedLabelsComponent,
  PopupFormComponent,
  constants,
} from "@shared";

@Component({
  selector: "app-lead-tags",
  standalone: true,
  template: `
    @if (withItemLable()) {
      <span class="item-label">{{ "tags" | translate }}</span>
    }

    <app-popup-form
      [fields]="fields()"
      [model]="model()"
      [endpoint]="constants.API_ENDPOINTS.updateCustomDataNoPermission"
      apiVersion="v2"
      [payload]="{
        id: lead().id,
        update_type: 'tags',
        update_value: model().tags
      }"
      [btnLabel]="!lead().tags_ids?.length ? 'add_tags' : ''"
      [btnTooltip]="lead().tags_ids?.length ? 'edit_tags' : 'add_tags'"
      (updateUi)="updateUi($event)"
    >
      <span topForm class="block text-primary text-xs font-medium mb-3">{{
        "tags" | translate
      }}</span>
      <app-comma-separated-labels [items]="tags()" [tooltip]="'tags' | translate" />
    </app-popup-form>
  `,
  imports: [PopupFormComponent, CommaSeparatedLabelsComponent, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadTagsComponent {
  #tagsInputs = inject(TagsInputsService);
  #leadsService = inject(LeadsService);
  #cachedLists = inject(CachedListsService);
  constants = constants;

  lead = model.required<Lead>();
  withItemLable = input(true);

  tags = computed(() => {
    const tags = this.#cachedLists.loadLists().get("tags:tags");
    return tags?.filter((i: { value: number }) => this.lead().tags_ids?.includes(i.value)) || [];
  });

  model = computed(() => ({ tags: this.lead().tags_ids }));
  fields = computed(() => [
    this.#tagsInputs.tagsSelectField({
      key: "tags",
      props: {
        label: _("tags"),
        multiple: true,
      },
    }),
  ]);

  updateUi(lead: Lead) {
    this.lead.update(lead => ({ ...lead, tags_ids: this.model().tags }));
    this.#leadsService.updateLeadInList(this.lead());
  }
}
