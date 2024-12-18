import { ChangeDetectionStrategy, Component, computed, inject, model } from "@angular/core";
import { OpportunityFieldsService } from "@modules/Opportunities/services/opportunity-fields.service";
import { IOpportunity } from "@modules/Opportunities/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import { CachedListsService, PopupFormComponent, TruncateTextPipe, constants } from "@shared";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-opportunity-interests",
  standalone: true,
  template: `
    <app-popup-form
      [fields]="fields()"
      [model]="model()"
      [payload]="{
        id: opportunity().id,
        update_type: 'interests',
        update_value: model().interests
      }"
      [endpoint]="constants.API_ENDPOINTS.updateOpportunitiesData"
      apiVersion="v2"
      [isEditHovered]="opportunity().interests_ids?.length ? true : false"
      [btnLabel]="!opportunity().interests_ids?.length ? ('add_interests' | translate) : ''"
      [btnTooltip]="
        opportunity().interests_ids?.length
          ? ('edit_interests' | translate)
          : ('add_interests' | translate)
      "
      [btnIcon]="
        opportunity().interests_ids?.length ? constants.icons.pencil : constants.icons.heart
      "
      [iconPos]="opportunity().interests_ids?.length ? 'right' : 'left'"
      [btnStyleClass]="btnStyleClass()"
      (updateUi)="opportunity.set($event)"
    >
      @if (opportunity().interests_ids?.length) {
        @for (interest of interests(); track $index) {
          <span
            class="bg-red text-white py-1 px-2 line-height-1 border-round text-xs"
            [pTooltip]="interest.label"
            tooltipPosition="top"
          >
            <i [class]="constants.icons.heart"></i>
            {{ interest.label | truncateText: 15 }}
          </span>
        }
      }
    </app-popup-form>
  `,
  imports: [PopupFormComponent, TooltipModule, TruncateTextPipe, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunityInterestsComponent {
  #opportunityFieldsService = inject(OpportunityFieldsService);
  #cachedLists = inject(CachedListsService);

  constants = constants;

  opportunity = model.required<IOpportunity>();

  interests = computed(() => {
    const interests = this.#cachedLists.loadLists().get("interests:interests");
    return interests?.filter(
      (u: { value: number }) => this.opportunity()?.interests_ids?.includes(u.value),
    );
  });

  btnStyleClass = computed(() =>
    this.opportunity().interests_ids?.length
      ? "transition-none p-button-link text-500 text-xs w-auto py-0 px-2"
      : "transition-none bg-red border-red px-2 py-1 text-xs line-height-1",
  );
  model = computed(() => ({ interests: this.opportunity()?.interests_ids }));
  fields = computed(() => [this.#opportunityFieldsService.getInterestsField()]);
}
