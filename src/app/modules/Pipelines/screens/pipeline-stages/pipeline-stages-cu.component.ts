import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PipelineStageModel } from "@modules/Pipelines/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  DynamicDialogComponent,
  FieldBuilderService,
  FormComponent,
  LangRepeaterFieldService,
} from "@shared";

@Component({
  selector: "app-pipeline-stages-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipelineStageCuComponent extends BaseCreateUpdateComponent<PipelineStageModel> {
  #getlangRepeaterField = inject(LangRepeaterFieldService);
  #fieldBuilder = inject(FieldBuilderService);

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: "pipelines/pipeline_stages/store",
        update: "pipelines/pipeline_stages/update",
      },
    };

    if (this.editData.id) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_pipeline_stage")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = { id: this.editData.id, ...new PipelineStageModel(this.editData) };
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_pipeline_stage")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
      this.model = { pipeline_id: this.editData.pipeline_id, ...new PipelineStageModel() };
    }

    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        {
          key: "order",
          type: "input-field",
          props: {
            type: "number",
            label: _("order"),
          },
        },
        {
          key: "probability",
          type: "input-field",
          props: {
            type: "number",
            required: true,
            label: _("probability"),
          },
        },
      ]),
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
