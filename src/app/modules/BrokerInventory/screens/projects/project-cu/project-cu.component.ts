import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { BrokerInventoryInputsService } from "@modules/BrokerInventory/services/broker-inventory-inputs.service";
import { ITEM_BI_DEVELOPER, ProjectModel } from "@modules/BrokerInventory/services/service-types";
import { LocationsInputsService } from "@modules/Locations/services/locations-inputs.service";
import { MarketingInputsService } from "@modules/Marketing/services/marketing-inputs.service";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  CachedListsService,
  DynamicDialogComponent,
  FieldBuilderService,
  FormComponent,
  LangRepeaterFieldService,
} from "@shared";
import { tap } from "rxjs";

@Component({
  selector: "app-project-cu",
  standalone: true,
  imports: [FormComponent, DynamicDialogComponent],
  providers: [LocationsInputsService],
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCuComponent extends BaseCreateUpdateComponent<ProjectModel> {
  #cachedLists = inject(CachedListsService);
  #getlangRepeaterField = inject(LangRepeaterFieldService);
  #fieldBuilder = inject(FieldBuilderService);
  #locationsInputs = inject(LocationsInputsService);
  #brokerInvertoryFields = inject(BrokerInventoryInputsService);
  #marketingFields = inject(MarketingInputsService);

  ngOnInit(): void {
    this.createUpdateForm.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(v => {
      this.dialogMeta = {
        ...this.dialogMeta,
        showSubmitButton: v === "VALID",
      };
    });

    this.dialogMeta = {
      ...this.dialogMeta,
      createApiVersion: "v2",
      updateApiVersion: "v2",
      showSubmitButton: false,
      endpoints: {
        store: "broker-inventory/projects/store",
        update: "broker-inventory/projects/update",
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_project")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = { id: this.editData.id, ...new ProjectModel(this.editData) };
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_project")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
      this.model = new ProjectModel();
    }

    this.#updateLists();
    this.fields = this.configureFields();
    // This order is matter (assign fields comes after update lists)
  }

  #updateLists() {
    let lists = [
      "locations:countries:ids:null",
      "broker_inventory:area_units",
      "marketing:currencies",
    ];

    const countryId = this.editData?.country_id;
    const regionId = this.editData?.region_id;
    const cityId = this.editData?.city_id;

    lists.push(`locations:regions:ids:${countryId || this.model.country_id}`);
    regionId && lists.push(`locations:cities:ids:${regionId}`);
    cityId && lists.push(`locations:areas:ids:${cityId}`);
    this.#cachedLists.updateLists(lists);
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      {
        type: "steps-field",
        fieldGroup: [
          {
            props: {
              label: _("project_information"),
              isValid: () => !!this.model.translations[0]?.project,
            },
            fieldGroup: [
              {
                key: "developer_info",
                type: "autocomplete-field",
                props: {
                  disabled: this.editData,
                  placeholder: _("developer"),
                  entity: ITEM_BI_DEVELOPER,
                  fieldKey: "developer_id",
                },
              },
              {
                key: "developer_id",
              },
              this.#getlangRepeaterField.getlangRepeaterField([
                {
                  key: "project",
                  type: "input-field",
                  props: {
                    required: true,
                    label: _("name"),
                  },
                },
                {
                  key: "description",
                  type: "textarea-field",
                  className: "col-12",
                  props: {
                    label: _("description"),
                    rows: 4,
                  },
                },
                {
                  key: "meta_title",
                  type: "textarea-field",
                  className: "col-12 md:col-6",
                  props: {
                    label: _("meta_title"),
                    rows: 4,
                  },
                },
                {
                  key: "meta_description",
                  type: "textarea-field",
                  className: "col-12 md:col-6",
                  props: {
                    label: _("meta_description"),
                    rows: 4,
                  },
                },
              ]),
              {
                key: "is_featured",
                type: "switch-field",
                props: {
                  label: _("is_featured"),
                  trueValue: true,
                  falseValue: false,
                },
              },
            ],
          },
          {
            props: { label: _("location_information") },
            fieldGroup: [
              ...this.#locationsInputs.getLocationFields(),
              {
                key: "address",
                type: "input-field",
                props: {
                  label: _("address"),
                },
              },
              ...this.getMapField(),
            ],
          },
          {
            props: {
              label: _("pricing_delivery_information"),
              isValid: () => !!this.model?.delivery_date,
            },
            fieldGroup: [
              this.#fieldBuilder.fieldBuilder([
                {
                  key: "area_from",
                  type: "input-field",
                  className: "col-12 md:col-6",
                  props: {
                    type: "number",
                    label: _("area_from"),
                  },
                },
                {
                  key: "area_to",
                  type: "input-field",
                  className: "col-12 md:col-6",
                  props: {
                    type: "number",
                    label: _("area_to"),
                  },
                },
                this.#brokerInvertoryFields.areaUnitsSelectField({
                  key: "bi_area_unit_id",
                  className: "col-12 md:col-6",
                  props: {
                    label: _("area_unit"),
                  },
                }),
                {
                  key: "delivery_date",
                  type: "date-field",
                  className: "col-12 md:col-6",
                  resetOnHide: false,
                  props: {
                    label: _("delivery_date"),
                    showTime: true,
                    required: true,
                  },
                },
                {
                  key: "price_from",
                  type: "input-field",
                  className: "col-12 md:col-6",
                  props: {
                    type: "number",
                    label: _("price_from"),
                    step: 2,
                  },
                },
                {
                  key: "price_to",
                  type: "input-field",
                  className: "col-12 md:col-6",
                  props: {
                    type: "number",
                    label: _("price_to"),
                    step: 2,
                  },
                },
                {
                  key: "down_payment_from",
                  type: "input-field",
                  className: "col-12 md:col-6",
                  props: {
                    type: "number",
                    label: _("down_payment_from"),
                    step: 2,
                  },
                },
                {
                  key: "down_payment_to",
                  type: "input-field",
                  className: "col-12 md:col-6",
                  props: {
                    type: "number",
                    label: _("down_payment_to"),
                    step: 2,
                  },
                },
                this.#marketingFields.currenciesSelectField({
                  key: "currency_code",
                  className: "col-12 md:col-6",
                  props: {
                    label: _("currency_code"),
                  },
                }),
                {
                  key: "finished_status",
                  type: "switch-field",
                  className: "col-12 md:col-6",
                  props: {
                    label: _("finished_status"),
                    trueValue: true,
                    falseValue: false,
                  },
                },
                {
                  key: "number_of_installments_from",
                  type: "input-field",
                  className: "col-12 md:col-6",
                  props: {
                    type: "number",
                    label: _("number_of_installments_from"),
                  },
                },
                {
                  key: "number_of_installments_to",
                  type: "input-field",
                  className: "col-12 md:col-6",
                  props: {
                    type: "number",
                    label: _("number_of_installments_to"),
                  },
                },
              ]),
            ],
          },
        ],
      },
    ];
  }

  getMapField(): FormlyFieldConfig[] {
    return [
      {
        type: "map-field",
        props: {
          isReadOnlyMap: false,
          isHiddenButton: false,
          lat: "latitude",
          long: "longitude",
        },
        hooks: {
          onInit: field => {
            const latField = field.form?.get(field.props?.lat);
            const lngField = field.form?.get(field.props?.long);

            return field.formControl?.valueChanges.pipe(
              tap(latLng => {
                latField?.setValue(latLng.lat());
                lngField?.setValue(latLng.lng());
              }),
            );
          },
        },
      },
      {
        key: "latitude",
        hooks: {
          onInit: field => {
            if (!field.model?.[field.props?.lat]) return;
            field.formControl?.setValue(field.model?.[field.props?.lat]);
          },
        },
      },
      {
        key: "longitude",
        hooks: {
          onInit: field => {
            if (!field.model?.[field.props?.long]) return;
            field.formControl?.setValue(field.model?.[field.props?.long]);
          },
        },
      },
    ];
  }
}
