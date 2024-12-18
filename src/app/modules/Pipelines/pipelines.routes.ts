import { Routes } from "@angular/router";
import { ModuleGuard, constants } from "@shared";
import { ngxPermissionsGuard } from "ngx-permissions";

export const PipelinesRoutes: Routes = [
  {
    path: "pipelines",
    canActivate: [ModuleGuard],
    data: {
      enabledModule: constants.modulesNames["Pipelines Module"],
      breadcrumbs: [{ label: "settings", url: "/settings" }, { label: "pipelines" }],
    },
    children: [
      {
        path: "",
        canActivate: [ngxPermissionsGuard],
        title: "pipelines",
        data: {
          permissions: {
            only: [constants.permissions["index-pipelines"]],
            redirectTo: "403",
          },
        },
        loadComponent: () => import("./screens/index/pipelines.component"),
      },
      {
        path: "pipeline-stages/:pipelineId/:pipelineName",
        canActivate: [ngxPermissionsGuard],
        loadComponent: () => import("./screens/pipeline-stages/pipeline-stages.component"),
        title: "pipeline_stages",
        data: {
          permissions: {
            only: [constants.permissions["view-pipeline-details"]],
            redirectTo: "403",
          },
          breadcrumbs: [
            { label: "settings", url: "/settings" },
            { label: "pipelines", url: "/pipelines" },
          ],
        },
      },
    ],
  },
];
