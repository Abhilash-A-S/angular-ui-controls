import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectionListComponent } from './selection-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SelectionListComponent', () => {
  let component: SelectionListComponent;
  let fixture: ComponentFixture<SelectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SelectionListComponent,
        TranslateModule.forRoot(),
        NoopAnimationsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectionListComponent);
    component = fixture.componentInstance;
    component.inputId = 'test-selection-list';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
