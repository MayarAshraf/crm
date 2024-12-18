import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormGroup } from "@angular/forms";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { NoteInputsService } from "@modules/Notes/services/note-inputs.service";
import { NotesService } from "@modules/Notes/services/notes.service";
import { INote, NoteModel } from "@modules/Notes/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateModule } from "@ngx-translate/core";
import {
  AuthService,
  CachedLabelsService,
  constants,
  FormComponent,
  InitialsPipe,
  LangService,
  RandomColorPipe,
} from "@shared";
import { TimelineModule } from "primeng/timeline";
import { TooltipModule } from "primeng/tooltip";
import { finalize, tap } from "rxjs";
import { NoteCardComponent } from "../note-card/note-card.component";

@Component({
  selector: "app-note-form",
  standalone: true,
  imports: [
    FormComponent,
    NoteCardComponent,
    TimelineModule,
    TooltipModule,
    InitialsPipe,
    TranslateModule,
    RandomColorPipe,
  ],
  template: `
    @if (notesList()) {
      @if (notesList()?.length) {
        <div class="mb-3">
          <p-timeline
            [value]="notesList() || []"
            [align]="currentLang() === 'ar' ? 'right' : 'left'"
          >
            <ng-template pTemplate="marker" let-note>
              <span
                class="custom-timline-marker"
                [style.background-color]="'' | randomColor"
                [pTooltip]="getLabelById('assignments:all_users_info', note.created_by)"
                tooltipPosition="top"
              >
                {{ getLabelById("assignments:all_users_info", note.created_by) | initials }}
              </span>
            </ng-template>

            <ng-template pTemplate="content" let-note>
              <app-note-card
                [note]="note"
                [endpoint]="constants.API_ENDPOINTS.deleteNotes"
                deleteApiVersion="v2"
                (onDelete)="onDeleteNote($event)"
              />
            </ng-template>
          </p-timeline>
        </div>
      } @else {
        <p class="mb-0 text-center text-300">{{ "no_notes_yet" | translate }}</p>
      }
    } @else {
      <div class="mt-3 text-center">
        <i class="pi pi-spin pi-spinner"></i>
      </div>
    }

    <div
      class="sticky bottom-0 bg-white pt-3 px-3 border-top-1 border-200 flex gap-3 align-items-start"
    >
      <div class="avatar">
        <img
          class="w-3rem h-3rem border-circle border-1 border-200"
          src="{{ avatarSrc() || 'assets/media/icons/avatar.jpg' }}"
          alt="Avatar"
        />
      </div>
      <div class="flex-auto bg-gray-50 p-3 border-round">
        <app-form
          [form]="form"
          [model]="model()"
          [fields]="fields"
          iconLabel="pi pi-send"
          [submitBtnLoading]="isLoading()"
          [showFormActions]="isEditing()"
          footerFormClass="relative border-none p-0 bg-transparent"
          (onSubmit)="addNote($event)"
        />
      </div>
    </div>
  `,
  styles: `
    :host ::ng-deep {
      .inplace-note .p-field {
        margin-bottom: 0 !important;
      }

      .p-timeline-event-separator {
        padding-inline-end: 1.5rem;
      }
      .p-timeline-event-connector {
        display: none;
      }
    }

    .custom-timline-marker {
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translateY(10px);
      width: 55px !important;
      height: 55px;
      color: #fff;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesComponent {
  #authService = inject(AuthService);
  currentLang = inject(LangService).currentLanguage;
  #cachedLabels = inject(CachedLabelsService);
  #noteInputs = inject(NoteInputsService);
  #noteService = inject(NotesService);
  #destroyRef = inject(DestroyRef); // Current "context" (this component)

  avatarSrc = signal(this.#authService.currentUser()?.image);
  isEditing = signal(false);

  notableId = input.required<number>();
  notableType = input.required<string>();

  isLoading = signal(false);
  notesList = signal<INote[] | null>(null);
  constants = constants;

  form = new FormGroup({});
  model = computed(() => new NoteModel({ id: this.notableId(), type: this.notableType() }));
  fields: FormlyFieldConfig[] = [];

  getLabelById(listKey: string, id: number) {
    return this.#cachedLabels.getLabelById(listKey, id);
  }

  ngOnInit() {
    this.fields = [
      {
        key: "notable_type",
      },
      {
        key: "notable_id",
      },
      {
        type: "input-field",
        className: "inplace-note",
        props: {
          label: _("write_note"),
          placeholder: _("write_note"),
          focus: field => {
            field.hide = true;
            this.isEditing.set(true);

            const subjectField = field.parent?.get?.("subject");
            const descField = field.parent?.get?.("description");
            subjectField && (subjectField.hide = false);
            descField && (descField.hide = false);
          },
        },
      },
      this.#noteInputs.getNoteSubjectField({
        hide: true,
        focus: true,
        props: {
          label: _("write_note"),
          placeholder: _("write_note"),
        },
      }),
      this.#noteInputs.getNoteDescField({
        hide: true,
        props: {
          label: _("enter_description"),
        },
      }),
    ];

    this.#noteService
      .getNotesList(this.notableId(), this.notableType())
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        tap(notes => this.notesList.set(notes)),
      )
      .subscribe();
  }

  addNote(model: NoteModel) {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
      return;
    }
    this.isLoading.set(true);
    this.#noteService
      .storeNote(model)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(note => {
        this.notesList.update(list => [note, ...(list as INote[])]);
        this.form.reset();
      });
  }

  onDeleteNote(id: number) {
    this.notesList.update(notes => (notes as INote[]).filter(n => n.id !== id));
  }
}
