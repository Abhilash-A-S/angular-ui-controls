import { JSDOM, VirtualConsole } from 'jsdom';
const virtualConsole = new VirtualConsole();
virtualConsole.on('jsdomError', (error) => {
  if (error.type !== 'css parsing') console.error(error.message);
});
const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
  virtualConsole,
});
for (const key of [
  'window',
  'document',
  'navigator',
  'self',
  'Node',
  'Element',
  'HTMLElement',
  'HTMLInputElement',
  'HTMLTextAreaElement',
  'Document',
  'Event',
  'FocusEvent',
  'MouseEvent',
  'KeyboardEvent',
  'CustomEvent',
  'DOMParser',
  'MutationObserver',
  'File',
  'FileList',
  'FileReader',
  'getComputedStyle',
]) {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    value: key === 'self' ? dom.window : dom.window[key],
  });
}
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
await import('@angular/compiler');
const { TestBed } = await import('@angular/core/testing');
const { BrowserDynamicTestingModule, platformBrowserDynamicTesting } = await import(
  '@angular/platform-browser-dynamic/testing'
);
TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
