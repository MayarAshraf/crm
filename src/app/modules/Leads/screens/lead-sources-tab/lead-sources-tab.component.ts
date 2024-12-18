import { KeyValuePipe, NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, input, signal } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { LeadsService } from "@modules/Leads/services/leads.service";
import { Lead } from "@modules/Leads/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import { CachedListsService } from "@shared";
import { TableModule } from "primeng/table";
import { TabViewModule } from "primeng/tabview";
import { TooltipModule } from "primeng/tooltip";
import { Observable, finalize, map, switchMap } from "rxjs";

@Component({
  selector: "app-lead-sources-tab",
  standalone: true,
  templateUrl: "./lead-sources-tab.component.html",
  styleUrl: "./lead-sources-tab.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TabViewModule, NgTemplateOutlet, KeyValuePipe, TableModule, TooltipModule,TranslateModule],
})
export class LeadSourcesTabComponent {
  #leadsService = inject(LeadsService);
  #cachedLists = inject(CachedListsService);

  lead = input.required<Lead>();
  isLoading = signal(true);

  getLabel(slug: string, id: number): string {
    return this.#cachedLists
      .loadLists()
      .get(slug)
      ?.find((data: { value: number }) => data.value === id)?.label;
  }

  sources$: Observable<any[]> = toObservable(this.lead).pipe(
    switchMap(lead =>
      this.#leadsService.getLeadSources(lead.id).pipe(
        map(({ data }) => data),
        finalize(() => this.isLoading.set(false)),
      ),
    ),
  );

  sources = toSignal(this.sources$, { initialValue: [] });
}
