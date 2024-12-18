import { Injectable, inject, signal } from "@angular/core";
import { ApiService } from "@shared";
import { Observable, map, shareReplay } from "rxjs";
import { Lead, LeadTimeline } from "./service-types";

@Injectable({
  providedIn: "root",
})
export class LeadsService {
  #api = inject(ApiService);

  // lead list
  leadList = signal<Lead[]>([]);
  totalLeads = signal<number>(0);
  leadsFiltered = signal<number>(0);

  updateLeadInList(lead: Lead) {
    this.leadList.update(list =>
      list.map(item => (item.id === lead.id ? { ...item, ...lead } : item)),
    );
  }

  // lead timeline
  leadTimeline = signal<LeadTimeline[]>([]);

  setLeadTimeline(leadTimeline: LeadTimeline[]) {
    this.leadTimeline.set(leadTimeline);
  }

  appendEventToTimeline(event: LeadTimeline) {
    this.leadTimeline.update(list => [event, ...list]);
  }

  // lead timeline
  getLeadTimeline(id: number, page: number = 1) {
    return this.#api
      .request(
        "get",
        `leads/leads/timeline?id=${id}&page=${page}`,
        undefined,
        undefined,
        undefined,
        "v2",
      )
      .pipe(map(({ data }) => data));
  }

  #detailsCache = new Map<number, Observable<any>>();

  getLeadDetails(
    lead_id: number,
    details = ["phones", "social_accounts", "organization", "recent_campaign"],
    is_full_lead = true,
  ): Observable<any> {
    if (!this.#detailsCache.has(lead_id)) {
      const observable = this.#api
        .request(
          "post",
          "leads/leads/get-details",
          { lead_id, details, is_full_lead },
          undefined,
          undefined,
          "v2",
        )
        .pipe(
          shareReplay(1),
          map(({ data }) => data),
        );

      this.#detailsCache.set(lead_id, observable);
    }
    return this.#detailsCache.get(lead_id) as Observable<any>;
  }

  getLeadSources(id: number) {
    return this.#api
      .request(
        "post",
        "leads/leads/get-sources",
        {
          lead_id: id,
        },
        undefined,
        undefined,
        "v2",
      )
      .pipe(map(({ data }) => data));
  }
}
