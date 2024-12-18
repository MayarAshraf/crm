import { Injectable } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { constants } from "@shared";

@Injectable({
  providedIn: "root",
})
export class TaskInputsService {
  getDescField(data?: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: "description",
      type: "textarea-field",
      expressions: data?.expressions,
      props: {
        label: _("enter_description"),
        placeholder: _("enter_description"),
        maxLength: constants.MAX_LENGTH_TEXTAREA,
        keypress: data?.props?.keypress,
        blur: data?.props?.blur,
      },
    };
  }
}
