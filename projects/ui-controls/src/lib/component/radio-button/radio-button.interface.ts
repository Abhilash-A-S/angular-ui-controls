/**
 * Base field information shared across all emitted events
 */
export interface RadioButtonFieldInfo {
  /** Currently selected radio value */
  modelValue: any;

  /** Field identifier used by parent component */
  textFieldName: string | number;

  /** Optional native input element reference */
  inputRef?: Element | null;
}

/**
 * Model change event payload
 */
export interface RadioButtonModelChangeEvent extends RadioButtonFieldInfo {
  /** Updated selected radio value */
  modelChangeEvent: any;
  index?: number;
}

/**
 * Input change event payload
 */
export interface RadioButtonInputEvent extends RadioButtonFieldInfo {
  /** Native input event */
  changeEvent: Event;
}

/**
 * Radio button option type
 * You can define this more strictly if all radio button options have a consistent shape
 */
export type RadioButtonOption = string | number | Record<string, any>;
