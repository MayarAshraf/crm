import { ChangeDetectionStrategy, Component, computed, inject, model, output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { LccaPermissionsService } from "@modules/Leads/services/lcca-permissions.service";
import { LeadsService } from "@modules/Leads/services/leads.service";
import { Lead } from "@modules/Leads/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import {
  CachedListsService,
  CopyButtonComponent,
  EntitySelectComponent,
  InplaceDescComponent,
  ListInfoComponent,
  MaskTogglerComponent,
  constants,
} from "@shared";
import { ButtonModule } from "primeng/button";
import { TabViewModule } from "primeng/tabview";
import { LeadAssigneesComponent } from "./lead-assignees/lead-assignees.component";
import { LeadInterestsComponent } from "./lead-interests/lead-interests.component";
import { LeadTagsComponent } from "./lead-tags/lead-tags.component";
import { LeadTimelineComponent } from "./lead-timeline/lead-timeline.component";

@Component({
  selector: "app-lead-profile-info-tab",
  standalone: true,
  templateUrl: "./lead-profile-info-tab.component.html",
  styleUrls: ["./lead-profile-info-tab.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    ButtonModule,
    LeadInterestsComponent,
    LeadTagsComponent,
    LeadAssigneesComponent,
    ListInfoComponent,
    TabViewModule,
    LeadTimelineComponent,
    CopyButtonComponent,
    EntitySelectComponent,
    MaskTogglerComponent,
    InplaceDescComponent,
    TranslateModule,
  ],
})
export class LeadProfileInfoTabComponent {
  leadsService = inject(LeadsService);
  #cachedLists = inject(CachedListsService);
  #lccaPermissions = inject(LccaPermissionsService);

  lead = model.required<Lead>();
  organization = model.required<string | null>();
  campaign = model.required<string | null>();

  onTabClicked = output<string>();

  constants = constants;

  getLabel(slug: string, prop: keyof Lead): string {
    return this.#cachedLists
      .loadLists()
      .get(slug)
      ?.find((data: { value: number }) => data.value === this.lead()[prop])?.label;
  }

  leadSource = computed(() => {
    return this.getLabel("dynamic_list:sources", "source_id");
  });

  leadCreator = computed(() => {
    return this.getLabel("assignments:all_users_info", "created_by");
  });

  leadIndustry = computed(() => {
    return this.getLabel("dynamic_list:industries", "industry_id");
  });

  leadJob = computed(() => {
    return this.getLabel("dynamic_list:jobs", "job_id");
  });

  leadDepartment = computed(() => {
    return this.getLabel("dynamic_list:departments", "department_id");
  });

  leadCountry = computed(() => {
    return this.getLabel("locations:countries:ids:null", "country_id");
  });

  leadRegion = computed(() => {
    return this.getLabel(`locations:regions:ids:${this.lead().country_id}`, "region_id");
  });

  leadCity = computed(() => {
    return this.getLabel(`locations:cities:ids:${this.lead().region_id}`, "city_id");
  });

  leadArea = computed(() => {
    return this.getLabel(`locations:areas:ids:${this.lead().city_id}`, "area_place_id");
  });

  checkPermission(name: string) {
    return this.#lccaPermissions.checkPermission(this.lead().lead_type_id, name);
  }
}
