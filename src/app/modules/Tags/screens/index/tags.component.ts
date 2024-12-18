import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { Tag } from "@modules/Tags/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import {
  BaseIndexComponent,
  EnabledModuleService,
  SimpleBulkDialogComponent,
  SimpleImportDialogComponent,
  TableWrapperComponent,
  constants,
} from "@shared";
import { MenuItem } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { MenuModule } from "primeng/menu";
import { TooltipModule } from "primeng/tooltip";
import { TagCuComponent } from "./tag-cu.component";
@Component({
  selector: "app-index-tag",
  standalone: true,
  templateUrl: "./tags.component.html",
  imports: [
    TableWrapperComponent,
    MenuModule,
    ButtonModule,
    TooltipModule,
    TranslateModule,
    SimpleBulkDialogComponent,
    SimpleImportDialogComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexTagComponent extends BaseIndexComponent<
  Tag,
  ComponentType<TagCuComponent>
> {
  #userPermission = inject(PermissionsService);
  #enabledModule = inject(EnabledModuleService);

  showImportDialog = signal(false);
  showBulkDialog = signal(false);

  moreActions = signal<MenuItem[]>([
    {
      label: this.translate.instant(_("bulk_creation")),
      icon: "fas fa-plus",
      command: () => this.showBulkDialog.set(true),
    },
    {
      label: this.translate.instant(_("import")),
      icon: "fas fa-upload",
      command: () => this.showImportDialog.set(true),
    },
  ]);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["index-tags"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-tag"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-tag"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-tag"]),
    });

    this.moduleName = this.#enabledModule.hasModule(constants.modulesNames["Tags Module"]);
    this.dialogComponent = TagCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: { index: "tags", delete: "tags/delete" },
      indexTitle: this.translate.instant(_("tags")),
      indexIcon: constants.icons.tags,
      createBtnLabel: this.translate.instant(_("create_tag")),
      indexTableKey: "TAGS_KEY",
      columns: [
        { name: "id", title: this.translate.instant(_("id")), searchable: true, orderable: true },
        {
          name: "tag",
          title: this.translate.instant(_("tag")),
          searchable: true,
          orderable: false,
        },
        {
          name: "created_at",
          title: this.translate.instant(_("created_at")),
          searchable: false,
          orderable: false,
        },
        {
          name: "creator.full_name",
          title: this.translate.instant(_("created_by")),
          searchable: false,
          orderable: false,
        },
      ],
    };
  }

  updateUi(records: Tag[]) {
    if (!records) return;
    this.records.update(oldRecords => [...records, ...oldRecords]);
    this.totalRecords.update(totalRecords => totalRecords + records.length);
    this.recordsFiltered.update(recordsFiltered => recordsFiltered + records.length);
  }
}
