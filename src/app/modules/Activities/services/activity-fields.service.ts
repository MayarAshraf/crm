import { Injectable, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { FieldBuilderService } from "@shared";

@Injectable({
  providedIn: "root",
})
export class ActivityFieldsService {
  #fieldBuilder = inject(FieldBuilderService);

  configureFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder(
        [
          {
            key: "whatsapp_message_sent",
            type: "boolean-field",
            className: "flex-none",
            props: {
              label: _("whatsapp_message_sent"),
            },
          },
          {
            key: "mark_old_todos_as_completed",
            type: "boolean-field",
            className: "flex-none",
            props: {
              label: _("mark_old_todos_as_completed"),
            },
          },
        ],
        "flex flex-wrap column-gap-3",
      ),
      {
        key: "due_date",
        type: "date-field",
        props: {
          label: _("due_date"),
          showTime: true,
          withPresets: true,
        },
      },
    ];
  }
}
