import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import {
  endOfDay,
  endOfMonth,
  endOfQuarter,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  subDays,
} from "date-fns";
import { ButtonModule } from "primeng/button";
import { Calendar, CalendarModule } from "primeng/calendar";
import { DividerModule } from "primeng/divider";

@Component({
  selector: "app-date-range",
  standalone: true,
  imports: [
    NgTemplateOutlet,
    ButtonModule,
    FormsModule,
    DividerModule,
    CalendarModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  template: `
    <div class="p-field">
      @if (withForm()) {
        <div [formGroup]="form()">
          <p-calendar
            #datePicker
            [formControlName]="controlName()"
            styleClass="h-auto"
            panelStyleClass="flex gap-2"
            inputStyleClass="bg-transparent"
            selectionMode="range"
            [title]="title()"
            [placeholder]="placeholder()"
            [showButtonBar]="false"
            [showIcon]="true"
            [showClear]="true"
            appendTo="body"
            dataType="string"
            dateFormat="yy-mm-dd"
          >
            <ng-template pTemplate="header">
              <ng-container *ngTemplateOutlet="calendarHeaderRef"></ng-container>
            </ng-template>
          </p-calendar>
        </div>
      } @else {
        <p-calendar
          #datePicker
          styleClass="h-auto"
          panelStyleClass="flex gap-2"
          inputStyleClass="bg-transparent"
          selectionMode="range"
          [title]="title()"
          [placeholder]="placeholder()"
          [showButtonBar]="false"
          [showIcon]="true"
          [(ngModel)]="currentDate"
          [maxDate]="maxDate()"
          [showClear]="true"
          appendTo="body"
          dataType="string"
          dateFormat="yy-mm-dd"
          (onSelect)="onSelect.emit($event)"
          (onClose)="onClose.emit(datePicker.value)"
          (onClear)="onClear.emit(datePicker.value)"
        >
          <ng-template pTemplate="header">
            <ng-container *ngTemplateOutlet="calendarHeaderRef"></ng-container>
          </ng-template>
        </p-calendar>
      }
    </div>

    <ng-template #calendarHeaderRef>
      <div class="presets-menu">
        @for (item of presets(); track $index) {
          <button
            pButton
            (click)="setPreset(item.value)"
            [label]="item.label"
            class="w-full text-left p-button-text text-sm py-1"
            [class.p-button-plain]="activePreset() !== item.value"
          ></button>
        }
        <p-divider styleClass="my-1"></p-divider>
        <button
          pButton
          (click)="clear()"
          class="w-full text-left p-button-text text-sm py-1"
          [label]="'clear_all' | translate"
        ></button>
      </div>
    </ng-template>
  `,
  styles: `
    :host ::ng-deep {.p-datepicker-trigger {padding: 0;}}
    .presets-menu {
      max-width: 200px;
      border-inline-end: 1px solid #e5e7eb;
      padding-inline-end: .5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangeComponent {
  withForm = input(true);
  form = input<FormGroup>({} as FormGroup);
  controlName = input<string>("");
  title = input("");
  placeholder = input("");
  maxDate = input(new Date());
  currentDate = new Date().toISOString().split("T")[0];

  onSelect = output<Date>();
  onClose = output<Date[] | null>();
  onClear = output<null>();

  datePicker = viewChild.required<Calendar>("datePicker");
  activePreset = signal("");

  presets = signal<{ label: string; value: string }[]>([
    {
      label: "Today",
      value: "today",
    },
    {
      label: "Yesterday",
      value: "yesterday",
    },
    {
      label: "Last 7 days",
      value: "last_7_days",
    },
    {
      label: "Last 30 days",
      value: "last_30_days",
    },
    {
      label: "This Month",
      value: "this_month",
    },
    {
      label: "This Quarter",
      value: "this_quarter",
    },
    {
      label: "This Year",
      value: "this_year",
    },
    {
      label: "Last Month",
      value: "last_month",
    },
    {
      label: "Last Quarter",
      value: "last_quarter",
    },
    {
      label: "Last Year",
      value: "last_year",
    },
  ]);

  setPreset(preset: string) {
    let startDate: Date = new Date();
    let endDate: Date = new Date();
    this.activePreset.set(preset);

    switch (preset) {
      case "today":
        startDate = endDate = startOfDay(new Date());
        break;
      case "yesterday":
        startDate = endDate = startOfDay(subDays(new Date(), 1));
        break;
      case "last_7_days":
        startDate = startOfDay(subDays(new Date(), 7));
        endDate = endOfDay(new Date());
        break;
      case "last_30_days":
        startDate = startOfDay(subDays(new Date(), 30));
        endDate = endOfDay(new Date());
        break;
      case "this_month":
        startDate = startOfMonth(new Date());
        endDate = endOfMonth(new Date());
        break;
      case "this_quarter":
        startDate = startOfQuarter(new Date());
        endDate = endOfQuarter(new Date());
        break;
      case "this_year":
        startDate = startOfYear(new Date());
        endDate = endOfYear(new Date());
        break;
      case "last_month":
        startDate = startOfMonth(subDays(new Date(), 30));
        endDate = endOfMonth(subDays(new Date(), 30));
        break;
      case "last_quarter":
        startDate = startOfQuarter(subDays(new Date(), 90));
        endDate = endOfQuarter(subDays(new Date(), 90));
        break;
      case "last_year":
        startDate = startOfYear(subDays(new Date(), 365));
        endDate = endOfYear(subDays(new Date(), 365));
        break;
    }

    this.datePicker().updateModel([startDate, endDate]);
    this.datePicker().updateInputfield();
    this.datePicker().hideOverlay();
    this.onSelect.emit(this.datePicker().value);
  }

  clear() {
    this.activePreset.set("");
    this.datePicker().clear();
    this.datePicker().hideOverlay();
  }
}
