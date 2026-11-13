import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[uiPreventClipboard]',
  standalone: true,
})
export class PreventClipboardDirective {
  /**
   * Clipboard restriction flag retained with its current wiring. The local uiPreventClipboard directive blocks copy, cut, and paste when true.
   * @default false
   */
  @Input() preventCopyPasteCut = false;
  constructor() {}
  @HostListener('paste', ['$event']) blockPaste(changeEvent: KeyboardEvent) {
    if (this.preventCopyPasteCut) {
      changeEvent.preventDefault();
    }
  }

  @HostListener('copy', ['$event']) blockCopy(changeEvent: KeyboardEvent) {
    if (this.preventCopyPasteCut) {
      changeEvent.preventDefault();
    }
  }

  @HostListener('cut', ['$event']) blockCut(changeEvent: KeyboardEvent) {
    if (this.preventCopyPasteCut) {
      changeEvent.preventDefault();
    }
  }
}
