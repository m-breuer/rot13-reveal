# @m-breuer/rot13-reveal

Client-side ROT13 obfuscation and interaction-triggered reveal utility.

ROT13 is not encryption. This library is intended to reduce trivial automated harvesting in static markup.

NPM: [@m-breuer/rot13-reveal](https://www.npmjs.com/package/@m-breuer/rot13-reveal)  
Repository: [m-breuer/rot13-reveal](https://github.com/m-breuer/rot13-reveal)

## Features

- Zero production dependencies
- Deterministic `rot13` transform
- Click-to-reveal UI mount helper
- Optional UI hardening (`user-select` and context menu blocking)
- Cleanup lifecycle (`destroy`) for SPA usage

## Requirements

- Node.js >= 24 (build/test tooling)
- Browser DOM APIs at runtime

## Install

```bash
npm install @m-breuer/rot13-reveal
```

## Quick Start

```html
<div id="contact"></div>
<script type="module">
  import { mountRot13Reveal } from "@m-breuer/rot13-reveal";

  mountRot13Reveal(document.getElementById("contact"), "hello@example.com", {
    label: "Show contact",
    mailtoAfterReveal: true
  });
</script>
```

## API

### `rot13(input: string): string`

- Transforms letters `A-Z` and `a-z`
- Preserves non-letter characters
- Symmetric: `rot13(rot13(x)) === x`

### `mountRot13Reveal(container, secretPlaintext, options?)`

```ts
mountRot13Reveal(
  container: HTMLElement,
  secretPlaintext: string,
  options?: RevealOptions,
): { destroy(): void };
```

Reveal flow:

1. ROT13-encode plaintext.
2. Render a button and output container.
3. Store encoded value in `dataset`.
4. Decode on click (optionally delayed).
5. Disable button after reveal.
6. Support cleanup through `destroy()`.

### `RevealOptions`

```ts
type RevealOptions = {
  label?: string;
  revealDelayMs?: number;
  mailtoAfterReveal?: boolean;
  hardenUi?: boolean;
  blockContextMenu?: boolean;
};
```

Defaults:

- `label`: `"Show contact"`
- `revealDelayMs`: `250`
- `mailtoAfterReveal`: `false`
- `hardenUi`: `true`
- `blockContextMenu`: `false`

## Usage

```ts
import { mountRot13Reveal } from "@m-breuer/rot13-reveal";

mountRot13Reveal(document.getElementById("contact")!, "you@example.com", {
  label: "Show email",
  mailtoAfterReveal: true,
});
```

## Build Output

`dist/`

- `index.js` (ESM)
- `index.cjs` (CommonJS)
- `index.d.ts` (types)

## Development

```bash
npm run lint
npm run test
npm run build
```

## License

MIT
