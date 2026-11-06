# DESIGN.md — Hogwarts Dehradun Design System

> **Aesthetic Direction**: *Atmospheric Gothic & Gilded Himalayan Manuscript*.
> A synthesis of Victorian-Gothic Hogwarts architecture, Indo-Saracenic Lucknow railway heritage, and rich gilded manuscript cartography.

---

## 1. Core Philosophy & 80/20 Rule

- **80% Proven Ergonomics**:
  - Instant scanability with standard keyboard bindings (`WASD`, `Q-Z`, `1-8`, `Esc`).
  - Seamless responsive layout functioning smoothly from 375px mobile screens up to ultra-wide 4K displays.
  - Rock-solid contrast meeting WCAG AA standards (minimum 4.5:1 for body and data).
  - High-performance, GPU-accelerated CSS transitions with zero layout shifts.

- **20% Distinctive Soul**:
  - **The Living Sanctum**: Interactive 3D miniature artifact stage with smooth inertia drag and golden runic pedestal.
  - **Illuminated Parchment & Golden Inlay**: Deep midnight slate (`#0a0c10`) accented by genuine aged vellum (`#f7f0e3`) and embossed gold leaf (`#d4af37`).
  - **Bilingual Cultural Fusion**: Authentic Devanagari typography (`Yatra One`, `Rozha One`, `Mukta`) seamlessly interwoven with classical serif typography (`Cinzel`, `Rozha One`).
  - **Floating Lumos Motes**: Procedural canvas particles floating like warm embers from floating candles.

---

## 2. Design Tokens & Palette Architecture

```css
:root {
  /* Surfaces & Hierarchy */
  --bg-deep: #080a0f;          /* Midnight Castle Void */
  --bg-surface: #10141f;       /* Shivalik Night Slate */
  --bg-raised: #181e2e;        /* Gothic Stone Wall */
  --bg-parchment: #f7f0e3;     /* Ancient Acceptance Letter Vellum */
  --bg-parchment-2: #ede2cb;   /* Weathered Map Paper */

  /* Gold & Lumos Accents */
  --gold-primary: #d4af37;     /* Hogwarts Gilded Trim */
  --gold-glow: #f59e0b;        /* Floating Candle Flame */
  --gold-bright: #fde68a;      /* Lumos Starburst */
  --gold-border: rgba(212, 175, 55, 0.35);

  /* House Colors */
  --gryffindor-scarlet: #8b151b;
  --gryffindor-gold: #f7b32b;
  --ravenclaw-blue: #123456;
  --ravenclaw-bronze: #8e6232;
  --slytherin-green: #1a472a;
  --slytherin-silver: #a3a99f;
  --hufflepuff-yellow: #d89f18;
  --hufflepuff-black: #262223;

  /* Typography */
  --font-display-deva: 'Yatra One', 'Rozha One', serif;
  --font-display-latin: 'Rozha One', 'Cinzel', serif;
  --font-sans: 'Mukta', system-ui, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Elevation & Shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.55);
  --shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.7);
  --shadow-gold: 0 0 20px rgba(212, 175, 55, 0.25);

  /* Border Radii */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 14px;
  --radius-full: 9999px;
}
```

---

## 3. The 7 Anti-AI-Slop Craft Rules

1. **No Cliché Tailwind Indigo**: We strictly use castle midnight `#080a0f`, aged gold `#d4af37`, and warm candlelight `#f59e0b`.
2. **No Purple-Blue Gradients**: Surface backgrounds use atmospheric darkness with authentic parchment texture and vignette depth.
3. **No Overlapping Text**: All Devanagari and Latin headers have calculated line-heights, flex wrapping, and dedicated container bounds.
4. **No Emojis as Structural UI**: We use authentic monoline SVGs, heraldic house shields, and clear keyboard badges.
5. **No Cliché Border-Left Cards**: Cards use refined 1px all-around borders with inlaid golden corner brackets.
6. **No Filler Text or Fake Metrics**: Real Harry Potter lore, precise coordinates in Dehradun (30.3165° N, 78.0322° E), and actual in-game features.
7. **Authentic Domain Microcopy**: "Board 5972 Express", "Wander Grounds", "Chant Incantation", "Platform 9¾ Gateway".

---

## 4. UI Layer Architecture

- **Layer 0**: WebGL Open-World Scene (`<canvas id="c">`)
- **Layer 10**: Interactive Destination Sanctum (`#card`)
- **Layer 20**: The Grand Hogwarts Home & Realm Explorer (`#home` + `#home-c` + `#particles-canvas`)
- **Layer 30**: HUD Overlays (Places menu, Music box, Spellbar, Navigation Coordinates)
- **Layer 40**: Pause Modal & World Map (`#pause`)
