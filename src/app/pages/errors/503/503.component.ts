import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'server-error',
  standalone: true,
  imports: [],
  templateUrl: "./503.component.html",
  styleUrls: ['./503.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export default class Error503Component {

}
