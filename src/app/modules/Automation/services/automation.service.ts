import { inject, Injectable } from '@angular/core';
import { ApiService } from '@shared';

@Injectable({
  providedIn: 'root'
})

export class AutomationService {
  #api = inject(ApiService);

}