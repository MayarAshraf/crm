import { DatePipe, NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ReactiveFormsModule } from "@angular/forms";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FieldType, FieldTypeConfig, FormlyModule } from "@ngx-formly/core";
import { TranslateService } from "@ngx-translate/core";
import { addDays, addHours, addMinutes, addWeeks } from "date-fns";
import moment from "moment-timezone";
import { Calendar, CalendarModule } from "primeng/calendar";
import { FloatLabelModule } from "primeng/floatlabel";
import { TabMenuModule } from "primeng/tabmenu";
import { TooltipModule } from "primeng/tooltip";
import { distinctUntilChanged, filter, tap } from "rxjs";
import { constants } from "src/app/shared/config";
import { DateFormatterPipe } from "src/app/shared/pipes";
import { AuthService } from "src/app/shared/services";

@Component({
  selector: "formly-data-picker-field",
  templateUrl: "./date-picker.component.html",
  standalone: true,
  styleUrls: ["./date-picker.component.scss"],
  imports: [
    NgClass,
    TooltipModule,
    FloatLabelModule,
    FormlyModule,
    CalendarModule,
    TabMenuModule,
    ReactiveFormsModule,
  ],
  providers: [DatePipe, DateFormatterPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerComponent extends FieldType<FieldTypeConfig> {
  #destroyRef = inject(DestroyRef); // Current "context" (this component)
  #datePipe = inject(DatePipe);
  #dateFormatter = inject(DateFormatterPipe);
  #translate = inject(TranslateService);
  readonly #currentZone = inject(AuthService).currentUser()?.timezone || "Etc/UTC";

  datePicker = viewChild.required<Calendar>("datePicker");

  forceDisplay = signal<boolean>(false);

  presetItems = [
    {
      label: this.#translate.instant(_("set_date_on_calendar")),
      icon: "pi pi-calendar",
      command: () => {
        this.forceDisplay.set(true);
        setTimeout(() => {
          this.datePicker().inputfieldViewChild?.nativeElement.dispatchEvent(new Event("click"));
        }, 0);
      },
    },
    {
      label: this.#translate.instant(_("after_15_minutes")),
      command: () => {
        this.forceDisplay.set(false);
        this.addToNow(15);
      },
    },
    {
      label: this.#translate.instant(_("after_30_minutes")),
      command: () => {
        this.forceDisplay.set(false);
        this.addToNow(30);
      },
    },
    {
      label: this.#translate.instant(_("after_1_hour")),
      command: () => {
        this.forceDisplay.set(false);
        this.addToNow(1, "hour");
      },
    },
    {
      label: this.#translate.instant(_("after_2_hours")),
      command: () => {
        this.forceDisplay.set(false);
        this.addToNow(2, "hour");
      },
    },
    {
      label: this.#translate.instant(_("after_3_hours")),
      command: () => {
        this.forceDisplay.set(false);
        this.addToNow(3, "hour");
      },
    },
    {
      label: this.#translate.instant(_("tomorrow")),
      command: () => {
        this.forceDisplay.set(false);
        this.addToNow(1, "day");
      },
    },
    {
      label: this.#translate.instant(_("day_after_tom")),
      command: () => {
        this.forceDisplay.set(false);
        this.addToNow(2, "day");
      },
    },
    {
      label: this.#translate.instant(_("after_1_week")),
      command: () => {
        this.forceDisplay.set(false);
        this.addToNow(1, "week");
      },
    },
    {
      label: this.#translate.instant(_("after_2_weeks")),
      command: () => {
        this.forceDisplay.set(false);
        this.addToNow(2, "week");
      },
    },
  ];

  updateTimeValue(value: string) {
    if (this.props.showTime) {
      const utcDate = moment.utc(value);
      const localDate = utcDate.tz(this.#currentZone).toDate();
      this.formControl?.setValue(localDate);

      const modelDate = this.#dateFormatter.transform(
        value,
        "absolute",
        "YYYY-MM-DD HH:mm:ss",
        constants.DATE_FORMAT,
      );
      this.field.model[this.field.key as string] = modelDate;
    }
  }

  ngOnInit() {
    this.forceDisplay.set(!this.props.withPresets);
    this.formControl?.value && this.updateTimeValue(this.formControl?.value);

    this.formControl.valueChanges
      .pipe(
        filter(value => !!value),
        distinctUntilChanged(),
        tap(value => {
          if (this.props.showTime) {
            const formattedDate = this.#datePipe.transform(value, "yyyy-MM-dd HH:mm");
            this.field.model[this.field.key as string] = formattedDate;
          }
        }),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe();
  }

  addToNow(amount: number, unit = "minute") {
    const currentDate = new Date();
    let presetDate: Date;

    switch (unit) {
      case "minute":
        presetDate = addMinutes(currentDate, amount);
        break;
      case "hour":
        presetDate = addHours(currentDate, amount);
        break;
      case "day":
        presetDate = addDays(currentDate, amount);
        break;
      case "week":
        presetDate = addWeeks(currentDate, amount);
        break;
      default:
        presetDate = currentDate;
        break;
    }

    this.formControl?.setValue(presetDate);
  }

  onClearClick(e: any) {
    e.stopPropagation();
    this.formControl?.setValue(null);
  }
}
