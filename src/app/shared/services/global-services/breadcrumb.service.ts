import { DestroyRef, Injectable, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";
import { BreadcrumbItem } from "./global";

@Injectable({
  providedIn: "root",
})
export class BreadcrumbService {
  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);
  #destroyRef = inject(DestroyRef);

  #breadcrumbs = signal<BreadcrumbItem[]>([]); // private to this service.
  breadcrumbs = this.#breadcrumbs.asReadonly(); // exposed publicly.
  home = { label: "dashboard", icon: "fas fa-home", url: "/home" };

  constructor() {
    this.#initBreadcrumbs();
  }

  #initBreadcrumbs() {
    this.#getBreadcrumbs(this.#activatedRoute.root);
    this.#router.events
      .pipe(
        takeUntilDestroyed(),
        filter(event => event instanceof NavigationEnd),
      )
      .subscribe(() => {
        this.#getBreadcrumbs(this.#activatedRoute.root);
      });
  }

  #getBreadcrumbs(route: ActivatedRoute) {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) return;

    for (const child of children) {
      child.data.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(data => {
        const breadcrumbs = data["breadcrumbs"];
        if (breadcrumbs && breadcrumbs.length) {
          this.#breadcrumbs.set([this.home, ...breadcrumbs]);
        } else {
          this.#breadcrumbs.set([this.home]);
        }
      });

      this.#getBreadcrumbs(child);
    }
  }

  updateAllBreadcrumbs(breadcrumbs: BreadcrumbItem[]) {
    this.#breadcrumbs.set([this.home, ...breadcrumbs]);
  }

  updateBreadcrumbAtIndex(index: number, breadcrumb: BreadcrumbItem) {
    this.#breadcrumbs.update(breadcrumbs => {
      const updatedBreadcrumbs = [...breadcrumbs];
      updatedBreadcrumbs[index] = breadcrumb;
      return updatedBreadcrumbs;
    });
  }

  pushBreadcrumb(breadcrumb: BreadcrumbItem) {
    this.#breadcrumbs.update(breadcrumbs => [...breadcrumbs, breadcrumb]);
  }
}
