import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  effect,
  inject,
  viewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { LoadingBarModule } from "@ngx-loading-bar/core";
import { TranslateModule } from "@ngx-translate/core";
import {
  AlertService,
  AuthService,
  ConfettiComponent,
  ConfirmDialogComponent,
  IdleComponent,
  LoadModulesService,
  SoundsService,
} from "@shared";
import { PrimeNGConfig } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ConfirmDialog } from "primeng/confirmdialog";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    LoadingBarModule,
    ButtonModule,
    ConfettiComponent,
    ToastModule,
    ConfirmPopupModule,
    IdleComponent,
    TranslateModule,
    ConfirmDialogComponent,
  ],
})
export class AppComponent implements OnInit {
  #primengConfig = inject(PrimeNGConfig);
  #alert = inject(AlertService);
  #sounds = inject(SoundsService);
  #router = inject(Router);
  #authService = inject(AuthService);
  #destroyRef = inject(DestroyRef); // Current "context" (this component)
  #loadModulesService = inject(LoadModulesService);

  isLoggedIn = this.#authService.isLoggedIn;
  isEnabledModules = this.#loadModulesService.enabledModules;

  confirmDialog = viewChild<ConfirmDialog>("confirmDialog");
  loggedInEffect = effect(() => !this.#authService.isLoggedIn() && this.confirmDialog()?.reject());

  ngOnInit() {
    this.#primengConfig.ripple = true;
    this.#handleAppSounds();

    this.#router.events.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(event => {
      if (event instanceof NavigationEnd && this.confirmDialog()) {
        this.confirmDialog()?.reject();
      }
    });
  }

  #handleAppSounds() {
    window.addEventListener("offline", () => {
      this.#alert.setMessage({
        severity: "warn",
        detail: `Oops! It seems that you are offline.Please check your internet connection.`,
        summary: "You are offline...",
        icon: "pi pi-wifi",
      });
      this.#sounds.playSound("offline");
    });

    window.addEventListener("online", () => {
      this.#alert.setMessage({
        severity: "success",
        detail: `Again You are online now.`,
        summary: "Voila... Welcome Back",
        icon: "pi pi-wifi",
      });
      this.#sounds.playSound("online");
    });
  }
}
