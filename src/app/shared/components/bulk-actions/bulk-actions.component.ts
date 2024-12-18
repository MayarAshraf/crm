import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, input, model, signal } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { MenuItem } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { MenuModule } from "primeng/menu";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-bulk-actions",
  standalone: true,
  templateUrl: "./bulk-actions.component.html",
  styleUrl: "./bulk-actions.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, ButtonModule, TooltipModule, MenuModule, TranslateModule],
})
export class BulkActionsComponent {
  bulkActions = model.required<MenuItem[]>();
  stateKey = input.required<string | undefined>();
  selection = model<any[]>([]);
  displayBulkActionsBar = computed(() => !!this.selection().length);
  targetElement = input.required<HTMLElement>();
  selectedAction = model.required<MenuItem | null>();

  position = signal({ left: 0, right: 0 });
  resizeObserver!: ResizeObserver;

  coordinates = computed(() => ({
    left: `${this.position().left + 20}px`,
    right: `${this.position().right + 20}px`,
  }));

  ngOnInit() {
    this.resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        const rect = entry.target.getBoundingClientRect();
        this.position.set({
          left: rect.left,
          right: window.innerWidth - rect.right,
        });
      });
    });
    this.resizeObserver.observe(this.targetElement());
  }

  ngOnDestroy() {
    if (!this.resizeObserver) return;
    this.resizeObserver.disconnect();
  }

  addBulkAction(item: MenuItem) {
    this.selectedAction.set(item);
  }

  clearAll() {
    this.selection.set([]);
    const storedDataString = localStorage.getItem(this.stateKey() as string);
    if (!storedDataString) return;
    const storedData = JSON.parse(storedDataString);
    delete storedData.selection;
    localStorage.setItem(this.stateKey() as string, JSON.stringify(storedData));
  }
}
