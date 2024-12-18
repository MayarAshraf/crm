import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-no-enabled-modules",
  standalone: true,
  imports: [],
  template: `
    <div class="holder">
      <i class="fas fa-ban text-4xl text-red-500"></i>
      <p class="capitalize m-0 text-3xl font-semibold">no enabled modules for this account!</p>
    </div>
  `,
  styles: `
    .holder {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap:1rem;
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NoEnabledModulesComponent {}
