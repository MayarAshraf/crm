import { inject, Injectable } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { GroupsInputsService } from "@modules/Groups/services/groups-inputs.service";
import { InterestsInputsService } from "@modules/Interests/services/interests-inputs.service";
import { TagsInputsService } from "@modules/Tags/services/tags-lists-inputs.service";
import { UsersInputsService } from "@modules/Users/services/users-inputs.service";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { CachedListsService, constants, FieldBuilderService, PermissionsService } from "@shared";
import { map, tap } from "rxjs";
import { ImportsService } from "./imports.service";

@Injectable({
  providedIn: "root",
})
export class ImportsInputsService {
  #importsService = inject(ImportsService);
  #cachedLists = inject(CachedListsService);
  #interestsInputs = inject(InterestsInputsService);
  #tagsInputs = inject(TagsInputsService);
  #usersInputs = inject(UsersInputsService);
  #groupsInputs = inject(GroupsInputsService);
  #fieldBuilder = inject(FieldBuilderService);
  #userPermissions = inject(PermissionsService);

  havePermissionsToAssign = this.#userPermissions.hasAnyPermissions([
    constants.permissions["assign-to-assignment-rule"],
    constants.permissions["assign-to-users"],
    constants.permissions["assign-to-groups"],
  ]);

  hasAssignToAssignmentRule = this.#userPermissions.hasPermission(
    constants.permissions["assign-to-assignment-rule"],
  );

  hasAssignToUsers = this.#userPermissions.hasPermission(constants.permissions["assign-to-users"]);

  hasAssignToGroups = this.#userPermissions.hasPermission(
    constants.permissions["assign-to-groups"],
  );

  assignmentsRulesTypesField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data.key,
      type: "select-field",
      className: data?.className,
      hide: data.hide,
      props: {
        label: data?.props?.label ? data?.props?.label : _("assignment_rule_type"),
        placeholder: data?.props?.placeholder,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        options: this.#cachedLists
          .getLists()
          .pipe(map(o => o.get(`assignments:assignments_rules_types`) || [])),
        change(field, event) {
          field.props && !field.props.multiple && event.originalEvent.stopPropagation();
        },
      },
    };
  }

  sssignmentsMethodsField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data?.key,
      type: "select-field",
      className: data?.className,
      hide: data.hide,
      expressions: data?.expressions,
      props: {
        label: data?.props?.label ? data?.props?.label : _("assignment_type"),
        placeholder: data?.props?.placeholder,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        showClear: data?.props?.showClear,
        options: this.#cachedLists.getLists().pipe(
          map(o => o.get(data?.props?.optionsListKey) || []),
          map((options: any[]) => {
            return options.filter(option => {
              const permissions: { [key: string]: string } = {
                assignments_rules: constants.permissions["assign-to-assignment-rule"],
                users: constants.permissions["assign-to-users"],
                groups: constants.permissions["assign-to-groups"],
              };

              const requiredPermission = permissions[option.value];

              if (requiredPermission) {
                return this.#userPermissions.hasPermission(requiredPermission);
              }
              return true;
            });
          }),
        ),
        change(field, event) {
          field.props && !field.props.multiple && event.originalEvent.stopPropagation();
        },
      },
      hooks: data?.hooks,
    };
  }

  assignmentRulesField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data?.key,
      type: "select-field",
      className: data?.className,
      hide: data.hide,
      expressions: data?.expressions,
      props: {
        label: data?.props?.label ? data?.props?.label : "Assignment Rules",
        placeholder: data?.props?.placeholder,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        options: this.#cachedLists
          .getLists()
          .pipe(map(o => o.get(`assignments:assignments_rules`) || [])),
        change(field, event) {
          field.props && !field.props.multiple && event.originalEvent.stopPropagation();
        },
      },
    };
  }

  getAssignToField(
    options: {
      optionsListKey?: string;
      isPopupDisplay?: boolean;
      assignmentTypeKey?: string;
      assignmentRuleKey?: string;
      usersKey?: string;
      groupsKey?: string;
    } = {},
  ): FormlyFieldConfig[] {
    const {
      optionsListKey = "assignments:leads_assignments_methods",
      isPopupDisplay = false,
      assignmentTypeKey = "assignment_rule",
      assignmentRuleKey = "assignment_rule_id",
      usersKey = "users",
      groupsKey = "groups",
    } = options;

    return [
      this.#fieldBuilder.fieldBuilder([
        this.sssignmentsMethodsField({
          key: assignmentTypeKey,
          className: isPopupDisplay ? "col-12" : "col-12 md:col-6",
          expressions: {
            hide: () => !this.havePermissionsToAssign,
          },
          props: {
            optionsListKey,
          },
          hooks: {
            onInit: field => {
              let assignmentRuleValue = null;

              if (
                this.hasAssignToGroups &&
                !this.hasAssignToUsers &&
                !this.hasAssignToAssignmentRule
              ) {
                assignmentRuleValue = "groups";
              } else if (
                this.hasAssignToAssignmentRule &&
                !this.hasAssignToUsers &&
                !this.hasAssignToGroups
              ) {
                assignmentRuleValue = "assignments_rules";
              } else if (this.hasAssignToUsers || !this.havePermissionsToAssign) {
                assignmentRuleValue = "users";
              }

              field.formControl?.setValue(assignmentRuleValue);
            },
          },
        }),

        this.assignmentRulesField({
          key: assignmentRuleKey,
          className: isPopupDisplay ? "col-12" : "col-12 md:col-6",
          expressions: {
            hide: ({ model }) =>
              !this.hasAssignToAssignmentRule ||
              model[assignmentTypeKey as string] !== "assignments_rules",
          },
          props: {
            placeholder: _("assignment_rules"),
            multiple: false,
          },
        }),

        this.#usersInputs.usersSelectField({
          key: usersKey,
          className: isPopupDisplay ? "col-12" : "col-12 md:col-6",
          expressions: {
            hide: ({ model }) =>
              !this.hasAssignToUsers || model[assignmentTypeKey as string] !== "users",
          },
          props: {
            required: true,
            label: _("users"),
            multiple: true,
          },
        }),

        this.#groupsInputs.groupsSelectField({
          key: groupsKey,
          expressions: {
            hide: ({ model }) =>
              !this.hasAssignToGroups || model[assignmentTypeKey as string] !== "groups",
          },
          className: isPopupDisplay ? "col-12" : "col-12 md:col-6",
          props: {
            required: true,
            label: _("groups"),
            multiple: true,
          },
        }),
      ]),
    ];
  }

  fblgiIdentifierTypesSelectField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data?.key,
      type: "select-field",
      className: data?.className,
      hide: data.hide,
      props: {
        label: data?.props?.label ? data?.props?.label : "Identifier Type",
        placeholder: data?.props?.placeholder,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        options: this.#importsService.fblgiIdentifierTypes,
        change(field, event) {
          field.props && !field.props.multiple && event.originalEvent.stopPropagation();
        },
      },
    };
  }

  leadInterestsTagsFieldsGroup(): FormlyFieldConfig[] {
    return [
      {
        type: "boolean-field",
        props: {
          label: _("lead_interests_tags"),
        },
        hooks: {
          onInit: field => {
            return field.formControl?.valueChanges.pipe(
              tap(value => {
                const interestsField = field.parent?.get?.("interests_ids");
                const tagsField = field.parent?.get?.("tags_ids");
                interestsField && (interestsField.hide = !value);
                tagsField && (tagsField.hide = !value);
              }),
            );
          },
        },
      },
      this.#interestsInputs.interestsSelectField({
        key: "interests_ids",
        hide: true,
        props: {
          label: _("interests"),
          placeholder: _("select_interests"),
          multiple: true,
        },
      }),
      this.#tagsInputs.tagsSelectField({
        key: "tags_ids",
        hide: true,
        props: {
          label: _("tags"),
          placeholder: _("select_tags"),
          multiple: true,
        },
      }),
    ];
  }

  getFileTypeField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data?.key ?? "file_type",
      type: "select-field",
      hide: data.hide,
      expressions: data.expressions,
      className: data?.className,
      props: {
        required: data?.props?.required,
        label: _("file_type"),
        options: this.#cachedLists
          .getLists()
          .pipe(map(o => o.get("imports:import_file_types") || [])),
      },
      hooks: data.hooks,
    };
  }
}
