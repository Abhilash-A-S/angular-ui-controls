# Angular UI Controls

Reusable Angular 20 controls with `ui-` selectors, Angular Forms support, and local input utilities.

**Release candidate — not yet published.** Package: `@abhilash-as/angular-ui-controls`. This build includes compatibility bindings and regression tests. It is not a claim of complete production certification.

## Run from source

Use Node.js 22.12+ and npm.

```bash
git clone --branch develop https://github.com/Abhilash-A-S/angular-ui-controls.git
cd angular-ui-controls
npm ci
npm run build
npm start
```

Open http://localhost:6006. The demo currently covers six controls.

## Install the packaged library

In an Angular 20 application, install the included tarball:

```bash
npm install /path/to/abhilash-as-angular-ui-controls-0.1.0-rc.1.tgz
```

After publication, use `npm install @abhilash-as/angular-ui-controls@next` for the candidate. The package declares its Angular Material, translation, date, selection, mentions, and editor peer dependencies. Configure a Material theme, animations and translations in the host application. Built-in icons are bundled. Consumer-supplied menu/option SVG icons require host registration. Some legacy layouts use utility CSS classes; supply equivalent styles in the host.

```ts
import { FormsModule } from '@angular/forms';
import { TextInputComponent } from '@abhilash-as/angular-ui-controls';
// Add both to your standalone component's imports.
```

```html
<ui-text-input inputId="first-name" label="First name" [(ngModel)]="firstName" />
```

Reactive Forms bindings are also supported. For use outside Angular Forms, prefer `[(value)]`. Do not bind `ngModel`, `formControl` and `value` simultaneously on one control.

## Naming and compatibility

- `value` / `valueChange` are the canonical raw-value bindings. Existing `modelValue`, `inputModelValue`, `checked`, and event bindings remain available where originally declared.
- Prefer `ui-radio-group` / `RadioGroupComponent`; `ui-radio-button` / `RadioButtonComponent` remain compatible.
- Prefer `SegmentOption` and `LanguageService`; existing exports remain available.
- Textarea focus state is `isFocused`; counters use `characterCount`, `remainingCharacters` and `shouldShowRemainingCharacters`.
- `maxLength` takes precedence over the legacy character-limit input `wordsLimit`.
- Programmatic writes no longer emit user-change notifications or mark controls touched. Focus leaving the control marks it touched.
- Number-input user edits now emit `number | null`. Password entry preserves leading spaces.
- Date controls use the Moment date adapter; existing adapter-dependent values are preserved. Search-filter values retain `{searchVal, selectVal}` for compatibility.

## Verification and packaging

```bash
npm test
npm run verify:consumer
npm run pack:library
```

`npm test` checks Prettier formatting, utility tests, library compilation, component regression tests, and the production demo build. Component tests use Angular TestBed with jsdom; they do not replace browser, keyboard, mobile, or screen-reader testing. `verify:consumer` installs the actual npm tarball in an isolated consumer and builds it without workspace TypeScript path aliases, reusing installed peer dependencies.

```bash
npm run format
npm run format:check
```

CI runs the test suite on pushes and pull requests. No script publishes automatically.

## Before a stable release

The remaining release gates are real-browser coverage for all controls (including virtual-scroll selections and editor integration), strict TypeScript/template adoption, and removal of remaining host-specific utility CSS assumptions. The rich-text editor uses CKEditor 5 version 49.1+ and loads only when used. Import `ckeditor5/ckeditor5.css` in your application styles. Set its `licenseKey` according to your CKEditor license; the default is `GPL`. Its browser integration and applicable license still need review. Third-party dependencies retain their own licenses.

Some legacy advanced-select flags and event payload names remain for compatibility; do not advertise the API as fully normalized yet. The current tests cover targeted regressions, not every input/output combination. PDF URLs are restricted to HTTP(S) and blob schemes; only supply document origins trusted by your application.

## Publish a candidate yourself

After reviewing the release gates and confirming ownership of the npm scope:

```bash
npm login
npm whoami
npm test
npm run verify:consumer
npm publish ./dist/ui-controls --access public --tag next --dry-run
npm publish ./dist/ui-controls --access public --tag next
```

Publishing is your final action. Use the `next` tag for this candidate. Promote a stable version only after completing the remaining validation.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Repository source is MIT licensed; dependency licenses are separate.
