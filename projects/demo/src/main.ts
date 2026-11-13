import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { provideTranslateService } from '@ngx-translate/core';
import {
  TextInputComponent,
  NumberInputComponent,
  CheckboxComponent,
  SearchableSelectComponent,
  DatePickerComponent,
  TextAreaComponent,
} from '@abhilash-as/angular-ui-controls';
@Component({
  selector: 'demo-root',
  standalone: true,
  imports: [
    FormsModule,
    TextInputComponent,
    NumberInputComponent,
    CheckboxComponent,
    SearchableSelectComponent,
    DatePickerComponent,
    TextAreaComponent,
  ],
  templateUrl: './app.component.html',
})
class DemoComponent {
  name = '';
  quantity = 1;
  department = null;
  date = null;
  updates = false;
  notes = 'API integration';
  departments = [
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'Design' },
    { id: 3, name: 'Support' },
  ];
  abbreviations = [{ abbreviation: 'API', remarks: 'Application Programming Interface' }];
  restricted = [{ word: 'restricted' }];
}
bootstrapApplication(DemoComponent, {
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(),
    provideTranslateService({ lang: 'en', fallbackLang: 'en' }),
  ],
}).catch(console.error);
