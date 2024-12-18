import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-birthdays',
  standalone: true,
  imports: [],
  templateUrl: './birthdays.component.html',
  styleUrl: './birthdays.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class BirthdaysComponent {

}
