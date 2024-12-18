import { Injectable, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { TranslateService } from "@ngx-translate/core";

import { AuthService, CachedListsService, FilterConfig } from "@shared";

@Injectable({
  providedIn: "root",
})
export class FilterTodosService {
  #cachedLists = inject(CachedListsService);
  #authService = inject(AuthService);
  #translate = inject(TranslateService);

  todosFilters(): FilterConfig[] {
    return [
      {
        type: "radio",
        name: "todo_type",
        label: this.#translate.instant(_("todo_type")),
        options: [
          {
            label: this.#translate.instant(_("follow_ups")),
            value: "tasks",
          },
          {
            label: this.#translate.instant(_("scheduled_meetings")),
            value: "events",
          },
        ],
        default: "tasks",
        is_required: false,
        is_hidden: false,
      },
      {
        type: "radio",
        name: "due_type",
        label: this.#translate.instant(_("todo_status")),
        options: [
          {
            label: this.#translate.instant(_("late")),
            value: "late",
          },
          {
            label: this.#translate.instant(_("todays")),
            value: "todays",
          },
          {
            label: this.#translate.instant(_("tomorrows")),
            value: "tomorrows",
          },
          {
            label: this.#translate.instant(_("upcoming")),
            value: "upcoming",
          },
          {
            label: this.#translate.instant(_("completed")),
            value: "completed",
          },
        ],
        default: "todays",
        is_required: false,
        is_hidden: false,
      },
      {
        type: "select",
        name: "assignees_attendees_ids",
        label: this.#translate.instant(_("select_deselect_assignees_attendees")),
        options: this.#cachedLists.loadLists().get("assignments:users") || [],
        default: [this.#authService.currentUser()?.id],
        is_required: false,
        is_multiple: true,
        is_hidden: false,
      },
    ];
  }
}
