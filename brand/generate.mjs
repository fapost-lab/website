// Generates the FaPost mark variants as SVG from one geometry. The SVG files next
// to this script are its output; change the geometry or colours here, not there.
// Usage: node brand/generate.mjs brand
import { writeFileSync, mkdirSync } from 'node:fs';

const out = process.argv[2] ?? '.';
mkdirSync(out, { recursive: true });

// Geometry on a 512 grid. The graph (two lines, three nodes) is cut out of the
// letter with a halo, then drawn on top: the cut works on any background.
const G = {
  top: 'M150 252 C150 168 210 112 294 112 H414 L388 160 C379 176 364 184 346 184 H298 C224 184 170 206 150 252 Z',
  middle: 'M246 298 C246 264 270 242 304 242 H394 L370 282 C362 294 350 298 336 298 Z',
  stem: 'M150 270 C164 252 188 244 214 244 V340 C214 380 186 410 150 410 Z',
  // Lines stop at the rim of a hollow node, so its centre stays empty.
  link: 'M226 242 C226 220 252 204 288 204 C300 204 310 201 317 196',
  drop: 'M226 282 V340',
  nodes: [
    { x: 226, y: 262, hollow: true },
    { x: 330, y: 182, hollow: true },
    { x: 226, y: 340, hollow: false },
  ],
  line: 10,
  r: 14,
  gap: 9,
};

// Optical centre: the letter's box is 150..414 × 112..410; its weight sits in the
// stem, so it moves a little right of the geometric centre.
const dx = 256 - (150 + 414) / 2 + 8;
const dy = 256 - (112 + 410) / 2;

function mark({ top, middle, stem, graph, ground, scale = 1 }) {
  const halo = G.line + G.gap * 2;
  const nodeHalo = G.r + G.line / 2 + G.gap;
  const nodes = G.nodes
    .map((n) =>
      n.hollow
        ? `<circle cx="${n.x}" cy="${n.y}" r="${G.r}" fill="none" stroke="${graph}" stroke-width="${G.line}"/>`
        : `<circle cx="${n.x}" cy="${n.y}" r="${G.r + G.line / 2}" fill="${graph}"/>`,
    )
    .join('');
  const cut = G.nodes.map((n) => `<circle cx="${n.x}" cy="${n.y}" r="${nodeHalo}" fill="#000"/>`).join('');

  return `
  ${ground ?? ''}
  <mask id="cut" maskUnits="userSpaceOnUse" x="-512" y="-512" width="1536" height="1536">
    <rect x="-512" y="-512" width="1536" height="1536" fill="#fff"/>
    <g transform="translate(${dx} ${dy})">
      <path d="${G.link}" fill="none" stroke="#000" stroke-width="${halo}" stroke-linecap="round"/>
      <path d="${G.drop}" fill="none" stroke="#000" stroke-width="${halo}" stroke-linecap="round"/>
      ${cut}
    </g>
  </mask>
  <g transform="translate(256 256) scale(${scale}) translate(-256 -256)">
  <g mask="url(#cut)">
    <g transform="translate(${dx} ${dy})">
      <path d="${G.top}" fill="${top}"/>
      <path d="${G.middle}" fill="${middle}"/>
      <path d="${G.stem}" fill="${stem}"/>
    </g>
  </g>
  <g transform="translate(${dx} ${dy})">
    <path d="${G.link}" fill="none" stroke="${graph}" stroke-width="${G.line}" stroke-linecap="round"/>
    <path d="${G.drop}" fill="none" stroke="${graph}" stroke-width="${G.line}" stroke-linecap="round"/>
    ${nodes}
  </g>
  </g>`;
}

const svg = (body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="${title}">${body}\n</svg>\n`;

// The application's palette (Warm Minimal, @fapost/ui tokens.css).
const C = {
  stone: '#1c1917',
  paper: '#f7f6f4',
  sage: '#5a6e58',
  sageLight: '#8fa68c',
  sageMist: '#c9d3c7',
};

const variants = {
  // Colour on the stone badge: favicons, avatars, social images.
  'fapost-mark-badge': mark({
    ground: `<circle cx="256" cy="256" r="256" fill="${C.stone}"/>`,
    scale: 1.12,
    top: C.paper,
    middle: C.sageMist,
    stem: C.sageLight,
    graph: C.paper,
  }),
  // Colour, no ground: on light backgrounds.
  'fapost-mark-on-light': mark({ top: C.stone, middle: C.sage, stem: C.sage, graph: C.stone }),
  // Colour, no ground: on dark backgrounds.
  'fapost-mark-on-dark': mark({ top: C.paper, middle: C.sageMist, stem: C.sageLight, graph: C.paper }),
  // One colour.
  'fapost-mark-black': mark({ top: '#000', middle: '#000', stem: '#000', graph: '#000' }),
  'fapost-mark-white': mark({ top: '#fff', middle: '#fff', stem: '#fff', graph: '#fff' }),
};

for (const [name, body] of Object.entries(variants)) {
  writeFileSync(`${out}/${name}.svg`, svg(body, 'FaPost'));
}
console.log(Object.keys(variants).join('\n'));
