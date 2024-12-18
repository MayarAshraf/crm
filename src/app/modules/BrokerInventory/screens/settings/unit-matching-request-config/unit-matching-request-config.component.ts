import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormGroup } from "@angular/forms";
import { UnitSettingsService } from "@modules/BrokerInventory/services/broker-inventory-unit-settings.service";
import {
  UnitMatchingRequestFields,
  UnitMatchingRequestModel,
} from "@modules/BrokerInventory/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateModule } from "@ngx-translate/core";
import { FieldBuilderService, FormComponent, SpinnerComponent, constants } from "@shared";
import { NgxPermissionsModule } from "ngx-permissions";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { distinctUntilChanged, finalize, map, shareReplay, tap } from "rxjs";

@Component({
  selector: "app-broker-inventory-unit-matching-request-config",
  standalone: true,
  templateUrl: "./unit-matching-request-config.component.html",
  imports: [
    DividerModule,
    FormComponent,
    CardModule,
    SpinnerComponent,
    NgxPermissionsModule,
    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UnitMatchingRequestConfigComponent {
  #fieldBuilder = inject(FieldBuilderService);
  #unitMatchingRequest = inject(UnitSettingsService);
  #destroyRef = inject(DestroyRef); // Current "context" (this component)

  dynamicFieldsUnitMatchingRequest$ = this.#unitMatchingRequest
    .getUnitMatchingRequestFields()
    .pipe(shareReplay(1));
  unitMatchingRequestConfigForm = new FormGroup({});
  fields!: FormlyFieldConfig[];
  model!: UnitMatchingRequestModel;
  unitFields = signal<UnitMatchingRequestFields[]>([]);
  loadingScreen = signal(true);
  submitBtnLoading = signal(false);
  permissions = signal({
    index: constants.permissions["update-broker-inventory-unit-request-matching-config"],
  });

  ngOnInit() {
    this.dynamicFieldsUnitMatchingRequest$
      .pipe(
        map(data => {
          let keysToDelete = [
            "deleted_at",
            "deleted_by",
            "updated_at",
            "updated_by",
            "created_at",
            "created_by",
            "id",
          ];
          for (let key of keysToDelete) {
            delete data[key];
          }
          this.model = { ...data };

          let transformData = Object.keys(data).map(key => ({ key, value: data[key] }));
          return transformData;
        }),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(fields => {
        this.#updateFields(fields);
        this.loadingScreen.set(false);
      });
  }

  #updateFields(fields: UnitMatchingRequestFields[]) {
    this.fields = this.configureFields(fields);
    const unitFields = fields.filter(item => item.key !== "total");
    this.unitFields.set(unitFields);
  }

  configureFields(fields: UnitMatchingRequestFields[]) {
    const buildfields = fields.map(data => {
      return {
        key: data.key,
        type: "input-field",
        className: "col-12 md:col-3",
        props: {
          type: "number",
          required: true,
          label: data.key,
          min: 0,
        },
        hooks: {
          onInit: (field: FormlyFieldConfig) => {
            const fieldTotal = field.form?.get("total");

            if (data.key == "total") {
              if (!field.props) return;
              field.props.min = 1;
              field.props.max = 100;
            }

            return field.formControl?.valueChanges.pipe(
              distinctUntilChanged(),
              tap(val => {
                const { updatedTotalAllFields, total } = this.unitFields().reduce(
                  (accumulator, unitField) => {
                    const updatedValue = unitField.key === data.key ? +val : unitField.value;

                    accumulator.updatedTotalAllFields.push({ ...unitField, value: updatedValue });
                    accumulator.total += updatedValue;

                    return accumulator;
                  },
                  { updatedTotalAllFields: [] as UnitMatchingRequestFields[], total: 0 },
                );

                this.unitFields.set(updatedTotalAllFields);
                fieldTotal?.setValue(total);
              }),
            );
          },
        },
      };
    });
    return [this.#fieldBuilder.fieldBuilder(buildfields)];
  }

  save(model: UnitMatchingRequestModel): void {
    if (this.unitMatchingRequestConfigForm.invalid) return;
    this.submitBtnLoading.set(true);

    const newModel = Object.entries(model).reduce((acc, [key, value]) => {
      acc[key] = +value;
      return acc;
    }, {} as UnitMatchingRequestModel);

    this.#unitMatchingRequest
      .updateUnitMatchingRequestFields(newModel)
      .pipe(
        finalize(() => this.submitBtnLoading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe();
  }
}
