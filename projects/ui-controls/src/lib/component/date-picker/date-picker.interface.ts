import { MatDatepickerInputEvent } from '@angular/material/datepicker';

/**
 * Base metadata shared across all date picker events
 */
export interface DatePickerFieldInfo {
  /** Native input reference (available when inputId is provided) */
  inputRef?: HTMLElement | null;

  /** Current selected date value */
  modelValue: Date | null;

  /** Field identifier from parent component */
  textFieldName: string | number;
}

/**
 * Emitted when date selection changes from MatDatepicker
 */
export interface DatePickerDateChangeEvent extends DatePickerFieldInfo {
  dateChangeEvent: MatDatepickerInputEvent<Date>;
}

/**
 * Emitted when ngModel value changes
 */
export interface DatePickerModelChangeEvent extends DatePickerFieldInfo {
  modelChangeEvent: Date | null;
}

/**
 * Emitted when input receives focus
 */
export interface DatePickerFocusEvent extends DatePickerFieldInfo {
  onFocusEvent: FocusEvent;
}

/**
 * Emitted when input loses focus
 */
export interface DatePickerBlurEvent extends DatePickerFieldInfo {
  onBlurEvent: FocusEvent;
}

/**
 * Emitted on keyup event
 */
export interface DatePickerKeyUpEvent extends DatePickerFieldInfo {
  onKeyUpEvent: KeyboardEvent;
}

/**
 * Emitted on keydown event
 */
export interface DatePickerKeyDownEvent extends DatePickerFieldInfo {
  onkeyDownEvent: KeyboardEvent;
}

/**
 * Emitted on native input event
 */
export interface DatePickerInputEvent extends DatePickerFieldInfo {
  changeEvent: Event;
}

/**
 * Emitted on native change event
 */
export interface DatePickerChangeEvent extends DatePickerFieldInfo {
  onChangeEvent: Event;
}

/**
 * Emitted on keyup event
 */
export interface DatePickerEnterEvent extends DatePickerFieldInfo {
  onKeyUpEvent: KeyboardEvent;
}


/**
 * Optional interface representing all @Input() properties
 */
export interface DatePickerInputs {
  inputId?: string;
  preventCopyPasteCut?: boolean;
  label?: string;
  modelValue: Date | null;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  textFieldName: string | number;
  placeholder?: string;
  readonly?: boolean;
  autoPopulateDateTime?: boolean;
  minDate?: Date;
  maxDate?: Date;
}
