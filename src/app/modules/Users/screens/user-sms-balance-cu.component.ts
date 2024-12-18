import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { UserSmsBalanceModel } from "@modules/Users/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  CacheService,
  DynamicDialogComponent,
  FieldBuilderService,
  FormComponent,
  StaticDataService,
  constants,
} from "@shared";
import { map } from "rxjs";

@Component({
  selector: "app-user-sms-balance-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSMSBalanceCuComponent extends BaseCreateUpdateComponent<UserSmsBalanceModel> {
  #fieldBuilder = inject(FieldBuilderService);
  #staticData = inject(StaticDataService);
  #cacheService = inject(CacheService);

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      dialogSubtitle: this.editData.full_name,
      endpoints: {
        update: "users/update-user-sms-balance",
      },
      dialogTitle: this.translate.instant(_("update_user_sms_balance")),
      submitButtonLabel: this.translate.instant(_("transfer_the_amount")),
    };

    this.model = new UserSmsBalanceModel(this.editData);
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        {
          key: "operation_type",
          type: "select-field",
          props: {
            placeholder: _("operation_type"),
            required: true,
            filter: true,
            options: this.#staticData.operationType,
          },
        },
        {
          key: "sms_balance_sheet_id",
          type: "select-field",
          props: {
            placeholder: _("sms_balance_sheet"),
            required: true,
            filter: true,
            options: this.#cacheService
              .getData(`${constants.API_ENDPOINTS.listBalanceSheet}/${this.editData.id}`, "get")
              .pipe(map(({ sms_balance_sheets }) => sms_balance_sheets)),
            optionValue: "id",
            optionLabel: "sms_balance",
          },
        },
      ]),
      {
        key: "amount",
        type: "input-field",
        props: {
          type: "number",
          placeholder: _("amount"),
          label: _("amount"),
          required: true,
        },
      },
    ];
  }
}
