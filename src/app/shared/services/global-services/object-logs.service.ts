import { inject, Injectable } from "@angular/core";
import { map } from "rxjs";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class ObjectLogsService {
  #api = inject(ApiService);

  getObjectLogs(id: number, type: string, archived: boolean = false) {
    return this.#api
      .request("post", "logger/get-by-subject-type-id", {
        id,
        type,
        archived,
      })
      .pipe(map(({ data }) => data));
  }
}
