import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  CachedListsService,
  DynamicDialogComponent,
  FormComponent,
} from "@shared";
import { ReferralModel } from "../services/service-type";

@Component({
  selector: "app-referral-cu",
  standalone: true,
  imports: [FormComponent, DynamicDialogComponent],
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferralCuComponent extends BaseCreateUpdateComponent<ReferralModel> {
  #cachedLists = inject(CachedListsService);

  ngOnInit(): void {
    this.#cachedLists.updateLists(["assignments:users"]);

    this.dialogMeta = {
      ...this.dialogMeta,
      createApiVersion: "v2",
      updateApiVersion: "v2",
      endpoints: {
        store: "referrals/referrals/store",
        update: "referrals/referrals/update",
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_referral")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = { id: this.editData.id, ...new ReferralModel(this.editData) };
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_referral")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
      this.model = new ReferralModel();
    }

    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      {
        key: "referral",
        type: "input-field",
        props: {
          required: true,
          label: _("name"),
        },
      },
      {
        key: "description",
        type: "textarea-field",
        props: {
          required: true,
          label: _("description"),
          rows: 4,
        },
      },
    ];
  }
}
