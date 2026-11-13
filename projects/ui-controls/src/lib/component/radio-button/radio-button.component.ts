import {
  Component,
  EventEmitter,
  Input,
  Output,
  Optional,
  Self,
  ChangeDetectorRef,
} from '@angular/core';
import { MaterialModule } from '../../material.module';
import {
  RadioButtonFieldInfo,
  RadioButtonInputEvent,
  RadioButtonModelChangeEvent,
  RadioButtonOption,
} from './radio-button.interface';
import { BaseControlValueAccessor } from '../base-control-value-accessor.directive';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'ui-radio-group, ui-radio-button',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './radio-button.component.html',
  styleUrl: './radio-button.component.scss',
})
export class RadioButtonComponent extends BaseControlValueAccessor<any> {
  /** HTML id attribute for the radio button group */
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
   * Label text or translation key displayed for this control.
   * @default ''
   * @type string
   */
  @Input() label: string = '';

  /**
   * Property name read from an option object to obtain its visible label.
   * @default ''
   * @type string
   * @renamedFrom displayLabelKey
   */
  @Input() labelKey: string = '';

  /**
   * Options rendered by the control; use the label/value key inputs for object options.
   * @default []
   * @type RadioButtonOption[]
   * @renamedFrom radioButtonsList
   */
  @Input() options: RadioButtonOption[] = [];

  /**
   * Error message displayed on validation failure
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
   * Property name used to identify or extract an option value.
   * @default ''
   * @type string
   * @renamedFrom idKey
   */
  @Input() valueKey: string = '';

  /**
   * Emits when the component model-change handler runs.
   * @payload RadioButtonModelChangeEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onModelChange
   */
  @Output() modelChange: EventEmitter<RadioButtonModelChangeEvent> =
    new EventEmitter<RadioButtonModelChangeEvent>();

  /**
   * Emits from the existing input/change handler.
   * @payload RadioButtonInputEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onInputChange
   */
  @Output() inputChanged: EventEmitter<RadioButtonInputEvent> =
    new EventEmitter<RadioButtonInputEvent>();

  /** Internal model bound to mat-radio-group */
  get inputModelValue(): any {
    return this.value;
  }
  set inputModelValue(val: any) {
    this.value = val;
  }

  /**
   * Direct binding to the component model, backed by its existing value accessor.
   */
  @Input()
  get modelValue(): any {
    return this.inputModelValue;
  }
  set modelValue(modelvalue: any) {
    if (modelvalue && this.valueKey) {
      this.inputModelValue =
        modelvalue != null && typeof modelvalue === 'object' && this.valueKey in modelvalue
          ? modelvalue[this.valueKey]
          : modelvalue;
    } else {
      this.inputModelValue = modelvalue;
    }
  }

  constructor(
    @Optional() @Self() public override ngControl: NgControl,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super(ngControl, changeDetectorRef);
  }

  /**
   * Returns common field information
   * attached to emitted events.
   */
  private fieldInfo(): RadioButtonFieldInfo {
    let inputRef: Element | null = null;
    if (this.effectiveId) {
      inputRef = typeof document === 'undefined' ? null : document.getElementById(this.effectiveId);
    }
    return {
      ...(inputRef && { inputRef: inputRef }),
      modelValue: this.getModelValue(),
      textFieldName: this.fieldName,
    };
  }

  /**
   * Emits when the selected radio value changes
   * @param modelChange - Updated selected value
   * @returns void (emits modelChange)
   */
  public modelValueChange(modelChange: RadioButtonOption): void {
    this.modelChange.emit({
      ...this.fieldInfo(),
      modelChangeEvent: modelChange,
      index: this.options.findIndex(
        (radioOption) =>
          (this.valueKey ? radioOption[this.valueKey] : radioOption) === this.inputModelValue,
      ),
    });
  }

  /**
   * Emits when a radio input change event occurs
   * @param changeValue - Input change event
   * @returns void (emits inputChanged)
   */
  public inputChange(changeValue: Event): void {
    this.inputChanged.emit({
      ...this.fieldInfo(),
      changeEvent: changeValue,
    });
  }
  getModelValue() {
    if (this.valueKey) {
      this.options.find((radioOption) => radioOption[this.valueKey] === this.inputModelValue);
    }
    return this.inputModelValue;
  }
}
