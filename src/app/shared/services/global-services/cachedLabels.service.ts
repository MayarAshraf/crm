import { inject, Injectable } from "@angular/core";
import { CachedListsService } from "./cached-lists.service";

@Injectable({
  providedIn: "root",
})
export class CachedLabelsService {
  #cachedLists = inject(CachedListsService);

  getLabelsByIds(listKey: string, ids: number[]) {
    const data = this.#cachedLists.loadLists().get(listKey);
    return data?.filter((item: { value: number }) => ids?.includes(item.value)) || [];
  }

  getLabelById(listKey: string, id: number) {
    return this.#cachedLists
      .loadLists()
      .get(listKey)
      ?.find((item: { value: number }) => item.value === id)?.label;
  }
}
