import { inject, Injectable } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { TranslateService } from "@ngx-translate/core";
import { CachedListsService, FilterConfig } from "@shared";

@Injectable()
export class ExportsFiltersService {
  #cachedLists = inject(CachedListsService);
  #translate = inject(TranslateService);

  exportersName = "exporters";
  getExportsFilters(): FilterConfig[] {
    return [
      {
        type: "daterange",
        name: "exported_at_range",
        label: this.#translate.instant(_("export_date_range")),
        default: null,
        is_required: false,
        is_hidden: false,
      },
      {
        type: "select",
        name: this.exportersName,
        label: this.#translate.instant(_("exporters")),
        options: this.#cachedLists.loadLists().get("assignments:users") || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: false,
      },
      {
        type: "select",
        name: "export_types",
        label: this.#translate.instant(_("export_types")),
        options: this.#cachedLists.loadLists().get("exports:export_types") || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: false,
      },
    ];
  }
}
