import { Injectable, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { ITEM_BI_UNIT } from "@modules/BrokerInventory/services/service-types";
import { InterestsInputsService } from "@modules/Interests/services/interests-inputs.service";
import { PipelinesFieldsService } from "@modules/Pipelines/services/pipeline-lists-inputs.service";
import { TagsInputsService } from "@modules/Tags/services/tags-lists-inputs.service";
import { UsersInputsService } from "@modules/Users/services/users-inputs.service";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { CacheService, CachedListsService, FieldBuilderService, constants } from "@shared";
import { map, switchMap, tap } from "rxjs";
import { OpportunityInputsService } from "./opportunity-inputs.service";

@Injectable({
  providedIn: "root",
})
export class OpportunityFieldsService {
  #interestsInputs = inject(InterestsInputsService);
  #tagsInputs = inject(TagsInputsService);
  #fieldBuilder = inject(FieldBuilderService);
  #usersInputs = inject(UsersInputsService);
  #cacheService = inject(CacheService);
  #cachedLists = inject(CachedListsService);
  #opportunityInputs = inject(OpportunityInputsService);
  #pipelinesFields = inject(PipelinesFieldsService);

  getInterestsField(className?: string): FormlyFieldConfig {
    return this.#interestsInputs.interestsSelectField({
      key: "interests",
      className,
      props: {
        label: _("interests"),
        placeholder: _("interests"),
        multiple: true,
      },
    });
  }

  getTagsField(className?: string): FormlyFieldConfig {
    return this.#tagsInputs.tagsSelectField({
      key: "tags",
      className,
      props: {
        label: _("tags"),
        placeholder: _("tags"),
        multiple: true,
      },
    });
  }

  getCloseDateField(forcShow = false, className?: string): FormlyFieldConfig {
    return {
      key: "close_date",
      type: "date-field",
      className,
      props: {
        label: _("closing_date_range"),
      },
      expressions: {
        hide: ({ model }) => !(model.close_date || forcShow),
      },
      hooks: {
        onInit: field => {
          const pipelineStageField = field.parent?.get?.("pipeline_stage_id");
          return pipelineStageField?.formControl?.valueChanges.pipe(
            switchMap(value => {
              return this.#cachedLists.getLists().pipe(
                map(o => o.get(`pipelines:pipeline_stages:id:${field.model.pipeline_id}`)),
                map(stages => {
                  return stages?.find((s: { value: number }) => s.value === value);
                }),
                tap((option: any) => {
                  if (!option) return;
                  field.hide = option.probability === 0 || option.probability === 100;
                }),
              );
            }),
          );
        },
      },
    };
  }

  getClosedAtField(forcShow = false, className?: string): FormlyFieldConfig {
    return {
      key: "closed_at",
      type: "date-field",
      className,
      expressions: {
        hide: ({ model }) => !(model.closed_at || forcShow),
      },
      hooks: {
        onInit: field => {
          const pipelineStageField = field.parent?.get?.("pipeline_stage_id");
          return pipelineStageField?.formControl?.valueChanges.pipe(
            switchMap(value => {
              return this.#cachedLists.getLists().pipe(
                map(o => o.get(`pipelines:pipeline_stages:id:${field.model.pipeline_id}`)),
                map(stages => {
                  return stages?.find((s: { value: number }) => s.value === value);
                }),
                tap((option: any) => {
                  if (!option) return;
                  field.hide = !(option.probability === 0 || option.probability === 100);
                  if (!field.props) return;
                  if (option.probability === 0) {
                    field.props.placeholder = "Lost At";
                    field.props.label = "Lost At 😡";
                    field.props.labelClass = "text-red-500";
                  } else if (option.probability === 100) {
                    field.props.placeholder = "Won At";
                    field.props.label = "Won At 😀";
                    field.props.labelClass = "text-green-500";
                  }
                }),
              );
            }),
          );
        },
      },
    };
  }

  configureFields(displayMode: "popup" | "dialog" = "dialog"): FormlyFieldConfig[] {
    return [
      {
        key: "opportunitable_type",
      },
      {
        key: "opportunitable_id",
      },
      this.#fieldBuilder.fieldBuilder([
        this.#opportunityInputs.getNameField(),
        this.#fieldBuilder.fieldBuilder(
          [
            this.#opportunityInputs.getAmountField({
              className: "input-group-field-lg",
              props: {
                required: true,
              },
            }),
            {
              key: "currency_code",
              type: "select-field",
              className: "input-group-field-sm",
              props: {
                required: true,
                filter: true,
                options: this.#cachedLists
                  .getLists()
                  .pipe(map(o => o.get(`marketing:currencies`) || [])),
                change(field, event) {
                  event.originalEvent.stopPropagation();
                },
              },
            },
          ],
          "input-group",
        ),
      ]),
      this.#fieldBuilder.fieldBuilder([
        this.#pipelinesFields.getPipelineField(
          {
            className: "col-12 md:col-6",
            props: {
              placeholder: _("pipeline"),
              label: _("pipeline"),
              required: true,
              filter: true,
            },
          },
          "pipelines:deal_pipelines",
        ),
        this.#pipelinesFields.getPipelineStageField({
          className: "col-12 md:col-6",
          props: {
            placeholder: _("pipeline_stage"),
            label: _("pipeline_statge"),
            required: true,
            filter: true,
          },
        }),
        this.getCloseDateField(false, "col-12 md:col-6"),
        this.getClosedAtField(false, "col-12 md:col-6"),
        this.#usersInputs.usersSelectField({
          key: "closed_by",
          className: "col-12 md:col-6",
          props: {
            placeholder: _("closed_by"),
          },
          hide: true,
          hooks: {
            onInit: field => {
              const pipelineStageField = field.parent?.get?.("pipeline_stage_id");

              return pipelineStageField?.formControl?.valueChanges.pipe(
                switchMap(value => {
                  return this.#cachedLists.getLists().pipe(
                    map(o => o.get(`pipelines:pipeline_stages:id:${field.model.pipeline_id}`)),
                    map(stages => {
                      return stages?.find((s: { value: number }) => s.value === value);
                    }),
                    tap((option: any) => {
                      if (!option) return;
                      field.hide = !(option.probability === 0 || option.probability === 100);

                      if (!field.props) return;
                      if (option.probability === 0) {
                        field.props.placeholder = "Lost By";
                        field.props.label = "Lost By 😡";
                        field.props.labelClass = "text-red-500";
                      } else if (option.probability === 100) {
                        field.props.placeholder = "Won By";
                        field.props.label = "Won By 😀";
                        field.props.labelClass = "text-green-500";
                      }
                    }),
                  );
                }),
              );
            },
          },
        }),
      ]),
      this.#opportunityInputs.getDescField(),
      this.#fieldBuilder.fieldBuilder([
        this.getInterestsField("col-12 md:col-6"),
        this.getTagsField("col-12 md:col-6"),
      ]),
      this.#usersInputs.usersSelectField({
        key: "assignees_ids",
        props: {
          label: _("assignees"),
          placeholder: _("assignees"),
          required: true,
          multiple: true,
        },
      }),
      this.#fieldBuilder.fieldBuilder([
        {
          key: "ui_toggler",
          type: "boolean-field",
          props: {
            label: _("select_broker"),
          },
        },
        {
          key: "ui_toggler_unit",
          type: "boolean-field",
          props: {
            label: _("on_unit"),
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          key: "broker_id",
          type: "select-field",
          resetOnHide: false,
          expressions: {
            hide: "!model.ui_toggler",
          },
          props: {
            placeholder: _("select_broker"),
            label: _("select_broker"),
            filter: true,
            options: this.#cachedLists.getLists().pipe(map(o => o.get(`brokers:brokers`) || [])),
            change(field, event) {
              event.originalEvent.stopPropagation();
            },
          },
        },
        {
          key: "broker_employee_ids",
          type: "select-field",
          resetOnHide: false,
          expressions: {
            hide: ({ model }) => !(model.ui_toggler && model.broker_id),
          },
          props: {
            placeholder: _("select_employees"),
            label: _("select_employees"),
            multiple: true,
            filter: true,
            showHeader: true,
            options: [],
            propValue: "id",
            optionLabel: "full_name",
          },
          hooks: {
            onInit: field => {
              const brokerField = field.parent?.get?.("broker_id")?.formControl;
              return brokerField?.valueChanges.pipe(
                switchMap(value => {
                  return this.#cacheService.getData(constants.API_ENDPOINTS.getBrokers, "get").pipe(
                    map(data => data.find((o: any) => o.id === value)),
                    tap(option => {
                      const options = option.employees;
                      field.props && (field.props.options = options);
                      field.hide = !(options && options.length);
                    }),
                  );
                }),
              );
            },
          },
        },
        {
          key: "commission",
          type: "input-field",
          resetOnHide: false,
          expressions: {
            hide: "!model.ui_toggler",
          },
          validation: {
            messages: {
              pattern: (error: any, field: FormlyFieldConfig) =>
                `"${field.formControl?.value}" seems to be invalid.`,
            },
          },
          props: {
            placeholder: "Commission",
            pattern: /^[0-9]+(\.[0-9][0-9]?)?$/,
          },
        },
      ]),
      {
        key: "bi_unit_info",
        type: "autocomplete-field",
        expressions: {
          hide: "!model.ui_toggler_unit",
        },
        props: {
          label: _("unit"),
          placeholder: _("unit-code_number_title"),
          entity: ITEM_BI_UNIT,
          fieldKey: "bi_unit_id",
        },
      },
      {
        key: "bi_unit_id",
      },
    ];
  }
}
