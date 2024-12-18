import { inject, Injectable, signal } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { ITEM_LEAD } from "@modules/Leads/services/service-types";
import { TranslateService } from "@ngx-translate/core";
import { CachedListsService, FilterConfig } from "@shared";
@Injectable({
  providedIn: "root",
})
export class CasesFiltersService {
  #cachedLists = inject(CachedListsService);
  #translate = inject(TranslateService);

  pipeLineId = signal<number | null>(null);

  getCasesFilters(): FilterConfig[] {
    return [
      {
        type: "select",
        name: "case_status",
        label: this.#translate.instant(_("open_cases")),
        options: this.#cachedLists.loadLists().get("customer_service:case_statuses") || [],
        default: null,
        is_required: false,
        is_multiple: false,
        is_hidden: false,
      },
      {
        type: "select",
        name: "assignees",
        label: this.#translate.instant(_("assignees")),
        options: this.#cachedLists.loadLists().get("assignments:users") || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: false,
      },
      {
        type: "select",
        name: "case_priority_ids",
        label: this.#translate.instant(_("case_priorities")),
        options: this.#cachedLists.loadLists().get("customer_service:case_priorities") || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: false,
      },
      {
        type: "select",
        name: "case_type_ids",
        label: this.#translate.instant(_("case_types")),
        options: this.#cachedLists.loadLists().get("customer_service:case_types") || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: false,
      },
      {
        type: "select",
        name: "pipeline_id",
        label: this.#translate.instant(_("pipeline")),
        options: this.#cachedLists.loadLists().get("pipelines:ticket_pipelines") || [],
        default: null,
        is_required: false,
        is_multiple: false,
        is_hidden: false,
        onChange: (event, form) => {
          this.pipeLineId.set(event.value);
          form.get("pipeline_stage_ids")?.setValue(null);
        },
      },
      {
        type: "select",
        name: "pipeline_stage_ids",
        label: this.#translate.instant(_("pipeline_stages")),
        options:
          this.#cachedLists.loadLists().get(`pipelines:pipeline_stages:id:${this.pipeLineId()}`) ||
          [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: !this.pipeLineId(),
      },
      {
        type: "select",
        name: "suspended_creators",
        label: this.#translate.instant(_("suspended_creators")),
        options: this.#cachedLists.loadLists().get("assignments:suspended_creators") || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: false,
      },
      {
        type: "select",
        name: "interests_ids",
        label: this.#translate.instant(_("interests")),
        options: this.#cachedLists.loadLists().get("interests:interests") || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: false,
      },
      {
        type: "select",
        name: "tags_ids",
        label: this.#translate.instant(_("tags")),
        options: this.#cachedLists.loadLists().get("tags:tags") || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: false,
      },
      {
        type: "daterange",
        name: "created_at_range",
        label: this.#translate.instant(_("created_at_range")),
        default: null,
        is_required: false,
        is_hidden: false,
        is_advanced: true,
      },
      {
        type: "daterange",
        name: "last_updated_at_range",
        label: this.#translate.instant(_("last_updated_at_range")),
        default: null,
        is_required: false,
        is_hidden: false,
        is_advanced: true,
      },
      {
        type: "autocomplete",
        name: "leads_ids",
        label: this.#translate.instant(_("customers")),
        entity: ITEM_LEAD,
        default: null,
        is_multiple: true,
        is_required: false,
        is_hidden: false,
        is_advanced: true,
      },
      {
        type: "select",
        name: "case_origin_ids",
        label: this.#translate.instant(_("case_origins")),
        options: this.#cachedLists.loadLists().get("customer_service:case_origins") || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: false,
        is_advanced: true,
      },
      {
        type: "select",
        name: "creators_ids",
        label: this.#translate.instant(_("creators")),
        options: this.#cachedLists.loadLists().get("assignments:users") || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: false,
        is_advanced: true,
      },
      {
        type: "select",
        name: "case_reason_ids",
        label: this.#translate.instant(_("case_reasons")),
        options: this.#cachedLists.loadLists().get("customer_service:case_reasons") || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: false,
        is_advanced: true,
      },
    ];
  }
}
