import { Injectable, inject, signal } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LoadModulesService, StaticDataService, constants } from "@shared";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";

@Injectable({
  providedIn: "root",
})
export class ReportsMenuItemsService {
  #enabledModules = inject(LoadModulesService).enabledModules;
  #staticData = inject(StaticDataService);
  #translate = inject(TranslateService);

  #activitiesItems = signal(this.#staticData.activityLinks);
  #meetingsItems = signal(this.#staticData.meetingLinks);
  #leadsItems = signal(this.#staticData.leadLinks);
  #smartReportsItems = signal(this.#staticData.smartReportsLinks);

  reportsMenuItems = signal([
    {
      icon: "fas fa-chart-line",
      label: this.#translate.instant(_("reports")),
      tooltip: this.#translate.instant(_("reports")),
      tooltipPosition: "right",
      routerLink: `/reports`,
      routerLinkActiveOptions: { exact: true },
      visible: this.#enabledModules()?.includes(constants.modulesNames["Reports Module"]),
      items: [
        {
          label: this.#translate.instant(_("activities")),
          icon: "fas fa-clipboard-check",
          items: this.#activitiesItems(),
        },
        {
          label: this.#translate.instant(_("meetings")),
          icon: constants.icons.meeting,
          items: this.#meetingsItems(),
        },
        {
          label: this.#translate.instant(_("leads")),
          icon: "fas fa-database",
          items: this.#leadsItems(),
        },
        {
          label: this.#translate.instant(_("smart_reports")),
          icon: "fas fa-file-contract",
          items: this.#smartReportsItems(),
        },
      ],
    },
  ]);
}
