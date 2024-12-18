import { inject, Injectable } from "@angular/core";
import { ApiService } from "@shared";

@Injectable({
  providedIn: "root",
})
export class OrganizationsService {
  #api = inject(ApiService);
}
