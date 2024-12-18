import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { DatePipe, NgClass, NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  TemplateRef,
  ViewContainerRef,
  computed,
  contentChild,
  inject,
  model,
  signal,
  viewChild,
} from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ReportsService } from "@modules/Reports/Services/get-report.service";
import {
  DateFormatterPipe,
  DateRangeComponent,
  DefaultScreenHeaderComponent,
  LangService,
  SidebarComponent,
  StaticDataService,
} from "@shared";
import { AccordionModule } from "primeng/accordion";
import { ButtonModule } from "primeng/button";
import { PanelMenuModule } from "primeng/panelmenu";
import { SidebarModule } from "primeng/sidebar";
import { filter, map } from "rxjs";

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [
    NgTemplateOutlet,
    SidebarComponent,
    DateRangeComponent,
    ButtonModule,
    PanelMenuModule,
    SidebarModule,
    NgClass,
    AccordionModule,
    DefaultScreenHeaderComponent,
  ],
  providers: [DatePipe, DateFormatterPipe],
  templateUrl: `./layout.component.html`,
  styleUrl: `./layout.component.scss`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);
  #breakpointObserver = inject(BreakpointObserver);
  #staticData = inject(StaticDataService);
  #destroyRef = inject(DestroyRef);
  currentLang = inject(LangService).currentLanguage;
  dateRange = inject(ReportsService).dateRange;
  #formatDate = inject(DateFormatterPipe);
  #datePipe = inject(DatePipe);

  menuItemsGroups = this.#staticData.menuItemReport;
  showSidebar = model<boolean>(true);

  dynamicSidebar = viewChild.required("dynamicSidebar", { read: ViewContainerRef });
  reportTemplate = contentChild<TemplateRef<any>>("reportContent");
  routerOutletTemplate = contentChild<TemplateRef<any>>("routerOutlet");

  filterMenuItemsGroups = signal(this.#staticData.menuItemReport);
  title = signal("");
  icon = signal("");
  isReportPage = signal(true);

  endDate = computed(() => new Date(this.dateRange()[0]));

  ngOnInit() {
    this.loadDataFromRoute(this.#activatedRoute);
    this.setDateRange([new Date(), new Date()]);

    this.#router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(() => this.loadDataFromRoute(this.#activatedRoute));
  }

  setDateRange(dates: Date[] | null) {
    const transferdDate = dates?.map(
      item => this.#datePipe.transform(item, "yyyy-MM-dd") as string,
    );
    this.dateRange.set(transferdDate as string[]);
  }

  loadDataFromRoute(route: ActivatedRoute): void {
    const childRoute = this.#childRoute(route);
    this.title.set(childRoute.snapshot.data.title);
    this.icon.set(childRoute.snapshot.data.icon);
    this.isReportPage.set(this.checkUrlLink(this.#router.url));
  }

  #childRoute(activatedRoute: ActivatedRoute): ActivatedRoute {
    while (activatedRoute.firstChild) {
      activatedRoute = activatedRoute.firstChild;
    }
    return activatedRoute;
  }

  checkUrlLink(link: string): boolean {
    return link === "/reports";
  }

  #isDesktopActive$ = this.#breakpointObserver
    .observe(["(min-width: 768px)"])
    .pipe(map((state: BreakpointState) => state.matches));

  isDesktopActive = toSignal(this.#isDesktopActive$, { initialValue: true });
}
