import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChratPieComponent, DefaultScreenHeaderComponent, constants } from '@shared';

@Component({
  selector: 'app-classified',
  standalone: true,
  imports: [ChratPieComponent, DefaultScreenHeaderComponent],
  templateUrl: './classified.component.html',
  styleUrl: './classified.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ClassifiedComponent {
  constants = constants;
}
