// HUD Controller: Controls Places menu, Spell hotbar, Music player, and Coordinates

import { soundSynth } from '../audio/sound-synthesizer.js';

export class HUDController {
  constructor(worldManager, wandMagic, player, dialogManager) {
    this.worldManager = worldManager;
    this.wandMagic = wandMagic;
    this.player = player;
    this.dialogManager = dialogManager;

    this.placesBtn = document.getElementById('places-btn');
    this.placesMenu = document.getElementById('places-menu');
    this.placesList = document.getElementById('places-list');

    this.musicTitle = document.getElementById('music-title');
    this.musicPlayBtn = document.getElementById('music-play-btn');
    this.musicPlayIcon = document.getElementById('music-play-icon');
    this.musicNextBtn = document.getElementById('music-next-btn');

    this.modeEl = document.getElementById('mode');
    this.coordsEl = document.getElementById('coords');
    this.spellBar = document.getElementById('spells-hud');

    this.initPlacesMenu();
    this.initMusicControls();
    this.initSpellBar();
    this.updateSpellDisplay();
  }

  initPlacesMenu() {
    if (!this.placesList) return;

    this.placesList.innerHTML = '';
    this.worldManager.landmarks.forEach(lm => {
      const item = document.createElement('button');
      item.className = 'place-item';
      item.innerHTML = `
        <span class="place-badge">${lm.id}</span>
        <div class="place-info">
          <div class="place-deva">${lm.devanagari}</div>
          <div class="place-name">${lm.name}</div>
        </div>
      `;
      item.addEventListener('click', () => {
        this.teleportToLandmark(lm.id);
        this.placesMenu.hidden = true;
      });
      this.placesList.appendChild(item);
    });

    if (this.placesBtn) {
      this.placesBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.placesMenu.hidden = !this.placesMenu.hidden;
      });
    }

    document.addEventListener('click', (e) => {
      if (!this.placesMenu.contains(e.target) && e.target !== this.placesBtn) {
        this.placesMenu.hidden = true;
      }
    });
  }

  teleportToLandmark(id) {
    const lm = this.worldManager.getLandmark(id);
    if (!lm) return;

    soundSynth.playTeleport();
    this.player.teleport(lm.pos, lm.look);
    this.dialogManager.showToast(lm.devanagari, `Arrived at ${lm.name}`, 3000);
    this.updateCoords(lm.name);
  }

  initMusicControls() {
    if (this.musicPlayBtn) {
      this.musicPlayBtn.addEventListener('click', () => {
        const isPlaying = soundSynth.toggleMute();
        this.musicPlayIcon.textContent = isPlaying ? '⏸' : '▶';
      });
    }

    if (this.musicNextBtn) {
      this.musicNextBtn.addEventListener('click', () => {
        const track = soundSynth.nextTrack();
        if (this.musicTitle) {
          this.musicTitle.textContent = track.title;
        }
      });
    }
  }

  initSpellBar() {
    if (!this.spellBar) return;
    this.spellBar.innerHTML = '';

    this.wandMagic.spells.forEach((s, idx) => {
      const btn = document.createElement('button');
      btn.className = `spell-slot ${idx === this.wandMagic.activeSpellIndex ? 'active' : ''}`;
      btn.id = `spell-slot-${s.id}`;
      btn.innerHTML = `
        <span class="spell-key">${s.keyAlt}</span>
        <span class="spell-name">${s.name}</span>
      `;
      btn.addEventListener('click', () => {
        this.wandMagic.selectSpell(idx);
        this.updateSpellDisplay();
        const res = this.wandMagic.castActiveSpell(this.worldManager.getInteractiveObjects());
        if (res) {
          this.dialogManager.showToast(res.spell, res.message, 2500);
        }
      });
      this.spellBar.appendChild(btn);
    });
  }

  updateSpellDisplay() {
    const active = this.wandMagic.getActiveSpell();
    if (this.modeEl) {
      this.modeEl.innerHTML = `Wand Spell: <b style="color: ${active.color}">${active.name}</b> [${active.keyAlt}]`;
    }

    this.wandMagic.spells.forEach((s, idx) => {
      const btn = document.getElementById(`spell-slot-${s.id}`);
      if (btn) {
        btn.classList.toggle('active', idx === this.wandMagic.activeSpellIndex);
      }
    });
  }

  updateCoords(locationName = null) {
    if (!this.coordsEl) return;
    const p = this.player.position;

    let loc = locationName;
    if (!loc) {
      if (p.distanceTo(new THREE.Vector3(-180, 0, -80)) < 45) {
        loc = 'Platform 9¾ · Lucknow Charbagh';
      } else if (p.distanceTo(new THREE.Vector3(40, 0, 40)) < 60) {
        loc = 'Hogwarts Castle · Dehradun Valley';
      } else if (p.distanceTo(new THREE.Vector3(130, 0, -120)) < 60) {
        loc = 'Quidditch Pitch';
      } else if (p.distanceTo(new THREE.Vector3(-70, 0, 90)) < 40) {
        loc = 'Hagrid’s Hut & Pumpkin Patch';
      } else if (p.distanceTo(new THREE.Vector3(-110, 0, 110)) < 45) {
        loc = 'Forbidden Himalayan Forest';
      } else {
        loc = 'Dehradun Shivalik Valley';
      }
    }

    this.coordsEl.textContent = `📍 ${loc} · 30.3165° N, 78.0322° E · Elev ${(640 + p.y * 10).toFixed(0)}m`;
  }
}
