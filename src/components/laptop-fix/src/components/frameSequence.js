// Frame sequence store.
// Downloads compressed WebP frames for both clips, but only keeps a small window
// of frames DECODED around the playhead. Decoding everything at once would use
// hundreds of MB and crash phones.

const CLIPS = ['clip1', 'clip2'];
export const FRAMES = 120; // frames per clip

export const IS_MOBILE =
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: coarse), (max-width: 820px)').matches;

const SET = IS_MOBILE ? 'mobile' : 'desktop';
const WINDOW = IS_MOBILE ? 30 : 24;        // decoded frames kept either side of the playhead
const CONCURRENCY = IS_MOBILE ? 4 : 6;     // parallel downloads

const blobs = CLIPS.map(() => new Array(FRAMES).fill(null));
const bitmaps = CLIPS.map(() => new Map());
const pending = CLIPS.map(() => new Map());

const urlFor = (c, i) =>
  `/frames/${CLIPS[c]}/${SET}/frame_${String(i + 1).padStart(4, '0')}.webp`;

async function fetchBlob(c, i) {
  try {
    const res = await fetch(urlFor(c, i));
    if (res.ok) blobs[c][i] = await res.blob();
  } catch (e) {
    /* a missing frame must never block the site: the nearest frame is shown instead */
  }
}

let job = null;

// Starts downloading (once). `ready` resolves when the opening frames are in,
// the rest keeps downloading in the background.
export function startPreload() {
  if (job) return job;

  const order = [];
  const seen = new Set();
  const add = (c, i) => {
    const k = c * FRAMES + i;
    if (!seen.has(k)) { seen.add(k); order.push([c, i]); }
  };

  for (let i = 0; i < 16; i++) add(0, i);   // opening of clip 1
  add(1, 0);                                 // first frame of clip 2
  const CRITICAL = order.length;
  for (let i = 0; i < FRAMES; i += 6) add(0, i);  // sparse pass so fast scrolling never shows blank
  for (let i = 0; i < FRAMES; i += 6) add(1, i);
  for (let c = 0; c < CLIPS.length; c++) for (let i = 0; i < FRAMES; i++) add(c, i); // fill in the rest

  let next = 0;
  let criticalLeft = CRITICAL;
  let resolveReady;
  const ready = new Promise((r) => { resolveReady = r; });

  const worker = async () => {
    while (next < order.length) {
      const idx = next++;
      const [c, i] = order[idx];
      await fetchBlob(c, i);
      if (idx < CRITICAL && --criticalLeft === 0) resolveReady();
    }
  };
  for (let w = 0; w < CONCURRENCY; w++) worker();

  job = { ready };
  return job;
}

export const hasBlob = (c, i) => !!blobs[c][i];
export const peek = (c, i) => bitmaps[c].get(i) || null;

export function decode(c, i) {
  if (bitmaps[c].has(i)) return Promise.resolve(bitmaps[c].get(i));
  if (pending[c].has(i)) return pending[c].get(i);
  const blob = blobs[c][i];
  if (!blob) return Promise.resolve(null);
  const p = createImageBitmap(blob)
    .then((bmp) => { bitmaps[c].set(i, bmp); pending[c].delete(i); return bmp; })
    .catch(() => { pending[c].delete(i); return null; });
  pending[c].set(i, p);
  return p;
}

// closest decoded frame to index i (used while the exact one is still decoding)
export function nearest(c, i) {
  const m = bitmaps[c];
  for (let d = 0; d < FRAMES; d++) {
    const a = m.get(i - d);
    if (a) return { index: i - d, bmp: a };
    const b = m.get(i + d);
    if (b) return { index: i + d, bmp: b };
  }
  return null;
}

// free decoded frames far from the playhead
export function evict(c, center) {
  for (const [i, bmp] of bitmaps[c]) {
    if (Math.abs(i - center) > WINDOW) { bmp.close(); bitmaps[c].delete(i); }
  }
}
