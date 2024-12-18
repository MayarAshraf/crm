import { ComponentType } from "@angular/cdk/portal";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  TemplateRef,
  viewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CaseCuComponent } from "@modules/CustomerService/screens/cases/case-cu.component";
import CaseViewComponent from "@modules/CustomerService/screens/cases/case-view/case-view.component";
import { Case } from "@modules/CustomerService/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import {
  BaseIndexComponent,
  CachedLabelsService,
  CachedListsService,
  CommaSeparatedLabelsComponent,
  constants,
  DateFormatterPipe,
  EnabledModuleService,
  PermissioneVisibilityDirective,
  PermissionsService,
  TableWrapperComponent,
} from "@shared";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";

@Component({
  selector: "app-cases-table",
  standalone: true,
  imports: [
    TableModule,
    TableWrapperComponent,
    DateFormatterPipe,
    CommaSeparatedLabelsComponent,
    PermissioneVisibilityDirective,
    ButtonModule,
    TranslateModule,
  ],
  templateUrl: "./cases-table.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CasesTableComponent extends BaseIndexComponent<Case, ComponentType<CaseCuComponent>> {
  #enabledModule = inject(EnabledModuleService);
  #userPermission = inject(PermissionsService);
  #cachedLabels = inject(CachedLabelsService);
  #cachedLists = inject(CachedListsService);

  name = viewChild.required<TemplateRef<any>>("name");
  typePriority = viewChild.required<TemplateRef<any>>("typePriority");
  stage = viewChild.required<TemplateRef<any>>("stage");
  assignees = viewChild.required<TemplateRef<any>>("assignees");

  indexTableKey = input.required<string>();
  withScreenHeader = input<boolean>(true);
  withActionsColumn = input<boolean>(true);

  getLabelById(listKey: string, id: number) {
    return this.#cachedLists
      .loadLists()
      .get(listKey)
      ?.find((item: { value: number }) => item.value === id)?.label;
  }

  getStage(pipelineId: number, stageId: number) {
    return this.#cachedLists
      .loadLists()
      .get("pipelines:tickets_pipeline_stages")
      ?.find((item: { value: number }) => item.value === pipelineId)
      ?.items?.find((item: { value: number }) => item.value === stageId)?.label;
  }

  getLabelsByIds(listKey: string, ids: number[]) {
    return this.#cachedLabels.getLabelsByIds(listKey, ids);
  }

  ngOnInit() {
    this.dialogConfig = {
      ...this.dialogConfig,
      width: "650px",
    };
    this.moduleName = this.#enabledModule.hasModule(
      constants.modulesNames["Customer Service Module"],
    );
    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["index-tickets"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-ticket"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-ticket"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-ticket"]),
      view: this.#userPermission.hasPermission(constants.permissions["view-ticket-details"]),
    });

    this.dialogComponent = CaseCuComponent;

    this.indexMeta = {
      ...this.indexMeta,
      indexTitle: this.translate.instant("cases"),
      indexIcon: "fas fa-comment-alt",
      createBtnLabel: this.translate.instant("new_case"),
      endpoints: { index: "customer-service/tickets", delete: "customer-service/tickets/delete" },
      indexTableKey: this.indexTableKey(),
      indexApiVersion: "v2",
      deleteApiVersion: "v2",
      columns: [
        {
          title: this.translate.instant("id"),
          name: "id",
          searchable: true,
          orderable: false,
        },
        {
          title: this.translate.instant("name"),
          name: "subject",
          render: this.name(),
          searchable: true,
          orderable: false,
        },
        {
          title: this.translate.instant("case_priority"),
          name: "case_priority_id",
          render: this.typePriority(),
          searchable: false,
          orderable: false,
        },
        {
          title: this.translate.instant("stage"),
          name: "pipeline_stage_id",
          render: this.stage(),
          searchable: false,
          orderable: false,
        },
        {
          title: this.translate.instant("assignees"),
          name: "assignees_ids",
          render: this.assignees(),
          searchable: false,
          orderable: false,
        },
      ],
    };
  }

  openViewRecordDialog(data: Case) {
    const dialogConfig = {
      ...this.dialogConfig,
      dismissableMask: true,
      width: "980px",
      data: {
        record: data,
        deleteRecord: this.deleteRecord.bind(this),
        updateRecord: this.openUpdateRecordDialog.bind(this),
        // Using .bind(this) ensures that the deleteRecord and openUpdateRecordDialog methods retain the correct context (`this` refers to CasesComponent) when called from CaseViewComponent.
      },
    };

    this.dialogRef = this.dialogService.open(CaseViewComponent, dialogConfig);
    this.dialogRef?.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(record => {
      this.updateRecord(record);
    });
  }
}
