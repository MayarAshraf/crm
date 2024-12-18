
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ReorderTableRecordsService {
  #api = inject(ApiService);

  updateRecordsOrder(endpoint: string, data: { id: number; old_order: number, new_order: number }) {
    return this.#api.request("post", endpoint, data).pipe(
      map(({ data }) => data),
    );
  };
}