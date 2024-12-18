import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from "@angular/core";
import { AccountFieldsService } from "@modules/SocialAccounts/services/account-fields.service";
import { AccountModel, SocialAccount } from "@modules/SocialAccounts/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateModule } from "@ngx-translate/core";
import { BasePopupFormComponent, CachedListsService } from "@shared";

@Component({
  selector: "app-account-popup",
  standalone: true,
  template: `
    <app-base-popup-form
      [fields]="fields"
      [model]="model()"
      endpoint="social_accounts/social_accounts/store"
      (updateUi)="onAccountAdded.emit($event)"
    >
      <span class="block mb-3 text-primary">
        {{ "new_contact_method" | translate }}
        <span class="text-xs">({{ data()?.full_name }})</span>
      </span>
    </app-base-popup-form>
  `,
  imports: [BasePopupFormComponent, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPopupComponent {
  #accountFieldsService = inject(AccountFieldsService);
  #cachedLists = inject(CachedListsService);

  data = model.required<any>();
  accountableType = input<string>();
  onAccountAdded = output<SocialAccount>();

  model = computed(() => new AccountModel({ id: this.data().id, type: this.accountableType() }));
  fields: FormlyFieldConfig[] = [];

  ngOnInit() {
    this.#cachedLists.updateLists(["social_accounts:social_account_types"]);
    this.fields = this.#accountFieldsService.configureFields();
  }
}
