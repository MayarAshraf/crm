import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { SettingsMenuItemsService } from "@modules/Settings/Services/settings-menu-items.service";
import { LangService } from "@shared";
import { MenuItem } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { PanelMenuModule } from "primeng/panelmenu";
import { SidebarModule } from "primeng/sidebar";
import { map, tap } from "rxjs";

@Component({
  selector: "app-menu-sidebar",
  templateUrl: "./menu-sidebar.component.html",
  styleUrls: ["./menu-sidebar.component.scss"],
  standalone: true,
  imports: [RouterLink, ButtonModule, PanelMenuModule, SidebarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuSidebarComponent {
  #router = inject(Router);
  #breakpointObserver = inject(BreakpointObserver);
  #SettingsMenuItems = inject(SettingsMenuItemsService);
  currentLang = inject(LangService).currentLanguage;
  #destroyRef = inject(DestroyRef); // Current "context" (this component)

  displayMenuSidebar = signal(true);
  menuItems = signal<MenuItem[]>([]);

  #isDesktopActive$ = this.#breakpointObserver.observe(["(min-width: 992px)"]).pipe(
    map((state: BreakpointState) => state.matches),
    tap(state => this.#updateMenuItems(state)),
  );

  isDesktopActive = toSignal(this.#isDesktopActive$, { initialValue: true });

  #updateMenuItems(state: boolean): void {
    const sidebarMenuItems = this.#SettingsMenuItems.sidebarMenuItems();
    const startHeaderItems = this.#SettingsMenuItems.startHeaderItems();
    const endHeaderItems = this.#SettingsMenuItems.endHeaderItems();

    if (state) {
      this.displayMenuSidebar.set(true);
      this.menuItems.set(sidebarMenuItems);
    } else {
      this.displayMenuSidebar.set(false);
      this.menuItems.set([...startHeaderItems, ...sidebarMenuItems, ...endHeaderItems]);
      this.handleNavigationEvents();
    }
  }

  handleNavigationEvents() {
    this.#router.events.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.displayMenuSidebar.set(false);
      }
    });
  }
}
