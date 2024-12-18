import { Directive, TemplateRef, ViewContainerRef, inject, input } from '@angular/core';

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class PermissioneVisibilityDirective<T> {
  #viewContainer = inject(ViewContainerRef);
  #templateRef = inject(TemplateRef<T>);

  hasPermission = input<boolean>(false, { alias: 'appHasPermission' });

  ngOnInit() {
    if (this.hasPermission()) {
      this.#viewContainer.createEmbeddedView(this.#templateRef);
    } else {
      this.#viewContainer.clear();
    };
  };
}
