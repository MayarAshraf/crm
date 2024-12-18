import { inject, Injectable } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { UsersInputsService } from "@modules/Users/services/users-inputs.service";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateService } from "@ngx-translate/core";
import { FieldBuilderService } from "@shared";
import { ImportsInputsService } from "./imports-inputs.service";
import { ImportsService } from "./imports.service";

@Injectable({
  providedIn: "root",
})
export class AssignmentRulesService {
  #fieldBuilder = inject(FieldBuilderService);
  #importsInputs = inject(ImportsInputsService);
  #usersInputs = inject(UsersInputsService);
  #importsService = inject(ImportsService);
  #translate = inject(TranslateService);

  getAssignmentRuleFields(): FormlyFieldConfig[] {
    return [
      {
        key: "id",
      },
      {
        key: "name",
        type: "input-field",
        props: {
          label: _("name"),
          placeholder: _("name"),
          required: true,
        },
      },
      this.#importsInputs.assignmentsRulesTypesField({
        key: "assignment_rule_type_id",
        props: {
          label: _("type"),
          multiple: false,
          required: true,
        },
      }),
      this.#usersInputs.usersSelectField({
        key: "users",
        props: {
          label: _("users"),
          multiple: true,
          required: true,
        },
      }),
      {
        template: `<h5 class="text-gray-500 mb-3 mt-0">${this.#translate.instant(
          _("options"),
        )}</h5>`,
      },
      this.#fieldBuilder.fieldBuilder([
        {
          key: "forcing_keep_me_there",
          type: "switch-field",
          props: {
            label: _("forcing_keep_me_there"),
          },
        },
        {
          key: "auto_hand_over",
          type: "switch-field",
          props: {
            label: _("auto_hand_over"),
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          key: "duration",
          type: "input-field",
          resetOnHide: false,
          expressions: {
            hide: "!model.auto_hand_over",
          },
          props: {
            type: "number",
            label: _("duration"),
            min: 1,
          },
        },
        {
          key: "duration_unit",
          type: "select-field",
          resetOnHide: false,
          expressions: {
            hide: "!model.auto_hand_over",
          },
          props: {
            label: _("duration_unit"),
            required: true,
            filter: true,
            options: this.#importsService.durationUnits,
          },
        },
      ]),
    ];
  }
}
