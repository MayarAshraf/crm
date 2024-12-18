import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  InjectionToken,
  Type,
  ViewContainerRef,
  assertInInjectionContext,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router } from "@angular/router";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { ImportLeadsComponent } from "@modules/Imports/screens/import-leads/import-leads.component";
import { ImportUnitsComponent } from "@modules/Imports/screens/import-units/import-units.component";
import { LeadCuComponent } from "@modules/Leads/screens/lead-cu.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { DefaultScreenHeaderComponent, PermissionsService, constants } from "@shared";
import { MenuItem } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { TooltipModule } from "primeng/tooltip";

export interface Item {
  type: string;
  leadTypeId?: number;
}

export interface AddItem<T> extends MenuItem {
  component?: Type<any>;
  showDialogHeader?: boolean;
  data: T;
}

const isVisible = new InjectionToken("IS_VISIBLE", {
  providedIn: "root",
  factory: () => signal(false),
});

export function injectIsVisible() {
  assertInInjectionContext(injectIsVisible);
  return inject(isVisible);
}

@Component({
  selector: "app-add-new",
  standalone: true,
  templateUrl: "./add-new.component.html",
  styleUrls: ["./add-new.component.scss"],
  imports: [
    ButtonModule,
    DialogModule,
    TooltipModule,
    ButtonModule,
    DefaultScreenHeaderComponent,
    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewComponent {
  #router = inject(Router);
  #destroyRef = inject(DestroyRef); // Current "context" (this component)
  #userPermission = inject(PermissionsService);
  #translate = inject(TranslateService);

  dynamicDialog = viewChild.required("dynamicDialog", { read: ViewContainerRef });

  selectedItem = signal<AddItem<Item> | null>(null);

  dialogVisible = injectIsVisible();
  widthSM = "360px";
  widthMD = "750px";
  widthLG = "1200px";
  dialogWidth = signal(this.widthSM);
  activeItems = signal<AddItem<Item>[]>([]);

  ngOnInit() {
    this.activeItems.set(this.addItems);
    this.#router.events.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(event => {
      if (event instanceof NavigationEnd && this.dialogVisible()) {
        this.dialogVisible.set(false);
      }
    });
  }

  addItems: AddItem<Item>[] = [
    {
      label: this.#translate.instant(_("new_lead")),
      title: this.#translate.instant(_("new_lead")),
      icon: "fas fa-filter",
      component: LeadCuComponent,
      showDialogHeader: false,
      data: {
        type: "lead",
        leadTypeId: 1,
      },
      dialogWidth: this.widthMD,
      visible: this.#userPermission.hasPermission(constants.permissions["create-lead"]),
    },
    {
      label: this.#translate.instant(_("new_contact")),
      title: this.#translate.instant(_("new_contact")),
      icon: "fas fa-id-card",
      component: LeadCuComponent,
      showDialogHeader: false,
      data: {
        type: "contact",
        leadTypeId: 2,
      },
      dialogWidth: this.widthMD,
      visible: this.#userPermission.hasPermission(constants.permissions["create-contact"]),
    },
    {
      label: this.#translate.instant(_("new_customer")),
      title: this.#translate.instant(_("new_customer")),
      icon: "fas fa-hand-holding-usd",
      component: LeadCuComponent,
      showDialogHeader: false,
      data: {
        type: "customer",
        leadTypeId: 3,
      },
      dialogWidth: this.widthMD,
      visible: this.#userPermission.hasPermission(constants.permissions["create-customer"]),
    },
    {
      label: this.#translate.instant(_("new_account")),
      title: this.#translate.instant(_("new_account")),
      icon: constants.icons.building,
      component: LeadCuComponent,
      showDialogHeader: false,
      data: {
        type: "account",
        leadTypeId: 4,
      },
      dialogWidth: this.widthMD,
      visible: this.#userPermission.hasPermission(constants.permissions["create-account"]),
    },
    {
      label: this.#translate.instant(_("import")),
      title: this.#translate.instant(_("import")),
      icon: "fas fa-file-upload",
      data: {
        type: "import",
      },
      dialogWidth: "300px",
      visible: this.#userPermission.hasPermission(constants.permissions["manage-imports"]),
    },
    {
      label: this.#translate.instant(_("new_case")),
      title: this.#translate.instant(_("new_case")),
      icon: "fas fa-comment",
      data: {
        type: "case",
      },
      visible: false,
    },
    {
      label: this.#translate.instant(_("new_unit")),
      title: this.#translate.instant(_("new_unit")),
      icon: "fas fa-door-closed",
      data: {
        type: "unit",
      },
      visible: false,
    },
    {
      label: this.#translate.instant(_("new_project")),
      title: this.#translate.instant(_("new_project")),
      icon: "fas fa-city",
      data: {
        type: "project",
      },
      visible: false,
    },
  ];

  importItems: AddItem<Item>[] = [
    {
      label: "Back",
      icon: "fas fa-arrow-left",
      data: { type: "back" },
      visible: true,
      dialogWidth: this.widthSM,
    },
    {
      label: "Leads",
      title: "Import Leads",
      icon: "fas fa-filter",
      component: ImportLeadsComponent,
      data: { type: "" },
      dialogWidth: this.widthLG,
      visible: this.#userPermission.hasPermission(constants.permissions["import-leads"]),
    },
    {
      label: "Brokers",
      title: "Import Brokers",
      icon: "fas fa-user-tie",
      data: { type: "" },
      visible: true,
    },
    {
      label: "Units",
      title: "Import Units",
      icon: "fas fa-door-closed",
      component: ImportUnitsComponent,
      data: { type: "" },
      dialogWidth: this.widthLG,
      visible: true,
    },
    {
      label: "Projects",
      title: "Import Projects",
      icon: "fas fa-city",
      data: { type: "" },
      visible: true,
    },
  ];

  back(item: AddItem<Item> | null = null) {
    this.selectedItem.set(item);
    this.dialogWidth.set(this.widthSM);
    this.dynamicDialog()?.clear();
  }

  displayItem(item: AddItem<Item>) {
    if (!item) return;
    if (item.data.type === "import") {
      this.activeItems.set(this.importItems);
    } else if (item.data.type === "back") {
      this.activeItems.set(this.addItems);
    } else {
      this.back(item);
      if (!item?.component) return;
      const componentRef = this.dynamicDialog()?.createComponent<any>(item.component);
      componentRef.instance.data = item.data;
      componentRef.instance.showDialogHeader = item.showDialogHeader;
    }

    this.dialogWidth.set(item.dialogWidth || this.widthSM);
  }
}
