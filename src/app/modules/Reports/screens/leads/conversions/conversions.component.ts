import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-conversions',
  standalone: true,
  imports: [],
  templateUrl: './conversions.component.html',
  styleUrl: './conversions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ConversionsComponent {

}
