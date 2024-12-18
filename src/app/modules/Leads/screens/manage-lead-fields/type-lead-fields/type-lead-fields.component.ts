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
import { GetleadFieldTypesService } from "@modules/Leads/services/leads-types-fields.service";
import { ManageleadField, TypeLeadFields, leadFields } from "@modules/Leads/services/service-types";
import {
  BaseIndexComponent,
  ManipulateTitlePipe,
  RangePipe,
  SoundsService,
  TableWrapperComponent,
} from "@shared";
import { MenuItem } from "primeng/api";
import { InputSwitchChangeEvent, InputSwitchModule } from "primeng/inputswitch";
import { SkeletonModule } from "primeng/skeleton";
import { TabMenuModule } from "primeng/tabmenu";
import { EMPTY, catchError, map } from "rxjs";

@Component({
  selector: "app-type-lead-fields",
  standalone: true,
  templateUrl: "./type-lead-fields.component.html",
  styleUrl: "./type-lead-fields.component.scss",
  imports: [
    ManipulateTitlePipe,
    SkeletonModule,
    RangePipe,
    TabMenuModule,
    FormsModule,
    NgTemplateOutlet,
    TableWrapperComponent,
    InputSwitchModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexTypeLeadFieldsComponent extends BaseIndexComponent<ManageleadField> {
  #updateleadFieldTypes = inject(GetleadFieldTypesService);
  #sounds = inject(SoundsService);

  leadFields = input<leadFields[]>([]);
  menuItems!: MenuItem[];
  activeItem = signal<MenuItem>({} as MenuItem);
  activityIndex = 0;

  typeLeadFields = TypeLeadFields;

  leadField = viewChild<TemplateRef<any>>("leadField");
  fastCreation = viewChild<TemplateRef<any>>("fastCreation");
  fastEdit = viewChild<TemplateRef<any>>("fastEdit");
  fullView = viewChild<TemplateRef<any>>("fullView");
  required = viewChild<TemplateRef<any>>("required");

  ngOnInit() {
    this.permissions.set({
      index: true,
      create: true,
      update: true,
      delete: true,
    });
    this.indexMeta = {
      ...this.indexMeta,
      indexTitle: this.translate.instant(_("manage_lead_fields")),
      indexIcon: "fas fa-edit",
      columns: [
        {
          name: "lead_field",
          title: this.translate.instant(_("lead_field")),
          render: this.leadField(),
        },
        {
          name: "is_fast_creation_hidden",
          title: this.translate.instant(_("fast_creation")),
          render: this.fastCreation(),
        },
        {
          name: "is_fast_edit_hidden",
          title: this.translate.instant(_("fast_edit")),
          render: this.fastEdit(),
        },
        {
          name: "is_full_view_hidden",
          title: this.translate.instant(_("full_view")),
          render: this.fullView(),
        },
        {
          name: "is_required",
          title: this.translate.instant(_("required")),
          render: this.required(),
        },
      ],
    };
    this.loadTypeLeadFields();
  }

  loadTypeLeadFields() {
    this.isLoading.set(true);

    this.indexMeta = {
      ...this.indexMeta,
      indexTableKey: this.leadFields().length
        ? `LEAD_FIELDS_${this.leadFields()[this.activityIndex].type_lead_name}_KEY`
        : "",
    };
    if (this.leadFields().length) {
      this.records.set(this.leadFields()[this.activityIndex].data);
      this.menuItems = this.leadFields().map((item, index) => {
        return {
          label: item.type_lead_name,
          command: () => {
            this.activityIndex = index;
            this.records.set(this.leadFields()[this.activityIndex].data);
          },
        };
      });
      this.activeItem.set(this.menuItems[0]);
      this.isLoading.set(false);
    }
  }

  update(event: InputSwitchChangeEvent, type: string, row: ManageleadField) {
    const model = {
      id: row.id,
      update_type: type,
      lead_field: row.lead_field,
      lead_type_id: row.lead_type_id,
      update_value: event.checked,
    };

    this.#updateleadFieldTypes
      .updateFieldType(model)
      .pipe(
        map(({ data }) => data),
        catchError(err => {
          if (err.status == 422) this.updateRecord(row);
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(record => {
        const leadFieldsTab = this.leadFields()[this.activityIndex].data;
        this.leadFields()[this.activityIndex].data = leadFieldsTab.map(item =>
          item.id === record.id ? { ...item, ...record } : item,
        );

        if (type === this.typeLeadFields.ISREQUIRED) {
          this.updateRecord(record);
        }
        this.#sounds.playSound("default");
      });
  }
}
