import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  model,
  output,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormGroup } from "@angular/forms";
import { ApiService } from "@gService/api.service";
import { GlobalApiResponse } from "@gService/global";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { constants } from "../config";
import { FormComponent } from "./form.component";

interface IEntity {
  [key: string]: any;
}

@Component({
  selector: "app-inplace-input",
  standalone: true,
  imports: [NgClass, FormComponent, ButtonModule, TooltipModule, TranslateModule],
  template: `
    <div class="inplace-form-holder" [ngClass]="!isEditing() ? 'inline-block' : ''">
      @if (!isEditing()) {
        <button
          pButton
          type="button"
          (click)="startEditing()"
          [icon]="constants.icons.pencil + ' text-xs'"
          iconPos="right"
          [label]="btnLabel() || entity()[updateType()] || enterBtnLabel() | translate"
          [pTooltip]="
            entity()[updateType()] ? (editBtnLabel() | translate) : (enterBtnLabel() | translate)
          "
          tooltipPosition="top"
          [class]="
            (entity()[updateType()] ? 'text-gray' : 'text-500') +
            ' hovered-edit shadow-none p-button-link w-auto p-0' +
            ' ' +
            btnStyleClass()
          "
        ></button>
      } @else {
        <app-form
          class="inplace-form"
          [form]="form"
          [model]="model()"
          [fields]="fields()"
          [showFormActions]="false"
        />
      }
    </div>
  `,
  styles: `
    ::ng-deep {
      .hovered-edit .p-button-icon {
        opacity: 0;
        visibility: hidden;
        transition:
          opacity 0.2s,
          visibility 0.2s;
      }

      .inplace-form-holder:hover {
        .hovered-edit .p-button-icon {
          opacity: 1;
          visibility: visible;
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InplaceDescComponent<T extends IEntity> {
  #api = inject(ApiService);
  #destroyRef = inject(DestroyRef); // Current "context" (this class)

  entity = model.required<T>();
  endpoint = input.required<string>();
  apiVersion = input("v2");
  updateType = input("description");
  inputType = input("textarea");
  enterBtnLabel = input("enter_description");
  editBtnLabel = input("edit_description");
  btnLabel = input("");
  btnStyleClass = input("");

  onUpdateUi = output<T>();

  form = new FormGroup({});
  isEditing = signal(false);
  constants = constants;

  updateUi(entity: T) {
    this.entity.update(oldEntity => ({
      ...oldEntity,
      [this.updateType()]: entity[this.updateType()],
    }));
    this.onUpdateUi.emit(entity);
  }

  model = computed(() => ({ [this.updateType()]: this.entity()[this.updateType()] }));

  fields = computed<FormlyFieldConfig[]>(() => [
    {
      key: this.updateType(),
      type: this.inputType(),
      expressions: {
        focus: () => this.isEditing(),
      },
      props: {
        keypress: (field, event) => {
          if (event.key !== "Enter") return;
          event.preventDefault();
          this.submitForm(event.target.value);
        },
        blur: () => {
          this.cancelEditing();
        },
      },
    },
  ]);

  startEditing() {
    this.isEditing.set(true);
  }

  cancelEditing() {
    this.isEditing.set(false);
  }

  submitForm(updateValue: any) {
    if (this.form.invalid) return;

    this.#api
      .request(
        "post",
        this.endpoint(),
        {
          id: this.entity().id,
          update_type: this.updateType(),
          update_value: updateValue,
        },
        undefined,
        undefined,
        this.apiVersion(),
      )
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((res: GlobalApiResponse) => {
        this.updateUi(res.data);
        this.cancelEditing();
      });
  }
}
