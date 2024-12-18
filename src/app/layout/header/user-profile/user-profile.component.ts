import { ComponentType } from "@angular/cdk/portal";
import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewContainerRef,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router } from "@angular/router";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { UpdatePasswordComponent } from "@modules/Users/screens/update-password/update-password.component";
import { UserCuComponent } from "@modules/Users/screens/user-cu.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import {
  AuthService,
  ConfirmService,
  DefaultScreenHeaderComponent,
  LangService,
  TruncateTextPipe,
} from "@shared";
import { MenuItem } from "primeng/api";
import { DialogModule } from "primeng/dialog";
import { TooltipModule } from "primeng/tooltip";
import { ProfileItemComponent } from "./profile-item/profile-item.component";
import { UtilitiesComponent } from "./utilities/utilities.component";

export interface ProfileItem<C = unknown, T = unknown> extends MenuItem {
  subtitle?: string;
  component?: C;
  isUpdateProfile?: boolean;
  editData?: T;
}

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    DialogModule,
    TooltipModule,
    DefaultScreenHeaderComponent,
    ProfileItemComponent,
    TruncateTextPipe,
    TranslateModule,
  ],
})
export class UserProfileComponent {
  #authService = inject(AuthService);
  #router = inject(Router);
  #confirmService = inject(ConfirmService);
  #destroyRef = inject(DestroyRef); // Current "context" (this component)
  currentLang = inject(LangService).currentLanguage;
  #translate = inject(TranslateService);

  dynamicDialog = viewChild.required("dynamicDialog", { read: ViewContainerRef });

  selectedItem = signal<ProfileItem<ComponentType<unknown>> | null>(null);

  currentUser = this.#authService.currentUser;

  dialogVisible = signal(false);
  widthSM = "360px";
  widthMD = "750px";
  dialogWidth = signal(this.widthSM);

  ngOnInit() {
    this.#router.events.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(event => {
      if (event instanceof NavigationEnd && this.dialogVisible()) {
        this.dialogVisible.set(false);
      }
    });
  }

  profileItems = signal<ProfileItem<ComponentType<unknown>, boolean>[]>([
    {
      label: this.#translate.instant(_("edit_my_profile")),
      subtitle: this.#translate.instant(_("name_email_more")),
      icon: "fas fa-id-badge",
      component: UserCuComponent,
      isUpdateProfile: true,
      editData: true,
      dialogWidth: this.widthMD,
    },
    // {
    //   label: this.#translate.instant(_("my_preferences")),
    //   subtitle: this.#translate.instant(_("language_notifications")),
    //   icon: "fas fa-user-gear",
    //   component: PreferencesComponent,
    //   dialogWidth: this.widthMD,
    // },
    {
      label: this.#translate.instant(_("update_password")),
      subtitle: this.#translate.instant(_("update_password_subtitle")),
      icon: "fas fa-unlock-alt",
      component: UpdatePasswordComponent,
      dialogWidth: this.widthMD,
    },
    // {
    //   label: this.#translate.instant(_("transfer_sms_balance")),
    //   subtitle: this.#translate.instant(_("transfer_sms_to_teammate")),
    //   icon: "fas fa-sms",
    //   component: TransferSMSComponent,
    //   dialogWidth: this.widthMD,
    // },
    {
      id: "utilities-item",
      label: this.#translate.instant(_("utilities")),
      subtitle: this.#translate.instant(_("utilities_subtitle")),
      icon: "fas fa-screwdriver-wrench",
      component: UtilitiesComponent,
    },
    {
      id: "logout-item",
      label: this.#translate.instant(_("logout")),
      subtitle: this.#translate.instant(_("logout_subtitle")),
      icon: "fas fa-right-from-bracket",
    },
  ]);

  displayItem(item: ProfileItem<ComponentType<unknown>, boolean> | null) {
    if (!item || !item?.component) return;
    this.back(item);
    const componentRef = this.dynamicDialog().createComponent<any>(item.component);
    componentRef.instance.isUpdateProfile = item.isUpdateProfile;
    componentRef.instance.editData = item.editData;
    this.dialogWidth.set(item.dialogWidth || this.widthSM);
  }

  back(item: ProfileItem<ComponentType<unknown>, boolean> | null = null) {
    this.selectedItem.set(item);
    this.dialogWidth.set(this.widthSM);
    this.dynamicDialog()?.clear();
  }

  logout() {
    this.#confirmService.confirmDelete({
      message: this.#translate.instant(_("confirm_proceed")),
      acceptCallback: () =>
        this.#authService
          .logout()
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe(() => {
            const currentUrl = this.#router.url;
            this.#router.navigate(["/auth/login"], { queryParams: { returnUrl: currentUrl } });
            this.dialogVisible.set(false);
          }),
    });
  }
}
