import { inject, Injectable } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { TranslateService } from "@ngx-translate/core";
import { CachedListsService, FilterConfig } from "@shared";

@Injectable({
  providedIn: "root",
})
export class ResourcesFiltersService {
  #cachedLists = inject(CachedListsService);
  #translate = inject(TranslateService);

  getResourcesFilters(): FilterConfig[] {
    return [
      {
        type: "select",
        name: "resource_type_id",
        label: this.#translate.instant(_("resource_type")),
        options: this.#cachedLists.loadLists().get("resources:resource_types") || [],
        default: null,
        is_required: false,
        is_multiple: false,
        is_hidden: false,
      },
      {
        type: "switcher",
        name: "is_active",
        label: this.#translate.instant(_("is_active")),
        default: false,
        is_required: false,
        is_hidden: false,
      },
      {
        type: "switcher",
        name: "is_private",
        label: this.#translate.instant(_("is_private")),
        default: false,
        is_required: false,
        is_hidden: false,
      },
    ];
  }
}
