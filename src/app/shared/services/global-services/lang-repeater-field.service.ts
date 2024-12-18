import { Injectable, inject } from "@angular/core";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { startWith, tap } from "rxjs";
import { FieldBuilderService } from "../forms/field-builder.service";
import { StaticDataService } from "./static-data.service";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { TranslateService } from "@ngx-translate/core";


@Injectable({
  providedIn: "root",
})
export class LangRepeaterFieldService {
  #staticDataService = inject(StaticDataService);
  #fieldBuilder = inject(FieldBuilderService);
  #translate = inject(TranslateService);

  getlangRepeaterField(fields: FormlyFieldConfig[] = []): FormlyFieldConfig {
    return {
      key: "translations",
      type: "repeat-field",
      props: {
        addBtnText: this.#translate.instant(_("add_translation")),
        disabledRepeater: false,
      },
      hooks: {
        onInit: (field: FormlyFieldConfig) => {
          return field.formControl?.valueChanges.pipe(
            startWith(field.model),
            tap(langs => {
              if (!field.props) return;
              if (langs.length === this.#staticDataService.languages.length) {
                return (field.props.disabledRepeater = true);
              } else {
                return (field.props.disabledRepeater = false);
              }
            }),
          );
        },
      },
      fieldArray: this.#fieldBuilder.fieldBuilder([
        {
          key: "language_id",
          type: "select-field",
          props: {
            required: true,
            label: _("languages"),
            options: this.#staticDataService.languages,
          },
        },
        ...fields,
      ]),
    };
  }
}
