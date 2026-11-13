import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MenuItem } from '../../utilities';

@Component({
  selector: 'ui-action-menu',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatIconModule],
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ActionMenuComponent {
  /**
   * Optional heading displayed in the action menu.
   * @type string
   */
  @Input() menuTitle?: string;
  @ViewChild(MatMenu) menuRef!: MatMenu;
  /**
   * Menu entries rendered by the action menu; disabled entries are not emitted on click.
   * @default []
   * @type MenuItem[]
   */
  @Input() menuItems: MenuItem[] = [];
  /**
   * Consumer context attached to the emitted menu item as rowData.
   * @type unknown
   */
  @Input() rowData: unknown;
  /**
   * Emits the enabled menu item with rowData attached.
   * @payload MenuItem
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom menuItemClick
   */
  @Output() menuItemSelected = new EventEmitter<MenuItem>();
  /**
   * Emits when the action menu closes.
   * @payload void
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   */
  @Output() closed = new EventEmitter<void>();
  /**
   * Additional CSS class or classes applied to the existing overlay panel.
   * @default ''
   * @type string
   * @renamedFrom customPanelClass
   */
  @Input() panelClass: string = '';

  onMenuItemClick(item: MenuItem): void {
    if (!item.disabled) {
      this.menuItemSelected.emit({
        ...item,
        rowData: this.rowData,
      });
    }
  }
  onMenuClosed(): void {
    this.closed.emit();
  }
}
