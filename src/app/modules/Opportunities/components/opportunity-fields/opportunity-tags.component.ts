import { ChangeDetectionStrategy, Component, computed, inject, model } from "@angular/core";
import { OpportunityFieldsService } from "@modules/Opportunities/services/opportunity-fields.service";
import { IOpportunity } from "@modules/Opportunities/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import { CachedListsService, PopupFormComponent, TruncateTextPipe, constants } from "@shared";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-opportunity-tags",
  standalone: true,
  template: `
    <app-popup-form
      [fields]="fields()"
      [model]="model()"
      apiVersion="v2"
      [endpoint]="constants.API_ENDPOINTS.updateOpportunitiesData"
      [payload]="{
        id: opportunity().id,
        update_type: 'tags',
        update_value: model().tags
      }"
      [isEditHovered]="opportunity().tags_ids?.length ? true : false"
      [btnLabel]="!opportunity().tags_ids?.length ? ('add_tags' | translate) : ''"
      [btnTooltip]="
        opportunity().tags_ids?.length ? ('edit_tags' | translate) : ('add_tags' | translate)
      "
      [btnIcon]="opportunity().tags_ids?.length ? constants.icons.pencil : constants.icons.tag"
      [iconPos]="opportunity().tags_ids?.length ? 'right' : 'left'"
      [btnStyleClass]="
        opportunity().tags_ids?.length
          ? 'transition-none p-button-link text-500 text-xs w-auto py-0 px-2'
          : 'transition-none bg-dark-purple border-dark-purple px-2 py-1 text-xs line-height-1'
      "
      (updateUi)="opportunity.set($event)"
    >
      @if (opportunity().tags_ids?.length) {
        @for (tag of tags(); track $index) {
          <span
            class="bg-dark-purple text-white py-1 px-2 line-height-1 border-round text-xs"
            [pTooltip]="tag.label"
            tooltipPosition="top"
          >
            <i [class]="constants.icons.tag"></i>
            {{ tag.label | truncateText: 15 }}
          </span>
        }
      }
    </app-popup-form>
  `,
  imports: [TagModule, PopupFormComponent, TooltipModule, TruncateTextPipe, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunityTagsComponent {
  #opportunityFieldsService = inject(OpportunityFieldsService);
  #cachedLists = inject(CachedListsService);
  constants = constants;

  opportunity = model.required<IOpportunity>();

  tags = computed(() => {
    const tags = this.#cachedLists.loadLists().get("tags:tags");
    return tags?.filter((u: { value: number }) => this.opportunity()?.tags_ids?.includes(u.value));
  });

  model = computed(() => ({ tags: this.opportunity()?.tags_ids }));
  fields = computed(() => [this.#opportunityFieldsService.getTagsField()]);
}
