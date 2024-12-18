import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { AutomationInputsService } from "@modules/Automation/services/automation-inputs.service";
import { RuleModel, RuleOption, RuleResponse } from "@modules/Automation/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  CacheService,
  DynamicDialogComponent,
  FieldBuilderService,
  FormComponent,
  FormlyDynamicInput,
  constants,
} from "@shared";
import { distinctUntilChanged, map, merge, startWith, switchMap, tap } from "rxjs";

@Component({
  selector: "app-rule-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutomationRuleCuComponent extends BaseCreateUpdateComponent<RuleModel> {
  #automationInputs = inject(AutomationInputsService);
  #cacheService = inject(CacheService);
  #fieldBuilder = inject(FieldBuilderService);

  #ruleListsEndpoint = constants.API_ENDPOINTS.getRuleLists;

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      dialogData$: this.#cacheService.getData(this.#ruleListsEndpoint),
      endpoints: {
        store: "automation/rules/store",
        update: "automation/rules/update",
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_rule")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = { id: this.editData.id, ...new RuleModel(this.editData) };
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_rule")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
      this.model = new RuleModel();
    }
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        {
          key: "name",
          type: "input-field",
          className: "col-12 md:col-6",
          props: {
            label: _("rule"),
            placeholder: _("Rule Name"),
            required: true,
          },
        },
      ]),
      {
        key: "apply_type",
        type: "radio-field",
        props: {
          label: _("apply_type"),
          required: true,
          options: [
            { value: "all", label: this.translate.instant(_("all")) },
            { value: "any", label: this.translate.instant(_("any")), disabled: true },
          ],
        },
      },
      {
        key: "conditions",
        type: "repeat-field",
        props: {
          addBtnText: this.translate.instant(_("add_condition")),
          disabledRepeater: false,
        },
        fieldArray: this.#fieldBuilder.fieldBuilder(
          [
            this.#automationInputs.conditionsSelectField({
              key: "name",
            }),
            {
              key: "operator",
              type: "select-field",
              expressions: {
                "props.disabled": field => {
                  const nameControl = field.parent?.get?.("name")?.formControl;
                  return nameControl?.value ? false : true;
                },
              },
              props: {
                required: true,
                label: _("operator"),
                placeholder: _("choose_operator"),
                filter: true,
                showHeader: true,
                options: [],
                isFirstPollution: this.editData ? true : false,
              },
              hooks: {
                onInit: field => {
                  return this.#getRuleListsData(field, "conditions", selectedCondition => {
                    const operators = selectedCondition?.operators;
                    if (!field.props) return;
                    field.props.options = operators;
                    if (operators?.length === 1) {
                      field.formControl?.setValue(operators[0]?.value);
                    } else {
                      !field.props.isFirstPollution && field.formControl?.setValue(null);
                      field.props.isFirstPollution && (field.props.isFirstPollution = false);
                    }
                  });
                },
              },
            },
            {
              type: FormlyDynamicInput,
              fieldGroup: [
                {
                  key: "value",
                  type: "select-field",
                  expressions: {
                    type: field => {
                      const operatorControl = field.parent?.parent?.get?.("operator").formControl;

                      let fieldType = "select-field";

                      this.#getRuleListsData(field, "conditions", selectedCondition => {
                        const selectedConditionType = selectedCondition?.value_type;

                        const selectedOperator = selectedCondition?.operators?.find(
                          o => o.value === operatorControl?.value,
                        );

                        if (
                          selectedConditionType === "text" ||
                          selectedConditionType === "number"
                        ) {
                          fieldType = "input-field";
                          field.props && (field.props.type = selectedConditionType);
                        }

                        if (selectedConditionType === "select") {
                          if (!selectedOperator?.multiple) {
                            fieldType = "ng-select-field";
                            field.props &&
                              selectedOperator &&
                              (field.props.multiple = selectedOperator.multiple);
                          }

                          if (selectedOperator?.multiple) {
                            fieldType = "select-field";
                            field.props &&
                              selectedOperator &&
                              (field.props.multiple = selectedOperator.multiple);
                          }
                        }
                      })
                        ?.pipe(takeUntilDestroyed(this.destroyRef))
                        ?.subscribe();

                      return fieldType;
                    },
                    "props.disabled": field => {
                      const operatorControl = field.parent?.parent?.get?.("operator")?.formControl;
                      return operatorControl?.value ? false : true;
                    },
                  },
                  props: {
                    required: true,
                    label: _("value"),
                    placeholder: _("value"),
                    filter: true,
                    showHeader: true,
                    options: [],
                    isFirstPollution: this.editData ? true : false,
                  },
                  hooks: {
                    onInit: field => {
                      const operatorControl = field.parent?.parent?.get?.("operator")?.formControl;
                      let fieldType = "select-field";

                      const nameChange$ = this.#getRuleListsData(
                        field,
                        "conditions",
                        selectedCondition => {
                          field.props && (field.props.description = selectedCondition?.description);
                          field.props && (field.props.options = selectedCondition?.value_options);
                        },
                      );

                      const operatorChange$ = operatorControl?.valueChanges.pipe(
                        startWith(operatorControl?.value),
                        distinctUntilChanged(),
                        tap(() => {
                          if (!field.props) return;
                          if (field.type === fieldType) {
                            field.props &&
                              !field.props.isFirstPollution &&
                              field.formControl?.setValue(null);
                            field.props &&
                              field.props.isFirstPollution &&
                              (field.props.isFirstPollution = false);
                          } else {
                            fieldType = field.type as string;
                          }
                        }),
                      );

                      return merge(...[nameChange$, operatorChange$].filter(Boolean)); // This will filter out any undefined values before merging the observables.
                    },
                  },
                },
              ],
            },
          ],
          "formgrid grid align-items-start",
        ),
      },
      {
        key: "actions",
        type: "repeat-field",
        props: {
          addBtnText: this.translate.instant(_("add_action")),
          disabledRepeater: false,
        },
        fieldArray: this.#fieldBuilder.fieldBuilder(
          [
            this.#automationInputs.actionsSelectField({
              key: "name",
              className: "col-12 md:col-6",
            }),
            {
              type: FormlyDynamicInput,
              fieldGroup: [
                {
                  key: "value",
                  type: "select-field",
                  expressions: {
                    type: field => {
                      let fieldType = "select-field";

                      this.#getRuleListsData(field, "actions", selectedAction => {
                        const selectedActionType = selectedAction?.value_type;

                        if (selectedActionType === "text" || selectedActionType === "number") {
                          fieldType = "input-field";
                          field.props && (field.props.type = selectedActionType);
                        }

                        if (selectedActionType === "select") {
                          fieldType = "select-field";
                        }
                      })
                        ?.pipe(takeUntilDestroyed(this.destroyRef))
                        ?.subscribe();

                      return fieldType;
                    },
                    "props.disabled": field => {
                      const nameControl = field.parent?.parent?.get?.("name")?.formControl;
                      return nameControl?.value ? false : true;
                    },
                  },
                  props: {
                    required: true,
                    label: _("value"),
                    placeholder: _("value"),
                    filter: true,
                    showHeader: true,
                    options: [],
                    isFirstPollution: this.editData ? true : false,
                  },
                  hooks: {
                    onInit: field => {
                      return this.#getRuleListsData(field, "actions", selectedAction => {
                        if (!field.props) return;
                        field.props.description = selectedAction?.description;
                        field.props.options = selectedAction?.value_options;

                        !field.props.isFirstPollution && field.formControl?.setValue(null);
                        field.props.isFirstPollution && (field.props.isFirstPollution = false);
                      });
                    },
                  },
                },
              ],
            },
          ],
          "formgrid grid align-items-start",
        ),
      },
      {
        key: "is_active",
        type: "switch-field",
        props: {
          label: _("enabled"),
        },
      },
    ];
  }

  #getRuleListsData(
    field: FormlyFieldConfig,
    key: "conditions" | "actions",
    handleResponse: (selectedOption: RuleOption) => void,
  ) {
    const nameControl =
      field.parent?.parent?.get?.("name")?.formControl || field.parent?.get?.("name")?.formControl;

    return nameControl?.valueChanges.pipe(
      startWith(nameControl?.value),
      distinctUntilChanged(),
      switchMap(value =>
        this.#cacheService.getData(this.#ruleListsEndpoint).pipe(
          map((data: RuleResponse) => data[key].find(item => item.value === value)),
          tap(selectedOption => selectedOption && handleResponse(selectedOption)),
        ),
      ),
    );
  }
}
