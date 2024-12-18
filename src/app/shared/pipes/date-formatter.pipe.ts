import { inject, Pipe, PipeTransform } from "@angular/core";
import moment from "moment-timezone";
import { constants } from "../config";
import { AuthService } from "../services";

@Pipe({ name: "dateFormatter", standalone: true })
export class DateFormatterPipe implements PipeTransform {
  readonly #currentZone = inject(AuthService).currentUser()?.timezone || "Etc/UTC";

  transform(
    value: string,
    outputType: "both" | "relative" | "absolute" = "both",
    dateFormat: string = constants.DATE_FORMAT,
    outputFormat: string = "MMM D, YYYY | hh:mm A",
    timezone: string = this.#currentZone,
  ) {
    if (!value) return "";

    const utcDate = moment.utc(value, dateFormat); // parse the date using the dateFormat and convert it to UTC (Coordinated Universal Time).
    const timezoneDate = utcDate.tz(timezone); // convert the UTC date to the timezone.
    const formattedDate = timezoneDate.format(outputFormat); // format the date using the outputFormat.
    const relativeTime = timezoneDate.fromNow(); // Calculate relative time based on the timezone-adjusted date.

    switch (outputType) {
      case "absolute":
        return formattedDate;
      case "relative":
        return relativeTime;
      case "both":
      default:
        return `${relativeTime}, ${formattedDate}`;
    }
  }
}
