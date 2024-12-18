import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { JsonParsePipe, SpinnerComponent } from '@shared';
import { DropdownModule } from 'primeng/dropdown';
import { PreferencesService } from '../services/preferences.service';
import { ListPreferencesComponent } from './components/list-preferences/list-preferences.component';

@Component({
  selector: 'app-preferences',
  standalone: true,
  template: `
    @if (preferences().length) {
      <div class="pb-8">
        @for(item of preferences(); let l = $last; track $index) {
        <app-list-preferences [name]="item.name"
                              [options]="item.options | jsonParse"
                              [isHidden]="item.is_hidden"
                              [selectedOption]="item.default"
                              [slug]="item.slug">
        </app-list-preferences>
        }
      </div>
    }@else{
      <app-spinner />
    }
  `,
  imports: [JsonParsePipe, DropdownModule, ListPreferencesComponent, SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreferencesComponent {
  preferences = inject(PreferencesService).preferences;
}