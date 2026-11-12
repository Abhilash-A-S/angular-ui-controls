/**
 * Base field information shared across all emitted events
 * Returned by fieldInfo()
 */
export interface SearchInputInfo {
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
export interface SearchInputModelChangeEvent extends SearchInputInfo {
  /** Updated input value */
  modelChangeEvent: any;
}

/**
 * Input event payload
 */
export interface SearchInputInputEvent extends SearchInputInfo {
  /** Native input/change event */
  changeEvent: Event;
}

/**
 * Focus event payload
 */
export interface SearchInputFocusEvent extends SearchInputInfo {
  /** Native focus event */
  focusEvent: FocusEvent;
}

/**
 * Blur event payload
 */
export interface SearchInputBlurEvent extends SearchInputInfo {
  /** Native blur event */
  blurEvent: FocusEvent;
}

/**
 * Keydown event payload
 */
export interface SearchInputKeydownEvent extends SearchInputInfo {
  /** Native keyboard event */
  keyDownEvent: KeyboardEvent;
}

/**
 * Keyup event payload
 */
export interface SearchInputKeyupEvent extends SearchInputInfo {
  /** Native keyboard event */
  keyUpEvent: KeyboardEvent;
}

/**
 * Enter key event payload
 */
export interface SearchInputKeyEnterEvent extends SearchInputInfo {
  /** Enter key or input-related event */
  keyEnterEvent: Event;
}

/**
 * Input click event payload
 */
export interface SearchInputClickEvent extends SearchInputInfo {
  /** Mouse click event */
  clickEvent: MouseEvent;
}
