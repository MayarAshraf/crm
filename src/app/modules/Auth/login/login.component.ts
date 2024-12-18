import { HttpErrorResponse } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  DestroyRef,
  OnInit,
  ViewContainerRef,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormGroup, FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { AlertComponent, AlertService, AuthService, FormComponent, constants } from "@shared";
import { CheckboxChangeEvent, CheckboxModule } from "primeng/checkbox";
import { LoginSplashComponent } from "./login-splash/login-splash.component";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  standalone: true,
  imports: [TranslateModule, FormComponent, CheckboxModule, FormsModule, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  #activatedRoute = inject(ActivatedRoute);
  #authService = inject(AuthService);
  #translate = inject(TranslateService);
  #alert = inject(AlertService);
  #router = inject(Router);
  #destroyRef = inject(DestroyRef); // Current "context" (this component)

  splashContainerRef = viewChild.required("splashContainer", { read: ViewContainerRef });

  #splashComponentRef!: ComponentRef<LoginSplashComponent>;

  returnUrl!: string;
  isError = signal(false);
  timedOut = signal(false);

  idleChecked = this.#authService.idleTime() === constants.IDLE_LONG_TIME;

  model: any = {};
  loginForm = new FormGroup({});

  fields: FormlyFieldConfig[] = [
    {
      key: "email",
      type: "input-field",
      className: "login-input",
      props: {
        required: true,
        label: "my.email@company.com",
        placeholder: "my.email@company.com",
      },
      validators: {
        validation: ["email"],
      },
    },
    {
      key: "password",
      type: "password-field",
      className: "login-input",
      props: {
        required: true,
        placeholder: "********",
        toggleMask: true,
      },
    },
  ];

  ngOnInit(): void {
    // the queryParams observable is used to get the value of the returnUrl and state parameters from the AuthGuard.
    this.#activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(params => {
        this.timedOut.set(!!params["timed_out"]);
        this.returnUrl = params["returnUrl"] || constants.LOGIN_SUCCESS_REDIRECT_URL;
        this.#alert.setMessage({ severity: "error", detail: params["message"] ?? "" });
      });
  }

  login(model: any): void {
    if (this.loginForm.invalid) return; // return early

    this.#splashComponentRef = this.splashContainerRef().createComponent(LoginSplashComponent);
    this.isError.set(false);
    model = { ...model, web_app: true };
    this.#authService
      .login(model)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => this.#router.navigateByUrl(this.returnUrl),
        // `navigateByUrl` can handle absolute paths which might include query parameters or fragments if they are ever added to the `returnUrl`.
        error: (error: HttpErrorResponse) => {
          this.#hideLoginSplashComponent();

          if (error.status === 401) {
            this.isError.set(true);
            this.timedOut.set(false);
          }
        },
      });
  }

  #hideLoginSplashComponent() {
    if (this.#splashComponentRef) {
      this.#splashComponentRef.destroy();
      this.splashContainerRef().clear();
    }
  }

  ngOnDestroy(): void {
    this.#hideLoginSplashComponent();
  }

  updateIdleTime(event: CheckboxChangeEvent) {
    if (event.checked) {
      this.#authService.updateIdleTime(constants.IDLE_LONG_TIME);
    } else {
      this.#authService.updateIdleTime(constants.IDLE_TIME);
    }
  }
}
