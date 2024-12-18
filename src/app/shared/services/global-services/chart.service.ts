import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ApiService } from "./api.service";
import { Charts } from "./global";

export interface ChartRespons {
  name: string;
  desc: string;
  data: number[];
  backgroundColor: string[];
  labels: string[];
}
@Injectable({
  providedIn: "root",
})
export class ChartService {
  #api = inject(ApiService);

  getCharts(charts: Charts) {
    return this.#api
      .request("post", "reports/charts/get-charts", charts, undefined, undefined, "v2")
      .pipe(map(({ data }) => Object.values(data))) as Observable<ChartRespons[]>;
  }
}
