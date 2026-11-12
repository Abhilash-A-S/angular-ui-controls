# Contributing

1. Create a feature branch.
2. Install dependencies with `npm ci`.
3. Update source under `projects/ui-controls/src/lib` and add a focused regression test when changing behavior.
4. Run `npm test` and check affected controls in the demo.
5. Describe the change, compatibility impact, and validation in your pull request.

Preserve separate HTML, SCSS, and TypeScript files for components. Use `ui-` component selectors and `ui`-prefixed attribute directives. Document inputs and outputs. Do not remove or merge public bindings without a documented migration.

The existing component creation specs are retained, but no Angular unit-test runner has been configured for them yet. `npm test` currently covers local utility tests plus compilation of the library and demo.
