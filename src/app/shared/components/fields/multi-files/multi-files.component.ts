import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FieldType, FieldTypeConfig, FormlyModule } from "@ngx-formly/core";
import { TranslateModule } from "@ngx-translate/core";
import { PrimeNGConfig } from "primeng/api";

import { environment } from "@env";
import { DropzoneConfigInterface, DropzoneModule } from "ngx-dropzone-wrapper";
import { ButtonModule } from "primeng/button";
import { ImageModule } from "primeng/image";
import { AuthService } from "src/app/shared/services";

export interface MediaFile {
  id: number;
  name: string;
  file_name: string;
  mime_type: string;
  size: number;
  file: string;
  extension: string; // controls the icon to display
}

@Component({
  selector: "formly-multi-files-field",
  templateUrl: "./multi-files.component.html",
  styleUrl: "./multi-files.component.scss",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DropzoneModule, ImageModule, ButtonModule, FormlyModule, TranslateModule],
})
export class MultiFilesFieldComponent extends FieldType<FieldTypeConfig> {
  #config = inject(PrimeNGConfig);
  #auth = inject(AuthService);

  uploadedFiles = signal<{ original_name: string; name: string }[]>([]);
  mediaFiles = signal<MediaFile[]>([]);

  uploadedFileNames = computed(() => this.uploadedFiles().map(f => f.name));
  files = computed(() => [...new Set(this.uploadedFileNames())]);
  mediaIds = computed(() => this.mediaFiles().map(m => m.id));

  config!: DropzoneConfigInterface;

  formControlEffect = effect(() => {
    this.files().length ? this.formControl.setValue(this.files()) : this.formControl.setValue(null);
  });

  mediaIdsEffect = effect(() => {
    if (this.props.mode === "update") {
      this.field.model["media_ids"] = this.mediaIds();
    }
  });

  onUploadSuccess(args: any): void {
    if (!args[1].status) return;
    const files = args[1].data;
    this.uploadedFiles.update(oldfiles => [...oldfiles, ...files]);
  }

  ngOnInit() {
    this.config = {
      url: environment.API_URL + "/" + (this.props.url ?? `v2/global/media/upload`),
      acceptedFiles: this.props.acceptedFiles ?? "image/*",
      parallelUploads: 2, // Process 2 files at a time.
      maxFilesize: this.props.maxFileSize ?? 10.48576, // Maximum file size in megabytes.
      headers: {
        Authorization: `Bearer ${this.#auth.accessToken()}`,
        "Cache-Control": null,
        "X-Requested-With": null,
      },
      // maxFiles: 1,
      autoReset: null, // Time for resetting component after upload (Default: null).
      errorReset: null, // Time for resetting component after an error (Default: null).
      cancelReset: null, // Time for resetting component after canceling (Default: null).
    };

    const media = this.model["media"]; // returned object in datatable/storedRecord
    if (this.props.mode === "update" && media && media.length > 0) {
      this.mediaFiles.set(media);
    }
  }

  removeFile(index: number) {
    this.mediaFiles.update(files => files.filter((_, i) => i !== index));
  }

  onRemovedFile(file: any) {
    this.uploadedFiles.update(files => files.filter(f => f.original_name !== file.name));
  }

  formatSize(bytes: number) {
    const k = 1024;
    const dm = 3;
    const sizes = this.#config.translation.fileSizeTypes;
    if (bytes === 0) {
      return `0 ${sizes?.[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes?.[i]}`;
  }
}
