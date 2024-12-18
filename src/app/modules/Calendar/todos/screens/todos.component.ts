import { NgClass, NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ITEM_CLASS_EVENT } from "@modules/Events/services/service-types";
import { LeadIdComponent } from "@modules/Leads/components/lead-id.component";
import { LeadMoreTogglerComponent } from "@modules/Leads/components/lead-more-toggler.component";
import { LeadNameComponent } from "@modules/Leads/components/lead-name/lead-name.component";
import { LeadTableRowComponent } from "@modules/Leads/components/lead-table-row/lead-table-row.component";
import LeadProfileComponent from "@modules/Leads/screens/lead-profile/lead-profile.component";
import { LccaPermissionsService } from "@modules/Leads/services/lcca-permissions.service";
import { LeadsService } from "@modules/Leads/services/leads.service";
import { Lead } from "@modules/Leads/services/service-types";
import { PhonesComponent } from "@modules/Phones/components/phones/phones/phones.component";
import { ITEM_CLASS_TASK } from "@modules/Tasks/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import {
  AuthService,
  BaseIndexComponent,
  CachedListsService,
  CommaSeparatedLabelsComponent,
  CustomLayoutSkeletonComponent,
  EnabledModuleService,
  FilterConfig,
  FiltersPanelComponent,
  RangePipe,
  TableWrapperComponent,
  constants,
} from "@shared";
import { TooltipModule } from "primeng/tooltip";
import { map, tap } from "rxjs";
import { FilterTodosService } from "../services/filter-todos.service";

@Component({
  selector: "app-todos",
  standalone: true,
  templateUrl: "./todos.component.html",
  styleUrls: ["./todos.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    NgTemplateOutlet,
    TableWrapperComponent,
    LeadNameComponent,
    TooltipModule,
    PhonesComponent,
    LeadTableRowComponent,
    FiltersPanelComponent,
    CommaSeparatedLabelsComponent,
    LeadMoreTogglerComponent,
    LeadIdComponent,
    RangePipe,
    TranslateModule,
    CustomLayoutSkeletonComponent,
  ],
})
export default class TodosComponent extends BaseIndexComponent<any> {
  #todosFilter = inject(FilterTodosService);
  leadsService = inject(LeadsService);
  #enabledModule = inject(EnabledModuleService);
  #lccaPermissions = inject(LccaPermissionsService);
  #cachedLists = inject(CachedListsService);
  #authService = inject(AuthService);

  todosFilters = computed<FilterConfig[]>(() => this.#todosFilter.todosFilters());

  showBasicFilters = signal(false);
  constants = constants;
  ITEM_CLASS_TASK = ITEM_CLASS_TASK;
  ITEM_CLASS_EVENT = ITEM_CLASS_EVENT;

  totalTodos = this.leadsService.totalLeads;
  todosFiltered = this.leadsService.leadsFiltered;

  todos$ = toObservable(this.records).pipe(
    map(todos => todos.map(item => item.record)),
    tap(todos => {
      const leads = todos.map(item => this.getLead(item));
      this.leadsService.leadList.set(leads);
      this.leadsService.totalLeads.set(this.totalRecords());
      this.leadsService.leadsFiltered.set(this.recordsFiltered());
    }),
  );

  todosReadonly = toSignal(this.todos$, { initialValue: [] });

  recordsList = computed(() => {
    const leads = new Map(this.leadsService.leadList().map(item => [item.id, item]));

    return this.todosReadonly()
      .filter(item => leads.has(this.getLead(item).id))
      .map(item => {
        const propName = "taskable" in item ? "taskable" : "eventable";
        return { ...item, [propName]: leads.get(this.getLead(item).id) };
      });
  });

  refreshTodos(filters: Record<string, any>) {
    this.filtersData.update(oldFilters => ({ ...oldFilters, ...filters }));
  }

  getLead(rowData: any) {
    const lead = rowData.class === ITEM_CLASS_TASK ? rowData.taskable : rowData.eventable;
    return lead;
  }

  getStatus(record: any) {
    const listSlug = record.class === ITEM_CLASS_TASK ? "tasks:statuses" : "events:event_statuses";
    return this.#cachedLists
      .loadLists()
      .get(listSlug)
      ?.find((s: { value: number }) => s.value === record.status_id)?.label;
  }

  getAssignees(rowData: any) {
    const users = this.#cachedLists.loadLists().get("assignments:all_users_info");
    return users?.filter((u: { value: number }) => rowData.assignees_ids?.includes(u.value)) || [];
  }

  getAttendees(rowData: any) {
    const users = this.#cachedLists.loadLists().get("assignments:all_users_info");
    return users?.filter((u: { value: number }) => rowData.attendees_ids?.includes(u.value)) || [];
  }

  checkPermission(lead: Lead, name: string) {
    return this.#lccaPermissions.checkPermission(lead.lead_type_id, name);
  }

  openLeadDialog(lead: Lead) {
    const lead$ = this.leadsService.getLeadDetails(lead.id);
    this.openUpdateRecordDialog(lead$);
  }

  ngOnInit() {
    this.withMultiLayout.set(true);

    this.refreshTodos({
      todo_type: "tasks",
      due_type: "todays",
      assignees_attendees_ids: [this.#authService.currentUser()?.id],
    });

    this.moduleName = this.#enabledModule.hasAnyModules([
      constants.modulesNames["Tasks Module"],
      constants.modulesNames["Events Module"],
    ]);

    this.dialogComponent = LeadProfileComponent;
    this.dialogConfig = { ...this.dialogConfig, dismissableMask: true, width: "980px" };

    this.#cachedLists.updateLists([
      "tasks:statuses",
      "events:event_statuses",
      "dynamic_list:statuses",
      "dynamic_list:sources",
      "assignments:assignments_rules",
      "assignments:assignments_rules_types",
      "assignments:all_users_info",
      "assignments:users",
      "assignments:groups",
      "interests:interests",
      "tags:tags",
      "dynamic_list:ratings",

      "activities:activity_outcomes",
      "activities:activity_types_messages",
      "activities:activity_types_meetings",
    ]);

    this.indexMeta = {
      ...this.indexMeta,
      endpoints: { index: "calendar/datatable_todos" },
      indexApiVersion: "v2",
      indexTableKey: "TODOS_KEY",
      columns: [
        {
          name: "id",
          searchable: true,
        },
        {
          name: "full_name",
          searchable: false,
        },
        {
          name: "company",
          searchable: false,
        },
        {
          name: "title",
          searchable: false,
        },
        {
          name: "phones",
          searchable: false,
        },
      ],
    };
  }
}
