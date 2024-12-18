import { DOCUMENT } from "@angular/common";
import { DestroyRef, Injectable, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { TranslateService } from "@ngx-translate/core";
import { PrimeNGConfig } from "primeng/api";
import { constants } from "../../config";
import { localStorageSignal } from "../../helpers";

@Injectable({ providedIn: "root" })
export class LangService {
  #translate = inject(TranslateService);
  #primengConfig = inject(PrimeNGConfig);
  #document = inject(DOCUMENT);
  #destroyRef = inject(DestroyRef); // Current "context" (this service)

  #currentLanguage = localStorageSignal<string>(constants.DEFAULT_LANGUAGE, "app-lang"); // private to this service.
  currentLanguage = this.#currentLanguage.asReadonly(); // exposed publicly.

  switchLanguage(lang: string) {
    this.#translate.use(lang);
    this.#currentLanguage.set(lang);
    this.changeHtmlAttributes(lang);
    this.translatePrimeNg();
  }

  changeHtmlAttributes(lang: string) {
    const htmlTag = this.#document.getElementsByTagName("html")[0] as HTMLHtmlElement;
    htmlTag.lang = lang;
    htmlTag.dir = lang === "ar" ? "rtl" : "ltr";
  }

  translatePrimeNg() {
    this.#translate
      .get("primeng")
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(res => this.#primengConfig.setTranslation(res));
  }
}
