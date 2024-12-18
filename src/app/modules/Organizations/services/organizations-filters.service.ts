import { inject, Injectable } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { TranslateService } from "@ngx-translate/core";
import { CachedListsService, FilterConfig } from "@shared";

@Injectable({
  providedIn: "root",
})
export class OrganizationsFiltersService {
  #cachedLists = inject(CachedListsService);
  #translate = inject(TranslateService);

  getOrganizationsFilters(): FilterConfig[] {
    return [
      {
        type: "daterange",
        name: "created_at_range",
        label: this.#translate.instant(_("creation_date_range")),
        default: null,
        is_required: false,
        is_hidden: false,
      },
      {
        type: "daterange",
        name: "last_updated_at_range",
        label: this.#translate.instant(_("select_last_updated_at_range")),
        default: null,
        is_required: false,
        is_hidden: false,
      },
      {
        type: "select",
        name: "type",
        label: this.#translate.instant(_("type")),
        options: this.#cachedLists.loadLists().get("organizations:organizations_types") || [],
        default: null,
        is_required: false,
        is_multiple: false,
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
        name: "creators",
        label: this.#translate.instant(_("creators")),
        options: this.#cachedLists.loadLists().get("assignments:users") || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: false,
      },
    ];
  }
}
