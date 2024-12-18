import { ComponentType } from "@angular/cdk/portal";
import { LowerCasePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, TemplateRef, inject, viewChild } from "@angular/core";
import { RouterLink } from "@angular/router";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { Pipeline } from "@modules/Pipelines/services/service-types";
import {
  BaseIndexComponent,
  EnabledModuleService,
  TableWrapperComponent,
  constants,
} from "@shared";
import { NgxPermissionsModule } from "ngx-permissions";
import { PipelineCuComponent } from "./pipeline-cu.component";

@Component({
  selector: "app-index-pipeline",
  standalone: true,
  templateUrl: "./pipelines.component.html",
  imports: [NgxPermissionsModule, LowerCasePipe, RouterLink, TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexPipelinesComponent extends BaseIndexComponent<
  Pipeline,
  ComponentType<PipelineCuComponent>
> {
  #userPermission = inject(PermissionsService);
  #enabledModule = inject(EnabledModuleService);

  pipelineName = viewChild.required<TemplateRef<any>>("pipelineName");

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["index-pipelines"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-pipeline"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-pipeline"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-pipeline"]),
      view: this.#userPermission.hasPermission(constants.permissions["view-pipeline-details"]),
      export: this.#userPermission.hasPermission(constants.permissions["export-pipelines"]),
    });

    this.moduleName = this.#enabledModule.hasModule(constants.modulesNames["Pipelines Module"]);
    this.dialogComponent = PipelineCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "pipelines/pipelines/all",
        delete: "pipelines/pipelines/delete",
      },
      indexTitle: this.translate.instant(_("pipeline")),
      indexIcon: constants.icons.list,
      createBtnLabel: this.translate.instant(_("create_pipeline")),
      indexTableKey: "PIPELINES_KEY",
      columns: [
        { name: "id", title: this.translate.instant(_("id")), searchable: false, orderable: true },
        {
          name: "pipelinable.name",
          title: this.translate.instant(_("pipelinable")),
          orderable: false,
          searchable: true,
        },
        {
          name: "name",
          title: this.translate.instant(_("pipelines")),
          searchable: true,
          orderable: false,
          render: this.pipelineName(),
        },
        {
          name: "created_at",
          title: this.translate.instant(_("created_at")),
          searchable: false,
          orderable: false,
        },
      ],
    };
  }
}
