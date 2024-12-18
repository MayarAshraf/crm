import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormGroup } from "@angular/forms";
import { NavigationEnd, Router } from "@angular/router";
import { FormlyFieldConfig, FormlyFormOptions } from "@ngx-formly/core";
import { TranslateService } from "@ngx-translate/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { finalize, Observable, of, switchMap } from "rxjs";
import {
  ApiService,
  AuthService,
  BaseCrudDialogMeta,
  FieldBuilderService,
  GlobalApiResponse,
} from "../../services";
import { DynamicDialogComponent } from "../dynamic-dialog/dynamic-dialog.component";
import { FormComponent } from "../form.component";

@Component({
  selector: "app-base-create-update",
  templateUrl: "./base-create-update.component.html",
  standalone: true,
  imports: [DynamicDialogComponent, FormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class BaseCreateUpdateComponent<T extends { [key: string]: any }> {
  public api = inject(ApiService);
  public translate = inject(TranslateService);
  public fieldBuilder = inject(FieldBuilderService);
  public router = inject(Router);
  public destroyRef = inject(DestroyRef); // Current "context" (this component)
  public dialogRef = inject(DynamicDialogRef);
  public dialogConfig = inject(DynamicDialogConfig);
  public editData = this.dialogConfig.data;
  #authService = inject(AuthService);

  isLoading = signal(false);
  isDisabled = computed(() => false);
  dialogMeta = new BaseCrudDialogMeta();

  model = {} as T;
  options: FormlyFormOptions = {};
  fields!: FormlyFieldConfig[];
  createUpdateForm = new FormGroup({});

  loggedInEffect = effect(() => !this.#authService.isLoggedIn() && this.closeDialog());

  constructor() {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.closeDialog();
      }
    });
  }

  protected onTitleBtnClicked() {}
  protected updateUi(data: any): Observable<any> | void {}

  protected createUpdateRecord(endpoints: { [key: string]: string }, model: T) {
    const { headers, params, updateApiVersion, createApiVersion } = this.dialogMeta;
    const isUpdateAction = this.editData?.method !== "create" && !!this.editData;

    const endpoint = isUpdateAction ? endpoints.update : endpoints.store;
    const apiVersion = isUpdateAction ? updateApiVersion : createApiVersion;

    const action = this.api.request("post", endpoint, model, headers, params, apiVersion);

    this.#manageRecord(action);
  }

  #manageRecord(action: Observable<GlobalApiResponse>) {
    if (this.createUpdateForm.invalid) {
      this.createUpdateForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    action
      .pipe(
        switchMap(response => this.updateUi(response.data) || of(response.data)),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(data => this.closeDialog(data));
  }

  closeDialog(data?: T) {
    this.dialogRef.close(data);
  }
}
