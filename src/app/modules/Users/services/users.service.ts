import { inject, Injectable } from "@angular/core";
import { ApiService } from "@shared";
import { map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  #api = inject(ApiService);

  updateUserPermissions(userId: number) {
    return this.#api
      .request("get", `users/updateUserPermisisonsModal/${userId}`)
      .pipe(map(({ data }) => data));
  }

  assignedLeadsCount(userId: number) {
    return this.#api
      .request("post", "users/assignedLeadsCount", { id: userId })
      .pipe(map(({ data }) => (data === 0 ? data + "" : data)));
  }
}
