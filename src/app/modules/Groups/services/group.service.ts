import { inject, Injectable } from '@angular/core';
import { ApiService } from '@shared';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class GroupService {
  #api = inject(ApiService);

  updateGropuPermissions(groupId: number) {
    return this.#api.request("post", `groups/updateGroupPermisisonsModal-v2/${groupId}`, {})
      .pipe(map(({ data }) => data));
  };

  updateGropuScopes(groupId: number) {
    return this.#api.request("post", `groups/getGroupAccessScopesGroupsModal/${groupId}`, {})
      .pipe(map(({ data }) => data));
  };
}
