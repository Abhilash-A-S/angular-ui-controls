> This guide covers the preceding naming cleanup. External utilities mentioned below have now been replaced locally; see DEPENDENCY_REPLACEMENTS.md.

# Naming migration guide

This is a breaking naming update. Update consumer templates, imports, direct instance references and any public-api.ts barrel in your workspace. Old selector/input/output aliases are not added. Every original decorated input and output has a one-to-one mapping; none was removed or merged. Event payload keys and runtime logic are preserved.

## Component selectors

| Before | After |
|---|---|
| `st-auto-complete` | `ui-autocomplete` |
| `st-checkbox` | `ui-checkbox` |
| `st-custom-select-search` | `ui-advanced-select` |
| `custom-time-picker` | `ui-time-input` |
| `st-date-picker` | `ui-date-picker` |
| `st-date-range-picker` | `ui-date-range-picker` |
| `st-date-time-picker` | `ui-date-time-picker` |
| `st-input-number` | `ui-number-input` |
| `st-input-box-password` | `ui-password-input` |
| `st-input-text` | `ui-text-input` |
| `st-input-file` | `ui-file-upload` |
| `st-more-details-menu` | `ui-action-menu` |
| `st-pdf-viwer` | `ui-pdf-viewer` |
| `st-radio-button` | `ui-radio-button` |
| `st-search-filter` | `ui-search-filter` |
| `st-search-input` | `ui-search-input` |
| `st-select-search` | `ui-searchable-select` |
| `st-selection-list` | `ui-selection-list` |
| `st-slide-toggle` | `ui-slide-toggle` |
| `st-tab-button-toggle` | `ui-segmented-control` |
| `st-text-area` | `ui-text-area` |
| `st-text-editor` | `ui-rich-text-editor` |
| `st-time-picker` | `ui-time-picker` |

## Local directives

| Before | After |
|---|---|
| `libUiInputPreventCopyPasteCut` | `uiPreventClipboard` |
| `yarAutopopulateCurrentDate` | `uiAutoPopulateCurrentDate` |

The date shortcut remains Shift+R. Its input alias is now `[uiAutoPopulateCurrentDate]`; direct class access uses `enabled`. The clipboard directive retains its separate `[preventCopyPasteCut]` flag. External directives from `the former external utility module` keep their original names.

## Exported classes and types

| Before | After |
|---|---|
| `InputComponent` | `TextInputComponent` |
| `InputBoxNumberComponent` | `NumberInputComponent` |
| `InputBoxPasswordComponent` | `PasswordInputComponent` |
| `InputFileComponent` | `FileUploadComponent` |
| `AutoCompleteComponent` | `AutocompleteComponent` |
| `CustomSelectSearchComponent` | `AdvancedSelectComponent` |
| `SelectSearchComponent` | `SearchableSelectComponent` |
| `CustomTimePickerComponent` | `TimeInputComponent` |
| `MoreDetailsMenuComponent` | `ActionMenuComponent` |
| `TabButtonToggleComponent` | `SegmentedControlComponent` |
| `TextEditorComponent` | `RichTextEditorComponent` |
| `TextEditorService` | `RichTextEditorService` |
| `TextEditorImageUpload` | `RichTextEditorImageUpload` |
| `PdfViwerComponent` | `PdfViewerComponent` |
| `UIInputsModule` | `UiInputsModule` |
| `PreventCopyPasteCut` | `PreventClipboardDirective` |
| `AutopopulateCurrentDateDirective` | `AutoPopulateCurrentDateDirective` |
| `IAutoCompleteModel` | `AutocompleteModel` |
| `SelectSearchFieldInfo` | `SearchableSelectFieldInfo` |
| `SelectSearchSelectionChangeEvent` | `SearchableSelectSelectionChangeEvent` |
| `SelectSearchToggleAllEvent` | `SearchableSelectToggleAllEvent` |
| `SelectSearchOpenCloseEvent` | `SearchableSelectOpenCloseEvent` |
| `SelectSearchOptionClickEvent` | `SearchableSelectOptionClickEvent` |
| `SelectSearchOptionItem` | `SearchableSelectOptionItem` |
| `SelectSearchOption` | `SearchableSelectOption` |
| `InputBoxNumberFieldInfo` | `NumberInputFieldInfo` |
| `InputBoxNumberModelChangeEvent` | `NumberInputModelChangeEvent` |
| `InputBoxNumberInputEvent` | `NumberInputInputEvent` |
| `InputBoxNumberFocusEvent` | `NumberInputFocusEvent` |
| `InputBoxNumberBlurEvent` | `NumberInputBlurEvent` |
| `InputBoxNumberKeydownEvent` | `NumberInputKeydownEvent` |
| `InputBoxNumberKeyupEvent` | `NumberInputKeyupEvent` |
| `InputBoxNumberKeyEnterEvent` | `NumberInputKeyEnterEvent` |
| `InputBoxPasswordFieldInfo` | `PasswordInputFieldInfo` |
| `InputBoxPasswordModelChangeEvent` | `PasswordInputModelChangeEvent` |
| `InputBoxPasswordInputEvent` | `PasswordInputInputEvent` |
| `InputBoxPasswordFocusEvent` | `PasswordInputFocusEvent` |
| `InputBoxPasswordBlurEvent` | `PasswordInputBlurEvent` |
| `InputBoxPasswordKeydownEvent` | `PasswordInputKeydownEvent` |
| `InputBoxPasswordKeyupEvent` | `PasswordInputKeyupEvent` |
| `InputBoxPasswordKeyEnterEvent` | `PasswordInputKeyEnterEvent` |
| `InputBoxTextFieldInfo` | `TextInputFieldInfo` |
| `InputBoxTextModelChangeEvent` | `TextInputModelChangeEvent` |
| `InputBoxTextInputEvent` | `TextInputInputEvent` |
| `InputBoxTextFocusEvent` | `TextInputFocusEvent` |
| `InputBoxTextBlurEvent` | `TextInputBlurEvent` |
| `InputBoxTextKeydownEvent` | `TextInputKeydownEvent` |
| `InputBoxTextKeyupEvent` | `TextInputKeyupEvent` |
| `InputBoxTextKeyEnterEvent` | `TextInputKeyEnterEvent` |
| `InputBoxTextClickEvent` | `TextInputClickEvent` |
| `SearchInputsInfo` | `SearchInputInfo` |
| `SearchInputsModelChangeEvent` | `SearchInputModelChangeEvent` |
| `SearchInputsInputEvent` | `SearchInputInputEvent` |
| `SearchInputsFocusEvent` | `SearchInputFocusEvent` |
| `SearchInputsBlurEvent` | `SearchInputBlurEvent` |
| `SearchInputsKeydownEvent` | `SearchInputKeydownEvent` |
| `SearchInputsKeyupEvent` | `SearchInputKeyupEvent` |
| `SearchInputsKeyEnterEvent` | `SearchInputKeyEnterEvent` |
| `SearchInputsClickEvent` | `SearchInputClickEvent` |

## Inputs and outputs by component

Unchanged bindings are listed in API_REFERENCE.md. `fieldName` is the renamed input; emitted objects retain their original `fieldName` or `textFieldName` keys. `modelChange` and `valueChanged` remain separate events with their original payloads. Do not assume either emits a raw value or forms a two-way binding pair.

### AutocompleteComponent

| Kind | Before | After |
|---|---|---|
| Input | `autoCompleteList` | `options` |
| Input | `displayKey` | `labelKey` |
| Input | `bindValueKey` | `valueKey` |
| Input | `autoCompleteModel` | `autocompleteModel` |
| Input | `textFieldName` | `fieldName` |
| Output | `inputChangeValue` | `valueChanged` |
| Output | `onModelChange` | `modelChange` |
| Output | `onInputChange` | `inputChanged` |
| Output | `onFocusChange` | `focusGained` |
| Output | `onBlurChange` | `focusLost` |
| Output | `onKeydownHandle` | `keyPressed` |
| Output | `onKeyupHandle` | `keyReleased` |
| Output | `onKeyEnterHandle` | `enterPressed` |

### CheckboxComponent

| Kind | Before | After |
|---|---|---|
| Input | `textFieldName` | `fieldName` |
| Output | `onClick` | `clicked` |
| Output | `onModelChange` | `modelChange` |
| Output | `onInputChange` | `inputChanged` |

### AdvancedSelectComponent

| Kind | Before | After |
|---|---|---|
| Input | `textFieldName` | `fieldName` |
| Input | `showSearchCheckBox` | `showSearchCheckbox` |
| Input | `showMultiSelect` | `multiple` |
| Input | `selectList` | `options` |
| Input | `displayKey` | `labelKey` |
| Input | `idKey` | `valueKey` |
| Input | `isSearchStartsWith` | `searchStartsWith` |
| Output | `toggleSelectHandle` | `selectAllChange` |
| Output | `onselectionChange` | `selectionChange` |
| Output | `onOpenedChange` | `panelOpenChange` |
| Output | `onOpened` | `panelOpened` |
| Output | `onClosed` | `panelClosed` |
| Output | `onBlur` | `blurred` |
| Output | `onOptionClick` | `optionClicked` |
| Output | `onSearchTextModelChange` | `searchTextChange` |

### TimeInputComponent

| Kind | Before | After |
|---|---|---|
| Input | `inputIdHr` | `hoursInputId` |
| Input | `inputIdMin` | `minutesInputId` |
| Input | `textFieldName` | `fieldName` |
| Output | `onModelChange` | `modelChange` |
| Output | `onInputChange` | `inputChanged` |
| Output | `onFocusChange` | `focusGained` |
| Output | `onBlurChange` | `focusLost` |
| Output | `onKeydownHandle` | `keyPressed` |
| Output | `onKeyupHandle` | `keyReleased` |
| Output | `onKeyEnterHandle` | `enterPressed` |

### DatePickerComponent

| Kind | Before | After |
|---|---|---|
| Input | `textFieldName` | `fieldName` |
| Output | `onModelChange` | `modelChange` |
| Output | `onChange` | `changeCommitted` |
| Output | `onInputChange` | `inputChanged` |
| Output | `onFocusChange` | `focusGained` |
| Output | `onBlurChange` | `focusLost` |
| Output | `onKeydownHandle` | `keyPressed` |
| Output | `onKeyupHandle` | `keyReleased` |
| Output | `onKeyEnterHandle` | `enterPressed` |
| Output | `onDateChange` | `dateChange` |

### DateRangePickerComponent

| Kind | Before | After |
|---|---|---|
| Input | `inputIdFrom` | `startInputId` |
| Input | `inputIdTo` | `endInputId` |
| Input | `textFieldName` | `fieldName` |
| Output | `onModelChange` | `modelChange` |
| Output | `onChange` | `changeCommitted` |
| Output | `onInputChange` | `inputChanged` |
| Output | `onFocusChange` | `focusGained` |
| Output | `onBlurChange` | `focusLost` |
| Output | `onKeydownHandle` | `keyPressed` |
| Output | `onKeyupHandle` | `keyReleased` |
| Output | `onKeyEnterHandle` | `enterPressed` |
| Output | `onDateChange` | `dateChange` |

### DateTimePickerComponent

| Kind | Before | After |
|---|---|---|
| Input | `textFieldName` | `fieldName` |
| Output | `onDateChange` | `dateChange` |
| Output | `onModelChange` | `modelChange` |
| Output | `onChange` | `changeCommitted` |
| Output | `onInputChange` | `inputChanged` |
| Output | `onFocusChange` | `focusGained` |
| Output | `onBlurChange` | `focusLost` |
| Output | `onKeydownHandle` | `keyPressed` |
| Output | `onKeyupHandle` | `keyReleased` |
| Output | `onKeyEnterHandle` | `enterPressed` |

### NumberInputComponent

| Kind | Before | After |
|---|---|---|
| Input | `textFieldName` | `fieldName` |
| Input | `postfix` | `suffix` |
| Input | `showPostfix` | `showSuffix` |
| Output | `onModelChange` | `modelChange` |
| Output | `onInputChange` | `inputChanged` |
| Output | `onFocusChange` | `focusGained` |
| Output | `onBlurChange` | `focusLost` |
| Output | `onKeydownHandle` | `keyPressed` |
| Output | `onKeyupHandle` | `keyReleased` |
| Output | `onKeyEnterHandle` | `enterPressed` |

### PasswordInputComponent

| Kind | Before | After |
|---|---|---|
| Input | `textFieldName` | `fieldName` |
| Input | `appToArabic` | `enableArabicInput` |
| Output | `onModelChange` | `modelChange` |
| Output | `onInputChange` | `inputChanged` |
| Output | `onFocusChange` | `focusGained` |
| Output | `onBlurChange` | `focusLost` |
| Output | `onKeydownHandle` | `keyPressed` |
| Output | `onKeyupHandle` | `keyReleased` |
| Output | `onKeyEnterHandle` | `enterPressed` |

### TextInputComponent

| Kind | Before | After |
|---|---|---|
| Input | `textFieldName` | `fieldName` |
| Input | `showToolTip` | `showTooltip` |
| Input | `chatGptAttr` | `assistantFieldId` |
| Input | `appToArabic` | `enableArabicInput` |
| Input | `postfix` | `suffix` |
| Input | `showPostfix` | `showSuffix` |
| Output | `onModelChange` | `modelChange` |
| Output | `onInputChange` | `inputChanged` |
| Output | `onFocusChange` | `focusGained` |
| Output | `onBlurChange` | `focusLost` |
| Output | `onKeydownHandle` | `keyPressed` |
| Output | `onKeyupHandle` | `keyReleased` |
| Output | `onKeyEnterHandle` | `enterPressed` |
| Output | `onInputClickHandle` | `inputClicked` |

### FileUploadComponent

| Kind | Before | After |
|---|---|---|
| Input | `textFieldName` | `fieldName` |
| Input | `showFileDragDrop` | `showDropZone` |
| Output | `onFileSelect` | `fileSelected` |
| Output | `onClear` | `cleared` |
| Output | `onValidationError` | `validationError` |

### ActionMenuComponent

| Kind | Before | After |
|---|---|---|
| Output | `menuItemClick` | `menuItemSelected` |
| Input | `customPanelClass` | `panelClass` |

### RadioButtonComponent

| Kind | Before | After |
|---|---|---|
| Input | `displayLabelKey` | `labelKey` |
| Input | `radioButtonsList` | `options` |
| Input | `textFieldName` | `fieldName` |
| Input | `idKey` | `valueKey` |
| Output | `onModelChange` | `modelChange` |
| Output | `onInputChange` | `inputChanged` |

### SearchFilterComponent

| Kind | Before | After |
|---|---|---|
| Input | `textFieldName` | `fieldName` |
| Input | `searchBtnToolTip` | `searchButtonTooltip` |
| Input | `selectList` | `options` |
| Input | `displayKey` | `labelKey` |
| Input | `idKey` | `valueKey` |
| Input | `showMultiSelect` | `multiple` |
| Output | `onModelChange` | `modelChange` |
| Output | `onInputChange` | `inputChanged` |
| Output | `onFocusChange` | `focusGained` |
| Output | `onBlurChange` | `focusLost` |
| Output | `onKeydownHandle` | `keyPressed` |
| Output | `onKeyupHandle` | `keyReleased` |
| Output | `onKeyEnterHandle` | `enterPressed` |
| Output | `onInputClickHandle` | `inputClicked` |
| Output | `onSearchClickHandle` | `searchClicked` |
| Output | `onselectionChange` | `selectionChange` |
| Output | `onOpenedChange` | `panelOpenChange` |
| Output | `onOpened` | `panelOpened` |
| Output | `onClosed` | `panelClosed` |
| Output | `onBlur` | `blurred` |
| Output | `onOptionClick` | `optionClicked` |
| Output | `onOptionSelectionChange` | `optionSelectionChanged` |

### SearchInputComponent

| Kind | Before | After |
|---|---|---|
| Input | `disableSearch` | `searchDisabled` |
| Input | `disableIcon` | `searchButtonDisabled` |
| Input | `textFieldName` | `fieldName` |
| Input | `searchBtnToolTip` | `searchButtonTooltip` |
| Output | `onModelChange` | `modelChange` |
| Output | `onInputChange` | `inputChanged` |
| Output | `onFocusChange` | `focusGained` |
| Output | `onBlurChange` | `focusLost` |
| Output | `onKeydownHandle` | `keyPressed` |
| Output | `onKeyupHandle` | `keyReleased` |
| Output | `onKeyEnterHandle` | `enterPressed` |
| Output | `onInputClickHandle` | `inputClicked` |
| Output | `onSearchClickHandle` | `searchClicked` |

### SearchableSelectComponent

| Kind | Before | After |
|---|---|---|
| Input | `textFieldName` | `fieldName` |
| Input | `showSearchCheckBox` | `showSearchCheckbox` |
| Input | `showMultiSelect` | `multiple` |
| Input | `selectList` | `options` |
| Input | `displayKey` | `labelKey` |
| Input | `idKey` | `valueKey` |
| Input | `isSearchStartsWith` | `searchStartsWith` |
| Output | `toggleSelectHandle` | `selectAllChange` |
| Output | `onselectionChange` | `selectionChange` |
| Output | `onOpenedChange` | `panelOpenChange` |
| Output | `onOpened` | `panelOpened` |
| Output | `onClosed` | `panelClosed` |
| Output | `onBlur` | `blurred` |
| Output | `onOptionClick` | `optionClicked` |
| Output | `onSearchTextModelChange` | `searchTextChange` |

### SelectionListComponent

| Kind | Before | After |
|---|---|---|
| Input | `selectList` | `options` |
| Input | `displayKey` | `labelKey` |
| Input | `idKey` | `valueKey` |
| Input | `textFieldName` | `fieldName` |
| Output | `onSelectionChange` | `selectionChange` |
| Output | `onModelChange` | `modelChange` |

### SlideToggleComponent

| Kind | Before | After |
|---|---|---|
| Input | `textFieldName` | `fieldName` |
| Output | `onChangeEventHandler` | `stateChange` |
| Output | `onClickHandler` | `clicked` |

### TextAreaComponent

| Kind | Before | After |
|---|---|---|
| Input | `minRow` | `minRows` |
| Input | `maxRow` | `maxRows` |
| Input | `numCols` | `columns` |
| Input | `limit` | `maxLength` |
| Input | `displayCharactersStats` | `showCharacterCount` |
| Input | `showRemainingWordsStatus` | `showRemainingCharacters` |
| Input | `textFieldName` | `fieldName` |
| Input | `appToArabic` | `enableArabicInput` |
| Input | `yarMentionConfig` | `abbreviationMentionConfig` |
| Input | `fieldTrim` | `trimOnBlur` |
| Input | `chatGptAttr` | `assistantFieldId` |
| Output | `inputChangeValue` | `valueChanged` |
| Output | `expandButtonClickcallback` | `expandRequested` |
| Output | `onInputChange` | `inputChanged` |

### RichTextEditorComponent

| Kind | Before | After |
|---|---|---|
| Input | `removeToolList` | `hiddenToolbarItems` |
| Input | `textFieldName` | `fieldName` |
| Output | `onBlur` | `blurred` |

### TimePickerComponent

| Kind | Before | After |
|---|---|---|
| Input | `textFieldName` | `fieldName` |
| Output | `onModelChange` | `modelChange` |
| Output | `onChange` | `changeCommitted` |
| Output | `onInputChange` | `inputChanged` |
| Output | `onFocusChange` | `focusGained` |
| Output | `onBlurChange` | `focusLost` |
| Output | `onKeydownHandle` | `keyPressed` |
| Output | `onKeyupHandle` | `keyReleased` |
| Output | `onKeyEnterHandle` | `enterPressed` |

### AutoPopulateCurrentDateDirective

| Kind | Before | After |
|---|---|---|
| Input | `yarAutopopulateCurrentDate` | `uiAutoPopulateCurrentDate` |

## Example

```html
<!-- Before -->
<st-input-text inputId="first-name" textFieldName="firstName"
  [(ngModel)]="firstName" [showToolTip]="true"
  (onKeyEnterHandle)="submit()"></st-input-text>

<!-- After -->
<ui-text-input inputId="first-name" fieldName="firstName"
  [(ngModel)]="firstName" [showTooltip]="true"
  (enterPressed)="submit()"></ui-text-input>
```

```ts
import { TextInputComponent } from './lib/component/text-input/text-input.component';
```

Keep ngModel/formControl/formControlName usage as before. The complete machine-readable map, including retained names and handler renames, is in api-migration.json.
