import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  inject,
  input,
  signal,
  viewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { ActivityTypesService } from "@modules/Activities/services/activity-types.service";
import { Activity, ActivityTypes } from "@modules/Activities/services/service-types";
import { BaseIndexComponent, RangePipe, TableWrapperComponent, constants } from "@shared";
import { MenuItem } from "primeng/api";
import { InputSwitchModule } from "primeng/inputswitch";
import { SkeletonModule } from "primeng/skeleton";
import { TabMenuModule } from "primeng/tabmenu";
import { map } from "rxjs";

@Component({
  selector: "app-type-activity",
  standalone: true,
  templateUrl: "./type-activity.component.html",
  styleUrl: "./type-activity.component.scss",
  imports: [
    NgTemplateOutlet,
    RangePipe,
    SkeletonModule,
    TabMenuModule,
    FormsModule,
    TableWrapperComponent,
    InputSwitchModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexActivityTypeComponent extends BaseIndexComponent<Activity> {
  #activityTypes = inject(ActivityTypesService);

  noteShown = viewChild.required<TemplateRef<any>>("notesShown");
  notesRequired = viewChild.required<TemplateRef<any>>("notesRequired");

  activityTypes = input<ActivityTypes[]>([]);
  menuItems!: MenuItem[];
  activeItem = signal<MenuItem>({} as MenuItem);
  activityIndex = 0;

  ngOnInit() {
    this.permissions.set({
      index: true,
      create: true,
      update: true,
      delete: true,
    });

    this.indexMeta = {
      ...this.indexMeta,
      indexTitle: this.translate.instant("manage_activity_types"),
      indexTableKey: `${
        this.activityTypes().length
          ? `TYPE_ACTIVITY_${this.activityTypes()[this.activityIndex].type_active_name}_KEY`
          : ``
      }`,
      indexIcon: constants.icons.pencil,
      columns: [
        { name: "name", title: "Type" },
        {
          name: "is_notes_shown",
          title: this.translate.instant(_("is_notes_shown")),
          render: this.noteShown(),
        },
        {
          name: "is_notes_required",
          title: this.translate.instant(_("is_notes_required")),
          render: this.notesRequired(),
        },
      ],
    };
    this.loadActivityTypes();
  }

  loadActivityTypes() {
    if (this.activityTypes().length) {
      this.records.set(this.activityTypes()[this.activityIndex].data);
      this.menuItems = this.activityTypes().map((item, index) => {
        return {
          label: item.type_active_name,
          command: () => {
            this.activityIndex = index;
            this.records.set(this.activityTypes()[this.activityIndex].data);
          },
        };
      });
      this.activeItem.set(this.menuItems[0]);
      this.isLoading.set(false);
    }
  }

  update(id: number, checked: boolean | number, type: string) {
    const model = {
      id,
      update_type: type,
      update_value: typeof checked === "boolean" ? checked : checked === 1 ? 1 : 0,
    };
    if (type === "is_type_notes_shown" || type === "is_type_notes_required") {
      this.#activityTypes
        .updateOutcomeData(model)
        .pipe(
          map(({ data }) => data),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe(record => {
          this.updateUiActivityTypeswithNavigateTabs(record);
          if (type === "is_type_notes_required") {
            this.updateRecord(record);
          }
        });
    } else {
      this.#activityTypes
        .updateCustomData(model)
        .pipe(
          map(({ data }) => data),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe(record => {
          this.updateUiActivityTypeswithNavigateTabs(record);
          if (type === "is_notes_required") {
            this.updateRecord(record);
          }
        });
    }
  }

  handleTypeValue(activityTypeField: Activity, propertyName: string, type: string) {
    return activityTypeField.hasOwnProperty(propertyName)
      ? type === "trueValue"
        ? true
        : false
      : type === "trueValue"
        ? 1
        : 0;
  }

  updateUiActivityTypeswithNavigateTabs(record: Activity) {
    const activityTypesTab = this.activityTypes()[this.activityIndex].data;
    this.activityTypes()[this.activityIndex].data = activityTypesTab.map(item =>
      item.id === record.id ? { ...item, ...record } : item,
    );
  }
}
