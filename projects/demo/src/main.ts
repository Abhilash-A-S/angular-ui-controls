import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideHttpClient } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { provideTranslateService } from "@ngx-translate/core";
import {
  TextInputComponent,
  NumberInputComponent,
  CheckboxComponent,
  SearchableSelectComponent,
  DatePickerComponent,
  TextAreaComponent,
} from "@abhilash-as/angular-ui-controls";
@Component({
  selector: "demo-root",
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
  template: ` <header>
      <span>ANGULAR UI CONTROLS</span
      ><a href="https://github.com/Abhilash-A-S/angular-ui-controls"
        >GitHub ↗</a
      >
    </header>
    <main>
      <p class="eyebrow">COMPONENT PLAYGROUND · ANGULAR 20</p>
      <h1>Consistent controls.<br />Built for your forms.</h1>
      <p class="intro">
        Explore the first controls in the independent library. These examples
        use real Angular Forms bindings.
      </p>
      <section>
        <article>
          <h2>Text input</h2>
          <ui-text-input inputId="name" label="Your name" [(ngModel)]="name" />
          <p>Value: {{ name || "Empty" }}</p>
        </article>
        <article>
          <h2>Number input</h2>
          <ui-number-input
            inputId="quantity"
            label="Quantity"
            [(ngModel)]="quantity"
            [minValue]="0"
            [maxValue]="100"
            [allowDecimal]="false"
          />
          <p>Range: 0–100; bounds apply on blur.</p>
        </article>
        <article>
          <h2>Searchable select</h2>
          <ui-searchable-select
            inputId="department"
            label="Department"
            [(ngModel)]="department"
            [options]="departments"
            labelKey="name"
            valueKey="id"
            [hideAllOption]="true"
          />
          <p>Value: {{ department || "None" }}</p>
        </article>
        <article>
          <h2>Date picker</h2>
          <ui-date-picker
            inputId="date"
            label="Choose a date"
            [(ngModel)]="date"
          />
        </article>
        <article>
          <h2>Checkbox</h2>
          <ui-checkbox
            inputId="updates"
            label="Receive updates"
            [(ngModel)]="updates"
          />
          <p>Checked: {{ updates }}</p>
        </article>
        <article>
          <h2>Highlighted textarea</h2>
          <ui-text-area
            inputId="notes"
            label="Notes"
            [(ngModel)]="notes"
            [useAbbreviationHighlight]="true"
            [abbreviationList]="abbreviations"
            [restrictedWords]="restricted"
            [maxLength]="300"
          />
          <p>
            Try “API” or “restricted”. Highlighting is local and uses safe text
            rendering.
          </p>
        </article>
      </section>
      <footer>
        Development preview · Package publication is not configured
        automatically.
      </footer>
    </main>`,
})
class DemoComponent {
  name = "";
  quantity = 1;
  department = null;
  date = null;
  updates = false;
  notes = "API integration";
  departments = [
    { id: 1, name: "Engineering" },
    { id: 2, name: "Design" },
    { id: 3, name: "Support" },
  ];
  abbreviations = [
    { abbreviation: "API", remarks: "Application Programming Interface" },
  ];
  restricted = [{ word: "restricted" }];
}
bootstrapApplication(DemoComponent, {
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(),
    provideTranslateService({ lang: "en", fallbackLang: "en" }),
  ],
}).catch(console.error);
