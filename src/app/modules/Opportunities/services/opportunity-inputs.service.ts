import { Injectable } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { constants } from "@shared";

@Injectable({ providedIn: "root" })
export class OpportunityInputsService {
  getNameField(data?: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: "name",
      type: "input-field",
      expressions: data?.expressions,
      props: {
        label: _("name"),
        placeholder: _("name"),
        required: true,
        maxLength: constants.MAX_LENGTH_TEXT_INPUT,
        keypress: data?.props?.keypress,
        blur: data?.props?.blur,
      },
    };
  }

  getAmountField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: "amount",
      type: "number-field",
      className: data?.className,
      expressions: data.expressions,
      hide: data.hide,
      props: {
        placeholder: _("amount"),
        required: data.props?.required,
        focused: data.props?.focused,
        onKeyDown: data.props?.onKeyDown,
        onBlur: data.props?.onBlur,
      },
      hooks: data.hooks,
    };
  }

  getDescField(data?: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: "description",
      type: "textarea-field",
      expressions: data?.expressions,
      props: {
        label: _("description"),
        placeholder: _("description"),
        maxLength: constants.MAX_LENGTH_TEXTAREA,
        keypress: data?.props?.keypress,
        blur: data?.props?.blur,
      },
    };
  }
}
