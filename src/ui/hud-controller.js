// HUD Controller: Manages Courier City UI, Home Screen Integration,
// Places Menu, Pause Modal, Spell Hotbar, Music Player, Coordinates & Disclaimers

import * as THREE from 'three';
import { soundSynth } from '../audio/sound-synthesizer.js';
import { HomeScreen, HOGWARTS_REALMS } from './home-screen.js';

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
    this.pauseCities = document.querySelector('.pause-cities');
    this.pauseRestart = document.getElementById('pause-restart');

    this.cardEl = document.getElementById('card');
    this.cardScriptDeva = this.cardEl?.querySelector('.script-deva');
    this.cardScriptLatin = this.cardEl?.querySelector('.script-latin');
    this.cardPlacesEl = document.getElementById('card-places');
    this.cardBackBtn = document.getElementById('card-back');
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
    this.gameDisclaimer = document.getElementById('game-disclaimer');
    this.gdCloseBtn = document.getElementById('gd-close');

    // State
    this.isPaused = false;
    this.selectedSpawnId = 1;
    this.currentRealm = HOGWARTS_REALMS[0];
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.currentFps = 60;

    // Initialize Components
    this.initHomeScreen();
    this.initWelcomeCard();
    this.initPauseMenu();
    this.initPlacesMenu();
    this.initMusicControls();
    this.initSpellBar();
    this.initGameDisclaimer();
    this.updateSpellDisplay();
  }

  // 1. Home Screen Integration (Courier City Style)
  initHomeScreen() {
    this.homeScreen = new HomeScreen((realm) => {
      this.currentRealm = realm;
      this.selectedSpawnId = realm.spawnId;

      if (this.cardScriptDeva) this.cardScriptDeva.textContent = realm.script;
      if (this.cardScriptLatin) this.cardScriptLatin.textContent = realm.name;

      this.updateCardPlacesActive();

      if (this.cardEl) {
        this.cardEl.classList.remove('gone');
      }
    });

    if (this.cardBackBtn) {
      this.cardBackBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.cardEl) {
          this.cardEl.classList.add('gone');
        }
        if (this.homeScreen) {
          this.homeScreen.show();
        }
      });
    }
  }

  // 2. Welcome Prologue Card (Courier City Style)
  initWelcomeCard() {
    if (!this.cardPlacesEl) return;
    this.cardPlacesEl.innerHTML = '';

    this.worldManager.landmarks.forEach(lm => {
      const btn = document.createElement('button');
      btn.className = `card-place-btn ${lm.id === this.selectedSpawnId ? 'active' : ''}`;
      btn.dataset.id = lm.id;
      btn.innerHTML = `
        <span class="num">${lm.id}</span>
        <span class="name">${lm.name}</span>
      `;
      btn.addEventListener('click', () => {
        this.selectedSpawnId = lm.id;
        this.updateCardPlacesActive();
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
      this.triggerGameDisclaimer();
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

  updateCardPlacesActive() {
    if (!this.cardPlacesEl) return;
    const btns = this.cardPlacesEl.querySelectorAll('.card-place-btn');
    btns.forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.id, 10) === this.selectedSpawnId);
    });
  }

  // 3. Opening Game Disclaimer
  initGameDisclaimer() {
    if (this.gdCloseBtn && this.gameDisclaimer) {
      this.gdCloseBtn.addEventListener('click', () => {
        this.gameDisclaimer.classList.add('hide');
      });
    }
  }

  triggerGameDisclaimer() {
    if (!this.gameDisclaimer) return;
    this.gameDisclaimer.classList.remove('hide');
    setTimeout(() => {
      if (this.gameDisclaimer) {
        this.gameDisclaimer.classList.add('hide');
      }
    }, 9500);
  }

  // 4. Pause Menu & Menu Button (Courier City Style)
  initPauseMenu() {
    // Populate Pause Menu Places Grid
    if (this.pausePlaces) {
      this.pausePlaces.innerHTML = '';
      this.worldManager.landmarks.forEach(lm => {
        const btn = document.createElement('button');
        btn.className = 'pause-place-btn';
        btn.innerHTML = `
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

    // Populate Pause Menu Realms Grid (.pause-cities)
    if (this.pauseCities) {
      this.pauseCities.innerHTML = '';
      HOGWARTS_REALMS.forEach(realm => {
        const a = document.createElement('a');
        a.href = `#${realm.id}`;
        a.innerHTML = `
          <span class="pc-script">${realm.script}</span>
          <span class="pc-name">${realm.name}</span>
        `;
        a.addEventListener('click', (e) => {
          e.preventDefault();
          this.teleportToLandmark(realm.spawnId);
          this.togglePause(false);
        });
        this.pauseCities.appendChild(a);
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
        if (this.menuBtn) {
          this.menuBtn.hidden = true;
        }
        if (this.homeScreen) {
          this.homeScreen.show();
        }
      });
    }

    // Escape Key listener
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        const isHomeVisible = document.getElementById('home') && !document.getElementById('home').hidden;
        const isCardVisible = this.cardEl && !this.cardEl.classList.contains('gone');
        if (isHomeVisible || isCardVisible) {
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

  // 5. Top Left Places Dropdown (Courier City Style)
  initPlacesMenu() {
    if (!this.placesList) return;
    this.placesList.innerHTML = '';

    this.worldManager.landmarks.forEach(lm => {
      const item = document.createElement('button');
      item.className = 'place-item';
      item.innerHTML = `
        <span class="place-num">${lm.key}</span>
        <span class="place-name">${lm.devanagari} · ${lm.name}</span>
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

    // Update active state in places dropdown
    if (this.placesList) {
      const items = this.placesList.querySelectorAll('.place-item');
      items.forEach((it, idx) => {
        it.classList.toggle('active', idx + 1 === id);
      });
    }
  }

  // 6. Floating Music Player (Courier City Style)
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

  // 7. Wand Spell Quick Bar (Courier City Pill Aesthetic)
  initSpellBar() {
    if (!this.spellBar) return;
    this.spellBar.innerHTML = '';

    this.wandMagic.spells.forEach((s, idx) => {
      const btn = document.createElement('button');
      btn.className = `spell-pill ${idx === this.wandMagic.activeSpellIndex ? 'active' : ''}`;
      btn.id = `spell-slot-${s.id}`;
      btn.innerHTML = `
        <span class="sp-key">${s.keyAlt}</span>
        <span class="sp-name">${s.name}</span>
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

  // 8. Coordinates & Elevation HUD ticker with live FPS
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
      const dLake = Math.hypot(p.x - 60, p.z - (-50));

      if (dLucknow < 45) {
        loc = 'Platform 9¾ · Lucknow Charbagh';
      } else if (dViaduct < 35 && p.y > 18) {
        loc = 'Himalayan Viaduct & 5972 Express';
      } else if (dCastle < 60) {
        loc = 'Hogwarts Castle · Dehradun Valley';
      } else if (dQuidditch < 55) {
        loc = 'Quidditch Pitch';
      } else if (dLake < 55) {
        loc = 'The Black Lake & Grounds';
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
