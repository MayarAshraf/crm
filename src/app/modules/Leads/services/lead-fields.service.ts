import { inject, Injectable } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { LeadListsInputsService } from "./lead-lists-inputs.service";

@Injectable({
  providedIn: "root",
})
export class LeadFieldsService {
  #leadListsInputs = inject(LeadListsInputsService);

  getIsColdCallsField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: "is_cold_calls",
      type: "switch-field",
      className: data?.className,
      expressions: data?.expressions,
      props: {
        label: _("cold_calls"),
        trueValue: "on",
        falseValue: "off",
      },
    };
  }

  getKeepMeThereField(): FormlyFieldConfig {
    return {
      key: "keep_me_there",
      type: "boolean-field",
      expressions: {
        hide: ({ model }) => model.assignment_rule !== "assignments_rules",
      },
      props: {
        label: _("keep_me_there"),
        trueValue: "on",
        falseValue: "off",
      },
    };
  }

  getChangeStageField(): FormlyFieldConfig {
    return {
      key: "change_stage",
      type: "boolean-field",
      props: {
        label: _("change_stage"),
        trueValue: 1,
        falseValue: 0,
      },
    };
  }

  getChangeRatingField(): FormlyFieldConfig {
    return {
      key: "change_rating",
      type: "boolean-field",
      props: {
        label: _("change_rating"),
        trueValue: 1,
        falseValue: 0,
      },
    };
  }

  getHideHistoryField(): FormlyFieldConfig {
    return {
      key: "hide_history",
      type: "boolean-field",
      props: {
        label: _("hide_history"),
        trueValue: 1,
        falseValue: 0,
      },
    };
  }

  getMarkOldTodosAsCompletedField(): FormlyFieldConfig {
    return {
      key: "mark_old_todos_as_completed",
      type: "boolean-field",
      props: {
        label: _("mark_old_todos_as_completed"),
        trueValue: "on",
        falseValue: "off",
      },
    };
  }

  getLeadStatusField(): FormlyFieldConfig {
    return this.#leadListsInputs.statusesSelectField({
      key: "status_id",
      expressions: {
        hide: "!model.change_stage",
      },
      props: {
        placeholder: _("select_stage"),
      },
    });
  }

  getLeadRatingField(): FormlyFieldConfig {
    return this.#leadListsInputs.ratingsSelectField({
      key: "rating_id",
      expressions: {
        hide: "!model.change_rating",
      },
      props: {
        placeholder: _("select_rating"),
      },
    });
  }
}
