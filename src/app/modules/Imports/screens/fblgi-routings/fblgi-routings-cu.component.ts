import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { ImportsInputsService } from "@modules/Imports/services/imports-inputs.service";
import { MarketingInputsService } from "@modules/Marketing/services/marketing-inputs.service";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  CachedListsService,
  DynamicDialogComponent,
  FormComponent,
} from "@shared";

@Component({
  selector: "fblgi-routings-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FblgiRoutingCuComponent extends BaseCreateUpdateComponent<any> {
  #marketingInputs = inject(MarketingInputsService);
  #importsInputs = inject(ImportsInputsService);
  #cachedLists = inject(CachedListsService);

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: "lead_generation/fblgi_routings/store",
        update: "lead_generation/fblgi_routings/update",
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_web_form_routing")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = this.editData;
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_web_form_routing")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
      this.model = {
        fqdn: null,
        form_id: null,
        identifier_type: "page_id",
        assignment_rule: "users",
      };
    }
    this.#cachedLists.updateLists([
      "interests:interests",
      "tags:tags",
      "marketing:campaigns",
      "marketing:campaign_statuses",
      "assignments:leads_assignments_methods",
      "assignments:assignments_rules",
      "assignments:users",
      "assignments:groups",
    ]);
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      this.#importsInputs.fblgiIdentifierTypesSelectField({
        key: "identifier_type",
      }),
      {
        key: "identifier_id",
        type: "input-field",
        props: {
          label: _("identifier_id"),
          required: true,
        },
      },
      ...this.#importsInputs.getAssignToField({ usersKey: "users_ids", groupsKey: "groups_ids" }),
      ...this.#importsInputs.leadInterestsTagsFieldsGroup(),
      ...this.#marketingInputs.setCampaignDetailsFieldsGroup(),
    ];
  }
}
