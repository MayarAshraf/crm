import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FieldArrayType, FormlyFieldConfig, FormlyModule } from "@ngx-formly/core";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "formly-repeat",
  template: `
    <div>
      @if (props.label) {
        <label>{{ props.label }}</label>
      }
      @if (props.description) {
        <p class="mb-3 text-xs">{{ props.description }}</p>
      }
      @for (
        field of field.fieldGroup;
        track field.id;
        let i = $index;
        let f = $first;
        let l = $last
      ) {
        <div class="flex align-items-start" [ngClass]="{ 'gap-2': !f }">
          <formly-field [field]="field" class="flex-auto"></formly-field>
          <div class="p-field">
            @if (!f) {
              <button
                pButton
                type="button"
                class="delete-repeater text-xs p-2 p-button-danger"
                icon="fas fa-trash text-xs"
                (click)="remove(i)"
                label="{{ props.removeBtnText }}"
              ></button>
              <!-- <button pButton class="text-xs p-2" icon="pi pi-chevron-up" type="button" (click)="reorderUp(i)"></button> -->
            }
            <!-- @if (!l) {
                <button pButton class="text-xs p-2" icon="pi pi-chevron-down" type="button" (click)="reorderDown(i)"></button>
              } -->
          </div>
        </div>
      }

      <div class="mb-3 text-right">
        <button
          pButton
          class="text-xs p-2"
          type="button"
          icon="fas fa-plus text-xs"
          (click)="add()"
          [disabled]="props.disabledRepeater"
          label="{{ props.addBtnText }}"
        ></button>
      </div>
    </div>
  `,
  standalone: true,
  styles: `
    .delete-repeater {
      height: var(--field-height);
    }
  `,
  imports: [NgClass, FormlyModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepeatTypeComponent extends FieldArrayType {
  customAdd() {
    if (this.props.add) {
      this.props.add(this);
    } else {
      this.add();
    }
  }

  customRemove(i: number) {
    if (this.props.remove) {
      this.props.remove(this, i);
    } else {
      this.remove(i);
    }
  }

  onAdd(field: FormlyFieldConfig) {
    super.add();
  }

  onRemove(i: number) {
    super.remove(i);
  }

  reorderUp(i: number) {
    if (i === 0) return;
    this.#reorder(i, i - 1);
  }

  reorderDown(i: number) {
    if (i === this.formControl.length - 1) return;
    this.#reorder(i, i + 1);
  }

  #reorder(oldI: number, newI: number) {
    const m = this.model[oldI];
    this.remove(oldI);
    this.add(newI, m);
  }
}
