import { inject, Injectable } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: "root",
})
export class TagsFieldsService {
  #translate = inject(TranslateService);

  tagField(): FormlyFieldConfig {
    return {
      key: "tag",
      type: "input-field",
      props: {
        required: true,
        label: _("tag"),
        placeholder: _("tag"),
      },
    };
  }
}
