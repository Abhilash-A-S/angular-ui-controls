/**
 * Base field information shared across all emitted events
 * Returned by fieldInfo()
 */
export interface PasswordInputFieldInfo {
  /** Current password value */
  modelValue: number;

  /** Field name provided by parent component */
  textFieldName: string | number;

  /** Native input element reference (if inputId exists) */
  inputRef?: Element | null;
}

/**
 * Model value change event payload
 */
export interface PasswordInputModelChangeEvent extends PasswordInputFieldInfo {
  /** Updated password value */
  modelChangeEvent: string;
}

/**
 * Input event payload
 */
export interface PasswordInputInputEvent extends PasswordInputFieldInfo {
  /** Native input event */
  inputChangeEvent: Event;
}

/**
 * Focus event payload
 */
export interface PasswordInputFocusEvent extends PasswordInputFieldInfo {
  /** Native focus event */
  focusEvent: FocusEvent;
}

/**
 * Blur event payload
 */
export interface PasswordInputBlurEvent extends PasswordInputFieldInfo {
  /** Native blur event */
  blurEvent: FocusEvent;
}

/**
 * Keydown event payload
 */
export interface PasswordInputKeydownEvent extends PasswordInputFieldInfo {
  /** Native keyboard event */
  keyDownEvent: KeyboardEvent;
}

/**
 * Keyup event payload
 */
export interface PasswordInputKeyupEvent extends PasswordInputFieldInfo {
  /** Native keyboard event */
  keyUpEvent: KeyboardEvent;
}

/**
 * Enter key event payload
 */
export interface PasswordInputKeyEnterEvent extends PasswordInputFieldInfo {
  /** Enter key or input-related event */
  keyEnterEvent: Event;
}
