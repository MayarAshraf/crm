import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject, input, numberAttribute } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { PipelineStage } from "@modules/Pipelines/services/service-types";
import { BaseIndexComponent, BreadcrumbService, TableWrapperComponent, constants } from "@shared";
import { PipelineStageCuComponent } from "./pipeline-stages-cu.component";

@Component({
  selector: "app-index-pipeline-stages",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexPipelinesStagesComponent extends BaseIndexComponent<
  PipelineStage,
  ComponentType<PipelineStageCuComponent>
> {
  #breadcrumbService = inject(BreadcrumbService);
  #userPermission = inject(PermissionsService);

  pipelineId = input<number, number>(0, { transform: numberAttribute });
  pipelineName = input<string>();

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["index-pipeline-stages"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-pipeline-stage"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-pipeline-stage"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-pipeline-stage"]),
    });

    this.#breadcrumbService.pushBreadcrumb({ label: this.pipelineName() });

    this.dialogComponent = PipelineStageCuComponent;
    this.filtersData.update(oldFilters => ({ ...oldFilters, id: this.pipelineId() }));

    this.indexMeta = {
      ...this.indexMeta,
      indexTableKey: `PIPELINES_${this.pipelineId()}_KEY`,
      endpoints: {
        index: "pipelines/pipeline_stages/index",
        delete: "pipelines/pipeline_stages/delete",
      },
      indexTitle: this.translate.instant(_("pipeline_stages")),
      indexIcon: constants.icons.list,
      createBtnLabel: this.translate.instant(_("create_pipeline_stage")),
      columns: [
        {
          name: "id",
          title: this.translate.instant(_("id")),
          searchable: false,
          orderable: true,
        },
        {
          name: "pipeline.name",
          title: this.translate.instant(_("pipeline")),
          searchable: true,
          orderable: false,
        },
        {
          name: "name",
          title: this.translate.instant(_("pipeline_stage")),
          searchable: true,
          orderable: false,
        },
        {
          name: "probability",
          title: this.translate.instant(_("probability")),
          searchable: false,
          orderable: true,
        },
        {
          name: "created_at",
          title: this.translate.instant(_("created_at")),
          searchable: false,
          orderable: true,
        },
      ],
    };
  }

  override openCreateRecordDialog() {
    this.dialogConfig = {
      ...this.dialogConfig,
      data: { pipeline_id: this.pipelineId(), method: "create" },
    };
    super.openCreateRecordDialog();
  }
}
