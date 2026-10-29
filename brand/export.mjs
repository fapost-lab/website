// Exports the site's raster icons from the badge SVG. Needs sharp, which this
// repository does not install:
//   npm install --no-save sharp
//   node brand/export.mjs brand/fapost-mark-badge.svg public/assets
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
const [svgPath, dir] = process.argv.slice(2);
const svg = readFileSync(svgPath);
const r = (s) => sharp(svg, { density: 72 * Math.ceil(s / 512) * 4 }).resize(s, s);
await r(512).png({ compressionLevel: 9 }).toFile(`${dir}/logo.png`);
await r(64).png({ compressionLevel: 9 }).toFile(`${dir}/favicon.png`);
// iOS fills transparent corners with black; give the touch icon the badge's own ground.
await r(180).flatten({ background: '#1c1917' }).png({ compressionLevel: 9 }).toFile(`${dir}/icon-180.png`);
