import { AsyncPipe, NgClass, NgStyle } from "@angular/common";
import { ChangeDetectionStrategy, Component, viewChild } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectComponent, NgSelectModule } from "@ng-select/ng-select";
import { FieldType, FieldTypeConfig, FormlyModule } from "@ngx-formly/core";
import { FormlySelectModule } from "@ngx-formly/core/select";
import { AutoFocusModule } from "primeng/autofocus";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputTextModule } from "primeng/inputtext";
import { Observable, of } from "rxjs";

@Component({
  selector: "formly-ng-select-field",
  templateUrl: "./ng-select.component.html",
  styleUrl: "./ng-select.component.scss",
  standalone: true,
  imports: [
    NgStyle,
    NgClass,
    FloatLabelModule,
    AsyncPipe,
    FormsModule,
    FormlyModule,
    InputTextModule,
    AutoFocusModule,
    FormlySelectModule,
    NgSelectModule,
    AsyncPipe,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgSelectFieldComponent extends FieldType<FieldTypeConfig> {
  select = viewChild.required<NgSelectComponent>("select");
  get options$(): Observable<any[]> {
    return Array.isArray(this.props.options)
      ? of(this.props.options)
      : this.props.options ?? of([]);
  }

  #onScroll = (event: any) => {
    if (this.select() && this.select().isOpen) {
      const isScrollingInScrollHost =
        (event.target.className as string)?.indexOf("ng-dropdown-panel-items") > -1;
      if (isScrollingInScrollHost) {
        return;
      } // ensure that the scrolling is not occurring inside the dropdown.
      this.select().dropdownPanel.adjustPosition();
    }
  };

  ngOnInit() {
    window.addEventListener("scroll", this.#onScroll, true);
  }

  ngOnDestroy() {
    window.removeEventListener("scroll", this.#onScroll, true);
  }
}
