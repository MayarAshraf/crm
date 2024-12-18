import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { FormlyFieldConfig, FormlyModule } from "@ngx-formly/core";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { ImportFileComponent } from "../fields/import-file.component";

@Component({
  selector: "app-simple-import-dialog",
  standalone: true,
  templateUrl: "./simple-import-dialog.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormlyModule, ReactiveFormsModule, TranslateModule, ButtonModule, DialogModule],
})
export class SimpleImportDialogComponent {
  dialogTitle = input<string>("");
  template = input<string>("");
  visible = model.required<boolean>();

  form = new FormGroup({});
  model: { file: File | null } = { file: null };

  fields: FormlyFieldConfig[] = [
    {
      key: "file",
      className: "block md:w-17rem",
      type: ImportFileComponent,
      props: {
        required: true,
      },
    },
  ];

  onSubmit() {
    const file = this.model.file as File;
    const formData = new FormData();
    formData.append("file", file);
  }
}
