import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { TagModel } from "@modules/Tags/services/service-types";
import { TagsFieldsService } from "@modules/Tags/services/tags-fields.service";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { BaseCreateUpdateComponent, DynamicDialogComponent, FormComponent } from "@shared";

@Component({
  selector: "app-tag-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [AsyncPipe, FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagCuComponent extends BaseCreateUpdateComponent<TagModel> {
  #agsFields = inject(TagsFieldsService);

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: "tags/store",
        update: "tags/update",
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_tag")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = { id: this.editData.id, ...new TagModel(this.editData) };
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_tag")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
      this.model = new TagModel();
    }
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [this.#agsFields.tagField()];
  }
}
