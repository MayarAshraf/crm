import { ChangeDetectionStrategy, Component, signal, viewChild } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FieldType, FieldTypeConfig, FormlyModule } from "@ngx-formly/core";
import { TranslateModule } from "@ngx-translate/core";
import { FileSelectEvent, FileUpload, FileUploadModule } from "primeng/fileupload";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "formly-import-file",
  template: `
    <div class="p-field">
      @if (props.fileLabel) {
        <label>
          {{ props.fileLabel }}
          @if (props.required && props.hideRequiredMarker !== true) {
            <span class="text-red-500">*</span>
          }
        </label>
      }

      @if (props.description) {
        <p class="mb-3 text-xs">{{ props.description }}</p>
      }

      <p-fileUpload
        #fileUploader
        mode="basic"
        [multiple]="props.multiple ?? false"
        [accept]="
          props.accept ??
          'xlsx,xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/excel,application/vnd.ms-excel, application/vnd.msexcel'
        "
        [maxFileSize]="props.maxFileSize ?? 134217728"
        [fileLimit]="props.fileLimit"
        [chooseLabel]="fileName() ? fileName() : ('upload_sheet' | translate)"
        [pTooltip]="fileName() ? fileName() : ('upload_sheet' | translate)"
        tooltipPosition="top"
        chooseIcon="pi pi-upload"
        (onSelect)="onSelect($event)"
      />

      @if (showError && formControl.errors) {
        <small class="p-error" role="alert">
          <formly-validation-message [field]="field"></formly-validation-message>
        </small>
      }
    </div>
  `,
  standalone: true,
  imports: [FormlyModule, FileUploadModule, TooltipModule, ReactiveFormsModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host ::ng-deep {
      .p-fileupload-choose {
        width: 100%;
        text-align: start;
        padding-block: .5rem;
        font-size: 14px;

        .p-button-label {
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  `,
})
export class ImportFileComponent extends FieldType<FieldTypeConfig> {
  fileUploader = viewChild.required<FileUpload>("fileUploader");

  fileName = signal("");

  onSelect(event: FileSelectEvent) {
    if (!event.files[0]) return;
    this.fileName.set(event.files[0].name);
    this.field.formControl?.setValue(event.files[0]);
    this.fileUploader()?.clear();
  }
}
