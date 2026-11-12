# Angular UI Controls

Reusable Angular form components with `ui-` selectors, Angular Forms integration, and local utilities. This development workspace contains 23 original controls and an additional highlighted-textarea building block.

**Status:** development preview; not published to npm. The proposed package name is `@abhilash-as/angular-ui-controls`. Publishing requires access to that npm scope.

## Clone and run

Use Node.js 22.12+ (or a version supported by Angular 20) and npm.

```bash
git clone https://github.com/Abhilash-A-S/angular-ui-controls.git
cd angular-ui-controls
npm ci
npm run build
npm start
```

Open http://localhost:6006. The demo imports the built package, so build the library before starting it. The demo currently showcases six controls; it is not a complete component catalogue.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run build` | Build the library into `dist/ui-controls` |
| `npm run build:demo` | Build the demo against the built library |
| `npm test` | Run utility tests and both builds |
| `npm run pack:library` | Build and create a local installable npm tarball |

## Try the package before publication

```bash
npm run pack:library
```

In a separate Angular 20 application, install the resulting `.tgz` file using its local path. The packaged manifest declares peer dependencies. Set up Angular Material theming, animations, HTTP and translations in your host app. Registered SVG icons and any application-specific utility CSS are also host responsibilities; see `DEPENDENCY_REPLACEMENTS.md`.

```ts
import { TextInputComponent } from '@abhilash-as/angular-ui-controls';
// Include TextInputComponent and FormsModule in your standalone component's imports.
```

```html
<ui-text-input
  inputId="first-name"
  label="First name"
  [(ngModel)]="firstName"
  (enterPressed)="submit()">
</ui-text-input>
```

After the package has actually been published, it can be installed by package name. No npm or GitHub publishing is performed by the scripts in this workspace.

## Compatibility and scope

Dependency ranges follow the supplied Angular 20.2+ manifest; `package-lock.json` records the versions used for this build. TypeScript is 5.9.x. Angular versions outside the declared peer ranges have not been verified.

All 338 original input declarations and 136 original output declarations remain in the renamed components/directives. Local replacement utilities add their own APIs. Event payload keys remain as previously supplied. The replacement utilities are new implementations, not a recovered copy of the missing utility dependency.

Review [DEPENDENCY_REPLACEMENTS.md](DEPENDENCY_REPLACEMENTS.md) for behavioral differences and [VALIDATION.md](VALIDATION.md) for checks and limitations. Existing issues from the initial review, including shared touch handling and language initialization, are not all resolved by this dependency-removal work.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Original code in this repository is offered under the MIT license; third-party dependencies retain their own licenses. Review the rich-text editor dependency and its configuration before publishing an application that uses it.
