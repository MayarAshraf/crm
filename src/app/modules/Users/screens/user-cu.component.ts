import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { GroupsInputsService } from "@modules/Groups/services/groups-inputs.service";
import { UserModel } from "@modules/Users/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateModule } from "@ngx-translate/core";
import {
  AuthService,
  BaseCreateUpdateComponent,
  CachedListsService,
  DynamicDialogComponent,
  FieldBuilderService,
  FormComponent,
  User,
} from "@shared";
import { map } from "rxjs";

@Component({
  selector: "app-user-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCuComponent extends BaseCreateUpdateComponent<any> {
  #groupsInputs = inject(GroupsInputsService);
  #fieldBuilder = inject(FieldBuilderService);
  #cachedLists = inject(CachedListsService);
  #authService = inject(AuthService);

  isUpdateProfile = false;
  isSingleUploading = signal(false);

  get authedUserModel() {
    return {
      id: this.#authService.currentUser()?.id,
      full_name: this.#authService.currentUser()?.full_name,
      job_title: this.#authService.currentUser()?.job_title,
      email: this.#authService.currentUser()?.email,
      mobile_number: this.#authService.currentUser()?.mobile_number,
      username: this.#authService.currentUser()?.username,
      gender: this.#authService.currentUser()?.gender === "Male" ? 1 : 2,
      birthdate: this.#authService.currentUser()?.birthdate,
      image: this.#authService.currentUser()?.image,
    };
  }

  ngOnInit() {
    this.isDisabled = computed(() => this.isSingleUploading());

    this.#cachedLists.updateLists(["assignments:groups", "users:time_zones"]);
    this.dialogMeta = {
      ...this.dialogMeta,
      showDialogHeader: !this.isUpdateProfile,
      endpoints: {
        store: "users/store",
        update: "users/update",
      },
    };

    if (this.editData && !this.isUpdateProfile) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_user")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = {
        ...new UserModel(this.editData),
        id: this.editData.id,
      };
    } else if (this.editData && this.isUpdateProfile) {
      this.dialogMeta = {
        ...this.dialogMeta,
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = this.authedUserModel;
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_user")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
      this.model = new UserModel();
    }
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        {
          key: "full_name",
          type: "input-field",
          props: {
            label: _("full_name"),
            placeholder: _("full_name"),
            required: true,
          },
        },
        {
          key: "job_title",
          type: "input-field",
          props: {
            label: _("job_title"),
            placeholder: _("job_title"),
            required: true,
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          key: "email",
          type: "input-field",
          props: {
            label: _("email"),
            placeholder: _("email"),
            required: true,
          },
        },
        {
          key: "username",
          type: "input-field",
          props: {
            label: _("username"),
            placeholder: _("username"),
            required: true,
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          hide: this.isUpdateProfile,
          validators: {
            validation: [{ name: "fieldMatch", options: { errorPath: "password_confirmation" } }],
          },
          fieldGroup: [
            this.#fieldBuilder.fieldBuilder([
              {
                key: "password",
                type: "password-field",
                expressions: {
                  "props.required": "!model.id",
                },
                props: {
                  placeholder: _("password"),
                  toggleMask: true,
                },
              },
              {
                key: "password_confirmation",
                type: "password-field",
                expressions: {
                  "props.required": "!model.id",
                },
                props: {
                  placeholder: _("password_confirmation"),
                  toggleMask: true,
                },
              },
            ]),
          ],
        },
      ]),
      this.#fieldBuilder.fieldBuilder([
        this.#groupsInputs.groupsSelectField({
          key: "group_id",
          className: "col-12 md:col-6",
          hide: this.isUpdateProfile,
          props: {
            label: _("group"),
            placeholder: _("select_group"),
            required: true,
          },
        }),
        {
          key: "timezone",
          type: "select-field",
          hide: this.isUpdateProfile,
          props: {
            label: _("timezone"),
            placeholder: _("select_timezone"),
            required: true,
            filter: true,
            options: this.#cachedLists.getLists().pipe(map(o => o.get(`users:time_zones`) || [])),
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          key: "mobile_number",
          type: "input-field",
          props: {
            type: "number",
            label: _("mobile_number"),
            required: true,
          },
        },
        {
          key: "birthdate",
          type: "date-field",
          props: {
            label: _("birthdate"),
            maxDate: new Date(),
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          key: "gender",
          type: "radio-field",
          className: "col-12 md:col-6",
          props: {
            label: _("gender"),
            required: true,
            options: [
              { value: 1, label: this.translate.instant(_("male")) },
              { value: 2, label: this.translate.instant(_("female")) },
            ],
          },
        },
      ]),
      {
        key: "image",
        type: "file-field",
        props: {
          label: _("image"),
          mode: this.editData ? "update" : "store",
          isUploading: this.isSingleUploading,
        },
      },
      {
        template: `<h5 class="text-gray-500">${this.translate.instant(_("options"))}</h5>`,
        hide: this.isUpdateProfile,
      },
      this.#fieldBuilder.fieldBuilder([
        {
          key: "in_gamification",
          type: "boolean-field",
          hide: this.isUpdateProfile,
          props: {
            label: _("in_gamification"),
          },
        },
        {
          key: "in_activities",
          type: "boolean-field",
          hide: this.isUpdateProfile,
          props: {
            label: _("in_activities_reports"),
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          key: "in_events",
          type: "boolean-field",
          hide: this.isUpdateProfile,
          props: {
            label: _("in_events_reports"),
          },
        },
        {
          key: "in_opportunities",
          type: "boolean-field",
          hide: this.isUpdateProfile,
          props: {
            label: _("in_opportunities_reports"),
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          key: "allow_anonymous_call_logs",
          type: "boolean-field",
          hide: this.isUpdateProfile,
          props: {
            label: _("allow_anonymous_call_logs"),
          },
        },
      ]),
    ];
  }

  protected override updateUi(user: User): void {
    this.#authService.updateCurrentUser(user);
  }
}
