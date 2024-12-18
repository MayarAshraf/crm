import { Injectable, inject, signal } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { TranslateService } from "@ngx-translate/core";
import { CachedListsService, FilterConfig } from "@shared";

@Injectable({
  providedIn: "root",
})
export class FilterCheckInService {
  #cachedLists = inject(CachedListsService);
  #translate = inject(TranslateService);

  isFakeIncidentTypesHidden = signal(true);

  getCheckInFilters(): FilterConfig[] {
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
        type: "select",
        name: "creators",
        label: this.#translate.instant(_("created_by")),
        options: this.#cachedLists.loadLists().get("assignments:users") || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: false,
      },
      {
        type: "select",
        name: "operation_types",
        label: this.#translate.instant(_("operation_types")),
        options: this.#cachedLists.loadLists().get("hr:operation_types") || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: false,
      },
      {
        type: "switcher",
        name: "is_fake_incident",
        label: this.#translate.instant(_("is_fake_incident")),
        default: false,
        is_required: false,
        is_hidden: false,
        is_advanced: true,
        onChange: (event, form) => {
          this.isFakeIncidentTypesHidden.set(!event.checked);
          form?.get("fake_incident_types")?.setValue(null);
        },
      },
      {
        type: "select",
        name: "fake_incident_types",
        label: this.#translate.instant(_("fake_incident_types")),
        options: this.#cachedLists.loadLists().get("hr:fake_incident_types") || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_advanced: true,
        is_hidden: this.isFakeIncidentTypesHidden(),
      },
      {
        type: "daterange",
        name: "last_updated_at_range",
        label: this.#translate.instant(_("last_update_date_range")),
        default: null,
        is_required: false,
        is_hidden: false,
        is_advanced: true,
      },
    ];
  }
}
