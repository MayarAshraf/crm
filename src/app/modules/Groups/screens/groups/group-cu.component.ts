import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { GroupsInputsService } from "@modules/Groups/services/groups-inputs.service";
import { GroupModel } from "@modules/Groups/services/service-types";
import { UsersInputsService } from "@modules/Users/services/users-inputs.service";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  CachedListsService,
  DynamicDialogComponent,
  FormComponent,
} from "@shared";
import { distinctUntilChanged, tap } from "rxjs";

@Component({
  selector: "app-group-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupCuComponent extends BaseCreateUpdateComponent<GroupModel> {
  #groupsInputs = inject(GroupsInputsService);
  #usersInputs = inject(UsersInputsService);
  #cachedLists = inject(CachedListsService);

  ngOnInit() {
    this.#cachedLists.updateLists(["assignments:users", "assignments:groups"]);

    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: "groups/store",
        update: "groups/update",
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_group")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = { id: this.editData.id, ...new GroupModel(this.editData) };
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_group")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
      this.model = new GroupModel();
    }
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      {
        key: "name",
        type: "input-field",
        props: {
          label: _("group"),
          placeholder: _("group"),
          required: true,
        },
      },
      this.#groupsInputs.groupsSelectField({
        key: "parent_id",
        props: {
          label: _("parent_group"),
          placeholder: _("select_parent_group"),
          required: true,
        },
      }),
      this.#usersInputs.usersSelectField({
        key: "users",
        props: {
          label: _("users"),
          placeholder: _("select_group_users"),
          multiple: true,
        },
        hooks: {}, // Used to Unset default AuthUser as selected User
      }),
      {
        key: "copy_permission_from",
        type: "radio-field",
        defaultValue: "none_option",
        props: {
          label: _("copy_permission_from"),
          required: true,
          options: [
            { value: "none_option", label: this.translate.instant(_("none")) },
            { value: "group_option", label: this.translate.instant(_("group")) },
            {
              value: "permissions_set_option",
              label: this.translate.instant(_("permissions_set")),
              disabled: true,
            },
          ],
        },
        hooks: {
          onInit: field => {
            return field.formControl?.valueChanges.pipe(
              distinctUntilChanged(),
              tap(value => {
                // const fieldGroups = field.parent?.fieldGroup;
                const fieldGroups = this.fields;

                const fieldsMap = {
                  permissions_group_id: fieldGroups?.find(f => f?.key === "permissions_group_id"),
                  permissions_set: fieldGroups?.find(f => f?.key === "permissions_set"),
                };

                if (fieldsMap.permissions_set && fieldsMap.permissions_group_id) {
                  fieldsMap.permissions_group_id.hide = value !== "group_option";
                  fieldsMap.permissions_set.hide = value !== "permissions_set_option";
                }
              }),
            );
          },
        },
      },
      {
        key: "permissions_set",
        type: "select-field",
        hide: true,
        props: {
          label: _("permissions_set"),
          placeholder: _("select_permissions_set"),
          options: [
            { value: "all", label: "All" },
            { value: "sales-admin", label: "Sales Admin" },
            { value: "sales-team-leader", label: "Sales Team Leader" },
            { value: "sales-agent", label: "Sales Agent" },
          ],
        },
      },
      this.#groupsInputs.groupsSelectField({
        key: "permissions_group_id",
        hide: true,
        props: {
          label: _("permissions_source"),
          placeholder: _("select_permissions_group"),
        },
      }),
    ];
  }
}
