import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { TranslateModule } from "@ngx-translate/core";
import {
  BaseIndexComponent,
  PermissioneVisibilityDirective,
  SimpleImportDialogComponent,
  StaticDataService,
  TableWrapperComponent,
  User,
  constants,
} from "@shared";
import { MenuItem } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { MenuModule } from "primeng/menu";
import { TooltipModule } from "primeng/tooltip";
import { UserCuComponent } from "../user-cu.component";
import { UserPermissionsDialogComponent } from "../user-permissions-dialog.component";
import { UserSMSBalanceCuComponent } from "../user-sms-balance-cu.component";
import { UserSuspendCuComponent } from "../user-suspend-cu/user-suspend-cu.component";

@Component({
  selector: "app-index-users",
  standalone: true,
  templateUrl: "./users.component.html",
  imports: [
    PermissioneVisibilityDirective,
    DropdownModule,
    FormsModule,
    MenuModule,
    ButtonModule,
    TooltipModule,
    TableWrapperComponent,
    TranslateModule,
    SimpleImportDialogComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexUsersComponent extends BaseIndexComponent<
  User,
  ComponentType<UserCuComponent>
> {
  #staticDataService = inject(StaticDataService);
  #userPermission = inject(PermissionsService);

  usersType!: { value: string; label: string }[];
  constants = constants;
  selectedUsersType = "all";

  showImportDialog = signal(false);

  moreActions = signal<MenuItem[]>([
    {
      label: this.translate.instant(_("import")),
      icon: "fas fa-upload",
      command: () => this.showImportDialog.set(true),
    },
  ]);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["index-users"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-user"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-user"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-user"]),
      view: this.#userPermission.hasPermission(constants.permissions["view-user"]),
      sms: this.#userPermission.hasPermission(constants.permissions["manage-sms"]),
      update_user_permissions: this.#userPermission.hasPermission(
        constants.permissions["update-user-permissions"],
      ),
      suspend_user: this.#userPermission.hasPermission(constants.permissions["suspend-user"]),
    });

    this.dialogComponent = UserCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: { index: "users/index", delete: "users/delete" },
      indexTitle: this.translate.instant(_("users")),
      indexIcon: "fas fa-users",
      createBtnLabel: this.translate.instant(_("create_user")),
      indexTableKey: "USERS_KEY",
      columns: [
        { name: "id", title: this.translate.instant(_("id")), searchable: false, orderable: true },
        {
          name: "full_name",
          title: this.translate.instant(_("name")),
          searchable: true,
          orderable: true,
        },
        {
          name: "group.name",
          title: this.translate.instant(_("group")),
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
    this.usersType = this.#staticDataService.usersType;
  }

  protected openSMSBalanceDialog(user: User) {
    const dialogConfig = { ...this.dialogConfig, data: user };
    this.dialogService.open(UserSMSBalanceCuComponent, dialogConfig);
  }

  protected openSuspendDialog(user: User) {
    const dialogConfig = { ...this.dialogConfig, data: user };
    this.dialogService.open(UserSuspendCuComponent, dialogConfig);
  }

  openUpdateUserPermissionsDialog(user: User) {
    const dialogConfig = { ...this.dialogConfig, data: user };
    this.dialogService.open(UserPermissionsDialogComponent, dialogConfig);
  }

  // openImportDialog() {
  //   this.dialogService.open(SimpleImportDialogComponent, this.dialogConfig);
  //   this.dialogRef?.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(records => {
  //     if (!records) return;
  //     this.records.update(oldRecords => [...oldRecords, ...records]);
  //     this.totalRecords.update(totalRecords => totalRecords + 1);
  //     this.recordsFiltered.update(recordsFiltered => recordsFiltered + 1);
  //   });
  // }

  filterUserType() {
    this.filtersData.update(oldFilters => ({ ...oldFilters, user_status: this.selectedUsersType }));
  }
}
