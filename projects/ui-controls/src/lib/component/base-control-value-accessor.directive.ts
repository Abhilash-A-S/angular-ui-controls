import {
  booleanAttribute,
  ChangeDetectorRef,
  Directive,
  Input,
  Output,
  EventEmitter,
  HostListener,
  Optional,
  Self,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Directive()
export abstract class BaseControlValueAccessor<T = any> implements ControlValueAccessor {
  /** The internal value of the control */
  protected _value: T | null = null;

  /** Standard change and touch callbacks */
  public onChangeCallback: (value: T | null) => void = () => {};
  public onTouchedCallback: () => void = () => {};

  /** Internal storage for idPrefix */
  protected rawIdPrefix: string = '';

  /** Plain string property bound in template [id]="effectiveId" (zero function or CD overhead) */
  public effectiveId: string = '';

  /** Internal storage for disabled state */
  protected _disabled: boolean = false;

  /**
   * Disables the control. Angular Forms can also update this state through setDisabledState.
   * @type boolean
   */
  @Input({ transform: booleanAttribute })
  set disabled(val: boolean) {
    this._disabled = val;
    if (this.cdr) {
      this.cdr.markForCheck();
    }
  }
  get disabled(): boolean {
    if (this.ngControl?.control) {
      return this.ngControl.control.disabled || this._disabled;
    }
    return this._disabled;
  }

  /**
   * Optional namespace prepended to inner control IDs to distinguish repeated instances.
   * @type string
   */
  @Input()
  set idPrefix(prefix: string) {
    this.rawIdPrefix = prefix || '';
    this.configureId();
  }
  get idPrefix(): string {
    return this.rawIdPrefix;
  }

  public configureId(): void {
    const rawId = (this as any).rawInputId || (this as any).inputId;
    this.effectiveId = this.rawIdPrefix && rawId ? `${this.rawIdPrefix}_${rawId}` : rawId || '';
  }

  /** Canonical value binding. Programmatic writes never emit user change events. */
  @Input()
  get value(): T | null {
    return this._value;
  }
  set value(value: T | null) {
    if (this.writingValue) {
      this._value = value;
      return;
    }
    this.writingValue = true;
    try {
      this.writeValue(value);
    } finally {
      this.writingValue = false;
    }
  }
  private writingValue = false;

  /** Raw value emitted once per committed user edit; supports [(value)]. */
  @Output() readonly valueChange = new EventEmitter<T | null>();

  /** Commit a view edit after the inner control has updated its local model. */
  public commitValue(value: T | null = this.value): void {
    if (this.disabled) return;
    this._value = value;
    this.onChangeCallback(value);
    this.valueChange.emit(value);
    this.cdr?.markForCheck();
  }

  /** Touch the outer control only when focus leaves the whole composite control. */
  @HostListener('focusout', ['$event'])
  public handleFocusOut(event: FocusEvent): void {
    const host = event.currentTarget as HTMLElement | null;
    if (event.relatedTarget && host?.contains(event.relatedTarget as Node)) return;
    this.onTouchedCallback();
  }

  /**
   * Alternate binding to the shared value, retained on the base class for compatibility.
   * @type T | null
   */
  @Input()
  get checked(): T | null {
    return this._value;
  }

  set checked(val: T | null) {
    this.value = val;
  }

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    protected cdr?: ChangeDetectorRef,
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  /** Writes a new value from the form model to the view */
  writeValue(value: T | null): void {
    this._value = value;
    if (this.cdr) {
      this.cdr.markForCheck();
    }
  }

  /** Registers a callback function that is called when the control's value changes in the UI */
  registerOnChange(fn: (value: T | null) => void): void {
    this.onChangeCallback = fn;
  }

  /** Registers a callback function that is called when the control is touched */
  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  /** Updates the disabled state from the form model */
  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    if (this.cdr) {
      this.cdr.markForCheck();
    }
  }
}
