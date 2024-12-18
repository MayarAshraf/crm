import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import {
  DEFAULT_INTERRUPTSOURCES,
  Idle,
  IdleExpiry,
  NgIdleModule,
  SimpleExpiry,
} from "@ng-idle/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { AuthService } from "../services";

@Component({
  selector: "app-idle",
  standalone: true,
  providers: [Idle, { provide: IdleExpiry, useClass: SimpleExpiry }],
  imports: [NgClass, DialogModule, NgIdleModule, ButtonModule, TranslateModule],
  template: `
    <p-dialog
      [(visible)]="visible"
      [style]="{ width: '450px' }"
      [breakpoints]="{ '768px': '95%' }"
      position="top"
      contentStyleClass="py-5 px-3 border-round"
      [modal]="true"
      [showHeader]="false"
      [closable]="false"
      [dismissableMask]="false"
      [closeOnEscape]="false"
      [draggable]="true"
      [resizable]="true"
    >
      <div class="flex flex-column align-items-center justify-content-center gap-3">
        <img
          width="60"
          [src]="isUserIdle() ? 'assets/media/icons/idle.svg' : 'assets/media/icons/not-idle.svg'"
        />
        <p
          class="my-0 font-medium text-center"
          [ngClass]="{ 'text-green-500': !isUserIdle(), 'text-red-500': isUserIdle() }"
          [innerHTML]="idleState()"
        ></p>
        <div class="w-full flex gap-3 justify-content-end">
          <button
            pButton
            (click)="handleLogout()"
            label="{{ 'Logout' | translate }}"
            class="flex-1 p-button-danger p-button-outlined text-sm py-2"
          ></button>
          <button
            pButton
            (click)="keepLoggedIn()"
            label="{{ 'Keep me logged in!' | translate }}"
            class="flex-1 p-button-success p-button-outlined text-sm py-2"
          ></button>
        </div>
      </div>
    </p-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdleComponent {
  #authService = inject(AuthService);
  #router = inject(Router);
  #idle = inject(Idle);
  #translate = inject(TranslateService);
  #destroyRef = inject(DestroyRef); // Current "context" (this component)

  idleState = signal("");
  visible = signal(false);
  isUserIdle = signal(false);

  #IDLE_TIME = this.#authService.idleTime;
  #IDLE_TIMEOUT = 20;

  ngOnInit() {
    this.#idle.stop();
    this.#setupIdleService();
    this.#reset();
  }

  #setupIdleService() {
    this.#idle.setIdle(this.#IDLE_TIME());
    this.#idle.setTimeout(this.#IDLE_TIMEOUT);
    this.#idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.#idle.onIdleEnd.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
      this.idleState.set(this.#translate.instant(_("No longer idle")));
      this.isUserIdle.set(false);
    });

    this.#idle.onTimeout.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
      this.handleLogout(true);
    });

    this.#idle.onIdleStart.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
      this.isUserIdle.set(true);
      this.visible.set(true);
    });

    this.#idle.onTimeoutWarning.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(countdown => {
      const warning = this.#translate.instant(_("idle warning"), { countdown });
      this.idleState.set(warning);
    });
  }

  #reset() {
    this.#idle.watch();
    this.isUserIdle.set(false);
  }

  keepLoggedIn() {
    this.visible.set(false);
    this.#reset();
  }

  handleLogout(timedOut?: boolean) {
    this.#authService.doLogout();
    this.#router.navigate(["/auth/login"], {
      queryParams: { returnUrl: this.#router.url, timed_out: timedOut },
    });
    this.visible.set(false);
  }
}
