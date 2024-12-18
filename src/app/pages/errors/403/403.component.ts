import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'forbidden-access',
  templateUrl: "./403.component.html",
  styleUrls: ['./403.component.scss'],
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Error403Component { }
