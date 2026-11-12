import { Component, EventEmitter, Input, Output, Optional, Self, ChangeDetectorRef } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SlideToggleFieldInfo } from './slide-toggle.interface';
import { NgControl } from '@angular/forms';
import { BaseControlValueAccessor } from '../base-control-value-accessor.directive';

@Component({
  selector: 'ui-slide-toggle',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './slide-toggle.component.html',
  styleUrl: './slide-toggle.component.scss',
})
export class SlideToggleComponent extends BaseControlValueAccessor<boolean> {
  /** Unique ID for the slide toggle */
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
   * Two-way bound value for the toggle (true/false)
   * @type boolean
   */
  @Input()
  get inputModelValue(): boolean {
    return !!this.value;
  }
  set inputModelValue(val: boolean) {
    if (this.preventToggleOnClick) {
      return;
    }
    this.value = val;
  }


  /**
   * Marks this control as required in its existing template; parent-form validators remain separately configured.
   * @default false
   * @type boolean
   */
  @Input() required: boolean = false;

  /**
   * Disable ripple animation effect
   * @default false
   * @type boolean
   */
  @Input() disableRipple: boolean = false;

  /**
   * Theme color: 'primary' | 'accent' | 'warn'
   * @default 'primary'
   * @type 'primary' | 'accent' | 'warn'
   */
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';

  /**
   * Label position: 'before' | 'after'
   * @default 'after'
   * @type 'before' | 'after'
   */
  @Input() labelPosition: 'before' | 'after' = 'after';

  /**
   * Label text or translation key displayed for this control.
   * @default ''
   * @type string
   */
  @Input() label: string = '';

  /**
   * Optional error message when required validation fails
   * @default ''
   * @type string
   */
  @Input() errorMessage: string = '';

  /**
   * Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved.
   * @type string | number
   * @renamedFrom textFieldName
   */
  @Input() fieldName!: string | number;

  /**
   * Whether to prevent the slide toggle from changing its value on click
   * @default false
   */
  @Input() preventToggleOnClick = false;

  /**
   * Emits when a permitted toggle state change is processed.
   * @payload SlideToggleFieldInfo
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onChangeEventHandler
   */
  @Output() readonly stateChange = new EventEmitter<SlideToggleFieldInfo>();

  /**
   * Emits when a permitted toggle action is processed.
   * @payload SlideToggleFieldInfo
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   */
  @Output() readonly toggleChange = new EventEmitter<SlideToggleFieldInfo>();

  /**
   * Emits when the existing click handler runs.
   * @payload SlideToggleFieldInfo
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onClickHandler
   */
  @Output() readonly clicked = new EventEmitter<SlideToggleFieldInfo>();

  constructor(@Optional() @Self() public override ngControl: NgControl,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super(ngControl, changeDetectorRef);
  }

  /**
   * Returns common field information
   * attached to emitted events.
   */
  private fieldInfo(): SlideToggleFieldInfo {
    let inputRef: Element | null = null;
    if (this.effectiveId) {
      inputRef = document.querySelector(`#${this.effectiveId}`);
    }
    return {
      ...inputRef && { inputRef: inputRef },
      modelValue: this.inputModelValue,
      textFieldName: this.fieldName
    };
  }

  /**
   * Handles the Material change event.
   */
  onToggleValueChange(event: MatSlideToggleChange): void {
    if (this.preventToggleOnClick) {
      event.source.checked = !!this.value;
      setTimeout(() => {
        event.source.checked = !!this.value;
        this.cdr?.detectChanges();
      });
      return;
    }

    this.stateChange.emit(this.fieldInfo());
  }

  /**
   * Called when the toggle is toggled
   */
  onToggleChange(): void {
    if (this.preventToggleOnClick) {
      return;
    }
    this.toggleChange.emit(this.fieldInfo());
  }

  /**
   * Called when the toggle is clicked
   */
  handleOnClick(changeValue: MouseEvent): void {
    if (this.preventToggleOnClick) {
      changeValue.preventDefault();
      return;
    }
    this.onTouchedCallback();
    this.clicked.emit({
      ...this.fieldInfo(),
      changeEvent: changeValue
    });
  }

  /**
   * Handles click on the overlay blocker when toggle clicks are prevented
   */
  handleOverlayClick(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.clicked.emit({
      ...this.fieldInfo(),
      changeEvent: event
    });
  }

}
