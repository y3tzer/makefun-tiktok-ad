// Entry for make.fun's bounty "Bring the humans with a TikTok ad" (bring-the-humans-03), Node 22+, standard library only.
// The entry is the TikTok video VIDEO.json names. This program hands that file to the gate: it checks that the address
// is a full TikTok video address (a short share link names no video), then copies the file byte for byte.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const SOURCE = join(BOT_DIR, 'VIDEO.json');
const FULL_VIDEO_ADDRESS = /^https:\/\/www\.tiktok\.com\/@[A-Za-z0-9._]+\/video\/\d+$/;
const SHORT_SHARE_LINK = /^https?:\/\/(vm\.tiktok\.com|vt\.tiktok\.com|(www\.)?tiktok\.com\/t)\//;

// Says what is wrong with an address in words the person who posted the video can act on.
function whyRefused(url: string): string {
  if (url.includes('<handle>') || url.includes('<id>')) return 'it is still the placeholder: put the posted video\'s address in';
  if (SHORT_SHARE_LINK.test(url)) return 'it is a short share link: open it in a browser and copy the address it lands on';
  if (url.includes('?') || url.includes('#')) return 'drop everything from the "?" or "#" on';
  return 'it is not a TikTok video address';
}

// Throws unless the file names a full TikTok video address. Success prints nothing, as the run contract asks.
function videoAddress(file: string): string {
  const parsed: unknown = JSON.parse(readFileSync(file, 'utf8'));
  const url = (parsed as { url?: unknown } | null)?.url;
  if (typeof url !== 'string') throw new Error('it holds no "url" string');
  if (!FULL_VIDEO_ADDRESS.test(url)) {
    throw new Error(`"${url}" is not a full address, https://www.tiktok.com/@<handle>/video/<id> (${whyRefused(url)})`);
  }
  return url;
}

try {
  videoAddress(SOURCE);
  mkdirSync(OUTPUT_DIR, { recursive: true });
  copyFileSync(SOURCE, join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(`VIDEO.json could not be handed in from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
