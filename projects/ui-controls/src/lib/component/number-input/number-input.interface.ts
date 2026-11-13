/**
 * Base field information shared across all emitted events
 * Returned by fieldInfo()
 */
export interface NumberInputFieldInfo {
  /** Current numeric value */
  modelValue: number;

  /** Field name provided by parent component */
  textFieldName: string | number;

  /** Native input element reference (if inputId exists) */
  inputRef?: Element | null;
}

/**
 * Model value change payload
 */
export interface NumberInputModelChangeEvent extends NumberInputFieldInfo {
  /** Updated numeric value */
  modelChangeEvent: number;
}

/**
 * Input event payload
 */
export interface NumberInputInputEvent extends NumberInputFieldInfo {
  /** Native input/change event */
  changeEvent: Event;
}

/**
 * Focus event payload
 */
export interface NumberInputFocusEvent extends NumberInputFieldInfo {
  /** Native focus event */
  focusEvent: FocusEvent;
}

/**
 * Blur event payload
 */
export interface NumberInputBlurEvent extends NumberInputFieldInfo {
  /** Native blur event */
  blurEvent: FocusEvent;
}

/**
 * Keydown event payload
 */
export interface NumberInputKeydownEvent extends NumberInputFieldInfo {
  /** Native keyboard event */
  keyDownEvent: KeyboardEvent;
}

/**
 * Keyup event payload
 */
export interface NumberInputKeyupEvent extends NumberInputFieldInfo {
  /** Native keyboard event */
  keyUpEvent: KeyboardEvent;
}

/**
 * Enter key event payload
 */
export interface NumberInputKeyEnterEvent extends NumberInputFieldInfo {
  /** Enter key or input-related event */
  keyEnterEvent: Event;
}
