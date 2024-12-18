import { inject, Injectable } from "@angular/core";
import { Message, MessageService } from "primeng/api";

@Injectable({ providedIn: "root" })
export class AlertService {
  #message = inject(MessageService);

  messageData: Message = {
    key: undefined,
    severity: "",
    detail: "",
    summary: "",
    icon: "",
    sticky: false,
    life: 4000,
  };

  setMessage(data: Message) {
    this.messageData = { ...this.messageData, ...data };
    if (this.messageData.detail?.trim()) {
      this.#message.clear();
      this.#message.add(this.messageData);
    }
  }
}
