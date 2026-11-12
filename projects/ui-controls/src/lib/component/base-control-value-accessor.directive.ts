import {
  booleanAttribute,
  ChangeDetectorRef,
  Directive,
  Input,
  Optional,
  Self,
} from "@angular/core";
import { ControlValueAccessor, NgControl } from "@angular/forms";

@Directive()
export abstract class BaseControlValueAccessor<
  T = any,
> implements ControlValueAccessor {
  /** The internal value of the control */
  protected _value: T | null = null;

  /** Standard change and touch callbacks */
  public onChangeCallback: (value: T | null) => void = () => {};
  public onTouchedCallback: () => void = () => {};

  /** Internal storage for idPrefix */
  protected rawIdPrefix: string = "";

  /** Plain string property bound in template [id]="effectiveId" (zero function or CD overhead) */
  public effectiveId: string = "";

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
    this.rawIdPrefix = prefix || "";
    this.configureId();
  }
  get idPrefix(): string {
    return this.rawIdPrefix;
  }

  public configureId(): void {
    const rawId = (this as any).rawInputId || (this as any).inputId;
    this.effectiveId =
      this.rawIdPrefix && rawId ? `${this.rawIdPrefix}_${rawId}` : rawId || "";
  }

  /**
   * Shared control value. Assigning this input follows the existing change/touch callback behavior; Angular Forms writes use writeValue.
   * @type T | null
   */
  @Input()
  get value(): T | null {
    return this._value;
  }

  /** Setter for internal value that automatically notifies the form control */
  set value(val: T | null) {
    if (val !== this._value) {
      this._value = val;
      this.onChangeCallback(val);
      this.onTouchedCallback();
      if (this.cdr) {
        this.cdr.markForCheck();
      }
    }
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
