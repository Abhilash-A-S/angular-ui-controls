/**
 * Base field information shared across all emitted events
 * Returned by fieldInfo()
 */
export interface TextInputFieldInfo {
  /** Current input value */
  modelValue: any;

  /** Field identifier used by parent component */
  fieldName: string | number;

  /** Native input element reference (if inputId is provided) */
  inputRef?: Element | null;
}

/**
 * Model value change event payload
 */
export interface TextInputModelChangeEvent extends TextInputFieldInfo {
  /** Updated input value */
  modelChangeEvent: any;
}

/**
 * Input event payload
 */
export interface TextInputInputEvent extends TextInputFieldInfo {
  /** Native input/change event */
  changeEvent: Event;
}

/**
 * Focus event payload
 */
export interface TextInputFocusEvent extends TextInputFieldInfo {
  /** Native focus event */
  focusEvent: FocusEvent;
}

/**
 * Blur event payload
 */
export interface TextInputBlurEvent extends TextInputFieldInfo {
  /** Native blur event */
  blurEvent: FocusEvent;
}

/**
 * Keydown event payload
 */
export interface TextInputKeydownEvent extends TextInputFieldInfo {
  /** Native keyboard event */
  keyDownEvent: KeyboardEvent;
}

/**
 * Keyup event payload
 */
export interface TextInputKeyupEvent extends TextInputFieldInfo {
  /** Native keyboard event */
  keyUpEvent: KeyboardEvent;
}

/**
 * Enter key event payload
 */
export interface TextInputKeyEnterEvent extends TextInputFieldInfo {
  /** Enter key or input-related event */
  keyEnterEvent: Event;
}

/**
 * Input click event payload
 */
export interface TextInputClickEvent extends TextInputFieldInfo {
  /** Mouse click event */
  clickEvent: MouseEvent;
}
