import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { environment } from "@env";
import { FieldType, FieldTypeConfig, FormlyModule } from "@ngx-formly/core";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { FileSelectEvent, FileUpload, FileUploadEvent, FileUploadModule } from "primeng/fileupload";
import { ImageModule } from "primeng/image";
import { constants } from "src/app/shared/config";

@Component({
  selector: "formly-field-file",
  templateUrl: "./file.component.html",
  standalone: true,
  styleUrl: "./file.component.scss",
  imports: [FormlyModule, ButtonModule, TranslateModule, ImageModule, FileUploadModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileFieldComponent extends FieldType<FieldTypeConfig> {
  #sanitizer = inject(DomSanitizer);

  fileUploader = viewChild.required<FileUpload>("fileUploader");

  selectedFile = signal<any>(null);
  url = `${environment.API_URL}/v2/global/media/upload`;

  mediaFile = signal<string | null>(null);

  constants = constants;

  ngOnInit() {
    const value = this.formControl?.value;
    if (this.props.mode === "update" && value) {
      this.mediaFile.set(value);
    }
  }

  onSelect(event: FileSelectEvent) {
    const file = event.files[0];
    if (!file) return;

    const maxFileSize = this.fileUploader()?.maxFileSize ?? 0;

    if (file.size > maxFileSize) return;

    this.props?.isUploading?.set(true);
    (file as any).objectURL = this.#sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(file),
    );
    this.selectedFile.set(file);
  }

  onUpload(event: FileUploadEvent) {
    const body = (event.originalEvent as any)?.body;
    if (!body.status) return;
    this.props?.isUploading?.set(false);
    const fileName = body.data[0].name;
    this.formControl?.setValue(fileName);
  }
}
