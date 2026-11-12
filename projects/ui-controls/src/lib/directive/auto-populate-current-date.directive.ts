import { Directive, HostListener, Input } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
  selector: "[uiAutoPopulateCurrentDate]",
  standalone: true,
})
export class AutoPopulateCurrentDateDirective {
  /**
   * Enables the Shift+R shortcut that writes the current date into the attached form control.
   * @default true
   * @renamedFrom yarAutopopulateCurrentDate
   */
  @Input("uiAutoPopulateCurrentDate") enabled = true;

  constructor(private inputForm: NgControl) {}
  @HostListener("keydown.Shift.r", ["$event"])
  autoPopulateCurrentDate(keyboardEvent: any) {
    if (this.enabled) {
      keyboardEvent.preventDefault();
      if (this.inputForm?.control) {
        this.inputForm.control.setValue(new Date());
        this.inputForm.control.markAllAsTouched();
      }
    }
  }
}
