import { inject, Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { CachedListsService, FieldBuilderService } from "@shared";
import { PhoneNumberUtil } from "google-libphonenumber";
import { map, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PhoneFieldsService {
  #fieldBuilder = inject(FieldBuilderService);
  #cachedLists = inject(CachedListsService);

  getCountryCodesField(data: FormlyFieldConfig = {}): FormlyFieldConfig {
    return {
      key: "country_codes",
      type: "select-field",
      className: data?.className,
      props: {
        multiple: true,
        required: data?.props?.required,
        label: _("country_codes"),
        filter: true,
        options: this.#cachedLists
          .getLists()
          .pipe(map(o => o.get("internationalizations:countries_codes") || [])),
      },
    };
  }

  getCountryCodeField(
    displayMode: "popup" | "dialog" = "dialog",
    data: FormlyFieldConfig = {},
  ): FormlyFieldConfig {
    return {
      key: "country_code",
      type: "select-field",
      className: displayMode === "popup" ? "col-12" : "",
      props: {
        placeholder: _("country_code"),
        label: _("country_code"),
        required: data.props?.required ?? true,
        filter: true,
        options: this.#cachedLists
          .getLists()
          .pipe(map(o => o.get("internationalizations:countries_codes") || [])),
        change(field, event) {
          event.originalEvent.stopPropagation();
        },
      },
    };
  }

  getPhoneField(
    displayMode: "popup" | "dialog" = "dialog",
    data: FormlyFieldConfig = {},
  ): FormlyFieldConfig {
    return {
      key: "phone",
      type: "input-field",
      className: displayMode === "popup" ? "col-12" : "",
      validators: {
        phone: {
          expression: (control: AbstractControl, field: FormlyFieldConfig) =>
            this.phoneValidator(control, field),
          message: (error: any, field: FormlyFieldConfig) =>
            `"${field.formControl?.value}" is not a valid phone number for the selected country.`,
        },
      },
      hooks: {
        onInit: field => {
          const countryCodeControl = field.form?.get("country_code");

          return countryCodeControl?.valueChanges.pipe(
            tap(() => field.formControl?.updateValueAndValidity()),
          );
        },
      },
      props: {
        required: data.props?.required ?? true,
        label: _("mobile_number"),
      },
    };
  }

  phoneValidator(control: AbstractControl, field: FormlyFieldConfig) {
    const countryCodeControl = field.form?.get("country_code");
    if (!countryCodeControl) return true;

    const countryCode = countryCodeControl.value;
    const phoneNumber = control.value;

    if (!countryCode || !phoneNumber) return true;

    const phoneUtil = PhoneNumberUtil.getInstance();
    try {
      const number = phoneUtil.parse(phoneNumber, countryCode.toUpperCase());
      const isValid = phoneUtil.isValidNumberForRegion(number, countryCode.toUpperCase());
      return isValid;
    } catch (e) {
      return false;
    }
  }

  getWhatsappField(): FormlyFieldConfig {
    return {
      key: "has_whatsapp",
      type: "boolean-field",
      props: {
        label: _("has_whatsapp"),
      },
    };
  }

  getPhoneFields(displayMode: "popup" | "dialog" = "dialog"): FormlyFieldConfig[] {
    return [
      {
        key: "phonable_type",
      },
      {
        key: "phonable_id",
      },
      this.#fieldBuilder.fieldBuilder([
        this.getCountryCodeField(displayMode),
        this.getPhoneField(displayMode),
      ]),
      this.getWhatsappField(),
    ];
  }
}
