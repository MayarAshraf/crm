import { Injectable, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { TranslateService } from "@ngx-translate/core";
import { ConfirmationService } from "primeng/api";

interface ConfirmConfig {
  target?: any;
  key?: string;
  header?: string;
  message?: string;
  acceptCallback: Function;
  rejectCallback?: Function;
}

@Injectable({ providedIn: "root" })
export class ConfirmService {
  #confirm = inject(ConfirmationService);
  #translate = inject(TranslateService);

  header = this.#translate.instant(_("are_you_sure"));
  message = this.#translate.instant(_("You_will_not_be_able_to_revert"));

  confirmDelete(config: ConfirmConfig): void {
    this.#confirm.confirm({
      target: config?.target || undefined,
      key: config.target ? undefined : config.key ? config.key : "globalConfirmDialogKey",
      header: config?.header ?? this.header,
      message: config?.message ?? this.message,
      accept: config.acceptCallback,
      reject: config?.rejectCallback,
    });
  }
}
