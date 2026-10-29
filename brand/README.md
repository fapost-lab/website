# FaPost mark

The FaPost mark: an F of three parts — top arc, crossbar, stem — with a flow graph of two
lines and three nodes cut out of it. Drawn in the application's palette (Warm Minimal,
`tokens.css` of `@fapost/ui` in Core).

| File | Use |
|---|---|
| `fapost-mark-badge.svg` | On the stone circle. Favicons, avatars, social images. |
| `fapost-mark-on-light.svg` | Colour, no ground, on light backgrounds. |
| `fapost-mark-on-dark.svg` | Colour, no ground, on dark backgrounds. |
| `fapost-mark-black.svg` | One colour, black. |
| `fapost-mark-white.svg` | One colour, white. |

Colours: stone `#1c1917`, paper `#f7f6f4`, sage `#5a6e58`, light sage `#8fa68c`, sage mist
`#c9d3c7`.

The mark reads from 32 px up; at 16 px only the silhouette of the F remains.

## Changing it

The SVG files are generated. Edit the geometry or colours in `generate.mjs`, then:

```bash
node brand/generate.mjs brand
npm install --no-save sharp
node brand/export.mjs brand/fapost-mark-badge.svg public/assets
cp brand/fapost-mark-badge.svg public/assets/favicon.svg
```

`export.mjs` writes `logo.png` (512 px, also the social image), `favicon.png` (64 px) and
`icon-180.png` (the Apple touch icon, on an opaque ground).

The FaPost name and logo are covered by the
[Trademark Policy](https://github.com/fapost-lab/core/blob/main/TRADEMARK.md).
