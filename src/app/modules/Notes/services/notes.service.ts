import { inject, Injectable } from "@angular/core";
import { ApiService } from "@gService/api.service";
import { NoteModel } from "@modules/Notes/services/service-types";
import { map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NotesService {
  #api = inject(ApiService);

  getNotesList(notable_id: number, notable_type: string) {
    return this.#api
      .request("post", "notes/notes/list", { notable_id, notable_type }, undefined, undefined, "v2")
      .pipe(map(({ data }) => data));
  }

  storeNote(note: NoteModel) {
    return this.#api
      .request("post", "notes/notes/store", note, undefined, undefined, "v2")
      .pipe(map(({ data }) => data));
  }
}
