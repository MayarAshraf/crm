import { NgClass, NgStyle } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { ConnectedOverlayScrollHandler } from "primeng/dom";
import { OverlayPanel, OverlayPanelModule } from "primeng/overlaypanel";
import { TooltipModule } from "primeng/tooltip";
import { finalize } from "rxjs";
import { constants } from "../../config";
import { ApiService, GlobalApiResponse, RequestHeaders, RequestParams } from "../../services";
import { FormComponent } from "../form.component";

@Component({
  selector: "app-popup-form",
  standalone: true,
  template: `
    <div class="popup-form-holder flex flex-wrap align-items-center gap-1">
      <ng-content></ng-content>
      <button
        pButton
        (click)="op.toggle($event)"
        [icon]="btnIcon()"
        [iconPos]="iconPos()"
        [label]="btnLabel() | translate"
        [pTooltip]="btnTooltip() | translate"
        [tooltipPosition]="tooltipPosition()"
        [ngClass]="{ 'hovered-edit': isEditHovered() }"
        [class]="btnStyleClass()"
        [ngStyle]="btnStyle()"
      ></button>
    </div>

    <p-overlayPanel
      #op
      [styleClass]="(isLgPanel() ? 'lg-panel' : '') + ' ' + (isSmPanel() ? 'sm-panel' : '')"
    >
      <ng-template pTemplate="content">
        <ng-content select="[topForm]"></ng-content>
        <app-form
          [form]="form"
          [model]="model()"
          [fields]="fields()"
          submitButtonClass="py-1 transition-none"
          [buttonLabel]="'save' | translate"
          [submitBtnLoading]="isLoading()"
          (onSubmit)="submitForm()"
        />
      </ng-template>
    </p-overlayPanel>
  `,
  styles: `
    :host { font-size: 0 }
    ::ng-deep {
      .hovered-edit .p-button-icon {
        opacity: 0;
        visibility: hidden;
        transition:
          opacity 0.2s,
          visibility 0.2s;
      }

      .popup-form-holder:hover {
        .hovered-edit .p-button-icon {
          opacity: 1;
          visibility: visible;
        }
      }
    }
  `,
  imports: [
    NgClass,
    NgStyle,
    ButtonModule,
    TooltipModule,
    OverlayPanelModule,
    FormComponent,
    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupFormComponent {
  public api = inject(ApiService);
  #destroyRef = inject(DestroyRef); // Current "context" (this class)

  form = new FormGroup({});
  model = input.required();
  fields = input.required<FormlyFieldConfig[]>();
  endpoint = input.required<string>();
  payload = input.required();
  isLoading = signal<boolean>(false);
  headers = input<RequestHeaders>();
  params = input<RequestParams>();
  apiVersion = input<string>();
  isEditHovered = input<boolean>(true);
  btnIcon = input<string>(`${constants.icons.pencil} text-xs`);
  iconPos = input<"left" | "right" | "top" | "bottom">("right");
  btnTooltip = input("");
  tooltipPosition = input<string>("top");
  btnLabel = input("");
  isLgPanel = input<boolean>(false);
  isSmPanel = input<boolean>(false);
  btnStyleClass = input<string>("p-button-link text-gray text-xs w-auto p-1");
  btnStyle = input<{ [klass: string]: any }>();

  updateUi = output<any>();

  overlayPanel = viewChild.required<OverlayPanel>("op");

  hidePanel() {
    this.overlayPanel().hide();
  }

  // Keep overlay panel open on page scroll
  // https://github.com/primefaces/primeng/issues/11470
  ngOnInit() {
    if (!this.overlayPanel()) return;
    this.overlayPanel().bindScrollListener = () => {
      if (!this.overlayPanel().scrollHandler) {
        this.overlayPanel().scrollHandler = new ConnectedOverlayScrollHandler(
          this.overlayPanel().target,
          () => {
            this.overlayPanel().align();
          },
        );
      }
      this.overlayPanel().scrollHandler?.bindScrollListener();
    };
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
      return;
    }
    this.isLoading.set(true);

    this.api
      .request(
        "post",
        this.endpoint(),
        this.payload(),
        this.headers(),
        this.params(),
        this.apiVersion(),
      )
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe((res: GlobalApiResponse) => {
        this.updateUi.emit(res.data);
        this.hidePanel();
      });
  }
}
