import { Component, ChangeDetectorRef, EventEmitter, Input, Output, Optional, Self } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { UiUtilitiesModule } from '../../utilities';
import { MatSelectionListChange } from '@angular/material/list';
import { SelectionListFieldInfo, SelectionListSelectionChangeEvent, SelectionListModelChangeEvent } from './selection-list.interface';
import { BaseControlValueAccessor } from '../base-control-value-accessor.directive';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'ui-selection-list',
  standalone: true,
  imports: [MaterialModule, UiUtilitiesModule],
  templateUrl: './selection-list.component.html',
  styleUrl: './selection-list.component.scss'
})
export class SelectionListComponent extends BaseControlValueAccessor<any> {
  // Unique ID for the selection list element
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
   * Enables the existing multiple-selection mode.
   * @default true
   * @type boolean
   */
  @Input() multiple: boolean = true;

  /**
   * Options rendered by the control; use the label/value key inputs for object options.
   * @default []
   * @type any[]
   * @renamedFrom selectList
   */
  @Input() options: any[] = [];

  /**
   * Property name read from an option object to obtain its visible label.
   * @default ''
   * @type string
   * @renamedFrom displayKey
   */
  @Input() labelKey: string = '';

  /**
   * Property name used to identify or extract an option value.
   * @default ''
   * @type string
   * @renamedFrom idKey
   */
  @Input() valueKey: string = '';

  /**
   * Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved.
   * @type string | number
   * @renamedFrom textFieldName
   */
  @Input() fieldName!: string | number;

  /**
   * Emits when the selection handler processes a selection.
   * @payload SelectionListSelectionChangeEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onSelectionChange
   */
  @Output() selectionChange: EventEmitter<SelectionListSelectionChangeEvent> = new EventEmitter<SelectionListSelectionChangeEvent>();

  /**
   * Emits when the component model-change handler runs.
   * @payload SelectionListModelChangeEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onModelChange
   */
  @Output() modelChange: EventEmitter<SelectionListModelChangeEvent> = new EventEmitter<SelectionListModelChangeEvent>();

  /** Internal model bound to selection list */
  public get inputModelValue(): any {
    return this.value;
  }
  public set inputModelValue(val: any) {
    this.value = val;
  }

  /**
   * Direct binding to the component model, backed by its existing value accessor.
   */
  @Input()
  get modelValue(): any {
    return this.inputModelValue;
  }
  set modelValue(val: any) {
    this.inputModelValue = val;
  }

  constructor(
    @Optional() @Self() public override ngControl: NgControl,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super(ngControl, changeDetectorRef);
  }

  /**
   * Returns the current field information
   * @returns object containing model value and field name
   */
  private fieldInfo(): SelectionListFieldInfo {
    let inputRef = null;
    if (this.effectiveId) {
      inputRef = document.querySelector(`#${this.effectiveId}`);
    }
    return {
      ...(inputRef && { inputRef }),
      modelValue: this.inputModelValue,
      textFieldName: this.fieldName
    };
  }

  /**
   * Emits updated model value when ngModel changes
   * @param val The updated model value
   * @returns void (emits modelChange event)
   */
  public modelValueChange(val: any): void {
    this.modelChange.emit({
      ...this.fieldInfo(),
      modelChangeEvent: val
    });
  }

  /**
   * Handles selection change event
   * @param changeValue MatSelectionListChange event
   * @returns void (emits selectionChange event)
   */
  public selectionChanged(changeValue: MatSelectionListChange): void {
    this.selectionChange.emit({
      ...this.fieldInfo(),
      selectionChangeEvent: changeValue
    });
  }

  /**
   * Track by function for performance optimization
   */
  trackByFn = (index: number, item: any): any => {
    return this.valueKey && item ? item[this.valueKey] : (item?.id ?? item);
  };
}
