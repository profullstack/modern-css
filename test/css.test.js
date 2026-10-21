import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
const strip = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');
const css = strip(read('modern.css'));
const tw = strip(read('tailwind.css'));
const fn = strip(read('functions.css'));
const pkg = JSON.parse(read('package.json'));

test('braces balance in every stylesheet', () => {
  for (const [name, src] of [['modern.css', css], ['tailwind.css', tw], ['functions.css', fn]]) {
    let depth = 0;
    for (const ch of src) {
      if (ch === '{') depth++;
      if (ch === '}') depth--;
      assert.ok(depth >= 0, `${name}: closing brace before its opening one`);
    }
    assert.equal(depth, 0, `${name}: unclosed block`);
  }
});

test('every rule sits inside the components layer', () => {
  const trimmed = css.trim().replace(/^@import "\.\/functions\.css";\s*/, '');
  assert.ok(trimmed.startsWith('@layer components {'), 'modern.css must open with the functions import, then @layer components');
  let depth = 0;
  let topLevel = 0;
  for (const ch of trimmed) {
    if (ch === '{' && depth++ === 0) topLevel++;
    if (ch === '}') depth--;
  }
  assert.equal(topLevel, 1, 'only the layer block may sit at the top level');
});

test('ships the documented classes', () => {
  for (const cls of [
    'subgrid-cards', 'subgrid-card', 'squircle', 'corner-bevel', 'corner-notch', 'corner-scoop',
    'stuck-header', 'stuck-header-bar', 'grid-rules', 'accordion', 'reading-flow-grid', 'reading-flow-flex',
  ]) {
    assert.match(css, new RegExp(`\\.${cls}\\b`), `.${cls} missing`);
  }
});

test('subgrid has a fallback for browsers without it', () => {
  assert.match(css, /@supports not \(grid-template-rows: subgrid\)/);
});

test('accordion animation is gated and respects reduced motion', () => {
  assert.match(css, /@supports \(interpolate-size: allow-keywords\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test('never uses inherit(), which no browser ships', () => {
  assert.doesNotMatch(css, /\binherit\(/);
});

test('tailwind entry imports the stylesheet and adds the stuck variant', () => {
  assert.match(tw, /@import "\.\/modern\.css";/);
  assert.match(tw, /@custom-variant stuck \(@container scroll-state\(stuck: top\)\);/);
});

test('every exported file exists and is packed', () => {
  const files = new Set(pkg.files);
  for (const target of Object.values(pkg.exports)) {
    const f = target.replace(/^\.\//, '');
    if (f !== 'package.json') assert.ok(files.has(f), `${f} exported but not in files`);
    read(f);
  }
});

test('functions.css defines the documented typed functions inside the layer', () => {
  assert.ok(fn.trim().startsWith('@layer components {'));
  for (const name of ['alpha', 'tint', 'shade', 'inner-radius', 'fluid']) {
    assert.match(fn, new RegExp(`@function --${name}\\([^)]*\\) returns <[a-z]+>`), `--${name} missing or untyped`);
  }
  assert.match(css, /^\s*@import "\.\/functions\.css";/, 'modern.css must pull in functions.css first');
});
