import { KeyValuePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { FilterConfig } from "../filters-panel/filters-panel.component";

export interface Chip {
  name: string;
  label?: string;
  value?: any;
  valueChip: string;
}

@Component({
  selector: "app-filters-chips",
  standalone: true,
  imports: [KeyValuePipe, ButtonModule, TagModule, TranslateModule],
  template: `
    @if (chips() && chips()?.length) {
      <div class="flex flex-wrap align-items-center gap-2">
        @for (chip of chips(); track $index) {
          <p-tag>
            <span>
              <span class="font-normal">{{ chip.label }}</span>
              @if (chip.label) {
                :
              }
              {{ chip.valueChip }}

              @if (!isDefaultValue(chip)) {
                <button
                  pButton
                  (click)="removeChip.emit(chip)"
                  class="p-button-link p-0 shadow-none transition-none w-auto ml-1 text-xs text-300 hover:text-white"
                  icon="pi pi-times text-xs"
                ></button>
              }
            </span>
          </p-tag>
        }
        @if (!hasAllDefaultValue()) {
          <button
            pButton
            class="p-button-link p-button-sm p-0 shadow-none"
            [label]="'clear_all' | translate"
            (click)="clearAllChips.emit()"
          ></button>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersChipsComponent {
  chips = input<Chip[] | null>();
  filters = input.required<FilterConfig[]>();

  removeChip = output<Chip>();
  clearAllChips = output();

  isDefaultValue(chip: Chip): boolean {
    return !!this.filters().find(item => item.default === chip.valueChip);
  }

  hasAllDefaultValue(): boolean {
    return this.chips()?.every(item =>
      this.filters().find(filter => filter.default === item.valueChip),
    ) as boolean;
  }
}
