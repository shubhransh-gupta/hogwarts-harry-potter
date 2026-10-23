// HUD Controller: Manages Courier City UI, Places Menu, Pause Modal, Spell Hotbar, Music Player & Coordinates

import * as THREE from 'three';
import { soundSynth } from '../audio/sound-synthesizer.js';

export class HUDController {
  constructor(worldManager, wandMagic, player, dialogManager) {
    this.worldManager = worldManager;
    this.wandMagic = wandMagic;
    this.player = player;
    this.dialogManager = dialogManager;

    // UI DOM Elements
    this.menuBtn = document.getElementById('menu');
    this.pauseModal = document.getElementById('pause');
    this.resumeBtn = document.getElementById('resume');
    this.pausePlaces = document.getElementById('pause-places');
    this.pauseRestart = document.getElementById('pause-restart');

    this.cardEl = document.getElementById('card');
    this.cardPlacesEl = document.getElementById('card-places');
    this.goBtn = document.getElementById('go');
    this.wanderBtn = document.getElementById('wander');

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

    // State
    this.isPaused = false;
    this.selectedSpawnId = 1;
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.currentFps = 60;

    this.initWelcomeCard();
    this.initPauseMenu();
    this.initPlacesMenu();
    this.initMusicControls();
    this.initSpellBar();
    this.updateSpellDisplay();
  }

  // 1. Welcome Prologue Card (Courier City Style)
  initWelcomeCard() {
    if (!this.cardPlacesEl) return;
    this.cardPlacesEl.innerHTML = '';

    this.worldManager.landmarks.forEach(lm => {
      const btn = document.createElement('button');
      btn.className = `card-place-btn ${lm.id === this.selectedSpawnId ? 'active' : ''}`;
      btn.innerHTML = `
        <span class="num">${lm.id}</span>
        <span class="name">${lm.name}</span>
      `;
      btn.addEventListener('click', () => {
        this.selectedSpawnId = lm.id;
        document.querySelectorAll('.card-place-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
      this.cardPlacesEl.appendChild(btn);
    });

    const enterGame = (spawnId) => {
      try {
        soundSynth.init();
        soundSynth.resume();
      } catch (err) {
        console.warn('Audio start:', err);
      }
      this.teleportToLandmark(spawnId);
      if (this.cardEl) {
        this.cardEl.classList.add('gone');
      }
      if (this.menuBtn) {
        this.menuBtn.hidden = false;
      }
    };

    if (this.goBtn) {
      this.goBtn.addEventListener('click', () => enterGame(this.selectedSpawnId));
    }

    if (this.wanderBtn) {
      this.wanderBtn.addEventListener('click', () => {
        const randId = 1 + Math.floor(Math.random() * this.worldManager.landmarks.length);
        enterGame(randId);
      });
    }
  }

  // 2. Pause Menu & Menu Button (Courier City Style)
  initPauseMenu() {
    // Populate Pause Menu Places Grid
    if (this.pausePlaces) {
      this.pausePlaces.innerHTML = '';
      this.worldManager.landmarks.forEach(lm => {
        const btn = document.createElement('button');
        btn.className = 'pause-place-btn';
        btn.innerHTML = `
          <span class="pp-num">${lm.id}</span>
          <span class="pp-native">${lm.devanagari}</span>
          <span class="pp-latin">${lm.name}</span>
        `;
        btn.addEventListener('click', () => {
          this.teleportToLandmark(lm.id);
          this.togglePause(false);
        });
        this.pausePlaces.appendChild(btn);
      });
    }

    if (this.menuBtn) {
      this.menuBtn.addEventListener('click', () => {
        this.togglePause(true);
      });
    }

    if (this.resumeBtn) {
      this.resumeBtn.addEventListener('click', () => {
        this.togglePause(false);
      });
    }

    if (this.pauseRestart) {
      this.pauseRestart.addEventListener('click', () => {
        this.togglePause(false);
        if (this.cardEl) {
          this.cardEl.classList.remove('gone');
        }
      });
    }

    // Escape Key listener
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        if (this.cardEl && !this.cardEl.classList.contains('gone')) {
          return;
        }
        this.togglePause(!this.isPaused);
      }
    });
  }

  togglePause(paused = null) {
    this.isPaused = paused !== null ? paused : !this.isPaused;
    if (this.pauseModal) {
      this.pauseModal.hidden = !this.isPaused;
    }
    if (this.placesMenu) {
      this.placesMenu.hidden = true;
    }
  }

  // 3. Top Left Places Dropdown (Courier City Style)
  initPlacesMenu() {
    if (!this.placesList) return;
    this.placesList.innerHTML = '';

    this.worldManager.landmarks.forEach(lm => {
      const item = document.createElement('button');
      item.className = 'place-item';
      item.innerHTML = `
        <div class="place-names">
          <span class="place-native">${lm.devanagari}</span>
          <span class="place-latin">${lm.name}</span>
        </div>
        <span class="place-key">${lm.key}</span>
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
      if (this.placesMenu && !this.placesMenu.contains(e.target) && e.target !== this.placesBtn) {
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

  // 4. Floating Music Player (Courier City Style)
  initMusicControls() {
    if (this.musicPlayBtn) {
      this.musicPlayBtn.addEventListener('click', () => {
        const isPlaying = soundSynth.toggleMute();
        if (this.musicPlayIcon) {
          this.musicPlayIcon.textContent = isPlaying ? '⏸' : '▶';
        }
      });
    }

    if (this.musicNextBtn) {
      this.musicNextBtn.addEventListener('click', () => {
        const track = soundSynth.nextTrack();
        if (this.musicTitle) {
          this.musicTitle.textContent = track.title;
        }
        this.dialogManager.showToast('संगीत बदल गया', `Now Playing: ${track.title}`, 2000);
      });
    }
  }

  // 5. Wand Spell Quick Bar
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
          this.dialogManager.showToast(res.spell, res.message, 2400);
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

  // 6. Coordinates & Elevation HUD ticker with live FPS
  updateCoords(locationName = null) {
    if (!this.coordsEl) return;

    // Calculate FPS
    const now = performance.now();
    this.frameCount++;
    if (now - this.lastFrameTime >= 1000) {
      this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastFrameTime));
      this.frameCount = 0;
      this.lastFrameTime = now;
    }

    const p = this.player.position;
    let loc = locationName;

    if (!loc) {
      const dLucknow = Math.hypot(p.x - (-180), p.z - (-80));
      const dCastle = Math.hypot(p.x - 40, p.z - 40);
      const dViaduct = Math.hypot(p.x - (-60), p.z - (-12));
      const dQuidditch = Math.hypot(p.x - 130, p.z - (-120));
      const dHagrid = Math.hypot(p.x - (-70), p.z - 90);
      const dForest = Math.hypot(p.x - (-110), p.z - 110);

      if (dLucknow < 45) {
        loc = 'Platform 9¾ · Lucknow Charbagh';
      } else if (dViaduct < 35 && p.y > 18) {
        loc = 'Himalayan Viaduct & 5972 Express';
      } else if (dCastle < 60) {
        loc = 'Hogwarts Castle · Dehradun Valley';
      } else if (dQuidditch < 55) {
        loc = 'Quidditch Pitch';
      } else if (dHagrid < 40) {
        loc = 'Hagrid’s Hut & Pumpkin Patch';
      } else if (dForest < 45) {
        loc = 'Forbidden Himalayan Forest';
      } else {
        loc = 'Dehradun Shivalik Valley';
      }
    }

    this.coordsEl.textContent = `📍 ${loc} · 30.3165° N, 78.0322° E · Elev ${(640 + p.y * 10).toFixed(0)}m · ${this.currentFps} FPS`;
  }
}
