# 🚂 Hogwarts Dehradun: The Lucknow 9¾ Express
### 🇮🇳 3D Open-World Browser Game Inspired by Harry Potter & Courier City

> *“Tucked secretly between Platforms 9 and 10 of Lucknow Charbagh Railway Station lies the enchanted barrier to Platform 9¾. Beyond the solid red masonry, steam billows from the scarlet locomotive: The 5972 Hogwarts Express, bound for Hogwarts School of Witchcraft and Wizardry—hidden between the misty pine peaks of Dehradun.”*

---

## 🌟 Overview & Concept

**Hogwarts Dehradun** is an ultra-lightweight, 3D open-world browser game built with **Three.js** and **Vite**, taking visual and UI inspiration from [Courier City](https://github.com/shubhransh-gupta/courier-city).

- **Setting**: The story starts at **Lucknow Charbagh Railway Station (Platform 9¾)**, where the protagonist walks through the enchanted brick pillar barrier and boards the iconic scarlet **5972 Hogwarts Express**. The train journeys through the Shivalik foothills and reaches **Hogwarts Castle**, nestled between the dramatic Himalayan mountain peaks of **Dehradun**.
- **Visuals**: Cel-shaded / toon-shaded 3D diorama aesthetic with warm vintage parchment UI, bilingual Hindi (Devanagari) & English typography (`Rozha One`, `Yatra One`, `Mukta`).
- **Interactive Wand Magic**: Cast authentic spells with dynamic lighting, particle effects, sound effects, and physics interactions.
- **Ultra Lightweight**: Pure procedural geometry and zero external heavyweight 3D model files—the entire production build is only ~150 kB gzipped!

---

## 📍 Explorable Landmarks (Instant Spawn `[1-8]`)

1. **Platform 9¾ (Lucknow Charbagh)**: Red brick arches, Indo-Saracenic domes, the magical brick barrier, luggage trolley half-submerged in the wall with owl cage, and the stationed 5972 Hogwarts Express.
2. **Himalayan Viaduct & Train**: Massive curved stone aqueduct bridge crossing the mountain gorge with an animated Hogwarts Express chugging across.
3. **Castle Courtyard & Clock Tower**: Cobblestone quad courtyard with gothic cloisters, central fountain, and the towering Hogwarts Clock Tower.
4. **The Great Hall**: Gothic cathedral hall with pointed stained-glass windows and dozens of enchanted floating candles flickering overhead.
5. **Astronomy Tower Spire**: The highest point of Hogwarts with observation balcony and rotating brass armillary astrological rings.
6. **The Quidditch Pitch**: Mountain stadium with four house spectator towers (Gryffindor, Slytherin, Ravenclaw, Hufflepuff), 6 golden scoring hoops, and an active **Golden Snitch** flitting through the air!
7. **Hagrid’s Hut & Giant Pumpkin Patch**: Cozy stone cottage with timber door, smoking chimney, and interactive giant pumpkins that can be levitated into mid-air!
8. **Forbidden Deodar Forest**: Whispering Himalayan cedar grove with glowing blue mushrooms, ancient standing stone circle with runic glyphs, and drifting spirit wisps.

---

## 🪄 Wand Spells & Enchantments

| Spell | Hotkey | Effect | Description |
|---|---|---|---|
| **Lumos / Nox** | `[1]` / `[Q]` | 💡 Wand Light | Wand tip ignites with brilliant blue-white light illuminating dark halls. |
| **Expecto Patronum** | `[2]` / `[E]` | 🦌 Silver Stag | Conjures a glowing silver stag patronus that leaps forward with celestial star trails. |
| **Wingardium Leviosa**| `[3]` / `[R]` | ✨ Levitation | Swish and flick! Levitates targeted giant pumpkins in Hagrid's patch into the air! |
| **Incendio** | `[4]` / `[F]` | 🔥 Fire Burst | Shoots a crackling fiery blast from your wand tip. |
| **Aguamenti** | `[5]` / `[C]` | 💧 Spring Water | Shoots a clean crystal jet of mountain spring water. |
| **Alohomora** | `[6]` / `[X]` | 🗝️ Unlock Charm | Spins golden arcane runes that unlock ancient doors and gates. |
| **Accio** | `[7]` / `[Z]` | 🧲 Summon Charm | Pulls nearby magical artifacts and the Golden Snitch towards you. |

---

## 🎮 Controls

- **Movement**: `W`, `A`, `S`, `D` or Arrow keys
- **Sprint / Dash**: Hold `Shift`
- **Cast Active Spell**: `Left Click` or `Space`
- **Select Spells**: `Q`, `E`, `R`, `F`, `C`, `X`, `Z` or bottom spell hotbar
- **Instant Spawn Places**: `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8` or top-left **Places** menu
- **Interact / Talk to NPCs**: `E`
- **Toggle Camera View**: `V` (Third-Person ↔ First-Person Wand View)
- **Time of Day**: `T` (Dawn → Noon → Sunset Golden Hour → Magical Midnight)
- **Weather**: `K` (Clear Sky → Himalayan Snowfall → Mountain Mist)
- **Sound / Music**: `M` (Mute/Play), `N` (Next Song)
- **Mobile Touch**: Touch joystick to move, on-screen `CAST` and `TALK` buttons

---

## 🎵 Procedural Web Audio API Synthesizer

Zero external MP3 files to download! The audio engine synthesizes authentic instruments procedural in real time:
- **Track 1**: *Hedwig’s Himalayan Theme* (Celesta melody with strings accompaniment)
- **Track 2**: *Platform 9¾ Lucknow Departure* (Rhythmic steam train waltz)
- **Track 3**: *Doon Valley Castle Nocturne* (Ambient mystical chime chords)
- **SFX**: Wand ignition, silver patronus bells, levitation hum, flame whoosh, unlocking tumblers, and authentic twin-tone steam whistle (`587Hz` & `740Hz`).

---

## 🚀 Running Locally

```bash
# Navigate to the project directory
cd hogwarts-dehradun

# Install dependencies (if not already installed)
npm install

# Start local dev server
npm run dev

# Build for production
npm run build
```

Open `http://localhost:5173` in your browser.
