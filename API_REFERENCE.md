# Public input and output reference

All 338 @Input and 136 @Output declarations are retained. Inherited base-class inputs are listed under BaseControlValueAccessor. Defaults and accepted TypeScript types are documented next to each declaration in source. Reserved outputs are explicitly marked when the supplied implementation has no emission site.

## AutocompleteComponent

Source: [view](projects/ui-controls/src/lib/component/autocomplete/autocomplete.component.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `inputId` | Identifier assigned to the inner control; combined with idPrefix when supplied. |
| Input | `readonly` | Requests the existing read-only behavior without disabling the parent form control. |
| Input | `required` | Marks this control as required in its existing template; parent-form validators remain separately configured. |
| Input | `options` | Options rendered by the control; use the label/value key inputs for object options. |
| Input | `label` | Label text or translation key displayed for this control. |
| Input | `wordsLimit` | Legacy character-limit input bound to maxlength (not a word counter). Retained separately from maxLength; existing precedence is unchanged. |
| Input | `labelKey` | Property name read from an option object to obtain its visible label. |
| Input | `valueKey` | Property name used to identify or extract an option value. |
| Input | `optionNgClass` | Optional resolver returning an ngClass value for each option (conditional coloring/styling). Receives the raw option and may return a string, string[] or { className: boolean } map. |
| Input | `panelClass` | Additional CSS class or classes applied to the existing overlay panel. |
| Input | `errorMessage` | to show error message |
| Input | `virtualScroll` | Renders the options inside a cdk virtual scroll viewport (use for large lists) |
| Input | `singleLineOption` | Keeps each option on a single line with ellipsis; full text is shown in a tooltip on hover when truncated |
| Input | `virtualScrollItemSize` | Height (px) of a single option row; must match the rendered mat-option height when virtualScroll is on |
| Input | `virtualScrollMaxHeight` | Maximum height (px) of the virtual scroll viewport (mat-autocomplete panel max-height is 256px) |
| Input | `autocompleteModel` | Autocomplete value and field metadata object; its value is synchronized with the shared control value. |
| Input | `error` | Flag to indicate validation error state (used with reactive forms) |
| Input | `fieldName` | Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved. |
| Input | `placeholder` | Hint text or translation key displayed while the control is empty. |
| Output | `valueChanged` | Emits the existing value-change payload; remains separate from modelChange. |
| Output | `modelChange` | Emits when the component model-change handler runs. |
| Output | `inputChanged` | Emits from the existing input/change handler. |
| Output | `focusGained` | Emits when the inner field gains focus. |
| Output | `focusLost` | Emits when the inner field loses focus. |
| Output | `keyPressed` | Emits on the inner field keydown event. |
| Output | `keyReleased` | Emits on the inner field keyup event. |
| Output | `enterPressed` | Emits when Enter is released in the inner field. |

## BaseControlValueAccessor

Source: [view](projects/ui-controls/src/lib/component/base-control-value-accessor.directive.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `disabled` | Disables the control. Angular Forms can also update this state through setDisabledState. |
| Input | `idPrefix` | Optional namespace prepended to inner control IDs to distinguish repeated instances. |
| Input | `value` | Shared control value. Assigning this input follows the existing change/touch callback behavior; Angular Forms writes use writeValue. |
| Input | `checked` | Alternate binding to the shared value, retained on the base class for compatibility. |

## CheckboxComponent

Source: [view](projects/ui-controls/src/lib/component/checkbox/checkbox.component.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `inputId` | Identifier assigned to the inner control; combined with idPrefix when supplied. |
| Input | `tooltip` | Tooltip text displayed on hover |
| Input | `label` | Label text or translation key displayed for this control. |
| Input | `errorMessage` | Error message displayed for validation |
| Input | `required` | Marks this control as required in its existing template; parent-form validators remain separately configured. |
| Input | `fieldName` | Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved. |
| Input | `indeterminate` | The indeterminate state is typically used in a "select all" scenario, where it indicates that some but not all child items are selected. |
| Output | `clicked` | Emits when the existing click handler runs. |
| Output | `modelChange` | Emits when the component model-change handler runs. |
| Output | `inputChanged` | Emits from the existing input/change handler. |
| Input | `inputModelValue` | Internal model bound to checkbox |
| Input | `modelValue` | Direct binding to the component model, backed by its existing value accessor. |

## AdvancedSelectComponent

Source: [view](projects/ui-controls/src/lib/component/advanced-select/advanced-select.component.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `itemSize` | Height in pixels of each option for virtual scrolling (defaults to 36px) |
| Input | `preventCopyPasteCut` | Clipboard restriction flag retained with its current wiring. The local uiPreventClipboard directive blocks copy, cut, and paste when true. |
| Input | `inputId` | Identifier assigned to the inner control; combined with idPrefix when supplied. |
| Input | `label` | Label text or translation key displayed for this control. |
| Input | `showSearch` | Enable the search in the option |
| Input | `errorMessage` | Error message shown when validation fails |
| Input | `required` | Marks this control as required in its existing template; parent-form validators remain separately configured. |
| Input | `fieldName` | Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved. |
| Input | `selectPlaceholder` | Placeholder text for the select field |
| Input | `searchPlaceholder` | Placeholder text for search input |
| Input | `readonly` | Requests the existing read-only behavior without disabling the parent form control. |
| Input | `isMultiSelect` | Enables multi-select behavior |
| Input | `showToggleAllCheckbox` | Displays "Select All" checkbox |
| Input | `noEntriesFoundLabel` | Label shown when no entries are found |
| Input | `toggleAllCheckboxTooltipMessage` | Tooltip message for select-all checkbox |
| Input | `showSearchCheckbox` | Shows checkbox in search area |
| Input | `multiple` | Enables the existing multiple-selection mode. |
| Input | `options` | Options rendered by the control; use the label/value key inputs for object options. |
| Input | `labelKey` | Property name read from an option object to obtain its visible label. |
| Input | `valueKey` | Property name used to identify or extract an option value. |
| Input | `hiddenKey` | Key in option object used to determine if the option should be hidden from dropdown. Defaults to 'isHidden'. |
| Input | `isGroupingEnabled` | Enables grouped select display |
| Input | `groupLabelKey` | Property key for group label (defaults to '') |
| Input | `groupChildrenKey` | Property key for group child options array (defaults to '') |
| Input | `enableAllOption` | Key used to map model value to option |
| Input | `enableSorting` | Key used to enable / disable sorting |
| Input | `sortAscending` | Defines whether the list should be sorted in ascending order. |
| Input | `sortKey` | Key used to sort the array |
| Input | `isMultiOptions` | Enables multiple options display |
| Input | `showClearIcon` | To clear the selected dropdown list |
| Input | `displayFields` | Conatins the multiple options |
| Input | `layoutMode` | Option text layout: inline joins the display fields; split separates primary and secondary fields. |
| Input | `serverSideSearch` | Enables server-side/external search by bypassing local pipe filtering |
| Input | `singleLineOption` | Keeps each option on a single line with ellipsis; full text is shown in a tooltip on hover when truncated |
| Input | `modelValue` | Direct binding to the component model, backed by its existing value accessor. |
| Input | `searchStartsWith` | Configuration for search starts with. |
| Output | `selectAllChange` | Emits when the select-all action runs. |
| Output | `selectionChange` | Emits when the selection handler processes a selection. |
| Output | `panelOpenChange` | Emits when the select panel open state changes. |
| Output | `panelOpened` | Emits when the select panel opens. |
| Output | `panelClosed` | Emits when the select panel closes. |
| Output | `blurred` | Emits when the control loses focus. |
| Output | `optionClicked` | Emits when an option is clicked. |
| Output | `searchTextChange` | Emits the updated search string for consumer filtering. |

## TimeInputComponent

Source: [view](projects/ui-controls/src/lib/component/time-input/time-input.component.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `preventCopyPasteCut` | Clipboard restriction flag retained with its current wiring. The local uiPreventClipboard directive blocks copy, cut, and paste when true. |
| Input | `hoursInputId` | Identifier for the hours input, combined with idPrefix when supplied. |
| Input | `minutesInputId` | Identifier for the minutes input, combined with idPrefix when supplied. |
| Input | `errorMessage` | Validation error message |
| Input | `required` | Marks this control as required in its existing template; parent-form validators remain separately configured. |
| Input | `fieldName` | Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved. |
| Input | `readonly` | Requests the existing read-only behavior without disabling the parent form control. |
| Input | `modelValue` | Direct binding to the component model, backed by its existing value accessor. |
| Output | `modelChange` | Emits when the component model-change handler runs. |
| Output | `inputChanged` | Emits from the existing input/change handler. |
| Output | `focusGained` | Emits when the inner field gains focus. |
| Output | `focusLost` | Emits when the inner field loses focus. |
| Output | `keyPressed` | Emits on the inner field keydown event. |
| Output | `keyReleased` | Emits on the inner field keyup event. |
| Output | `enterPressed` | Emits when Enter is released in the inner field. |

## DatePickerComponent

Source: [view](projects/ui-controls/src/lib/component/date-picker/date-picker.component.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `inputId` | Identifier assigned to the inner control; combined with idPrefix when supplied. |
| Input | `preventCopyPasteCut` | Clipboard restriction flag retained with its current wiring. The local uiPreventClipboard directive blocks copy, cut, and paste when true. |
| Input | `label` | Label text or translation key displayed for this control. |
| Input | `modelValue` | Direct binding to the component model, backed by its existing value accessor. |
| Input | `errorMessage` | Error message displayed for validation |
| Input | `required` | Marks this control as required in its existing template; parent-form validators remain separately configured. |
| Input | `fieldName` | Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved. |
| Input | `placeholder` | Hint text or translation key displayed while the control is empty. |
| Input | `readonly` | Requests the existing read-only behavior without disabling the parent form control. |
| Input | `autoPopulateDateTime` | Automatically populate current date on load |
| Input | `minDate` | Minimum selectable date |
| Input | `maxDate` | Maximum selectable date |
| Input | `showTodayDate` | Flag to control whether today's date should be displayed in the UI |
| Output | `modelChange` | Emits when the component model-change handler runs. |
| Output | `changeCommitted` | Emits from the existing change handler. |
| Output | `inputChanged` | Emits from the existing input/change handler. |
| Output | `focusGained` | Emits when the inner field gains focus. |
| Output | `focusLost` | Emits when the inner field loses focus. |
| Output | `keyPressed` | Emits on the inner field keydown event. |
| Output | `keyReleased` | Emits on the inner field keyup event. |
| Output | `enterPressed` | Reserved output retained for API compatibility. No emission site exists in the supplied implementation. |
| Output | `dateChange` | Emits when the date-selection handler runs. |

## DateRangePickerComponent

Source: [view](projects/ui-controls/src/lib/component/date-range-picker/date-range-picker.component.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `startInputId` | Identifier for the range start input, combined with idPrefix when supplied. |
| Input | `endInputId` | Identifier for the range end input, combined with idPrefix when supplied. |
| Input | `preventCopyPasteCut` | Clipboard restriction flag retained with its current wiring. The local uiPreventClipboard directive blocks copy, cut, and paste when true. |
| Input | `label` | Label text or translation key displayed for this control. |
| Input | `errorMessage` | Error message displayed for validation |
| Input | `required` | Marks this control as required in its existing template; parent-form validators remain separately configured. |
| Input | `startDisabled` | Disable start date input |
| Input | `endDisabled` | Disable end date input |
| Input | `fieldName` | Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved. |
| Input | `startPlaceholder` | Placeholder for start date input |
| Input | `endPlaceholder` | Placeholder for end date input |
| Input | `endReadonly` | Makes end date input read-only |
| Input | `startReadonly` | Makes start date input read-only |
| Input | `autoPopulateDateTime` | Automatically populate current date |
| Input | `startMinDate` | Minimum allowed start date |
| Input | `startMaxDate` | Maximum allowed start date |
| Input | `endMinDate` | Minimum allowed end date |
| Input | `endMaxDate` | Maximum allowed end date |
| Output | `modelChange` | Emits when the component model-change handler runs. |
| Output | `changeCommitted` | Emits from the existing change handler. |
| Output | `inputChanged` | Emits from the existing input/change handler. |
| Output | `focusGained` | Emits when the inner field gains focus. |
| Output | `focusLost` | Emits when the inner field loses focus. |
| Output | `keyPressed` | Emits on the inner field keydown event. |
| Output | `keyReleased` | Emits on the inner field keyup event. |
| Output | `enterPressed` | Reserved output retained for API compatibility. No emission site exists in the supplied implementation. |
| Output | `dateChange` | Emits when the date-selection handler runs. |

## DateTimePickerComponent

Source: [view](projects/ui-controls/src/lib/component/date-time-picker/date-time-picker.component.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `preventCopyPasteCut` | Clipboard restriction flag retained with its current wiring. The local uiPreventClipboard directive blocks copy, cut, and paste when true. |
| Input | `label` | Label text or translation key displayed for this control. |
| Input | `inputId` | Identifier assigned to the inner control; combined with idPrefix when supplied. |
| Input | `modelValue` | Direct binding to the component model, backed by its existing value accessor. |
| Input | `errorMessage` | Error message displayed for validation |
| Input | `required` | Marks this control as required in its existing template; parent-form validators remain separately configured. |
| Input | `fieldName` | Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved. |
| Input | `placeholder` | Hint text or translation key displayed while the control is empty. |
| Input | `readonly` | Requests the existing read-only behavior without disabling the parent form control. |
| Input | `autoPopulateDateTime` | Automatically populate current date-time |
| Input | `minDate` | Minimum selectable date-time |
| Input | `maxDate` | Maximum selectable date-time |
| Output | `dateChange` | Emits when the date-selection handler runs. |
| Output | `modelChange` | Emits when the component model-change handler runs. |
| Output | `changeCommitted` | Emits from the existing change handler. |
| Output | `inputChanged` | Emits from the existing input/change handler. |
| Output | `focusGained` | Emits when the inner field gains focus. |
| Output | `focusLost` | Emits when the inner field loses focus. |
| Output | `keyPressed` | Emits on the inner field keydown event. |
| Output | `keyReleased` | Emits on the inner field keyup event. |
| Output | `enterPressed` | Reserved output retained for API compatibility. No emission site exists in the supplied implementation. |

## NumberInputComponent

Source: [view](projects/ui-controls/src/lib/component/number-input/number-input.component.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `preventCopyPasteCut` | Clipboard restriction flag retained with its current wiring. The local uiPreventClipboard directive blocks copy, cut, and paste when true. |
| Input | `inputId` | Identifier assigned to the inner control; combined with idPrefix when supplied. |
| Input | `tooltip` | Tooltip text displayed on hover |
| Input | `label` | Label text or translation key displayed for this control. |
| Input | `modelValue` | Direct binding to the component model, backed by its existing value accessor. |
| Input | `errorMessage` | Error message displayed when validation fails |
| Input | `required` | Marks this control as required in its existing template; parent-form validators remain separately configured. |
| Input | `fieldName` | Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved. |
| Input | `placeholder` | Hint text or translation key displayed while the control is empty. |
| Input | `readonly` | Requests the existing read-only behavior without disabling the parent form control. |
| Input | `inputType` | Defines input behavior: number or percentage |
| Input | `textAlign` | Text alignment inside the input: 'left' / 'right' / 'center' (defaults to 'left') |
| Input | `maxDigits` | Maximum allowed digits |
| Input | `minValue` | Minimum allowed numeric value |
| Input | `maxValue` | Maximum allowed numeric value |
| Input | `allowDecimal` | Allows decimal values when true |
| Input | `decimalPlaces` | Maximum number of decimal places allowed |
| Input | `allowNegative` | Allows negative numbers when true |
| Input | `prefix` | Text displayed before the input value (e.g. '$', '+91', 'kg'). |
| Input | `showPrefix` | Controls whether the prefix is rendered. Set to `true` only when the prefix should be visible. |
| Input | `suffix` | Text displayed after the input, such as a unit or percentage sign. |
| Input | `showSuffix` | Controls whether the suffix is rendered. |
| Output | `modelChange` | Emits when the component model-change handler runs. |
| Output | `inputChanged` | Emits from the existing input/change handler. |
| Output | `focusGained` | Emits when the inner field gains focus. |
| Output | `focusLost` | Emits when the inner field loses focus. |
| Output | `keyPressed` | Emits on the inner field keydown event. |
| Output | `keyReleased` | Emits on the inner field keyup event. |
| Output | `enterPressed` | Emits when Enter is released in the inner field. |

## PasswordInputComponent

Source: [view](projects/ui-controls/src/lib/component/password-input/password-input.component.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `preventCopyPasteCut` | Clipboard restriction flag retained with its current wiring. The local uiPreventClipboard directive blocks copy, cut, and paste when true. |
| Input | `inputId` | Identifier assigned to the inner control; combined with idPrefix when supplied. |
| Input | `label` | Label text or translation key displayed for this control. |
| Input | `modelValue` | Direct binding to the component model, backed by its existing value accessor. |
| Input | `errorMessage` | Error message shown when validation fails |
| Input | `required` | Marks this control as required in its existing template; parent-form validators remain separately configured. |
| Input | `fieldName` | Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved. |
| Input | `placeholder` | Hint text or translation key displayed while the control is empty. |
| Input | `readonly` | Requests the existing read-only behavior without disabling the parent form control. |
| Input | `enableArabicInput` | Passes the Arabic typing flag to the existing utility directive. |
| Output | `modelChange` | Emits when the component model-change handler runs. |
| Output | `inputChanged` | Emits from the existing input/change handler. |
| Output | `focusGained` | Emits when the inner field gains focus. |
| Output | `focusLost` | Emits when the inner field loses focus. |
| Output | `keyPressed` | Emits on the inner field keydown event. |
| Output | `keyReleased` | Emits on the inner field keyup event. |
| Output | `enterPressed` | Emits when Enter is released in the inner field. |

## TextInputComponent

Source: [view](projects/ui-controls/src/lib/component/text-input/text-input.component.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `preventCopyPasteCut` | Clipboard restriction flag retained with its current wiring. The local uiPreventClipboard directive blocks copy, cut, and paste when true. |
| Input | `inputId` | Identifier assigned to the inner control; combined with idPrefix when supplied. |
| Input | `tooltip` | Tooltip text displayed on hover |
| Input | `label` | Label text or translation key displayed for this control. |
| Input | `wordsLimit` | Legacy character-limit input bound to maxlength (not a word counter). Retained separately from maxLength; existing precedence is unchanged. |
| Input | `modelValue` | Direct binding to the component model, backed by its existing value accessor. |
| Input | `errorMessage` | Validation error message |
| Input | `required` | Marks this control as required in its existing template; parent-form validators remain separately configured. |
| Input | `fieldName` | Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved. |
| Input | `placeholder` | Hint text or translation key displayed while the control is empty. |
| Input | `readonly` | Requests the existing read-only behavior without disabling the parent form control. |
| Input | `maxLength` | Maximum number of characters allowed |
| Input | `showTooltip` | Shows the current input value in the tooltip when enabled. |
| Input | `assistantFieldId` | Value written to the existing ChatGptAttr DOM attribute for field discovery. |
| Input | `onlyAlphabets` | Prevents numbers and special special character |
| Input | `enableArabicInput` | Passes the Arabic typing flag to the existing utility directive. |
| Input | `prefix` | Text displayed before the input value (e.g. '$', '+91', 'kg'). |
| Input | `showPrefix` | Controls whether the prefix is rendered. Set to `true` only when the prefix should be visible. |
| Input | `suffix` | Text displayed after the input, such as a unit or percentage sign. |
| Input | `showSuffix` | Controls whether the suffix is rendered. |
| Output | `modelChange` | Emits when the component model-change handler runs. |
| Output | `inputChanged` | Emits from the existing input/change handler. |
| Output | `focusGained` | Emits when the inner field gains focus. |
| Output | `focusLost` | Emits when the inner field loses focus. |
| Output | `keyPressed` | Emits on the inner field keydown event. |
| Output | `keyReleased` | Emits on the inner field keyup event. |
| Output | `enterPressed` | Emits when Enter is released in the inner field. |
| Output | `inputClicked` | Emits when the inner input is clicked. |

## FileUploadComponent

Source: [view](projects/ui-controls/src/lib/component/file-upload/file-upload.component.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `inputId` | Identifier assigned to the inner control; combined with idPrefix when supplied. |
| Input | `label` | Label text or translation key displayed for this control. |
| Input | `placeholder` | Hint text or translation key displayed while the control is empty. |
| Input | `errorMessage` | Validation error message for empty/required fields |
| Input | `required` | Marks this control as required in its existing template; parent-form validators remain separately configured. |
| Input | `accept` | File types allowed (e.g. '.csv, .xlsx', 'image/*', '.pdf') |
| Input | `showClearIcon` | Shows the clear button when a file is selected |
| Input | `fieldName` | Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved. |
| Input | `showDropZone` | Uses the existing drag/drop presentation with multiple file selection; false uses the single-file browse presentation. |
| Output | `fileSelected` | Emits after selected files pass the configured extension/MIME checks. |
| Output | `cleared` | Emits after the selected file is cleared. |
| Output | `validationError` | Emits the validation message when a selected file fails the configured format check. |

## ActionMenuComponent

Source: [view](projects/ui-controls/src/lib/component/action-menu/action-menu.component.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `menuTitle` | Optional heading displayed in the action menu. |
| Input | `menuItems` | Menu entries rendered by the action menu; disabled entries are not emitted on click. |
| Input | `rowData` | Consumer context attached to the emitted menu item as rowData. |
| Output | `menuItemSelected` | Emits the enabled menu item with rowData attached. |
| Output | `closed` | Emits when the action menu closes. |
| Input | `panelClass` | Additional CSS class or classes applied to the existing overlay panel. |

## PdfViewerComponent

Source: [view](projects/ui-controls/src/lib/component/pdf-viewer/pdf-viewer.component.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `pdfUrl` | Resource URL embedded in the viewer. The current implementation trusts this URL; callers must supply a trusted source. |

## RadioButtonComponent

Source: [view](projects/ui-controls/src/lib/component/radio-button/radio-button.component.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `inputId` | Identifier assigned to the inner control; combined with idPrefix when supplied. |
| Input | `label` | Label text or translation key displayed for this control. |
| Input | `labelKey` | Property name read from an option object to obtain its visible label. |
| Input | `options` | Options rendered by the control; use the label/value key inputs for object options. |
| Input | `errorMessage` | Error message displayed on validation failure |
| Input | `required` | Marks this control as required in its existing template; parent-form validators remain separately configured. |
| Input | `fieldName` | Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved. |
| Input | `valueKey` | Property name used to identify or extract an option value. |
| Output | `modelChange` | Emits when the component model-change handler runs. |
| Output | `inputChanged` | Emits from the existing input/change handler. |
| Input | `modelValue` | Direct binding to the component model, backed by its existing value accessor. |

## SearchFilterComponent

Source: [view](projects/ui-controls/src/lib/component/search-filter/search-filter.component.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `preventCopyPasteCut` | Clipboard restriction flag retained with its current wiring. The local uiPreventClipboard directive blocks copy, cut, and paste when true. |
| Input | `idPrefix` | Optional namespace prepended to inner control IDs to distinguish repeated instances. |
| Input | `inputId` | Identifier assigned to the inner control; combined with idPrefix when supplied. |
| Input | `tooltip` | Tooltip text displayed on hover |
| Input | `searchTextLabel` | Label displayed above the input field |
| Input | `searchSelectLabel` | Label displayed above the dropdown |
| Input | `wordsLimit` | Legacy character-limit input bound to maxlength (not a word counter). Retained separately from maxLength; existing precedence is unchanged. |
| Input | `disabled` | Disables the control. Angular Forms can also update this state through setDisabledState. |
| Input | `fieldName` | Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved. |
| Input | `placeholder` | Hint text or translation key displayed while the control is empty. |
| Input | `readonly` | Requests the existing read-only behavior without disabling the parent form control. |
| Input | `maxLength` | Maximum number of characters allowed |
| Input | `inputType` | Defines input behavior: number or percentage |
| Input | `errorMessage` | Error message displayed when validation fails |
| Input | `required` | Marks this control as required in its existing template; parent-form validators remain separately configured. |
| Input | `searchButtonTooltip` | Tooltip text or translation key for the search button. |
| Input | `selectPlaceholder` | Placeholder text for select dropdown |
| Input | `options` | Options rendered by the control; use the label/value key inputs for object options. |
| Input | `labelKey` | Property name read from an option object to obtain its visible label. |
| Input | `valueKey` | Property name used to identify or extract an option value. |
| Input | `multiple` | Enables the existing multiple-selection mode. |
| Input | `showClearIcon` | Show clear icon button in select dropdown |
| Output | `modelChange` | Emits when the component model-change handler runs. |
| Output | `inputChanged` | Emits from the existing input/change handler. |
| Output | `focusGained` | Emits when the inner field gains focus. |
| Output | `focusLost` | Emits when the inner field loses focus. |
| Output | `keyPressed` | Emits on the inner field keydown event. |
| Output | `keyReleased` | Emits on the inner field keyup event. |
| Output | `enterPressed` | Emits when Enter is released in the inner field. |
| Output | `inputClicked` | Emits when the inner input is clicked. |
| Output | `searchClicked` | Emits when the search action is activated. |
| Output | `selectionChange` | Emits when the selection handler processes a selection. |
| Output | `panelOpenChange` | Emits when the select panel open state changes. |
| Output | `panelOpened` | Emits when the select panel opens. |
| Output | `panelClosed` | Emits when the select panel closes. |
| Output | `blurred` | Emits when the control loses focus. |
| Output | `optionClicked` | Emits when an option is clicked. |
| Output | `optionSelectionChanged` | Emits when the existing option-selection handler runs. |

## SearchInputComponent

Source: [view](projects/ui-controls/src/lib/component/search-input/search-input.component.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `preventCopyPasteCut` | Clipboard restriction flag retained with its current wiring. The local uiPreventClipboard directive blocks copy, cut, and paste when true. |
| Input | `inputId` | Identifier assigned to the inner control; combined with idPrefix when supplied. |
| Input | `tooltip` | Tooltip text displayed on hover |
| Input | `label` | Label text or translation key displayed for this control. |
| Input | `wordsLimit` | Legacy character-limit input bound to maxlength (not a word counter). Retained separately from maxLength; existing precedence is unchanged. |
| Input | `modelValue` | Direct binding to the component model, backed by its existing value accessor. |
| Input | `searchDisabled` | Disables the search text input independently of the search button. |
| Input | `searchButtonDisabled` | Disables the search action button independently of the text input. |
| Input | `fieldName` | Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved. |
| Input | `placeholder` | Hint text or translation key displayed while the control is empty. |
| Input | `readonly` | Requests the existing read-only behavior without disabling the parent form control. |
| Input | `maxLength` | Maximum number of characters allowed |
| Input | `searchButtonPosition` | Determines where the search button is rendered relative to the input |
| Input | `inputType` | Defines input behavior: number or percentage |
| Input | `errorMessage` | Error message displayed when validation fails |
| Input | `required` | Marks this control as required in its existing template; parent-form validators remain separately configured. |
| Input | `searchButtonTooltip` | Tooltip text or translation key for the search button. |
| Output | `modelChange` | Emits when the component model-change handler runs. |
| Output | `inputChanged` | Emits from the existing input/change handler. |
| Output | `focusGained` | Emits when the inner field gains focus. |
| Output | `focusLost` | Emits when the inner field loses focus. |
| Output | `keyPressed` | Emits on the inner field keydown event. |
| Output | `keyReleased` | Emits on the inner field keyup event. |
| Output | `enterPressed` | Emits when Enter is released in the inner field. |
| Output | `inputClicked` | Emits when the inner input is clicked. |
| Output | `searchClicked` | Emits when the search action is activated. |

## SearchableSelectComponent

Source: [view](projects/ui-controls/src/lib/component/searchable-select/searchable-select.component.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `itemSize` | Height in pixels of each option for virtual scrolling (defaults to 36px) |
| Input | `preventCopyPasteCut` | Clipboard restriction flag retained with its current wiring. The local uiPreventClipboard directive blocks copy, cut, and paste when true. |
| Input | `inputId` | Identifier assigned to the inner control; combined with idPrefix when supplied. |
| Input | `label` | Label text or translation key displayed for this control. |
| Input | `showSearch` | Enable the search in the option |
| Input | `errorMessage` | Error message shown when validation fails |
| Input | `required` | Marks this control as required in its existing template; parent-form validators remain separately configured. |
| Input | `fieldName` | Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved. |
| Input | `selectPlaceholder` | Placeholder text for the select field |
| Input | `searchPlaceholder` | Placeholder text for search input |
| Input | `readonly` | Requests the existing read-only behavior without disabling the parent form control. |
| Input | `isMultiSelect` | Enables multi-select behavior |
| Input | `showToggleAllCheckbox` | Displays "Select All" checkbox |
| Input | `noEntriesFoundLabel` | Label shown when no entries are found |
| Input | `toggleAllCheckboxTooltipMessage` | Tooltip message for select-all checkbox |
| Input | `showSearchCheckbox` | Shows checkbox in search area |
| Input | `multiple` | Enables the existing multiple-selection mode. |
| Input | `options` | Options rendered by the control; use the label/value key inputs for object options. |
| Input | `labelKey` | Property name read from an option object to obtain its visible label. |
| Input | `valueKey` | Property name used to identify or extract an option value. |
| Input | `hiddenKey` | Key in option object used to determine if the option should be hidden from dropdown. Defaults to 'isHidden'. |
| Input | `serverSideSearch` | Enables server-side/external search by bypassing local pipe filtering |
| Input | `modelValue` | Direct binding to the component model, backed by its existing value accessor. |
| Input | `searchStartsWith` | Configuration for search starts with. |
| Input | `showClearIcon` | To clear the selected dropdown list |
| Output | `selectAllChange` | Emits when the select-all action runs. |
| Output | `selectionChange` | Emits when the selection handler processes a selection. |
| Output | `panelOpenChange` | Emits when the select panel open state changes. |
| Output | `panelOpened` | Emits when the select panel opens. |
| Output | `panelClosed` | Emits when the select panel closes. |
| Output | `blurred` | Emits when the control loses focus. |
| Output | `optionClicked` | Emits when an option is clicked. |
| Output | `searchTextChange` | Emits the updated search string for consumer filtering. |
| Input | `enableAllOption` | Key used to map model value to option |
| Input | `hideAllOption` | Removes the "All" option that is otherwise added automatically in multi-select mode |
| Input | `enableSorting` | Key used to enable / disable sorting |
| Input | `singleLineOption` | Keeps each option on a single line with ellipsis; full text is shown in a tooltip on hover when truncated |
| Input | `sortAscending` | Defines whether the list should be sorted in ascending order. |
| Input | `sortKey` | Key used to sort the array |

## SelectionListComponent

Source: [view](projects/ui-controls/src/lib/component/selection-list/selection-list.component.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `inputId` | Identifier assigned to the inner control; combined with idPrefix when supplied. |
| Input | `tooltip` | Tooltip text displayed on hover |
| Input | `label` | Label text or translation key displayed for this control. |
| Input | `errorMessage` | Error message displayed for validation |
| Input | `required` | Marks this control as required in its existing template; parent-form validators remain separately configured. |
| Input | `multiple` | Enables the existing multiple-selection mode. |
| Input | `options` | Options rendered by the control; use the label/value key inputs for object options. |
| Input | `labelKey` | Property name read from an option object to obtain its visible label. |
| Input | `valueKey` | Property name used to identify or extract an option value. |
| Input | `fieldName` | Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved. |
| Output | `selectionChange` | Emits when the selection handler processes a selection. |
| Output | `modelChange` | Emits when the component model-change handler runs. |
| Input | `modelValue` | Direct binding to the component model, backed by its existing value accessor. |

## SlideToggleComponent

Source: [view](projects/ui-controls/src/lib/component/slide-toggle/slide-toggle.component.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `inputId` | Identifier assigned to the inner control; combined with idPrefix when supplied. |
| Input | `inputModelValue` | Two-way bound value for the toggle (true/false) |
| Input | `required` | Marks this control as required in its existing template; parent-form validators remain separately configured. |
| Input | `disableRipple` | Disable ripple animation effect |
| Input | `color` | Theme color: 'primary' / 'accent' / 'warn' |
| Input | `labelPosition` | Label position: 'before' / 'after' |
| Input | `label` | Label text or translation key displayed for this control. |
| Input | `errorMessage` | Optional error message when required validation fails |
| Input | `fieldName` | Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved. |
| Input | `preventToggleOnClick` | Whether to prevent the slide toggle from changing its value on click |
| Output | `stateChange` | Emits when a permitted toggle state change is processed. |
| Output | `toggleChange` | Emits when a permitted toggle action is processed. |
| Output | `clicked` | Emits when the existing click handler runs. |

## SegmentedControlComponent

Source: [view](projects/ui-controls/src/lib/component/segmented-control/segmented-control.component.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `options` | Options rendered by the control; use the label/value key inputs for object options. |
| Input | `currentValue` | Selected segment value, backed by the shared form value. |
| Input | `size` | Segmented-control size: md or lg. |
| Output | `selectionChange` | Emits when the selection handler processes a selection. |
| Output | `widthCalculated` | Emits measured segment widths in pixels, in option order. |

## TextAreaComponent

Source: [view](projects/ui-controls/src/lib/component/text-area/text-area.component.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `inputId` | Identifier assigned to the inner control; combined with idPrefix when supplied. |
| Input | `resize` | Enables or disables textarea resize |
| Input | `preventCopyPasteCut` | Clipboard restriction flag retained with its current wiring. The local uiPreventClipboard directive blocks copy, cut, and paste when true. |
| Input | `minRows` | Minimum visible textarea rows passed to the existing textarea configuration. |
| Input | `maxRows` | Maximum textarea rows passed to the existing textarea configuration. |
| Input | `columns` | Textarea column count passed to the native cols attribute. |
| Input | `label` | Label text or translation key displayed for this control. |
| Input | `maxLength` | Maximum allowed characters |
| Input | `showCharacterCount` | Controls display of the existing character-count indicator. |
| Input | `modelValue` | Direct binding to the component model, backed by its existing value accessor. |
| Input | `error` | Shows validation error state |
| Input | `required` | Marks this control as required in its existing template; parent-form validators remain separately configured. |
| Input | `showRemainingCharacters` | Shows the remaining-character indicator when the existing focus/limit conditions allow it. |
| Input | `fieldName` | Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved. |
| Input | `templateLabel` | Label used in expandable dialog |
| Input | `placeholder` | Hint text or translation key displayed while the control is empty. |
| Input | `readonly` | Requests the existing read-only behavior without disabling the parent form control. |
| Input | `mentionsList` | Mention list for @ mentions |
| Input | `mentionConfig` | Mention configuration |
| Input | `useAbbreviationHighlight` | Enables abbreviation highlight textarea |
| Input | `abbreviationList` | Allowed abbreviations |
| Input | `enableArabicInput` | Passes the Arabic typing flag to the existing utility directive. |
| Input | `restrictedWords` | Restricted words list |
| Input | `abbreviationMentionConfig` | Optional replacement configuration for abbreviation mentions; null uses the component-built configuration. |
| Input | `trimOnBlur` | Trims leading and trailing whitespace when the textarea loses focus. |
| Input | `assistantFieldId` | Value written to the existing ChatGptAttr DOM attribute for field discovery. |
| Output | `valueChanged` | Emits the existing value-change payload; remains separate from modelChange. |
| Output | `expandRequested` | Reserved output retained for API compatibility. No emission site exists in the supplied implementation. |
| Output | `inputChanged` | Emits from the existing input/change handler. |
| Output | `itemSelected` | Emits when an abbreviation is picked from the mention list |

## RichTextEditorComponent

Source: [view](projects/ui-controls/src/lib/component/rich-text-editor/rich-text-editor.component.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `inputId` | Identifier assigned to the inner control; combined with idPrefix when supplied. |
| Input | `modelValue` | Direct binding to the component model, backed by its existing value accessor. |
| Input | `hiddenToolbarItems` | Toolbar item identifiers removed from the editor configuration. |
| Input | `editorType` | Editor type identifier |
| Input | `resize` | Enables or disables resize option |
| Input | `preventCopyPasteCut` | Clipboard restriction flag retained with its current wiring. The local uiPreventClipboard directive blocks copy, cut, and paste when true. |
| Input | `label` | Label text or translation key displayed for this control. |
| Input | `error` | Displays validation error state |
| Input | `required` | Marks this control as required in its existing template; parent-form validators remain separately configured. |
| Input | `fieldName` | Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved. |
| Input | `placeholder` | Hint text or translation key displayed while the control is empty. |
| Input | `readonly` | Requests the existing read-only behavior without disabling the parent form control. |
| Output | `modelChange` | Emits when the component model-change handler runs. |
| Output | `blurred` | Emits when the control loses focus. |

## TimePickerComponent

Source: [view](projects/ui-controls/src/lib/component/time-picker/time-picker.component.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `inputId` | Identifier assigned to the inner control; combined with idPrefix when supplied. |
| Input | `label` | Label text or translation key displayed for this control. |
| Input | `modelValue` | Direct binding to the component model, backed by its existing value accessor. |
| Input | `errorMessage` | Validation error message |
| Input | `required` | Marks this control as required in its existing template; parent-form validators remain separately configured. |
| Input | `fieldName` | Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved. |
| Input | `placeholder` | Hint text or translation key displayed while the control is empty. |
| Input | `readonly` | Requests the existing read-only behavior without disabling the parent form control. |
| Input | `minTime` | Minimum selectable time |
| Input | `maxTime` | Maximum selectable time |
| Output | `modelChange` | Emits when the component model-change handler runs. |
| Output | `changeCommitted` | Emits from the existing change handler. |
| Output | `inputChanged` | Emits from the existing input/change handler. |
| Output | `focusGained` | Emits when the inner field gains focus. |
| Output | `focusLost` | Emits when the inner field loses focus. |
| Output | `keyPressed` | Emits on the inner field keydown event. |
| Output | `keyReleased` | Emits on the inner field keyup event. |
| Output | `enterPressed` | Reserved output retained for API compatibility. No emission site exists in the supplied implementation. |

## AutoPopulateCurrentDateDirective

Source: [view](projects/ui-controls/src/lib/directive/auto-populate-current-date.directive.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `uiAutoPopulateCurrentDate` | Enables the Shift+R shortcut that writes the current date into the attached form control. |

## PreventClipboardDirective

Source: [view](projects/ui-controls/src/lib/directive/prevent-clipboard.directive.ts)

| Kind | Binding | Purpose |
|---|---|---|
| Input | `preventCopyPasteCut` | Clipboard restriction flag retained with its current wiring. The local uiPreventClipboard directive blocks copy, cut, and paste when true. |
