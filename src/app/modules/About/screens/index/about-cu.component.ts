import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { AboutFieldsService } from "@modules/About/services/about-lists-inputs.service";
import { AboutModel } from "@modules/About/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  CachedListsService,
  DynamicDialogComponent,
  FormComponent,
  LangRepeaterFieldService,
} from "@shared";

@Component({
  selector: "app-about-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutCuComponent extends BaseCreateUpdateComponent<AboutModel> {
  #AboutFields = inject(AboutFieldsService);
  #getlangRepeaterField = inject(LangRepeaterFieldService);
  #cachedLists = inject(CachedListsService);

  ngOnInit() {
    this.#cachedLists.updateLists(["about:about_types"]);

    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: "about/about-sections/store",
        update: "about/about-sections/update",
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_about_section")),
        submitButtonLabel: this.translate.instant(_("update_about_section")),
      };
      this.model = new AboutModel(this.editData);
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_about_section")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
      this.model = new AboutModel();
    }
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      this.#AboutFields.AboutSectionSelectField({
        key: "about_section_type_id",
        props: {
          label: _("type"),
          required: true,
        },
      }),
      this.#getlangRepeaterField.getlangRepeaterField([
        {
          key: "title",
          type: "input-field",
          props: {
            required: true,
            label: _("title"),
          },
        },
        {
          key: "description",
          type: "textarea-field",
          className: "col-12",
          props: {
            label: _("description"),
            placeholder: _("description"),
          },
        },
      ]),
    ];
  }
}
