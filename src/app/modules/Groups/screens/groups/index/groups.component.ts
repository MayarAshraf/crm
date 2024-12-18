import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { Group } from "@modules/Groups/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import {
  BaseIndexComponent,
  PermissioneVisibilityDirective,
  TableWrapperComponent,
  constants,
} from "@shared";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { GroupCuComponent } from "../group-cu.component";
import { GroupPermissionsDialogComponent } from "../group-permissions-dialog.component";
import { GroupScopesDialogComponent } from "../group-scopes-dialog.component";

@Component({
  selector: "app-index-groups",
  standalone: true,
  templateUrl: "./groups.component.html",
  imports: [
    ButtonModule,
    PermissioneVisibilityDirective,
    TooltipModule,
    TableWrapperComponent,
    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexGroupsComponent extends BaseIndexComponent<
  Group,
  ComponentType<GroupCuComponent>
> {
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["index-groups"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-group"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-group"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-group"]),
      view: this.#userPermission.hasPermission(constants.permissions["view-group"]),
      update_permissions: this.#userPermission.hasPermission(
        constants.permissions["update-group-permissions"],
      ),
      update_access_scopes: this.#userPermission.hasPermission(
        constants.permissions["update-group-access-scopes-groups"],
      ),
    });

    this.dialogComponent = GroupCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "groups/index",
        delete: "groups/delete",
      },
      indexTitle: this.translate.instant(_("groups")),
      indexIcon: "fas fa-layer-group",
      createBtnLabel: this.translate.instant(_("create_group")),
      indexTableKey: "GROUPS_KEY",
      columns: [
        { name: "id", title: this.translate.instant(_("id")), searchable: false, orderable: true },
        {
          name: "name",
          title: this.translate.instant(_("name")),
          searchable: true,
          orderable: true,
        },
        {
          name: "parent_group.name",
          title: this.translate.instant(_("parent_group")),
          searchable: true,
          orderable: true,
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
        {
          name: "updated_at",
          title: this.translate.instant(_("updated_at")),
          searchable: false,
          orderable: false,
        },
      ],
    };
  }

  openUpdateGroupPermissionsDialog(group: Group) {
    const dialogConfig = { ...this.dialogConfig, data: group };
    this.dialogService.open(GroupPermissionsDialogComponent, dialogConfig);
  }

  openUpdateGroupScopesDialog(group: Group) {
    const dialogConfig = { ...this.dialogConfig, data: group };
    this.dialogService.open(GroupScopesDialogComponent, dialogConfig);
  }
}
