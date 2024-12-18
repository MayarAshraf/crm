import { Injectable, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { NoteInputsService } from "./note-inputs.service";

@Injectable({
  providedIn: "root",
})
export class NoteFieldsService {
  #noteInputs = inject(NoteInputsService);

  configureFields(): FormlyFieldConfig[] {
    return [
      {
        key: "notable_type",
      },
      {
        key: "notable_id",
      },
      this.#noteInputs.getNoteSubjectField({
        props: { label: _("enter_subject") },
      }),
      this.#noteInputs.getNoteDescField({
        props: { label: _("enter_description") },
      }),
    ];
  }
}
