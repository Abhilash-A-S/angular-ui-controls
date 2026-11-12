import { MatCheckboxChange } from '@angular/material/checkbox';

export interface CheckboxFieldInfo {
  inputRef?: Element | null;
  modelValue: boolean;
  textFieldName: string | number;
}

export interface CheckboxInputChangeEvent extends CheckboxFieldInfo {
  changeEvent: Event | MatCheckboxChange;
}
