import { KeyValuePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, input, signal } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { TranslateModule } from "@ngx-translate/core";
import { ObjectLogsService } from "@shared";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { Observable, finalize, map, switchMap } from "rxjs";

interface Log {
  id: number;
  causer_id: number;
  causer_type: string;
  causer_full_name: string;
  description: string;
  subject_type: string;
  created_at: string;
  named_changes: { [key: string]: { new: string; old: string } }[];
}

@Component({
  selector: "app-logs",
  standalone: true,
  imports: [KeyValuePipe, TableModule, TooltipModule, TranslateModule],
  template: `
    <p-table
      [value]="logs()"
      [loading]="isLoading()"
      [rows]="10"
      [paginator]="true"
      [alwaysShowPaginator]="false"
      [showCurrentPageReport]="true"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      [rowsPerPageOptions]="[5, 10, 20, 30, 50, 100]"
      styleClass="p-datatable-sm p-datatable-striped"
    >
      <ng-template pTemplate="header">
        <tr>
          <th>{{ "date_time" | translate }}</th>
          <th>{{ "name" | translate }}</th>
          <th>{{ "changes" | translate }}</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-log>
        <tr>
          <td>{{ log.created_at }}</td>
          <td>{{ log.causer_full_name }}</td>
          <td>
            @if (log.named_changes && log.named_changes.length > 0) {
              @for (change of log.named_changes; track $index) {
                @for (item of change | keyvalue; track item) {
                  <span class="flex gap-2 align-items-center">
                    <strong class="white-space-nowrap">{{ item.key }}:</strong>
                    <span class="white-space-nowrap font-medium">
                      {{ assertChangeType(item.value).new }}
                    </span>
                    <i class="fas fa-arrow-alt-circle-right"></i>
                    <span class="white-space-nowrap font-medium">
                      {{ assertChangeType(item.value).old }}
                    </span>
                  </span>
                }
              }
            } @else {
              --
            }
          </td>
        </tr>
      </ng-template>

      <ng-template pTemplate="emptymessage">
        <tr>
          <td colspan="5">{{ "no_logs_found" | translate }}.</td>
        </tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogsComponent {
  #objectLogs = inject(ObjectLogsService);

  id = input.required<number>();
  type = input.required<string>();
  isArchived = input(false);
  isLoading = signal(true);

  logs$: Observable<Log[]> = toObservable(this.isArchived).pipe(
    switchMap(isArchived =>
      this.#objectLogs.getObjectLogs(this.id(), this.type(), isArchived).pipe(
        map(({ data }) => data),
        finalize(() => this.isLoading.set(false)),
      ),
    ),
  );

  logs = toSignal(this.logs$, { initialValue: [] });

  assertChangeType(value: unknown): { new: string; old: string } {
    return value as { new: string; old: string };
  }
}
