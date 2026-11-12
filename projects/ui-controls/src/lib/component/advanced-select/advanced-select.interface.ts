import { MatSelectChange } from '@angular/material/select';

/**
 * Base field information shared across all emitted events
 */
export interface SearchableSelectFieldInfo {
  /** Current value(s) bound to the select */
  modelValue: any;

  /** Field identifier used in parent component */
  textFieldName: string | number;

  /** Optional reference to native input element */
  inputRef?: Element | null;
}

/**
 * Selection change event payload
 */
export interface SearchableSelectSelectionChangeEvent
  extends SearchableSelectFieldInfo {
  /** MatSelect change event containing selected value(s) */
  selectionChange: MatSelectChange;
}

/**
 * Toggle "Select All" event payload
 */
export interface SearchableSelectToggleAllEvent extends SearchableSelectFieldInfo {
  /** True if all options are selected, false if cleared */
  selectAllValue: boolean;
}

/**
 * Open/close change event payload
 */
export interface SearchableSelectOpenCloseEvent extends SearchableSelectFieldInfo {
  /** Boolean indicating whether the dropdown is opened or closed */
  selectionChange: boolean;
}

/**
 * Option click event payload
 */
export interface SearchableSelectOptionClickEvent {
  /** The clicked option */
  activeOption: SearchableSelectOption;
}

/**
 * Interface representing an option object with standard flags
 */
export interface SearchableSelectOptionItem {
  [key: string]: any;
  isDisabled?: boolean;
  isHidden?: boolean;
}

/**
 * Single selectable option type
 * Can be primitive (string/number) or an object with arbitrary keys
 */
export type SearchableSelectOption = any;

