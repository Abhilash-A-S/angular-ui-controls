import { NgxMatDatepickerInputEvent } from '@ngxmc/datetime-picker';

/**
 * Base field information for DateTime picker
 */
export interface DateTimePickerFieldInfo {
  /** Current date-time value */
  modelValue: Date;

  /** Field name provided by parent */
  textFieldName: string | number;

  /** Native input element reference (if inputId provided) */
  inputRef?: Element | null;
}

/**
 * Date picker change event payload
 */
export interface DateTimePickerDateChangeEvent extends DateTimePickerFieldInfo {
  /** Date-time picker change value */
  dateChangeEvent: NgxMatDatepickerInputEvent<any, any>;
}

/**
 * ngModel change event payload
 */
export interface DateTimePickerModelChangeEvent extends DateTimePickerFieldInfo {
  /** Updated model value */
  modelChangeEvent: Date;
}

/**
 * Focus event payload
 */
export interface DateTimePickerFocusEvent extends DateTimePickerFieldInfo {
  /** Native focus event */
  focusEvent: FocusEvent;
}

/**
 * Blur event payload
 */
export interface DateTimePickerBlurEvent extends DateTimePickerFieldInfo {
  /** Native blur event */
  blurEvent: FocusEvent;
}

/**
 * Input event payload
 */
export interface DateTimePickerInputEvent extends DateTimePickerFieldInfo {
  /** Native input event */
  inputChangeEvent: Event;
}

/**
 * Native change event payload
 */
export interface DateTimePickerChangeEvent extends DateTimePickerFieldInfo {
  /** Native change event */
  changeEvent: Event;
}

/**
 * Keyup event payload
 */
export interface DateTimePickerKeyupEvent extends DateTimePickerFieldInfo {
  /** Native keyboard event */
  keyUpEvent: KeyboardEvent;
}

/**
 * Keydown event payload
 */
export interface DateTimePickerKeydownEvent extends DateTimePickerFieldInfo {
  /** Native keyboard event */
  keyDownEvent: KeyboardEvent;
}
/**
 * Keydown event payload
 */
export interface DateTimePickerKeyEnter extends DateTimePickerFieldInfo {
  /** Native keyboard event */
  keyDownEvent: KeyboardEvent;
}
