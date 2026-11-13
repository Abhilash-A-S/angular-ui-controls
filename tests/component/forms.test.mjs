import './setup.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import * as ui from '../../dist/ui-controls/fesm2022/abhilash-as-angular-ui-controls.mjs';

function create(Type, inputs = {}) {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [Type],
    providers: [
      provideZonelessChangeDetection(),
      provideNoopAnimations(),
      provideHttpClient(),
      provideTranslateService(),
    ],
  });
  const fixture = TestBed.createComponent(Type);
  for (const [name, value] of Object.entries(inputs)) fixture.componentRef.setInput(name, value);
  return fixture;
}
for (const name of [
  'TextInput',
  'NumberInput',
  'PasswordInput',
  'SearchInput',
  'Checkbox',
  'RadioButton',
  'SlideToggle',
  'SelectionList',
  'SearchableSelect',
  'AdvancedSelect',
  'TextArea',
  'DatePicker',
  'DateRangePicker',
  'DateTimePicker',
  'TimePicker',
  'TimeInput',
  'FileUpload',
  'SegmentedControl',
  'Autocomplete',
]) {
  test(`${name}: programmatic writes do not notify or touch the parent form`, () => {
    const fixture = create(ui[`${name}Component`]);
    const control = fixture.componentInstance;
    let changes = 0,
      touches = 0,
      outputs = 0;
    control.registerOnChange(() => changes++);
    control.registerOnTouched(() => touches++);
    control.valueChange.subscribe(() => outputs++);
    control.writeValue(null);
    control.value = null;
    assert.equal(changes, 0);
    assert.equal(touches, 0);
    assert.equal(outputs, 0);
    control.commitValue(null);
    assert.equal(changes, 1);
    assert.equal(outputs, 1);
    assert.equal(touches, 0);
    control.handleFocusOut(new FocusEvent('focusout'));
    assert.equal(touches, 1);
    control.setDisabledState(true);
    control.commitValue(null);
    assert.equal(changes, 1);
    fixture.destroy();
  });
}
test('text input: an actual DOM edit commits once and blur touches', async () => {
  const fixture = create(ui.TextInputComponent, { inputId: 'customer:name', value: 'Initial' });
  const control = fixture.componentInstance;
  let changes = [],
    touches = 0;
  control.registerOnChange((value) => changes.push(value));
  control.registerOnTouched(() => touches++);
  fixture.detectChanges();
  await fixture.whenStable();
  const input = fixture.nativeElement.querySelector('input');
  assert.equal(input.value, 'Initial');
  input.value = 'Alice';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await fixture.whenStable();
  assert.deepEqual(changes, ['Alice']);
  assert.equal(touches, 0);
  input.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
  assert.equal(touches, 1);
});
test('number input: DOM edits emit numbers and clearing emits null', async () => {
  const fixture = create(ui.NumberInputComponent, { inputId: 'amount' });
  const values = [];
  fixture.componentInstance.registerOnChange((value) => values.push(value));
  fixture.detectChanges();
  await fixture.whenStable();
  const input = fixture.nativeElement.querySelector('input');
  input.value = '42';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await fixture.whenStable();
  input.value = '';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await fixture.whenStable();
  assert.deepEqual(values, [42, null]);
});
test('textarea: one notification per edit; counters handle empty and full values', async () => {
  const fixture = create(ui.TextAreaComponent, {
    inputId: 'notes',
    maxLength: 5,
    showCharacterCount: true,
  });
  const control = fixture.componentInstance;
  const values = [];
  control.registerOnChange((value) => values.push(value));
  fixture.detectChanges();
  await fixture.whenStable();
  assert.equal(control.characterCount, 0);
  const input = fixture.nativeElement.querySelector('textarea');
  input.value = 'hello';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await fixture.whenStable();
  assert.deepEqual(values, ['hello']);
  assert.equal(control.remainingCharacters, 0);
});
test('radio object values preserve zero, false and empty strings', () => {
  const fixture = create(ui.RadioButtonComponent);
  const control = fixture.componentInstance;
  control.valueKey = 'id';
  for (const id of [0, false, '']) {
    control.modelValue = { id };
    assert.equal(control.value, id);
  }
});
test('blocked slide toggle still accepts programmatic values', () => {
  const fixture = create(ui.SlideToggleComponent);
  const control = fixture.componentInstance;
  control.preventToggleOnClick = true;
  control.inputModelValue = true;
  assert.equal(control.value, true);
});
test('PDF rejects executable URL schemes before trusting a resource', () => {
  const fixture = create(ui.PdfViewerComponent);
  for (const url of [
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'file:///etc/passwd',
  ])
    assert.throws(() => (fixture.componentInstance.pdfUrl = url));
  assert.doesNotThrow(() => (fixture.componentInstance.pdfUrl = 'https://example.com/report.pdf'));
});
test('segmented control ignores disabled options and disabled form state', () => {
  const fixture = create(ui.SegmentedControlComponent);
  const c = fixture.componentInstance;
  c.options = [
    { label: 'A', value: 'a' },
    { label: 'B', value: 'b', disabled: true },
  ];
  c.select('a');
  c.select('b');
  assert.equal(c.value, 'a');
  c.disabled = true;
  c.select(null);
  assert.equal(c.value, 'a');
});

for (const name of ['SearchableSelect', 'AdvancedSelect']) {
  test(`${name}: select-all keeps a real option whose value is All`, () => {
    const fixture = create(ui[`${name}Component`]);
    const c = fixture.componentInstance;
    c.multiple = true;
    c.options = ['All', 'Other'];
    c.ngOnChanges({ options: { currentValue: c.options, firstChange: true } });
    const values = [];
    c.registerOnChange((value) => values.push(value));
    c.toggleSelectAll(true);
    assert.deepEqual(c.value, ['All', 'Other']);
    assert.equal(values.length, 1);
    c.toggleSelectAll(false);
    assert.deepEqual(c.value, []);
  });
}

test('file upload: selection and clearing update the canonical form value', () => {
  const fixture = create(ui.FileUploadComponent);
  const c = fixture.componentInstance;
  const file = new File(['example'], 'example.txt', { type: 'text/plain' });
  const files = {
    0: file,
    length: 1,
    *[Symbol.iterator]() {
      yield file;
    },
  };
  const input = { files, value: 'example.txt' };
  const values = [];
  c.registerOnChange((value) => values.push(value));
  c.onFileChange({ target: input });
  assert.equal(c.value, files);
  c.clearFile(new MouseEvent('click'));
  assert.equal(c.value, null);
  assert.equal(input.value, '');
  assert.deepEqual(values, [files, null]);
});
