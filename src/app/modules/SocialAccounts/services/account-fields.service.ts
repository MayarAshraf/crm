import { inject, Injectable } from "@angular/core";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { CachedListsService, constants, FieldBuilderService } from "@shared";
import { map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AccountFieldsService {
  #fieldBuilder = inject(FieldBuilderService);
  #cachedLists = inject(CachedListsService);

  getAccountTypeField(isRequired = true): FormlyFieldConfig {
    return {
      key: "account_type_id",
      type: "select-field",
      props: {
        required: isRequired,
        filter: true,
        label: _("account_type"),
        placeholder: _("select_account_type"),
        options: this.#cachedLists
          .getLists()
          .pipe(map(o => o.get(`social_accounts:social_account_types`) || [])),
        change(field, event) {
          event.originalEvent.stopPropagation();
        },
      },
    };
  }

  getSocialAccountField(isRequired = true): FormlyFieldConfig {
    return {
      key: "social_account",
      type: "input-field",
      props: {
        required: isRequired,
        maxLength: constants.MAX_LENGTH_TEXT_INPUT,
        label: _("contact_method"),
      },
    };
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      {
        key: "accountable_type",
      },
      {
        key: "accountable_id",
      },
      this.#fieldBuilder.fieldBuilder([this.getAccountTypeField(), this.getSocialAccountField()]),
    ];
  }
}
