import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  model,
  output,
  viewChild,
} from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { INote } from "@modules/Notes/services/service-types";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import {
  constants,
  GlobalActionService,
  InplaceDescComponent,
  TimelineCardComponent,
} from "@shared";

@Component({
  selector: "app-note-card",
  standalone: true,
  template: `
    <div class="relative">
      <div #deleteTarget class="confirm-target"></div>

      <app-timeline-card [value]="note()" [moreOptions]="moreOptions">
        <div header>
          <app-inplace-input
            [(entity)]="note"
            updateType="subject"
            [enterBtnLabel]="'enter_subject' | translate"
            [editBtnLabel]="'edit_subject' | translate"
            inputType="input"
            [endpoint]="constants.API_ENDPOINTS.updateNotesData"
          />
        </div>

        <div content>
          <app-inplace-input
            [(entity)]="note"
            [endpoint]="constants.API_ENDPOINTS.updateNotesData"
          />
        </div>
      </app-timeline-card>
    </div>
  `,
  styles: `
    .confirm-target {
      position: absolute;
      top: 1rem;
      left: calc(50% - 95px);
      transform: translateX(-50%);
      pointer-events: none;
    }
  `,
  imports: [TimelineCardComponent, InplaceDescComponent, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteCardComponent extends GlobalActionService {
  #translate = inject(TranslateService);

  note = model.required<INote>();
  endpoint = input<string>("");
  deleteApiVersion = input<string>("v1");
  onDelete = output<number>();
  deleteTarget = viewChild.required<ElementRef>("deleteTarget");

  constants = constants;

  moreOptions = [
    {
      label: this.#translate.instant(_("delete")),
      icon: "fas fa-trash-alt",
      command: () => {
        const target = this.deleteTarget().nativeElement;
        this.deleteAction(this.endpoint(), target, this.note().id, this.deleteApiVersion());
      },
    },
  ];

  protected updateUi(): void {
    this.onDelete.emit(this.note().id);
  }
}
