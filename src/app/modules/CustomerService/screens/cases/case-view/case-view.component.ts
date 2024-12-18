import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { Case, ITEM_TICKET } from "@modules/CustomerService/services/service-types";
import { LeadNameComponent } from "@modules/Leads/components/lead-name/lead-name.component";
import { LccaPermissionsService } from "@modules/Leads/services/lcca-permissions.service";
import { Lead } from "@modules/Leads/services/service-types";
import { NotesComponent } from "@modules/Notes/components/notes/notes.component";
import { PhonesComponent } from "@modules/Phones/components/phones/phones/phones.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import {
  CachedListsService,
  CommaSeparatedLabelsComponent,
  ConfirmService,
  constants,
  CopyButtonComponent,
  DateFormatterPipe,
  EntitySelectComponent,
  ListInfoComponent,
  LogsComponent,
  MediaListComponent,
  PermissionsService,
} from "@shared";
import { MenuItem } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MenuModule } from "primeng/menu";
import { TabViewModule } from "primeng/tabview";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-case-view",
  standalone: true,
  imports: [
    ButtonModule,
    TooltipModule,
    MenuModule,
    DividerModule,
    TabViewModule,
    EntitySelectComponent,
    CommaSeparatedLabelsComponent,
    ListInfoComponent,
    DateFormatterPipe,
    NotesComponent,
    PhonesComponent,
    LogsComponent,
    LeadNameComponent,
    CopyButtonComponent,
    TranslateModule,
    MediaListComponent,
  ],
  templateUrl: "./case-view.component.html",
  styleUrl: "./case-view.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CaseViewComponent {
  #dialogConfig = inject(DynamicDialogConfig);
  #dialogRef = inject(DynamicDialogRef);
  #cachedLists = inject(CachedListsService);
  #lccaPermissions = inject(LccaPermissionsService);
  #userPermission = inject(PermissionsService);
  #confirmService = inject(ConfirmService);
  #translate = inject(TranslateService);

  activeIndex = signal(0);

  case = signal(this.#dialogConfig.data.record);

  constants = constants;
  ITEM_TICKET = ITEM_TICKET;

  ngOnInit() {
    this.#cachedLists.updateLists([
      "interests:interests",
      "tags:tags",
      "customer_service:case_reasons",
      "customer_service:case_origins",
      "customer_service:case_types",
      "pipelines:ticket_pipelines",
      "pipelines:pipeline_stages:id:" + this.case().pipeline_id,
      "assignments:all_users_info",
    ]);
  }

  getlabels(listKey: string, ids: number[]) {
    const data = this.#cachedLists.loadLists().get(listKey);
    return data?.filter((item: { value: number }) => ids?.includes(item.value)) || [];
  }

  getLabelById(listKey: string, id: number) {
    return this.#cachedLists
      .loadLists()
      .get(listKey)
      ?.find((item: { value: number }) => item.value === id)?.label;
  }

  tabsItems = computed<MenuItem[]>(() => [
    {
      label: this.#translate.instant(_("info")),
      tooltip: this.#translate.instant(_("info")),
      icon: "fas fa-info-circle",
      index: 0,
    },
    {
      label: this.#translate.instant(_("attachments")),
      tooltip: this.#translate.instant(_("attachments")),
      icon: "fas fa-paperclip",
      index: 1,
      badgeNumber: this.case().media.length,
    },
    {
      label: this.#translate.instant(_("logs")),
      tooltip: this.#translate.instant(_("logs")),
      icon: "fas fa-history",
      index: 2,
    },
  ]);

  moreOptions = [
    {
      label: this.#translate.instant(_("edit_case")),
      icon: constants.icons.pencil,
      visible: this.#userPermission.hasPermission(constants.permissions["update-ticket"]),
      command: () => {
        this.#dialogConfig.data.updateRecord(this.case());
        this.closeDialog();
      },
    },
    {
      label: this.#translate.instant(_("delete_case")),
      icon: "fas fa-trash-alt",
      visible: this.#userPermission.hasPermission(constants.permissions["delete-ticket"]),
      command: () => {
        this.#confirmService.confirmDelete({
          acceptCallback: () => {
            this.#dialogConfig.data.deleteRecord(this.case());
            this.closeDialog();
          },
        });
      },
    },
  ];

  checkPermission(lead: Lead, name: string) {
    return this.#lccaPermissions.checkPermission(lead.lead_type_id, name);
  }

  openLead(lead: Lead) {
    window.open(`/leads/leadId/${lead.id}`, "_blank");
  }

  closeDialog(data?: Case) {
    this.#dialogRef.close(data);
  }

  ngOnDestroy() {
    this.closeDialog(this.case());
  }
}
