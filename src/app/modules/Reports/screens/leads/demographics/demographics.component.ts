import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChratPieComponent, DefaultScreenHeaderComponent, constants } from '@shared';

@Component({
  selector: 'app-demographics',
  standalone: true,
  imports: [ChratPieComponent, DefaultScreenHeaderComponent],
  templateUrl: './demographics.component.html',
  styleUrl: './demographics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class DemographicsComponent {
  constants = constants;
}
