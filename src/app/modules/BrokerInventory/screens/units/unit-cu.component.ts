import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { GroupsInputsService } from "@modules/Groups/services/groups-inputs.service";
import { ImportsInputsService } from "@modules/Imports/services/imports-inputs.service";
import { LocationsInputsService } from "@modules/Locations/services/locations-inputs.service";
import { UsersInputsService } from "@modules/Users/services/users-inputs.service";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  CachedListsService,
  DynamicDialogComponent,
  FieldBuilderService,
  FormComponent,
} from "@shared";
import { TreeNode } from "primeng/api";
import { TreeNodeSelectEvent, TreeNodeUnSelectEvent } from "primeng/tree";
import { tap } from "rxjs";

@Component({
  selector: "app-unit-cu",
  standalone: true,
  imports: [FormComponent, DynamicDialogComponent],
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitCuComponent extends BaseCreateUpdateComponent<any> {
  #cachedLists = inject(CachedListsService);
  #fieldBuilder = inject(FieldBuilderService);
  #importsInputs = inject(ImportsInputsService);
  #usersInputs = inject(UsersInputsService);
  #groupsInputs = inject(GroupsInputsService);
  #locationsInputs = inject(LocationsInputsService);

  staticNodeOptions = signal<TreeNode[]>([]);
  selection = signal<TreeNode[]>([]);

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
        dialogTitle: this.translate.instant(_("update_unit")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = {};
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_unit")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
      this.model = {};
    }

    this.staticNodeOptions.set([
      { label: this.translate.instant(_("Unit Buyer")), data: "buyer_id" },
      {
        label: this.translate.instant(_("Facilities & Amenities")),
        data: ["facilities", "amenities"],
      },
      {
        label: this.translate.instant(_("More Areas")),
        data: [
          "garden_area",
          "bi_garden_area_unit_id",
          "garden_area_price",
          "garden_area_price_per_meter",
          "roof_area",
          "bi_roof_area_unit_id",
          "roof_area_price",
          "roof_area_price_per_meter",
          "garage_area",
          "garage_price",
          "garage_price_per_meter",
          "basement_area",
          "bi_basement_area_unit_id",
          "build_up_area",
        ],
      },
      {
        label: this.translate.instant(_("Poisition & View")),
        data: "bi_view_id",
      },
      {
        label: this.translate.instant(_("Financial information")),
        data: ["price_per_meter", "down_payment", "number_of_installments"],
      },
      {
        label: this.translate.instant(_("Delivery information")),
        data: ["initial_delivery_date", "delivery_date", "is_delivered"],
      },
      { label: this.translate.instant(_("Unit Assigness")), data: "assignment_rule" },
    ]);
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      {
        type: "steps-field",
        fieldGroup: [
          {
            props: {
              label: _("Unit Information"),
            },
            fieldGroup: [
              ...this.initUnitInfoFields(),
              ...this.unitBuyerField(),
              ...this.unitFacilitiesAmenitiesFields(),
              ...this.unitAreasFields(),
              ...this.unitViewField(),
              ...this.unitFacilitiesAndInfoFields(),
              ...this.unitDeliveryFields(),
              ...this.unitAssignmentRulesFiedls(),
              this.#toggleLeadfields(),
            ],
          },
          {
            props: {
              label: _("Unit Description"),
            },
            fieldGroup: [
              this.#fieldBuilder.fieldBuilder([
                {
                  key: "title",
                  type: "input-field",
                  props: {
                    label: _("title"),
                  },
                },
              ]),
              {
                key: "description",
                type: "textarea-field",
                props: {
                  required: true,
                  label: _("Description"),
                  rows: 4,
                },
              },
              this.#fieldBuilder.fieldBuilder([
                {
                  key: "video_embed_url",
                  type: "input-field",
                  props: {
                    label: _("Video Embed url"),
                  },
                },
                {
                  key: "virtual_tour_360",
                  type: "input-field",
                  props: {
                    label: _("360 Virtual Tour url"),
                  },
                },
              ]),
            ],
          },
          {
            props: {
              label: _("Location Information"),
            },
            fieldGroup: [
              ...this.#locationsInputs.getLocationFields(),
              this.#fieldBuilder.fieldBuilder([
                {
                  key: "bi_project_id",
                  type: "select-field",
                  props: {
                    required: true,
                    placeholder: _("Project"),
                    filter: true,
                    options: [],
                  },
                },
                {
                  key: "bi_phase_id",
                  type: "select-field",
                  props: {
                    required: true,
                    placeholder: _("phase"),
                    filter: true,
                    options: [],
                  },
                },
              ]),
              this.#fieldBuilder.fieldBuilder([
                {
                  key: "building_number",
                  type: "input-group-field",
                  props: {
                    type: "number",
                    placeholder: _("Building Number"),
                    icon: "fa fa-building",
                  },
                },
                {
                  key: "unit_number",
                  type: "input-group-field",
                  props: {
                    type: "number",
                    placeholder: _("Unit Number"),
                    icon: "fa fa-building",
                  },
                },
                {
                  key: "bi_floor_number_id",
                  type: "select-field",
                  props: {
                    required: true,
                    placeholder: _("Floor Number"),
                    filter: true,
                    options: [],
                  },
                },
              ]),
              {
                key: "address",
                type: "textarea-field",
                props: {
                  required: true,
                  label: _("Address"),
                  rows: 4,
                },
              },
              ...this.getMapField(),
            ],
          },
        ],
      },
    ];
  }
  initUnitInfoFields() {
    return [
      this.#fieldBuilder.fieldBuilder([
        {
          key: "unit_code",
          type: "input-group-field",
          props: {
            placeholder: _("unit code"),
            icon: "fa fa-hashtag",
          },
        },
        {
          key: "grouped_bi_purpose_type_id",
          type: "select-field",
          props: {
            required: true,
            placeholder: _("unit type"),
            filter: true,
            options: [],
          },
        },
        {
          key: "bi_offering_type_id",
          type: "select-field",
          props: {
            required: true,
            placeholder: _("for Rent"),
            filter: true,
            options: [],
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder(
        [
          {
            key: "price",
            type: "input-group-field",
            className: "input-group-field-lg",
            props: {
              type: "number",
              placeholder: _("Price - Optional"),
              icon: "fas fa-money-bill",
            },
          },
          {
            key: "currency_code",
            type: "select-field",
            className: "input-group-field-sm",
            props: {
              required: true,
              placeholder: _("Code"),
              filter: true,
              options: [],
            },
          },
        ],
        "input-group",
      ),
      this.#fieldBuilder.fieldBuilder([
        {
          key: "bi_payment_method_id_create_unit_form",
          type: "select-field",
          props: {
            required: true,
            placeholder: _("Payment Method"),
            filter: true,
            options: [],
          },
        },
        this.#fieldBuilder.fieldBuilder(
          [
            {
              key: "area",
              type: "input-group-field",
              className: "input-group-field-lg",
              props: {
                type: "number",
                placeholder: _("Area"),
                icon: "fas fa-ruler-combined",
              },
            },
            {
              key: "bi_area_unit_id",
              type: "select-field",
              className: "input-group-field-sm",
              props: {
                required: true,
                placeholder: _("Square Meter (m2)"),
                filter: true,
                options: [],
              },
            },
          ],
          "input-group",
        ),
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          key: "bi_bedroom_id",
          type: "select-field",
          props: {
            required: true,
            groupInput: true,
            icon: "fa fa-bed",
            placeholder: _("Bedrooms"),
            filter: true,
            options: [],
          },
        },
        {
          key: "bi_bathroom_id",
          type: "select-field",
          props: {
            required: true,
            groupInput: true,
            icon: "fa fa-bath",
            placeholder: _("Bathrooms"),
            filter: true,
            options: [],
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          key: "bi_finishing_type_id",
          type: "select-field",
          props: {
            required: true,
            placeholder: _("Finishing Type"),
            filter: true,
            options: [],
          },
        },
        {
          key: "bi_furnishing_status_id",
          type: "select-field",
          props: {
            required: true,
            placeholder: _("Furnishing Status"),
            filter: true,
            options: [],
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          key: "seller_id_create_unit_form",
          type: "autocomplete-field",
          props: {
            disabled: this.editData,
            placeholder: _("Unit Owner"),
            entity: [],
            fieldKey: "seller_id_create_unit_form",
          },
        },
        {
          key: "seller_id_create_unit_form",
        },
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          key: "is_featured",
          type: "switch-field",
          props: {
            label: _("is_featured"),
            trueValue: true,
            falseValue: false,
          },
        },
        {
          key: "on_hold",
          type: "switch-field",
          props: {
            label: _("On Hold"),
            trueValue: true,
            falseValue: false,
          },
        },
      ]),
    ];
  }
  unitBuyerField() {
    return [
      this.#fieldBuilder.fieldBuilder([
        {
          key: "buyer_id",
          type: "autocomplete-field",
          hide: true,
          props: {
            disabled: this.editData,
            placeholder: _("Buyer"),
            entity: [],
            fieldKey: "buyer_id",
          },
        },
        {
          key: "buyer_id",
        },
      ]),
    ];
  }
  unitFacilitiesAmenitiesFields() {
    return [
      this.#fieldBuilder.fieldBuilder([
        {
          key: "facilities",
          type: "select-field",
          hide: true,
          props: {
            required: true,
            multiple: true,
            placeholder: _("Facilities"),
            filter: true,
            options: [],
          },
        },
        {
          key: "amenities",
          type: "select-field",
          hide: true,
          props: {
            required: true,
            multiple: true,
            placeholder: _("Amenities"),
            filter: true,
            options: [],
          },
        },
      ]),
    ];
  }
  unitAreasFields() {
    return [
      this.#fieldBuilder.fieldBuilder(
        [
          {
            key: "garden_area",
            type: "input-field",
            className: "input-group-field-lg",
            hide: true,
            props: {
              type: "number",
              label: _("Graden Area"),
            },
          },
          {
            key: "bi_garden_area_unit_id",
            type: "select-field",
            className: "input-group-field-sm",
            hide: true,
            props: {
              required: true,
              placeholder: _("Square Meter (m2)"),
              filter: true,
              options: [],
            },
          },
        ],
        "input-group",
      ),
      this.#fieldBuilder.fieldBuilder([
        {
          key: "garden_area_price",
          type: "input-field",
          hide: true,
          props: {
            type: "number",
            label: _("Graden Area price"),
          },
        },
        {
          key: "garden_area_price_per_meter",
          type: "input-field",
          hide: true,
          props: {
            type: "number",
            label: _("Graden Area price per meter"),
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder(
        [
          {
            key: "roof_area",
            type: "input-field",
            hide: true,
            className: "input-group-field-lg",
            props: {
              type: "number",
              label: _("Roof Area"),
            },
          },
          {
            key: "bi_roof_area_unit_id",
            type: "select-field",
            hide: true,
            className: "input-group-field-sm",
            props: {
              required: true,
              placeholder: _("Square Meter (m2)"),
              filter: true,
              options: [],
            },
          },
        ],
        "input-group",
      ),
      this.#fieldBuilder.fieldBuilder([
        {
          key: "roof_area_price",
          type: "input-field",
          hide: true,
          props: {
            type: "number",
            label: _("Roof area price"),
          },
        },
        {
          key: "roof_area_price_per_meter",
          type: "input-field",
          hide: true,
          props: {
            type: "number",
            label: _("Roof area price per meter"),
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          key: "garage_area",
          type: "input-field",
          hide: true,
          props: {
            type: "number",
            label: _("Garage area"),
          },
        },
        {
          key: "garage_price",
          type: "input-field",
          hide: true,
          props: {
            type: "number",
            label: _("Garage price"),
          },
        },
        {
          key: "garage_price_per_meter",
          type: "input-field",
          hide: true,
          props: {
            type: "number",
            label: _("Garage price per meter"),
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder([
        this.#fieldBuilder.fieldBuilder(
          [
            {
              key: "basement_area",
              type: "input-field",
              className: "input-group-field-lg",
              hide: true,
              props: {
                type: "number",
                label: _("Basement Area"),
              },
            },
            {
              key: "bi_basement_area_unit_id",
              type: "select-field",
              className: "input-group-field-sm",
              hide: true,
              props: {
                required: true,
                placeholder: _("Square Meter (m2)"),
                filter: true,
                options: [],
              },
            },
          ],
          "input-group",
        ),
        {
          key: "build_up_area",
          type: "input-field",
          hide: true,
          props: {
            type: "number",
            label: _("Built Up Area"),
          },
        },
      ]),
    ];
  }
  unitViewField() {
    return [
      this.#fieldBuilder.fieldBuilder([
        {
          key: "bi_view_id",
          type: "select-field",
          hide: true,
          props: {
            required: true,
            placeholder: _("view"),
            filter: true,
            options: [],
          },
        },
      ]),
    ];
  }
  unitFacilitiesAndInfoFields() {
    return [
      this.#fieldBuilder.fieldBuilder([
        {
          key: "price_per_meter",
          type: "input-field",
          hide: true,
          props: {
            type: "number",
            label: _("Price Per Meter"),
          },
        },
        {
          key: "down_payment",
          type: "input-field",
          hide: true,
          props: {
            type: "number",
            label: _("Down Payment"),
          },
        },
        {
          key: "number_of_installments",
          type: "input-field",
          hide: true,
          props: {
            type: "number",
            label: _("Number of Installments"),
          },
        },
      ]),
    ];
  }
  unitDeliveryFields() {
    return [
      this.#fieldBuilder.fieldBuilder([
        {
          key: "initial_delivery_date",
          type: "date-field",
          hide: true,
          props: {
            required: true,
            label: _("Initial Delivery Date"),
          },
        },
        {
          key: "delivery_date",
          type: "date-field",
          hide: true,
          props: {
            required: true,
            label: _("Delivery Date"),
          },
        },
        {
          key: "is_delivered",
          type: "switch-field",
          hide: true,
          props: {
            label: _("Is Delivered"),
            trueValue: true,
            falseValue: false,
          },
        },
      ]),
    ];
  }
  unitAssignmentRulesFiedls() {
    return [
      this.fieldBuilder.fieldBuilder([
        this.#importsInputs.assignmentTypesSelectField({
          key: "assignment_rule",
          hide: true,
          props: {
            required: true,
            label: _("Assignment Type"),
          },
        }),
        this.#usersInputs.usersSelectField({
          key: "users",
          className: "col-12 md:col-6",
          expressions: {
            hide: "model.assignment_rule !== 'users'",
          },
          props: {
            required: true,
            label: _("Users"),
            multiple: true,
          },
        }),
        this.#groupsInputs.groupsSelectField({
          key: "groups",
          className: "col-12 md:col-6",
          expressions: {
            hide: "model.assignment_rule !== 'groups'",
          },
          props: {
            required: true,
            label: _("Groups"),
            multiple: true,
          },
        }),
      ]),
    ];
  }
  #toggleLeadfields() {
    return {
      type: "tree-field",
      props: {
        withTogglerBtn: true,
        togglerBtnLabel: this.translate.instant(_("Add Detail")),
        togglerBtnIcon: "fas fa-plus",
        selection: this.selection,
        options: this.staticNodeOptions(),
        selectionChange: (_: FormlyFieldConfig, value: TreeNode[]) => {
          this.selection.set(value);
        },
        onNodeSelect: (field: FormlyFieldConfig, event: TreeNodeSelectEvent) => {
          this.#handleNodeSelection(field, event.node, false);
        },
        onNodeUnselect: (field: FormlyFieldConfig, event: TreeNodeUnSelectEvent) => {
          this.#handleNodeSelection(field, event.node, true);
        },
      },
    };
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
  #handleNodeSelection(field: FormlyFieldConfig, node: TreeNode, isHide: boolean) {
    const toggleFieldDisplay = (fieldKey: string) => {
      const selectedField = field.parent?.get?.(fieldKey);
      selectedField && (selectedField.hide = isHide);
    };
    const data = Array.isArray(node.data) ? node.data : [node.data];
    data.forEach(key => toggleFieldDisplay(key));
    field.props &&
      (field.props.togglerBtnLabel =
        this.selection().length === this.staticNodeOptions().length
          ? this.translate.instant(_("Less Detail"))
          : this.translate.instant(_("Add Detail")));
    field.props &&
      (field.props.togglerBtnIcon =
        this.selection().length === this.staticNodeOptions().length
          ? "fas fa-minus"
          : "fas fa-plus");
  }
}
