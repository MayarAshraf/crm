import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { SettingsMenuItemsService } from "@modules/Settings/Services/settings-menu-items.service";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { MenubarModule } from "primeng/menubar";
import { map } from "rxjs";
import { AddNewComponent } from "./add-new/add-new.component";
import { GlobalSearchComponent } from "./global-search/global-search.component";
import { MenuSidebarComponent } from "./menu-sidebar/menu-sidebar.component";
import { TopHeaderMenuComponent } from "./top-header-menu/top-header-menu.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  standalone: true,
  imports: [
    ButtonModule,
    MenuSidebarComponent,
    UserProfileComponent,
    MenubarModule,
    DialogModule,
    TopHeaderMenuComponent,
    GlobalSearchComponent,
    AddNewComponent,
    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  startHeaderItems = inject(SettingsMenuItemsService).startHeaderItems;
  #breakpointObserver = inject(BreakpointObserver);

  searchDialogVisible = signal(false);
  isSearchExpanded = signal(false);

  globalSearch = viewChild<GlobalSearchComponent>("globalSearch");

  #isDesktopActive$ = this.#breakpointObserver
    .observe(["(min-width: 768px)"])
    .pipe(map((state: BreakpointState) => state.matches));

  isDesktopActive = toSignal(this.#isDesktopActive$, { initialValue: true });

  openSearch() {
    if (this.isDesktopActive()) {
      this.isSearchExpanded.set(true);
    } else {
      this.searchDialogVisible.set(true);
    }
    this.globalSearch()?.searchFocus();
  }
}
