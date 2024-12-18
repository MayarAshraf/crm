import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormlyModule } from "@ngx-formly/core";
import localForage from "localforage";
import { ButtonModule } from "primeng/button";
import { LangService } from "../services";

@Component({
  selector: "app-lang-switcher",
  template: `
    <button
      pButton
      (click)="switchLanguage()"
      [label]="buttonLabel"
      icon="fas fa-globe"
      class="p-button-sm"
    ></button>
  `,
  standalone: true,
  imports: [FormlyModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangSwitcherComponent {
  #langService = inject(LangService);
  buttonLabel = "";
  RELOAD_DELAY = 1000;

  ngOnInit() {
    this.#setButtonLabel();
  }

  #setButtonLabel() {
    this.buttonLabel = this.#langService.currentLanguage() === "en" ? "Ar" : "En";
  }

  switchLanguage() {
    const newLang = this.#langService.currentLanguage() === "en" ? "ar" : "en";
    this.#langService.switchLanguage(newLang);
    this.#setButtonLabel();
    localForage.clear();

    setTimeout(() => {
      location.reload();
    }, this.RELOAD_DELAY);
  }
}
