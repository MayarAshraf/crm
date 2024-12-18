import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '@shared';
import { map } from 'rxjs';
import { UserPreference } from './service-types';

@Injectable({
  providedIn: 'root',
})

export class PreferencesService {
  #api = inject(ApiService);

  #preferences = this.#api.request("get", 'preferences/my-preferences').pipe(map(({ data }) => data));

  // UserPreference[] is a generic type for both the signal and its default value.
  // empty array as the initial value will be the value of the signal until the observable emits its first value.
  preferences = toSignal<UserPreference[], UserPreference[]>(this.#preferences, { initialValue: [] });
}
