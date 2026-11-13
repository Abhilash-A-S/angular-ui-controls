import { UiIconsService } from './services/ui-icons.service';
import { NgModule, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // For ngModel (template-driven forms)
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; // For matInput directive
import { MatIconModule } from '@angular/material/icon'; // For mat-icon
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker'; // For matDatepicker
import { MatNativeDateModule } from '@angular/material/core'; // For native date support
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MentionModule } from 'angular-mentions';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader();
}
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    HttpClientModule,
    TranslateModule.forChild(),
    MatSelectModule,
    MatTooltipModule,
    MentionModule,
    NgxMatSelectSearchModule,
    MatSlideToggleModule,
    MatListModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    TranslateModule,
    HttpClientModule,
    MatSelectModule,
    MatTooltipModule,
    MentionModule,
    NgxMatSelectSearchModule,
    MatSlideToggleModule,
    MatListModule,
  ],
})
export class MaterialModule {
  private readonly icons = inject(UiIconsService);
}
