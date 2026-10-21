# @profullstack/modern-css

Modern CSS for every Profullstack site: subgrid cards, squircle corners, stuck
headers, grid gap rules, `height: auto` accordions and `reading-flow`, as opt-in
classes.

Every class is progressive enhancement. A browser without the feature gets the
plain layout (rounded corners, a header that sticks without changing look, a
`<details>` that snaps open), never a broken one. All rules live in the
`components` layer, so your own CSS and Tailwind utilities always win.

```sh
npm install @profullstack/modern-css
```

## Use it

Plain CSS, CSS modules or Next.js (`app/layout.tsx`):

```js
import '@profullstack/modern-css';
```

Tailwind 4, after `@import "tailwindcss";`:

```css
@import "@profullstack/modern-css/tailwind.css";
```

That also adds a `stuck:` variant (`stuck:bg-white`, `stuck:shadow`) for anything
inside a `.stuck-header`.

## Classes

| Class | What it does | Without support |
|---|---|---|
| `.subgrid-cards` + `.subgrid-card` | Auto-fill card grid whose rows line up across cards. Set `--card-rows` to the number of children in each card. | Cards stack their children in a flex column |
| `.squircle`, `.corner-bevel`, `.corner-notch`, `.corner-scoop` | `corner-shape` on top of your `border-radius` | Ordinary rounded corners |
| `.stuck-header` + `.stuck-header-bar` | Sticky header whose inner bar gains a background and shadow once it is stuck | Sticks, no change of look |
| `.grid-rules` | Lines between grid or flex cells, no extra DOM | Plain gap |
| `details.accordion` | Animates open and closed to `height: auto` | Snaps open |
| `.reading-flow-grid`, `.reading-flow-flex` | Tab order follows the visual order | DOM order |

```html
<ul class="subgrid-cards" style="--card-rows: 3">
  <li class="subgrid-card squircle">
    <h3>Starter</h3>
    <p>Short description</p>
    <a href="/buy">Buy</a>
  </li>
  <!-- ... -->
</ul>

<header class="stuck-header">
  <div class="stuck-header-bar">...</div>
</header>
```

Custom properties: `--card-min` (16rem), `--cards-gap` (1.5rem), `--card-gap`
(0.5rem), `--stuck-bg` (Canvas), `--stuck-shadow`, `--stuck-z` (50), `--rule`,
`--accordion-speed` (0.25s).

## Support (October 2026)

Subgrid works in every current browser. `corner-shape`, scroll-state queries,
gap decorations, `interpolate-size` and `reading-flow` are Chrome and Edge only
for now, which is why each falls back as shown above.

Not included: `@function`, `border-shape`, anchored container queries and
scroll-triggered animations are page-specific or still moving, and `inherit()`
ships in no browser.

## License

MIT
