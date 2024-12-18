import { Directive, TemplateRef, ViewContainerRef, inject, input } from "@angular/core";

@Directive({
  selector: "[appModuleVisibility]",
  standalone: true,
})
export class ModuleVisibilityDirective<T> {
  #viewContainer = inject(ViewContainerRef);
  #templateRef = inject(TemplateRef<T>);

  hasModuleName = input<boolean>(false, { alias: "appModuleVisibility" });

  ngOnInit(): void {
    if (this.hasModuleName()) {
      this.#viewContainer.createEmbeddedView(this.#templateRef);
    } else {
      this.#viewContainer.clear();
    }
  }
}
