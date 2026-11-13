export interface SlideToggleFieldInfo {
  /** Currently selected slider value */
  modelValue: boolean;

  /** Field identifier used by parent component */
  textFieldName: string | number;

  /** Optional native input element reference */
  inputRef?: Element | null;
  changeEvent?: MouseEvent;
}
