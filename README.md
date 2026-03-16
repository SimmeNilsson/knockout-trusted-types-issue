# knockout-trusted-types-issue

Demonstrates a runtime crash when using Knockout 3.5.2 with Vite.

## Root cause

The failure involves a chain of three interacting behaviours:

1. **ES modules are always strict.** Vite serves the entry point as
   `<script type="module">`, which puts all code — including any `eval()`
   calls made from within that module — into strict mode.

2. **Trusted Types switches Knockout from `new Function()` to `eval()`.**
   When the browser exposes the `trustedTypes` global (Chrome, Edge),
   Knockout automatically creates a Trusted Types policy and uses `eval()`
   instead of `new Function()` to evaluate binding strings. This is noted
   in Knockout's own source:

    > _"new Function() doesn't accept TrustedScript in Chrome, so use eval instead."_
    > (`createBindingsStringEvaluator`, knockout-latest.debug.js)

3. **`eval()` in strict mode inherits strict mode; `new Function()` does not.**
   Knockout's binding evaluator builds a function body that uses `with`
   statements (e.g. `with($context){with($data||{}){return{...}}}`).
   `with` is illegal in strict mode, so the `eval()` call crashes.

## Error message

```
strict mode code may not contain 'with' statements
```

## Steps to reproduce

1. Use Knockout in a Vite project (`<script type="module">`)
2. Run in Chrome or Edge (browsers that expose `trustedTypes`)
3. Apply any Knockout binding (e.g. `data-bind="text: value"`)

The crash occurs in any browser that exposes the `trustedTypes` global —
Chrome, Edge, and Firefox (since v128).

## Versions

- knockout: 3.5.2
- vite: ^8.0.0
