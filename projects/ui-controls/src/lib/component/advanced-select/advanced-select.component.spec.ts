import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedSelectComponent } from './advanced-select.component';

describe('SelectSearchComponent', () => {
  let component: AdvancedSelectComponent;
  let fixture: ComponentFixture<AdvancedSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
