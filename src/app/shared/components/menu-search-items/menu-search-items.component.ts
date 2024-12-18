import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FilterService, MenuItem } from 'primeng/api';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-menu-search-items',
  template: `
    <p-autoComplete
      [ngModel]="selectedItem()"
      (ngModelChange)="selectedItem.set($event)"
      [group]="true"
      [suggestions]="filteredItems()"
      [placeholder]="placeholder()"
      [showEmptyMessage]="true"
      [scrollHeight]="'300px'"
      [dropdown]="true"
      dropdownIcon="fas fa-search text-500"
      (completeMethod)="filterItem($event)"
      field="label"
>
      <ng-template let-group pTemplate="group">
        <span class="text-primary flex gap-1 align-items-center">
          <i class="{{ group.icon }}"></i> {{ group.label }}
        </span>
      </ng-template>

      <ng-template let-item pTemplate="item">
        <a
          pButton
          [routerLink]="item.routerLink"
          class="p-button-link text-700 text-sm font-medium w-full p-2"
          >{{ item.label }}</a
        >
      </ng-template>
    </p-autoComplete>
  `,
  standalone: true,
  styles: `
    ::ng-deep .p-autocomplete-dropdown {
      background-color: transparent;
      border-color: #d1d5db;
      margin-inline-start: -1px;

      &:hover {
        background-color: var(--gray-100);
      }
    }
  `,
  imports: [AutoCompleteModule, ButtonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuSearchItemsComponent {
  #filterService = inject(FilterService);

  menuItemsGroups = input.required<MenuItem[]>();
  placeholder = input.required<string>();

  selectedItem = signal<MenuItem | null>(null);
  filteredItems = signal<MenuItem[]>([]);

  filterItem(event: AutoCompleteCompleteEvent) {
    let query = event.query;
    let filteredGroups = [];

    for (let optgroup of this.menuItemsGroups()) {
      let filteredSubOptions = this.#filterService.filter(
        optgroup.items as MenuItem[],
        ["label"],
        query,
        "contains",
      );

      if (filteredSubOptions && filteredSubOptions.length) {
        filteredGroups.push({
          label: optgroup.label,
          icon: optgroup.icon,
          items: filteredSubOptions,
        });
      }
    }

    this.filteredItems.set(filteredGroups);
  }
}
