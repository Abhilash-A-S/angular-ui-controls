import {
  Component,
  ChangeDetectorRef,
  EventEmitter,
  Input,
  Output,
  Optional,
  Self,
} from '@angular/core';
import { MaterialModule } from '../../material.module';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CheckboxFieldInfo, CheckboxInputChangeEvent } from './checkbox.interface';
import { BaseControlValueAccessor } from '../base-control-value-accessor.directive';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'ui-checkbox',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
})
export class CheckboxComponent extends BaseControlValueAccessor<boolean> {
  // Unique ID for the checkbox element
  protected rawInputId: string = '';

  /**
   * Identifier assigned to the inner control; combined with idPrefix when supplied.
   * @type string
   * @remarks Required Angular input; provide a stable identifier.
   */
  @Input({ required: true })
  set inputId(id: string) {
    this.rawInputId = id || '';
    this.configureId();
  }
  get inputId(): string {
    return this.rawInputId;
  }

  /**
   * Tooltip text displayed on hover
   * @default ''
   * @type string
   */
  @Input() tooltip: string = '';

  /**
   * Label text or translation key displayed for this control.
   * @default ''
   * @type string
   */
  @Input() label: string = '';

  /**
   * Error message displayed for validation
   * @default ''
   * @type string
   */
  @Input() errorMessage: string = '';

  /**
   * Marks this control as required in its existing template; parent-form validators remain separately configured.
   * @default false
   * @type boolean
   */
  @Input() required: boolean = false;

  /**
   * Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved.
   * @type string | number
   * @renamedFrom textFieldName
   */
  @Input() fieldName!: string | number;

  /**
   * The indeterminate state is typically used in a "select all" scenario, where it indicates that some but not all child items are selected.
   * @default false
   * @type boolean
   */
  @Input() indeterminate: boolean = false;

  /**
   * Emits when the existing click handler runs.
   * @payload MouseEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onClick
   */
  @Output() clicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  /**
   * Emits when the component model-change handler runs.
   * @payload CheckboxFieldInfo
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onModelChange
   */
  @Output() modelChange: EventEmitter<CheckboxFieldInfo> = new EventEmitter<CheckboxFieldInfo>();

  /**
   * Emits from the existing input/change handler.
   * @payload CheckboxInputChangeEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onInputChange
   */
  @Output() inputChanged: EventEmitter<CheckboxInputChangeEvent> =
    new EventEmitter<CheckboxInputChangeEvent>();

  /**
   * Internal model bound to checkbox
   * @type boolean
   */
  @Input()
  get inputModelValue(): boolean {
    return !!this.value;
  }
  set inputModelValue(val: boolean) {
    this.value = val;
  }

  /**
   * Direct binding to the component model, backed by its existing value accessor.
   * @type boolean
   */
  @Input()
  get modelValue(): boolean {
    return this.inputModelValue;
  }
  set modelValue(val: boolean) {
    this.inputModelValue = val;
  }

  constructor(
    @Optional() @Self() public override ngControl: NgControl,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super(ngControl, changeDetectorRef);
  }

  /**
   * Returns the current field information
   * @returns object containing model value and field name
   */
  private fieldInfo(): CheckboxFieldInfo {
    let inputRef = null;
    if (this.effectiveId) {
      inputRef = typeof document === 'undefined' ? null : document.getElementById(this.effectiveId);
    }
    return {
      ...(inputRef && { inputRef: inputRef }),
      modelValue: this.inputModelValue,
      textFieldName: this.fieldName,
    };
  }

  /**
   * Emits updated model value when ngModel changes
   * @returns void (emits modelChange event)
   */
  public modelValueChange(): void {
    this.modelChange.emit(this.fieldInfo());
  }

  /**
   * Emits input event details along with field info
   * @param changeValue Input event object
   * @returns void (emits inputChanged event)
   */
  public inputChange(changeValue: Event, typeofChange: string): void {
    this.inputChanged.emit({
      ...this.fieldInfo(),
      ...{ changeEvent: changeValue, typeofChange },
    });
  }

  /**
   * Handles checkbox change event
   * @param changeValue MatCheckboxChange event
   * @returns void (emits inputChanged event)
   */
  public onChangeHandle(changeValue: MatCheckboxChange, typeofChange: string): void {
    this.inputChanged.emit({
      ...this.fieldInfo(),
      ...{ changeEvent: changeValue, typeofChange },
    });
  }

  /**
   * Emits click event when checkbox is clicked
   * @param event Mouse click event
   * @returns void (emits clicked event)
   */
  public onCheckboxClick(event: MouseEvent): void {
    this.clicked.emit(event);
  }
}
