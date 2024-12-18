import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { NgClass, NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { AccordionModule } from "primeng/accordion";
import { AutoCompleteCompleteEvent, AutoCompleteModule } from "primeng/autocomplete";
import { BadgeModule } from "primeng/badge";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { InputSwitchChangeEvent, InputSwitchModule } from "primeng/inputswitch";
import { InputTextModule } from "primeng/inputtext";
import { ListboxModule } from "primeng/listbox";
import { RadioButtonModule } from "primeng/radiobutton";
import { SkeletonModule } from "primeng/skeleton";
import { TooltipModule } from "primeng/tooltip";
import { filter, map, tap } from "rxjs";
import { localStorageSignal } from "../../helpers";
import { RangePipe } from "../../pipes";
import { AutocompleteService, LangService } from "../../services";
import { DateRangeComponent } from "../date-range/date-range.component";
import { Chip, FiltersChipsComponent } from "../filters-chips/filters-chips.component";
import { SidebarComponent } from "../sidebar/sidebar.component";

export interface FilterOption {
  label: string;
  value: any;
  items?: FilterOption[];
}

export interface FilterConfig {
  type: string;
  name: string;
  label: string;
  options?: FilterOption[];
  default?: any;
  is_required: boolean;
  search?: boolean;
  group?: boolean;
  is_multiple?: boolean;
  is_hidden: boolean;
  is_advanced?: boolean;
  expanded?: boolean;
  showAllOptions?: boolean;
  entity?: string;
  suggestions?: { label: string; value: number }[];
  onChange?: (event: any, form: FormGroup<any>) => void;
}

export interface Setting {
  label: string;
  name: string;
  value: boolean;
}

@Component({
  selector: "app-filters-panel",
  standalone: true,
  templateUrl: "./filters-panel.component.html",
  styleUrl: "./filters-panel.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    NgTemplateOutlet,
    ButtonModule,
    SkeletonModule,
    SidebarComponent,
    RadioButtonModule,
    AutoCompleteModule,
    AccordionModule,
    BadgeModule,
    ListboxModule,
    FormsModule,
    InputSwitchModule,
    CalendarModule,
    TooltipModule,
    FiltersChipsComponent,
    InputTextModule,
    ReactiveFormsModule,
    DateRangeComponent,
    RangePipe,
    TranslateModule,
  ],
})
export class FiltersPanelComponent {
  #router = inject(ActivatedRoute);
  #fb = inject(FormBuilder);
  currentLang = inject(LangService).currentLanguage;
  #breakpointObserver = inject(BreakpointObserver);
  #destroyRef = inject(DestroyRef);
  #cdr = inject(ChangeDetectorRef);
  #autocomplete = inject(AutocompleteService);

  displaySettings = input(true);
  displayMoreFilter = input(true);

  advancedFiltersRef = viewChild<ElementRef>("advancedFiltersRef");

  #formGroupsCache: Map<string, FormGroup<any>> = new Map();

  filtersForm = computed<FormGroup<any>>(() => {
    let filterFormGroup = this.#formGroupsCache.get("filters");

    if (!filterFormGroup && this.filters().length) {
      return this.#createFormGroup(this.filters(), this.#fb, "default", "filters");
    }
    return filterFormGroup ? filterFormGroup : this.#fb.group({});
  });

  settingsForm = computed<FormGroup<any>>(() => {
    return this.settings().length
      ? this.#createFormGroup(this.settings(), this.#fb, "value", "settings")
      : this.#fb.group({});
  });

  showFilterSidebar = model<boolean>(false);
  isAdvancedFilter = model<boolean>(false);
  displayFiltersHint = localStorageSignal<boolean>(true, "display-filters-hint");
  filters = input.required<FilterConfig[]>();

  basicFilters = computed(() => this.filters().filter(filter => !filter.is_advanced));
  advancedFilters = computed(() => this.filters().filter(filter => filter.is_advanced));
  settings = model<Setting[]>([]);
  showSettings = signal(false);

  chips = localStorageSignal<Chip[] | null>(null, this.#getStorageKeys("storedChipsKey"));

  storedFilters = computed(() => {
    if (!this.chips()) return null;

    const filters: Record<string, any> = {};

    this.chips()?.forEach(chip => {
      filters[chip.name] = chip.value ? chip.value : chip.valueChip || null;
    });

    return filters;
  });

  storedSettings = localStorageSignal<Record<string, boolean> | null>(
    null,
    this.#getStorageKeys("storedSettingsKey"),
  );

  #getStorageKeys(key: string): string {
    return this.#router.snapshot.data.stateKeys[key];
  }

  onSubmitFilters = output<Record<string, any>>();
  onRemoveChip = output<Record<string, any>>();
  onClearAllChips = output<Record<string, any>>();

  isAdvancedFilter$ = toObservable(this.isAdvancedFilter).pipe(
    filter(e => e),
    tap(() => this.#handleAdvancedFilter()),
  );

  loadIsAdvancedFilter = toSignal(this.isAdvancedFilter$, { initialValue: false });

  ngOnInit() {
    if (this.storedFilters()) {
      this.#handleAdvancedFilter();
      this.onSubmitFilters.emit(this.storedFilters() as Record<string, any>);
    }

    if (this.storedSettings()) {
      this.submitSettings(this.storedSettings() as Record<string, boolean>);
      this.settingsForm().patchValue(this.storedSettings() as Record<string, boolean>);
    }
  }

  #handleAdvancedFilter() {
    const advancedFilters = this.filters().filter(filter => filter.is_advanced);
    const advancedChips = (this.chips() || []).filter(chip => {
      return advancedFilters.some(filter => filter.name === chip.name);
    });

    this.isAdvancedFilter.set(advancedChips.length > 0 || this.isAdvancedFilter());
  }

  #createFormGroup(items: any[], fb: FormBuilder, defaultValue: string, type: string): FormGroup {
    let formGroup: Record<string, any> = {};
    items.forEach(item => {
      formGroup[item.name] = [
        this.#getInitialValue(item, type, defaultValue),
        item.is_required ? Validators.required : null,
      ];
    });
    type === "filters" && this.#formGroupsCache.set("filters", fb.group(formGroup));
    return fb.group(formGroup);
  }

  #getInitialValue(item: any, type: string, defaultValue: string) {
    if (type === "filters") {
      return this.storedFilters()?.[item.name] || item[defaultValue] || null;
    }
    return item[defaultValue] || null;
  }

  toggleExpansion(filter: FilterConfig) {
    filter.expanded = !filter.expanded;
  }

  showAdvancedFilters() {
    this.isAdvancedFilter.set(true);
    this.advancedFiltersRef()?.nativeElement.scrollIntoView({ behavior: "smooth" });
  }

  visibleOptions(filter: FilterConfig) {
    return filter.expanded ? filter.options : filter.options?.slice(0, 4);
  }

  #updateChips() {
    const newChips: Chip[] = [];

    this.filters().forEach(filter => {
      const controlValue = this.filtersForm().get(filter.name)?.value;
      if (controlValue) {
        switch (filter.type) {
          case "select":
            this.#handleSelectFilter(filter, controlValue, newChips);
            break;
          case "switcher":
            this.#handleSwitcherFilter(filter, controlValue, newChips);
            break;
          case "autocomplete":
            this.#handleAutocompleteFilter(filter, controlValue, newChips);
            break;
          default:
            this.#handleOtherFilter(filter, controlValue, newChips);
            break;
        }
      }
    });

    this.chips.set(newChips.length ? newChips : null);
  }

  #getFirstWord = (label: string) => {
    if (!label) return "";
    return label.split(" ")[0];
  };

  #handleSelectFilter(filter: FilterConfig, controlValue: any, newChips: Chip[]) {
    const findOption = (
      options: FilterOption[],
      value: any,
    ): { label: string; value: any } | null => {
      for (const option of options) {
        if (option.items) {
          const found = findOption(option.items, value); // handles if there is agroup
          if (found) return found;
        } else if (option.value === value) {
          return { label: option.label, value: option.value };
        }
      }
      return null;
    };

    const updateChips = (label: string, value: any) => {
      newChips.push({ name: filter.name, label: filter.label, value: value, valueChip: label });
    };

    if (filter.is_multiple) {
      const selections: { label: string; value: any }[] = controlValue.map((value: any) =>
        findOption(filter.options as FilterOption[], value),
      );
      const selectedLabels = selections.map(option => this.#getFirstWord(option.label)).join(", ");
      const selectedValues = selections.map(option => option.value);

      updateChips(selectedLabels, selectedValues);
    } else {
      const selection = findOption(filter.options as FilterOption[], controlValue);
      selection && updateChips(selection.label, selection.value);
    }
  }

  #handleSwitcherFilter(filter: FilterConfig, controlValue: any, newChips: Chip[]) {
    newChips.push({
      name: filter.name,
      value: controlValue,
      valueChip: filter.label,
    });
  }

  #handleAutocompleteFilter(filter: FilterConfig, controlValue: any, newChips: Chip[]) {
    if (Array.isArray(controlValue)) {
      const labels = controlValue.map(item => this.#getFirstWord(item.label)).join(", ");
      newChips.push({
        name: filter.name,
        label: filter.label,
        value: controlValue,
        valueChip: labels,
      });
    } else {
      newChips.push({
        name: filter.name,
        label: filter.label,
        value: controlValue.value,
        valueChip: controlValue.label,
      });
    }
  }

  #handleOtherFilter(filter: FilterConfig, controlValue: any, newChips: Chip[]) {
    newChips.push({
      name: filter.name,
      label: filter.label,
      valueChip: controlValue,
    });
  }

  removeChip(chip: Chip) {
    const filterName = this.filters().find(f => f.name === chip.name);
    this.filtersForm()
      ?.get(filterName?.name as string)
      ?.setValue(filterName?.default);

    this.#updateChips();
    this.onRemoveChip.emit(this.#getFormValue());
  }

  clearAllChips() {
    const formValue = this.filters()
      .filter(item => item.default)
      .reduce((acc, item) => ({ ...acc, [item.name]: item.default }), {});

    Object.keys(formValue).length
      ? this.filtersForm().setValue(formValue)
      : this.filtersForm().reset();

    this.#updateChips();
    this.onClearAllChips.emit(this.#getFormValue());
  }

  #getFormValue() {
    return this.filtersForm().value;
  }

  onSubmit() {
    if (!this.filtersForm().valid) {
      this.filtersForm().markAllAsTouched();
      return;
    }
    this.#formGroupsCache.get("filters")?.patchValue(this.#getFormValue());
    this.#updateChips();
    this.onSubmitFilters.emit(this.#getFormValue());
    this.showFilterSidebar.set(false);
  }

  updateSetting(name: string, event: InputSwitchChangeEvent) {
    this.settings.update(settings =>
      settings.map(setting =>
        setting.name === name ? { ...setting, value: event.checked } : setting,
      ),
    );
  }

  updateSettings(settingsValue: Record<string, boolean>) {
    this.settings.update(settings =>
      settings.map(setting => ({ ...setting, value: !!settingsValue[setting.name] })),
    );
  }

  onSubmitSetting() {
    const settingsFormValue = this.settingsForm().value;
    this.storedSettings.set(settingsFormValue);
    this.submitSettings(settingsFormValue);
    this.showSettings.set(false);
  }

  submitSettings(settingsValue: Record<string, boolean>) {
    this.updateSettings(settingsValue);
  }

  #isDesktopActive$ = this.#breakpointObserver
    .observe(["(min-width: 768px)"])
    .pipe(map((state: BreakpointState) => state.matches));

  isDesktopActive = toSignal(this.#isDesktopActive$, { initialValue: true });

  onComplete(event: AutoCompleteCompleteEvent, filter: FilterConfig) {
    this.#autocomplete
      .search(filter?.entity as string, event.query)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(({ data }) => {
        filter.suggestions = data;
        this.#cdr.markForCheck();
      });
  }
}
