import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from "@angular/core";
import { PhoneFieldsService } from "@modules/Phones/services/phone-fields.service";
import { Phone, PhoneModel } from "@modules/Phones/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateModule } from "@ngx-translate/core";
import { BasePopupFormComponent } from "@shared";

@Component({
  selector: "app-phone-popup",
  standalone: true,
  template: `
    <app-base-popup-form
      [fields]="fields"
      [model]="model()"
      endpoint="phones/store"
      (updateUi)="onPhoneAdded.emit($event)"
    >
      <span class="block mb-3 text-primary">
        {{ "new_phone" | translate }}
        @if (data()) {
          <span class="text-xs">({{ data()?.full_name }})</span>
        }
      </span>
    </app-base-popup-form>
  `,
  imports: [BasePopupFormComponent, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhonePopupComponent {
  #phoneFields = inject(PhoneFieldsService);

  data = model<any>();
  phonableId = input<number>();
  phonableType = input<string>();
  displayMode = input<"dialog" | "popup">("dialog");
  onPhoneAdded = output<Phone>();

  model = computed(
    () =>
      new PhoneModel({
        phonable_id: this.phonableId() || this.data().id,
        phonable_type: this.phonableType(),
      }),
  );
  fields: FormlyFieldConfig[] = [];

  ngOnInit() {
    this.fields = this.#phoneFields.getPhoneFields(this.displayMode());
  }
}
