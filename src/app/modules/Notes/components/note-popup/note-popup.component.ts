import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from "@angular/core";
import { NoteFieldsService } from "@modules/Notes/services/note-fields.service";
import { NoteModel } from "@modules/Notes/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateModule } from "@ngx-translate/core";
import { BasePopupFormComponent } from "@shared";

@Component({
  selector: "app-note-popup",
  standalone: true,
  template: `
    <app-base-popup-form
      [fields]="fields"
      [model]="model()"
      endpoint="notes/notes/store"
      apiVersion="v2"
      (updateUi)="onNoteAdded.emit($event)"
    >
      <span class="block mb-3 text-primary">
        {{ "new_note" | translate }}
        <span class="text-xs">({{ data()?.full_name }})</span>
      </span>
    </app-base-popup-form>
  `,
  imports: [BasePopupFormComponent, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotePopupComponent {
  #noteFieldsService = inject(NoteFieldsService);

  data = model.required<any>();

  notableType = input<string>();
  onNoteAdded = output<any>();

  model = computed(() => new NoteModel({ id: this.data().id, type: this.notableType() }));
  fields: FormlyFieldConfig[] = [];

  ngOnInit() {
    this.fields = this.#noteFieldsService.configureFields();
  }
}
