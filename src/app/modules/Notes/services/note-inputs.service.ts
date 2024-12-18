import { inject, Injectable } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateService } from "@ngx-translate/core";
import { constants } from "@shared";

@Injectable({
  providedIn: "root",
})
export class NoteInputsService {
  #translate = inject(TranslateService);
  getNoteSubjectField(data?: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: "subject",
      type: "input-field",
      expressions: data?.expressions,
      hide: data?.hide,
      focus: data?.focus,
      props: {
        required: true,
        label: data?.props?.label,
        placeholder: data?.props?.placeholder ?? _("enter_subject"),
        maxLength: constants.MAX_LENGTH_TEXT_INPUT,
        keypress: data?.props?.keypress,
        blur: data?.props?.blur,
      },
    };
  }

  getNoteDescField(data?: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: "description",
      type: "textarea-field",
      expressions: data?.expressions,
      hide: data?.hide,
      props: {
        label: data?.props?.label,
        placeholder: _("enter_description"),
        maxLength: constants.MAX_LENGTH_TEXTAREA,
        keypress: data?.props?.keypress,
        blur: data?.props?.blur,
      },
    };
  }
}
