import { Injectable, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { TranslateService } from "@ngx-translate/core";
import { CachedListsService, FilterConfig } from "@shared";

@Injectable({ providedIn: "root" })
export class DuplicatesFiltersService {
  #cachedLists = inject(CachedListsService);
  #translate = inject(TranslateService);

  getFilters(): FilterConfig[] {
    return [
      {
        type: "select",
        name: "status_ids",
        label: this.#translate.instant(_("stages")),
        options: this.#cachedLists.loadLists().get("dynamic_list:statuses") || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: false,
      },
      {
        type: "select",
        name: "assignees_ids",
        label: this.#translate.instant(_("assignees")),
        options: this.#cachedLists.loadLists().get("assignments:users") || [],
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
        type: "select",
        name: "source_ids",
        label: this.#translate.instant(_("sources")),
        options: this.#cachedLists.loadLists().get("dynamic_list:sources") || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: false,
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
      },
      {
        type: "select",
        name: "rating_ids",
        label: this.#translate.instant(_("select_deselect_ratings")),
        options: this.#cachedLists.loadLists().get("dynamic_list:ratings") || [],
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
    ];
  }
}
