import { HttpContext } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { NGX_LOADING_BAR_IGNORED } from "@ngx-loading-bar/http-client";
import { TranslateModule } from "@ngx-translate/core";
import { DropdownModule } from "primeng/dropdown";
import { finalize } from "rxjs";
import { ApiService, CachedListsService } from "../services";

interface IEntity {
  [key: string]: any;
}

@Component({
  selector: "app-entity-select",
  standalone: true,
  template: `
    @if (label()) {
      <label class="block item-label">{{ label() | translate }}</label>
    }
    <p-dropdown
      [options]="options()"
      [(ngModel)]="selectedValue"
      appendTo="body"
      [loading]="loading()"
      [autoOptionFocus]="false"
      [group]="group()"
      [placeholder]="placeholder() | translate"
      [tooltip]="this.label() || this.placeholder() || '' | translate"
      tooltipPosition="top"
      [disabled]="disabled()"
      (onChange)="handleChange($event.value)"
      [styleClass]="styleClass()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, DropdownModule, TranslateModule],
})
export class EntitySelectComponent<T extends IEntity> implements OnInit {
  #api = inject(ApiService);
  #cachedLists = inject(CachedListsService);
  #destroyRef = inject(DestroyRef); // Current "context" (this component)

  selectedValue = signal<any>(null);

  entity = model.required<T>();
  listName = input.required<string>();
  listModule = input.required<string>();
  updateType = input.required<string>();
  label = input<string>("");
  placeholder = input<string>("");
  disabled = input<boolean>(false);
  group = input<boolean>(false);
  styleClass = input<string>("special-dropdown");
  endpoint = input.required<string>();
  apiVersion = input("v1");
  loading = signal(false);
  onChange = output<T>();

  options = computed(() =>
    this.#cachedLists.loadLists().get(`${this.listModule()}:${this.listName()}`),
  );

  ngOnInit() {
    this.selectedValue.set(this.entity()[this.updateType() as keyof T]);
  }

  handleChange(value: any): void {
    this.loading.set(true);

    this.#api
      .request(
        "post",
        this.endpoint(),
        {
          id: this.entity().id,
          update_type: this.updateType(),
          update_value: value,
        },
        undefined,
        undefined,
        this.apiVersion(),
        new HttpContext().set(NGX_LOADING_BAR_IGNORED, true),
      )
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(() => {
        this.entity.set({ ...this.entity(), [this.updateType()]: value });
        this.onChange.emit(this.entity());
      });
  }
}
