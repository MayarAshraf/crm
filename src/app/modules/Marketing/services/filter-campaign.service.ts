import { Injectable, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { TranslateService } from "@ngx-translate/core";
import { CachedListsService, FilterConfig } from "@shared";

@Injectable({
  providedIn: "root",
})
export class FilterCampaignService {
  #cachedLists = inject(CachedListsService);
  #translate = inject(TranslateService);

  getCampaignFilters(): FilterConfig[] {
    return [
      {
        type: "select",
        name: "campaign_type_ids",
        label: this.#translate.instant(_("campaign_type")),
        options: this.#cachedLists.loadLists().get("marketing:campaigns_types") || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: false,
      },
      {
        type: "select",
        name: "campaign_status_ids",
        label: this.#translate.instant(_("campaign_status")),
        options: this.#cachedLists.loadLists().get("marketing:campaigns_statuses") || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: false,
      },
      {
        type: "daterange",
        name: "start_date",
        label: this.#translate.instant(_("start_date")),
        default: null,
        is_required: false,
        is_hidden: false,
      },
      {
        type: "daterange",
        name: "end_date",
        label: this.#translate.instant(_("end_date")),
        default: null,
        is_required: false,
        is_hidden: false,
      },
      {
        type: "select",
        name: "creators",
        label: this.#translate.instant(_("creators")),
        options: this.#cachedLists.loadLists().get("assignments:users") || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: false,
      },
      {
        type: "daterange",
        name: "created_at_range",
        label: this.#translate.instant(_("creation_date_range")),
        default: null,
        is_required: false,
        is_hidden: false,
      },
      {
        type: "number",
        name: "expected_revenue",
        label: this.#translate.instant(_("expected_revenue")),
        default: null,
        is_required: false,
        is_hidden: false,
        is_advanced: true,
      },
      {
        type: "number",
        name: "actual_cost",
        label: this.#translate.instant(_("actual_cost")),
        default: null,
        is_required: false,
        is_hidden: false,
        is_advanced: true,
      },
      {
        type: "number",
        name: "budgeted_cost",
        label: this.#translate.instant(_("budgeted_cost")),
        default: null,
        is_required: false,
        is_hidden: false,
        is_advanced: true,
      },
      {
        type: "number",
        name: "expected_response",
        label: this.#translate.instant(_("expected_response")),
        default: null,
        is_required: false,
        is_hidden: false,
        is_advanced: true,
      },
      {
        type: "daterange",
        name: "last_updated_at_range",
        label: this.#translate.instant(_("select_last_updated_at_range")),
        default: null,
        is_required: false,
        is_hidden: false,
        is_advanced: true,
      },
    ];
  }
}
