import { NgModule } from '@angular/core';
import { TextInputComponent } from './component/text-input/text-input.component';
import { TextAreaComponent } from './component/text-area/text-area.component';
import { RichTextEditorComponent } from './component/rich-text-editor/rich-text-editor.component';
import { CheckboxComponent } from './component/checkbox/checkbox.component';
import { RadioButtonComponent } from './component/radio-button/radio-button.component';
import { DatePickerComponent } from './component/date-picker/date-picker.component';
import { DateTimePickerComponent } from './component/date-time-picker/date-time-picker.component';
import { DateRangePickerComponent } from './component/date-range-picker/date-range-picker.component';
import { AutocompleteComponent } from './component/autocomplete/autocomplete.component';
import { NumberInputComponent } from './component/number-input/number-input.component';
import { SearchableSelectComponent } from './component/searchable-select/searchable-select.component';
import { TimePickerComponent } from './component/time-picker/time-picker.component';
import { PasswordInputComponent } from './component/password-input/password-input.component';
import { SearchInputComponent } from './component/search-input/search-input.component';
import { UiUtilitiesModule } from './utilities';
import { TimeInputComponent } from './component/time-input/time-input.component';
import { AdvancedSelectComponent } from './component/advanced-select/advanced-select.component';
import { SlideToggleComponent } from './component/slide-toggle/slide-toggle.component';
import { SegmentedControlComponent } from './component/segmented-control/segmented-control.component';
import { ActionMenuComponent } from './component/action-menu/action-menu.component';
import { FileUploadComponent } from './component/file-upload/file-upload.component';
import { PdfViewerComponent } from './component/pdf-viewer/pdf-viewer.component';
import { SearchFilterComponent } from './component/search-filter/search-filter.component';
import { SelectionListComponent } from './component/selection-list/selection-list.component';

@NgModule({
  imports: [
    TextInputComponent,
    TextAreaComponent,
    CheckboxComponent,
    RichTextEditorComponent,
    RadioButtonComponent,
    DatePickerComponent,
    DateTimePickerComponent,
    DateRangePickerComponent,
    AutocompleteComponent,
    NumberInputComponent,
    SearchableSelectComponent,
    TimePickerComponent,
    PasswordInputComponent,
    SearchInputComponent,
    TimeInputComponent,
    UiUtilitiesModule,
    AdvancedSelectComponent,
    SlideToggleComponent,
    SegmentedControlComponent,
    ActionMenuComponent,
    FileUploadComponent,
    PdfViewerComponent,
    SearchFilterComponent,
    SelectionListComponent,
  ],
  exports: [
    TextInputComponent,
    CheckboxComponent,
    TextAreaComponent,
    RichTextEditorComponent,
    RadioButtonComponent,
    DatePickerComponent,
    DateTimePickerComponent,
    DateRangePickerComponent,
    AutocompleteComponent,
    NumberInputComponent,
    SearchableSelectComponent,
    TimePickerComponent,
    SearchInputComponent,
    PasswordInputComponent,
    TimeInputComponent,
    AdvancedSelectComponent,
    SlideToggleComponent,
    SegmentedControlComponent,
    ActionMenuComponent,
    FileUploadComponent,
    PdfViewerComponent,
    SearchFilterComponent,
    SelectionListComponent,
  ],
})
export class UiInputsModule {}
