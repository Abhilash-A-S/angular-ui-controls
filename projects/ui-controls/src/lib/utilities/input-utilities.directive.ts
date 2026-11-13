import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { MatTooltip, TooltipPosition } from '@angular/material/tooltip';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { clampInput, normalizeInput } from './input-rules';

/** Normalizes text/numeric input before Angular Forms receives the bubbling input event. */
@Directive({ selector: '[uiInputRules]', standalone: true })
export class InputRulesDirective implements OnInit, OnDestroy {
  @Input() inputType: 'text' | 'number' | 'percentage' | 'integers' = 'text';
  @Input() onlyAlphabets = false;
  @Input() maxDigits?: number;
  @Input() minValue?: number;
  @Input() maxValue?: number;
  @Input() allowDecimal?: boolean;
  @Input() decimalPlaces?: number;
  @Input() allowNegative = false;
  private readonly element = inject<ElementRef<HTMLInputElement>>(ElementRef).nativeElement;
  private readonly normalize = (event: Event) => {
    if ((event as InputEvent).isComposing) return;
    this.element.value = normalizeInput(this.element.value, this);
  };
  ngOnInit(): void {
    this.element.addEventListener('input', this.normalize, true);
  }
  ngOnDestroy(): void {
    this.element.removeEventListener('input', this.normalize, true);
  }
  @HostListener('blur') clamp(): void {
    const next = clampInput(this.element.value, this);
    if (next !== this.element.value) {
      this.element.value = next;
      this.element.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}

/** Removes leading whitespace from typing and paste; preserves whitespace inside the value. */
@Directive({ selector: '[uiTrimLeadingSpace]', standalone: true })
export class TrimLeadingSpaceDirective implements OnInit, OnDestroy {
  private readonly element = inject<ElementRef<HTMLInputElement>>(ElementRef).nativeElement;
  private readonly trim = (e: Event) => {
    if (!(e as InputEvent).isComposing) this.element.value = this.element.value.replace(/^\s+/, '');
  };
  ngOnInit(): void {
    this.element.addEventListener('input', this.trim, true);
  }
  ngOnDestroy(): void {
    this.element.removeEventListener('input', this.trim, true);
  }
}

/** Limits the hour/minute fields to the configured count of decimal digits. */
@Directive({ selector: '[uiDigitLimit]', standalone: true })
export class DigitLimitDirective implements OnInit, OnDestroy {
  @Input() uiDigitLimit: number | string = 2;
  private readonly element = inject<ElementRef<HTMLInputElement>>(ElementRef).nativeElement;
  private readonly normalize = () => {
    const limit = Number(this.uiDigitLimit);
    const digits = this.element.value.replace(/\D/g, '');
    this.element.value = Number.isFinite(limit) && limit > 0 ? digits.slice(0, limit) : digits;
  };
  ngOnInit(): void {
    this.element.addEventListener('input', this.normalize, true);
  }
  ngOnDestroy(): void {
    this.element.removeEventListener('input', this.normalize, true);
  }
}

/** Enables Arabic keyboard-layout substitution for Latin key presses; existing Arabic and IME input pass through. */
@Directive({ selector: '[uiArabicInput]', standalone: true })
export class ArabicInputDirective {
  @Input() isEnabledArabicText = false;
  private readonly element =
    inject<ElementRef<HTMLInputElement | HTMLTextAreaElement>>(ElementRef).nativeElement;
  private readonly keys: Record<string, string> = {
    q: 'ض',
    w: 'ص',
    e: 'ث',
    r: 'ق',
    t: 'ف',
    y: 'غ',
    u: 'ع',
    i: 'ه',
    o: 'خ',
    p: 'ح',
    '[': 'ج',
    ']': 'د',
    a: 'ش',
    s: 'س',
    d: 'ي',
    f: 'ب',
    g: 'ل',
    h: 'ا',
    j: 'ت',
    k: 'ن',
    l: 'م',
    ';': 'ك',
    "'": 'ط',
    z: 'ئ',
    x: 'ء',
    c: 'ؤ',
    v: 'ر',
    b: 'لا',
    n: 'ى',
    m: 'ة',
    ',': 'و',
    '.': 'ز',
    '/': 'ظ',
  };
  @HostListener('keydown', ['$event']) convert(event: KeyboardEvent): void {
    if (
      !this.isEnabledArabicText ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      event.shiftKey ||
      event.isComposing ||
      this.element.readOnly ||
      this.element.disabled
    )
      return;
    const replacement = this.keys[event.key];
    if (!replacement) return;
    const start = this.element.selectionStart,
      end = this.element.selectionEnd;
    if (start === null || end === null) return;
    const next = this.element.value.slice(0, start) + replacement + this.element.value.slice(end);
    event.preventDefault();
    if (this.element.maxLength >= 0 && next.length > this.element.maxLength) return;
    this.element.value = next;
    this.element.setSelectionRange(start + replacement.length, start + replacement.length);
    this.element.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

/** Shows a Material tooltip only when the host text overflows its rendered box. */
@Directive({
  selector: '[uiEllipsisTooltip]',
  standalone: true,
  hostDirectives: [MatTooltip],
})
export class EllipsisTooltipDirective {
  @Input() uiEllipsisTooltip: unknown = '';
  @Input() tooltipPosition: TooltipPosition = 'above';
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly tooltip = inject(MatTooltip);
  @HostListener('mouseenter') @HostListener('focusin') update(): void {
    this.tooltip.message = String(this.uiEllipsisTooltip ?? '');
    this.tooltip.position = this.tooltipPosition;
    this.tooltip.disabled = !(
      this.element.scrollWidth > this.element.clientWidth ||
      this.element.scrollHeight > this.element.clientHeight
    );
  }
}

/** Repositions an open autocomplete overlay when the viewport moves or resizes. */
@Directive({ selector: '[uiAutocompletePosition]', standalone: true })
export class AutocompletePositionDirective {
  private readonly trigger = inject(MatAutocompleteTrigger, { optional: true });
  @HostListener('window:resize') @HostListener('window:scroll') update(): void {
    if (this.trigger?.panelOpen) this.trigger.updatePosition();
  }
}
