import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { FieldType, FieldTypeConfig } from "@ngx-formly/core";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { StyleClassModule } from "primeng/styleclass";
import { TreeModule } from "primeng/tree";

@Component({
  selector: "formly-tree-field",
  template: `
    <div class="p-field">
      @if (props.label) {
        <label [ngClass]="props.labelClass">{{ props.label }}</label>
      }

      @if (props.description) {
        <p class="mb-3 text-xs">{{ props.description }}</p>
      }

      <div [ngClass]="{ 'relative inline-block': props.withTogglerBtn }">
        @if (props.withTogglerBtn) {
          <button
            pButton
            type="button"
            class="p-button-sm p-button-outlined p-button-secondary"
            pStyleClass="@next"
            enterFromClass="hidden"
            enterActiveClass="scalein"
            leaveToClass="hidden"
            leaveActiveClass="fadeout"
            [hideOnOutsideClick]="true"
            [icon]="props.togglerBtnIcon"
            [label]="props.togglerBtnLabel"
          ></button>
        }

        <div [ngClass]="{ 'dropdown-menu hidden origin-bottom': props.withTogglerBtn }">
          <div class="flex align-items-center flex-wrap gap-1 mb-3">
            @if (props.withSelectionToggler) {
              <button
                pButton
                type="button"
                [label]="
                  props.isAllSelected ? ('deselect_all' | translate) : ('select_all' | translate)
                "
                (click)="props.toggleSelection && props.toggleSelection(field)"
                [disabled]="field.props.isNoFilterResult"
                class="text-xs py-1 px-2 p-button-secondary w-8rem"
              ></button>
            }

            @if (props.withCollapseToggler) {
              <button
                pButton
                type="button"
                [label]="
                  isNodeExpanded() ? ('collapse_all' | translate) : ('expand_all' | translate)
                "
                (click)="expandRecursive()"
                [loading]="expandLoading()"
                [disabled]="field.props.isNoFilterResult"
                class="text-xs py-1 px-2 p-button-secondary w-8rem"
              ></button>
            }
          </div>
          <p-tree
            [styleClass]="props.withTogglerBtn ? 'border-none p-0' : ''"
            [value]="props.options"
            [metaKeySelection]="props.metaKeySelection ?? false"
            [propagateSelectionUp]="true"
            [propagateSelectionDown]="true"
            [selection]="props.selection() ?? null"
            [selectionMode]="props.selectionMode ?? 'checkbox'"
            [filter]="props.filter"
            [layout]="props.layout ?? 'vertical'"
            [filterBy]="props.filterBy ?? 'label'"
            [filterPlaceholder]="props.filterPlaceholder"
            [scrollHeight]="props.scrollHeight ?? '300px'"
            (selectionChange)="props.selectionChange && props.selectionChange(field, $event)"
            (onFilter)="props.onFilter && props.onFilter(field, $event)"
            (onNodeSelect)="props.onNodeSelect && props.onNodeSelect(field, $event)"
            (onNodeUnselect)="props.onNodeUnselect && props.onNodeUnselect(field, $event)"
          />
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [NgClass, ButtonModule, StyleClassModule, TreeModule, TranslateModule],
  styles: `
    .dropdown-menu {
      --width: 275px;
      position: absolute;
      z-index: 10;
      bottom: 100%;
      inset-inline-start: 0;
      width: var(--width);
      padding-block: 10px;
      background-color: #fff;
      border: 1px solid var(--gray-300);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeComponent extends FieldType<FieldTypeConfig> {
  isNodeExpanded = signal(false);
  expandLoading = signal(false);

  expandRecursive() {
    this.isNodeExpanded.update(expanded => !expanded);
    this.expandLoading.set(true);

    setTimeout(() => {
      this.props?.options?.forEach(node => {
        node.expanded = this.isNodeExpanded();
        this.expandLoading.set(false);
      });
    }, 500);
  }
}
