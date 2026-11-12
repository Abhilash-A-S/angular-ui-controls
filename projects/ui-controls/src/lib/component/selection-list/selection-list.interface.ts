import { MatSelectionListChange } from '@angular/material/list';

/**
 * Metadata shared across selection list events
 */
export interface SelectionListFieldInfo {
  /** Native input element reference (if inputId is provided) */
  inputRef?: Element | null;

  /** Current selected value(s) bound to the model */
  modelValue: any;

  /** Field name identifier provided by parent */
  textFieldName: string | number;
}

/**
 * Event payload emitted when selections are changed
 */
export interface SelectionListSelectionChangeEvent extends SelectionListFieldInfo {
  selectionChangeEvent: MatSelectionListChange;
}

/**
 * Event payload emitted when the model value changes
 */
export interface SelectionListModelChangeEvent extends SelectionListFieldInfo {
  modelChangeEvent: any;
}
