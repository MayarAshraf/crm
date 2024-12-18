import { Injectable } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { constants } from "@shared";

@Injectable({
  providedIn: "root",
})
export class ActivityInputsService {
  getActivityNoteField(data?: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: "notes",
      type: "textarea-field",
      expressions: data?.expressions,
      props: {
        label: _("enter_notes"),
        placeholder: _("enter_notes"),
        required: data?.props?.required,
        maxLength: constants.MAX_LENGTH_TEXTAREA,
        blur: data?.props?.blur,
        keypress: data?.props?.keypress,
      },
    };
  }
}
