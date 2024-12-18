import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-list-preferences',
  standalone: true,
  templateUrl: './list-preferences.component.html',
  styleUrls: ['./list-preferences.component.scss'],
  imports: [DropdownModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListPreferencesComponent {
  name = input<string>();
  options = input<{ label: string, value: string }[]>([]);
  isHidden = input<number>();
  slug = input<string>();
  selectedOption = input<string>();
}