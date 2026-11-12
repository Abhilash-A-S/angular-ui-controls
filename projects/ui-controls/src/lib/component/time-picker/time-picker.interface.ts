/**
 * Base field information shared across all emitted events
 */
export interface TimePickerFieldInfo {
  /** Selected time value (model value) */
  modelValue: string;

  /** Field identifier used by parent components */
  textFieldName: string | number;

  /** Optional reference to the input element */
  inputRef?: HTMLElement | null;
}

/**
 * Change event payload for time picker
 */
export interface TimePickerChangeEvent extends TimePickerFieldInfo {
  /** Native input or change event */
  changeEvent?: Event;
}
/**
 * Change event payload for time picker
 */
export interface TimePickerChange extends TimePickerFieldInfo {
  /** Native input or change event */
  changeEvent?: Event;
}

/**
 * Date/time selection event payload
 */
export interface TimePickerDateChangeEvent extends TimePickerFieldInfo {
  /** Selected time value */
  selectedTime?: string;
}

/**
 * Keyboard event payload for keyup/keydown/enter
 */
export interface TimePickerKeyboardEvent extends TimePickerFieldInfo {
  /** Keyboard event object */
  keyboardEvent?: KeyboardEvent;
}

/**
 * Focus/blur event payload
 */
export interface TimePickerFocusEvent extends TimePickerFieldInfo {
  /** Native focus or blur event */
  focusEvent?: FocusEvent;
}
