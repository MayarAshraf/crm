import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormGroup } from "@angular/forms";
import { ModulesSettings } from "@modules/Settings/Services/service-types";
import { ModulesSettingsService } from "@modules/Settings/Services/settings.service";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateModule } from "@ngx-translate/core";
import { BreadcrumbService, FieldBuilderService, FormComponent, SpinnerComponent } from "@shared";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { finalize, map, shareReplay } from "rxjs";

@Component({
  selector: "app-manage-global-setting",
  standalone: true,
  templateUrl: "./manage-global-settings.component.html",
  imports: [DividerModule, FormComponent, CardModule, SpinnerComponent, TranslateModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ManageGlobalSettingsCuComponent {
  #modulesSettings = inject(ModulesSettingsService);
  #breadcrumbService = inject(BreadcrumbService);
  #destroyRef = inject(DestroyRef); // Current "context" (this component)
  #fieldBuilder = inject(FieldBuilderService);

  moduleSetting = input<string>("");

  dynamicFieldsSettings$ = this.#modulesSettings.getModulesSettings().pipe(shareReplay(1));

  manageGlobalSettingsForm = new FormGroup({});
  fields!: FormlyFieldConfig[];
  model!: ModulesSettings;
  loadingScreen = signal(true);
  submitBtnLoading = signal(false);

  ngOnInit() {
    this.#breadcrumbService.pushBreadcrumb({ label: this.moduleSetting() });

    this.dynamicFieldsSettings$
      .pipe(
        map(fields => fields[this.moduleSetting()]),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(fields => {
        const transformModel = fields
          .map((data: ModulesSettings) => ({ id: data.id, value: data.value }))
          .reduce(
            (acc: ModulesSettings, obj: ModulesSettings) => ({ ...acc, [obj.id]: obj.value }),
            {},
          );

        this.model = transformModel;
        this.#updateFields(fields);
        this.loadingScreen.set(false);
      });
  }

  #updateFields(fields: ModulesSettings[]) {
    this.fields = [this.configureFields(fields)];
  }

  configureFields(fields: ModulesSettings[]): FormlyFieldConfig {
    const dynamicFields = fields.map((field: any) => {
      return {
        key: field.id,
        type: "input-field",
        className: "col-12 md:col-4",
        props: {
          label: field.key,
          required: true,
        },
      };
    });
    return this.#fieldBuilder.fieldBuilder(dynamicFields);
  }

  update(model: any): void {
    if (this.manageGlobalSettingsForm.invalid) return;
    this.submitBtnLoading.set(true);
    this.#modulesSettings
      .updateKeys(model)
      .pipe(
        finalize(() => this.submitBtnLoading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe();
  }
}
