import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PipelinesFieldsService } from "@modules/Pipelines/services/pipeline-lists-inputs.service";
import { PipelineModel } from "@modules/Pipelines/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  DynamicDialogComponent,
  FormComponent,
  LangRepeaterFieldService,
} from "@shared";

@Component({
  selector: "app-pipeline-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipelineCuComponent extends BaseCreateUpdateComponent<PipelineModel> {
  #PipelinesFields = inject(PipelinesFieldsService);
  #getlangRepeaterField = inject(LangRepeaterFieldService);

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: "pipelines/pipelines/store",
        update: "pipelines/pipelines/update",
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_pipeline")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = {
        id: this.editData.id,
        pipelinable_id: this.editData.pipelinable_id,
        ...new PipelineModel(this.editData),
      };
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_pipeline")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
      this.model = new PipelineModel();
    }
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      this.#PipelinesFields.pipelinableSelectField({
        key: "pipelinable_id",
        props: {
          required: true,
          label: _("select_pipelinable"),
        },
      }),
      this.#getlangRepeaterField.getlangRepeaterField([
        {
          key: "name",
          type: "input-field",
          props: {
            required: true,
            label: _("name"),
          },
        },
        {
          key: "description",
          type: "textarea-field",
          className: "col-12",
          props: {
            label: _("description"),
          },
        },
      ]),
    ];
  }
}
