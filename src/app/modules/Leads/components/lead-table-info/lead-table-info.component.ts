import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostBinding,
  inject,
  input,
  model,
} from "@angular/core";
import { LeadAssigneesComponent } from "@modules/Leads/screens/lead-profile-info-tab/lead-assignees/lead-assignees.component";
import { LccaPermissionsService } from "@modules/Leads/services/lcca-permissions.service";
import { LeadsService } from "@modules/Leads/services/leads.service";
import { Lead } from "@modules/Leads/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import {
  AlertService,
  CachedListsService,
  CommaSeparatedLabelsComponent,
  constants,
  DateFormatterPipe,
  EntitySelectComponent,
} from "@shared";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { LeadIdComponent } from "../lead-id.component";

@Component({
  selector: "app-lead-table-info",
  standalone: true,
  template: `
    <ul
      class="p-reset flex row-gap-2 column-gap-3"
      [ngClass]="{
        'flex-row flex-wrap align-items-center': isListLayout(),
        'flex-column': !isListLayout()
      }"
    >
      <!-- lead id -->
      @if ((!settings().length || isVisible("lead_id")) && isListLayout()) {
        <li>
          <app-lead-id [leadId]="lead().id" />
        </li>
      }

      <!-- interests -->
      @if ((!settings().length || isVisible("interests")) && interests().length) {
        <li class="flex gap-1 align-items-center">
          <i [class]="constants.icons.heart + ' text-red'"></i>
          <app-comma-separated-labels
            [sliceCount]="sliceCount()"
            [items]="interests()"
            [tooltip]="'interests' | translate"
          />
        </li>
      }

      <!-- tags -->
      @if ((!settings().length || isVisible("tags")) && tags().length) {
        <li class="flex gap-1 align-items-center">
          <i [class]="constants.icons.tag + ' text-dark-purple'"></i>
          <app-comma-separated-labels
            [sliceCount]="sliceCount()"
            [items]="tags()"
            [tooltip]="'tags' | translate"
          />
        </li>
      }

      <!-- source -->
      @if ((!settings().length || isVisible("source")) && lead().source_id) {
        <li class="text-xs font-medium">
          <span [pTooltip]="'lead_source' | translate" tooltipPosition="top">
            <i class="fas fa-circle-dot text-teal-500"></i>
            <span class="pl-1">
              {{ leadSource() }}
            </span>
          </span>
        </li>
      }

      <!-- creator -->
      @if ((!settings().length || isVisible("creator")) && lead().created_by) {
        <li class="text-xs font-medium">
          <span [pTooltip]="'creator' | translate" tooltipPosition="top">
            <i class="fas fa-user-pen"></i>
            <span class="pl-1">
              {{ leadCreator() }}
            </span>
          </span>
        </li>
      }

      <!-- created at -->
      @if ((!settings().length || isVisible("created_at")) && lead().created_at) {
        <li class="text-xs font-medium">
          <span [pTooltip]="'created_at' | translate" tooltipPosition="top">
            <i class="fas fa-calendar-days"></i>
            <span class="pl-1">
              {{ lead().created_at | dateFormatter: "absolute" }}
            </span>
          </span>
        </li>
      }

      @if (isListLayout()) {
        <li class="ml-auto"></li>
      }

      <!-- assignees -->
      @if (checkPermission("update-??-assignment")) {
        @if (isVisible("assignees") && assignees().length) {
          <li class="flex flex-wrap align-items-center gap-1">
            <i class="fas fa-user-tie text-indigo-600"></i>
            <app-comma-separated-labels
              [sliceCount]="sliceCount()"
              [items]="assignees()"
              [tooltip]="'assignees' | translate"
            />

            <app-lead-assignees
              [(lead)]="lead"
              [withItemLable]="false"
              [withAvatars]="false"
              btnStyleClass="p-button-text p-button-rounded text-xs p-0 w-2rem h-2rem"
            />
          </li>
        }
      }

      <!-- lead lists -->
      @if (isVisible("rating_id")) {
        <li>
          <app-entity-select
            [(entity)]="lead"
            [endpoint]="constants.API_ENDPOINTS.updateCustomDataNoPermission"
            apiVersion="v2"
            styleClass="lead-rating-select"
            listModule="dynamic_list"
            listName="ratings"
            updateType="rating_id"
            placeholder="rating"
            (onChange)="leadsService.updateLeadInList($event)"
          />
        </li>
      }

      @if (isVisible("lead_list_id")) {
        <li>
          <app-entity-select
            [(entity)]="lead"
            [endpoint]="constants.API_ENDPOINTS.updateCustomDataNoPermission"
            apiVersion="v2"
            listModule="dynamic_list"
            listName="lead_lists"
            updateType="lead_list_id"
            placeholder="list"
            (onChange)="leadsService.updateLeadInList($event)"
          />
        </li>
      }

      @if (isVisible("lead_quality_id")) {
        <li>
          <app-entity-select
            [(entity)]="lead"
            [endpoint]="constants.API_ENDPOINTS.updateCustomDataNoPermission"
            apiVersion="v2"
            listModule="dynamic_list"
            listName="lead_qualities"
            updateType="lead_quality_id"
            placeholder="quality"
            (onChange)="leadsService.updateLeadInList($event)"
          />
        </li>
      }

      @if (isVisible("lead_classification_id")) {
        <li>
          <app-entity-select
            [(entity)]="lead"
            [endpoint]="constants.API_ENDPOINTS.updateCustomDataNoPermission"
            apiVersion="v2"
            listModule="dynamic_list"
            listName="lead_classifications"
            updateType="lead_classification_id"
            placeholder="classification"
            (onChange)="leadsService.updateLeadInList($event)"
          />
        </li>
      }
      @if (isVisible("pipeline_stage")) {
        <li>
          <app-entity-select
            [(entity)]="lead"
            [endpoint]="constants.API_ENDPOINTS.updateCustomData"
            apiVersion="v2"
            listModule="pipelines"
            listName="deal_pipelines"
            updateType="pipeline_stage_id"
            placeholder="pipeline_stage"
            (onChange)="leadsService.updateLeadInList($event)"
          />
        </li>
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    ButtonModule,
    TooltipModule,
    LeadAssigneesComponent,
    EntitySelectComponent,
    CommaSeparatedLabelsComponent,
    LeadIdComponent,
    DateFormatterPipe,
    TranslateModule,
  ],
})
export class LeadTableInfoComponent {
  leadsService = inject(LeadsService);
  alert = inject(AlertService);
  #cachedLists = inject(CachedListsService);
  #lccaPermissions = inject(LccaPermissionsService);

  lead = model.required<Lead>();
  settings = input<any>([]);
  isListLayout = model(true);
  sliceCount = computed(() => (this.isListLayout() ? 1 : 3));
  constants = constants;

  @HostBinding("class.w-full") protected get computedHostClasses() {
    return this.isListLayout();
  }

  leadCreator = computed(() => {
    return this.#cachedLists
      .loadLists()
      .get("assignments:all_users_info")
      ?.find((user: { value: number }) => user.value == this.lead().created_by)?.label;
  });

  leadSource = computed(() => {
    return this.#cachedLists
      .loadLists()
      .get("dynamic_list:sources")
      ?.find((s: { value: number }) => s.value == this.lead().source_id)?.label;
  });

  isVisible(name: string) {
    return this.settings()?.find((i: any) => i.name === name)?.value;
  }

  interests = computed(() => {
    const interests = this.#cachedLists.loadLists().get("interests:interests");
    return (
      interests?.filter((i: { value: number }) => this.lead()?.interests_ids?.includes(i.value)) ||
      []
    );
  });

  tags = computed(() => {
    const tags = this.#cachedLists.loadLists().get("tags:tags");
    return tags?.filter((i: { value: number }) => this.lead()?.tags_ids?.includes(i.value)) || [];
  });

  assignees = computed(() => {
    const users = this.#cachedLists.loadLists().get("assignments:all_users_info");
    return (
      users?.filter((u: { value: number }) => this.lead()?.assignees_ids?.includes(u.value)) || []
    );
  });

  checkPermission(name: string) {
    return this.#lccaPermissions.checkPermission(this.lead().lead_type_id, name);
  }
}
