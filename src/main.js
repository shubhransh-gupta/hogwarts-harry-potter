// Hogwarts Dehradun: The Lucknow 9¾ Express
// Browser-based 3D open-world magical exploration game

import * as THREE from 'three';
import { WorldManager } from './world/world-manager.js';
import { Player } from './entities/player.js';
import { WandMagic } from './entities/wand-magic.js';
import { GoldenSnitch } from './entities/golden-snitch.js';
import { NPCManager } from './entities/npcs.js';
import { DialogManager } from './ui/dialog-manager.js';
import { HUDController } from './ui/hud-controller.js';
import { soundSynth } from './audio/sound-synthesizer.js';
import { TrainJourneyController } from './world/train-journey.js';
import { HorcruxQuestManager } from './world/horcrux-quest.js';

class HogwartsGame {
  constructor() {
    this.canvas = document.getElementById('c');
    this.clock = new THREE.Clock();

    // 1. Setup Three.js WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'default'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.BasicShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    // 2. Setup Scene & Perspective Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.2, 850);

    // 3. Initialize Core Game Subsystems
    this.worldManager = new WorldManager(this.scene);
    this.player = new Player(this.scene, this.camera);
    this.wandMagic = new WandMagic(this.scene, this.player);
    this.wandMagic.setWorldManager(this.worldManager);
    this.goldenSnitch = new GoldenSnitch(this.scene);
    this.npcManager = new NPCManager(this.scene);
    this.dialogManager = new DialogManager();
    this.horcruxManager = new HorcruxQuestManager(this.scene, this.player, this.dialogManager);
    this.wandMagic.setHorcruxManager(this.horcruxManager);
    this.trainJourney = new TrainJourneyController(this.scene, this.camera, this.player, this.worldManager, this.dialogManager);
    this.hudController = new HUDController(this.worldManager, this.wandMagic, this.player, this.dialogManager);

    window.game = this;

    this.isMouseDown = false;
    this.previousMousePosition = { x: 0, y: 0 };

    this.initControls();
    this.initMobileTouchControls();
    this.initWindowResize();
    this.initStoryTriggers();

    // Pause physics/rendering if user switches tabs to save battery & CPU
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.clock.getDelta(); // flush accumulated delta
      }
    });

    // Start render loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initControls() {
    // Keyboard listeners
    window.addEventListener('keydown', (e) => {
      const homeEl = document.getElementById('home');
      if (homeEl && !homeEl.hidden) return;
      const cardEl = document.getElementById('card');
      if (cardEl && !cardEl.classList.contains('gone')) return;

      soundSynth.resume();

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.player.keys.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.player.keys.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.player.keys.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.player.keys.right = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.player.keys.sprint = true;
          break;
        case 'Space':
          this.player.jump();
          break;
        case 'KeyE':
          this.interactProximity();
          break;
        case 'KeyT':
          const time = this.worldManager.cycleTimeOfDay();
          this.dialogManager.showToast('समय चक्र', `Time of Day: ${time.name}`, 2000);
          break;
        case 'KeyK':
          const weather = this.worldManager.cycleWeather();
          this.dialogManager.showToast('मौसम बदला', `Weather: ${weather.toUpperCase()}`, 2000);
          break;
        case 'KeyV':
          this.player.isFirstPerson = !this.player.isFirstPerson;
          this.dialogManager.showToast('कैमरा दृश्य', this.player.isFirstPerson ? 'First Person Wand View' : 'Third Person View', 1800);
          break;
        case 'KeyM':
          const isPlaying = soundSynth.toggleMute();
          const pIcon = document.getElementById('music-play-icon');
          if (pIcon) pIcon.textContent = isPlaying ? '⏸' : '▶';
          break;
        case 'KeyN':
          const track = soundSynth.nextTrack();
          const mTitle = document.getElementById('music-title');
          if (mTitle) mTitle.textContent = track.title;
          this.dialogManager.showToast('संगीत', `Now Playing: ${track.title}`, 2000);
          break;

        // Spell hotkeys (Q, R, F, C, X, Z)
        case 'KeyQ':
          this.selectAndCastSpell(0);
          break;
        case 'KeyR':
          this.selectAndCastSpell(2);
          break;
        case 'KeyF':
          this.selectAndCastSpell(3);
          break;
        case 'KeyC':
          this.selectAndCastSpell(4);
          break;
        case 'KeyX':
          this.selectAndCastSpell(5);
          break;
        case 'KeyZ':
          this.selectAndCastSpell(6);
          break;
        case 'KeyG':
          this.selectAndCastSpell(7); // Avada Kedavra
          break;
        case 'KeyH':
          this.selectAndCastSpell(8); // Expelliarmus
          break;
        case 'KeyJ':
          this.selectAndCastSpell(9); // Sectumsempra
          break;

        // Landmark spawn hotkeys (Digit 1-9)
        case 'Digit1':
          this.hudController.teleportToLandmark(1);
          break;
        case 'Digit2':
          this.hudController.teleportToLandmark(2);
          break;
        case 'Digit3':
          this.hudController.teleportToLandmark(3);
          break;
        case 'Digit4':
          this.hudController.teleportToLandmark(4);
          break;
        case 'Digit5':
          this.hudController.teleportToLandmark(5);
          break;
        case 'Digit6':
          this.hudController.teleportToLandmark(6);
          break;
        case 'Digit7':
          this.hudController.teleportToLandmark(7);
          break;
        case 'Digit8':
          this.hudController.teleportToLandmark(8);
          break;
        case 'Digit9':
          this.hudController.teleportToLandmark(9);
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.player.keys.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.player.keys.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.player.keys.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.player.keys.right = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.player.keys.sprint = false;
          break;
      }
    });

    // Mouse Look & Cast
    this.canvas.addEventListener('mousedown', (e) => {
      soundSynth.resume();
      if (e.button === 0 && !this.hudController.isPaused) {
        // Left click casts active wand spell
        this.castActiveWandSpell();
      }
      this.isMouseDown = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });

    window.addEventListener('mousemove', (e) => {
      const homeEl = document.getElementById('home');
      if (homeEl && !homeEl.hidden) return;
      const cardEl = document.getElementById('card');
      if (cardEl && !cardEl.classList.contains('gone')) return;

      if (this.isMouseDown || document.pointerLockElement === this.canvas) {
        const deltaX = (e.movementX !== undefined && document.pointerLockElement === this.canvas)
          ? e.movementX
          : (e.clientX - this.previousMousePosition.x);
        const deltaY = (e.movementY !== undefined && document.pointerLockElement === this.canvas)
          ? e.movementY
          : (e.clientY - this.previousMousePosition.y);

        // Courier City style mouse look: dragging right pans view to the right
        this.player.cameraYaw -= deltaX * 0.0035;
        this.player.cameraPitch = Math.max(-0.35, Math.min(0.82, this.player.cameraPitch + deltaY * 0.003));

        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    // Note: Touch controls initialized in initMobileTouchControls()
  }

  initMobileTouchControls() {
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const touchControls = document.getElementById('touch-controls');
    if (touchControls && isTouch) {
      touchControls.style.display = 'block';
    }

    // 1. Virtual Movement Joystick
    const joystickZone = document.getElementById('joystick-zone');
    const joystickBase = document.getElementById('joystick-base');
    const joystickThumb = document.getElementById('joystick-thumb');
    let joystickTouchId = null;
    let baseRect = null;
    const maxRadius = 42;

    if (joystickZone && joystickBase && joystickThumb) {
      const handleJoyStart = (e) => {
        const homeEl = document.getElementById('home');
        if (homeEl && !homeEl.hidden) return;
        soundSynth.resume();

        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (joystickTouchId === null) {
            joystickTouchId = t.identifier;
            baseRect = joystickBase.getBoundingClientRect();
            handleJoyMove(e);
            break;
          }
        }
      };

      const handleJoyMove = (e) => {
        if (joystickTouchId === null) return;
        for (let i = 0; i < e.touches.length; i++) {
          const t = e.touches[i];
          if (t.identifier === joystickTouchId) {
            if (!baseRect) baseRect = joystickBase.getBoundingClientRect();
            const centerX = baseRect.left + baseRect.width / 2;
            const centerY = baseRect.top + baseRect.height / 2;
            const dx = t.clientX - centerX;
            const dy = t.clientY - centerY;
            const dist = Math.hypot(dx, dy);
            const clampedDist = Math.min(dist, maxRadius);
            const angle = Math.atan2(dy, dx);

            const tx = Math.cos(angle) * clampedDist;
            const ty = Math.sin(angle) * clampedDist;
            joystickThumb.style.transform = `translate(${tx}px, ${ty}px)`;

            const normX = tx / maxRadius;
            const normY = ty / maxRadius;
            const thresh = 0.22;
            this.player.keys.forward = normY < -thresh;
            this.player.keys.backward = normY > thresh;
            this.player.keys.left = normX < -thresh;
            this.player.keys.right = normX > thresh;
            break;
          }
        }
      };

      const handleJoyEnd = (e) => {
        if (joystickTouchId === null) return;
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === joystickTouchId) {
            joystickTouchId = null;
            joystickThumb.style.transform = 'translate(0px, 0px)';
            this.player.keys.forward = false;
            this.player.keys.backward = false;
            this.player.keys.left = false;
            this.player.keys.right = false;
            break;
          }
        }
      };

      joystickZone.addEventListener('touchstart', handleJoyStart, { passive: false });
      window.addEventListener('touchmove', handleJoyMove, { passive: false });
      window.addEventListener('touchend', handleJoyEnd, { passive: false });
      window.addEventListener('touchcancel', handleJoyEnd, { passive: false });
    }

    // 2. Camera Drag on Right-Half of Canvas
    let cameraTouchId = null;
    let prevCamX = 0;
    let prevCamY = 0;

    this.canvas.addEventListener('touchstart', (e) => {
      const homeEl = document.getElementById('home');
      if (homeEl && !homeEl.hidden) return;

      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.clientX > window.innerWidth * 0.35 && cameraTouchId === null) {
          cameraTouchId = t.identifier;
          prevCamX = t.clientX;
          prevCamY = t.clientY;
          break;
        }
      }
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (cameraTouchId === null) return;
      for (let i = 0; i < e.touches.length; i++) {
        const t = e.touches[i];
        if (t.identifier === cameraTouchId) {
          const dx = t.clientX - prevCamX;
          const dy = t.clientY - prevCamY;
          this.player.cameraYaw -= dx * 0.0055;
          this.player.cameraPitch = Math.max(-0.35, Math.min(0.82, this.player.cameraPitch + dy * 0.0045));
          prevCamX = t.clientX;
          prevCamY = t.clientY;
          break;
        }
      }
    }, { passive: false });

    const handleCamEnd = (e) => {
      if (cameraTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === cameraTouchId) {
          cameraTouchId = null;
          break;
        }
      }
    };
    window.addEventListener('touchend', handleCamEnd);
    window.addEventListener('touchcancel', handleCamEnd);

    // 3. Action Buttons
    const btnCast = document.getElementById('btn-touch-cast');
    if (btnCast) {
      btnCast.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        soundSynth.resume();
        this.castActiveWandSpell();
      });
    }

    const btnInteract = document.getElementById('btn-touch-interact');
    if (btnInteract) {
      btnInteract.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        soundSynth.resume();
        this.interactProximity();
      });
    }

    const btnJump = document.getElementById('btn-touch-jump');
    if (btnJump) {
      btnJump.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.player.jump();
      });
    }

    const btnSprint = document.getElementById('btn-touch-sprint');
    if (btnSprint) {
      btnSprint.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.player.keys.sprint = !this.player.keys.sprint;
        btnSprint.classList.toggle('active', this.player.keys.sprint);
      });
    }

    // 4. Portrait vs Landscape Orientation Check
    const rotateHint = document.getElementById('rotate-hint');
    const btnDismissRotate = document.getElementById('btn-dismiss-rotate');
    if (btnDismissRotate && rotateHint) {
      btnDismissRotate.addEventListener('click', () => {
        rotateHint.hidden = true;
      });
    }

    const checkOrientation = () => {
      const isMobile = window.innerWidth <= 950 || isTouch;
      const isPortrait = window.innerHeight > window.innerWidth;
      if (rotateHint) {
        if (isMobile && isPortrait) {
          rotateHint.hidden = false;
        } else {
          rotateHint.hidden = true;
        }
      }
    };

    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', () => {
      setTimeout(checkOrientation, 300);
    });
    checkOrientation();
  }

  initStoryTriggers() {
    const btnStory = document.getElementById('btn-hud-story');
    if (btnStory) {
      btnStory.addEventListener('click', (e) => {
        e.stopPropagation();
        soundSynth.resume();
        this.dialogManager.showStoryPrologue();
      });
    }

    const btnPauseStory = document.getElementById('pause-story-plot');
    if (btnPauseStory) {
      btnPauseStory.addEventListener('click', (e) => {
        e.stopPropagation();
        soundSynth.resume();
        this.dialogManager.showStoryPrologue();
      });
    }
  }

  selectAndCastSpell(index) {
    this.wandMagic.selectSpell(index);
    this.hudController.updateSpellDisplay();
    this.castActiveWandSpell();
  }

  castActiveWandSpell() {
    const targets = this.worldManager.getInteractiveObjects();
    const result = this.wandMagic.castActiveSpell(targets);
    if (result) {
      this.dialogManager.showToast(result.spell, result.message, 2400);
    }
  }

  interactProximity() {
    // If cinematic is active, allow skipping
    if (this.trainJourney && this.trainJourney.isActive) {
      this.trainJourney.completeJourney();
      return;
    }

    // Check if near a Dark Horcrux (Strike it in duel!)
    if (this.horcruxManager) {
      const nearHorcrux = this.horcruxManager.getNearbyHorcrux(this.player.position, 6.5);
      if (nearHorcrux) {
        this.castActiveWandSpell();
        const activeSpell = this.wandMagic.spells[this.wandMagic.activeSpellIndex]?.id || 'expelliarmus';
        this.horcruxManager.damageHorcrux(nearHorcrux, activeSpell, this.wandMagic);
        return;
      }
    }

    // Check if near Hogwarts Express at Lucknow Platform 9¾ FIRST
    const distToTrain = this.player.position.distanceTo(new THREE.Vector3(-204, 1.0, -108));
    if (distToTrain < 16.0) {
      this.trainJourney.startJourney();
      return;
    }

    // Check if near an Enchanted Mystery Box
    if (this.horcruxManager && this.horcruxManager.openNearbyMysteryBox(this.player.position, this.wandMagic)) {
      this.hudController.updateSpellDisplay();
      return;
    }

    const dialog = this.npcManager.checkProximity(this.player.position, 6.0);
    if (dialog) {
      if (dialog.isSortingHat) {
        this.dialogManager.showInteractiveSorting((house) => {
          this.player.setHouse(house);
          soundSynth.playSortingHatFanfare();
          this.dialogManager.showToast(
            'सॉर्टिंग पूर्ण!',
            `The Sorting Hat has placed you in ${house.toUpperCase()}! +50 House Points!`,
            5000
          );
        });
        return;
      }
      this.dialogManager.showDialog(dialog);
    } else {

      // Check if near Nimbus 2000 Broom on Quidditch pitch (130, 1.2, -120)
      const dPitch = this.player.position.distanceTo(new THREE.Vector3(130, 1.2, -120));
      if (dPitch < 8.5) {
        soundSynth.playSpellPatronus();
        this.player.moveSpeed = 19.5; // High speed broom surge!
        setTimeout(() => { this.player.moveSpeed = 11.5; }, 10000);
        this.dialogManager.showToast('निम्बस २०००!', 'You mounted the Nimbus 2000! Flying speed boosted across the pitch!', 3500);
        return;
      }

      // Check if near platform 9 3/4 barrier
      if (this.player.position.distanceTo(new THREE.Vector3(-180, 1.2, -74)) < 8.0) {
        this.dialogManager.showToast('प्लेटफ़ॉर्म ९¾', 'You stand before the enchanted barrier to the 5972 Express!', 3000);
      }
    }
  }

  initWindowResize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  animate() {
    requestAnimationFrame(this.animate);

    // 0a. Zero background CPU/GPU usage if user switches tab or minimizes window
    if (document.hidden) return;

    // 0b. Zero background 3D simulation/rendering while user is browsing Home Screen
    const homeEl = document.getElementById('home');
    if (homeEl && !homeEl.hidden && !homeEl.classList.contains('lifting')) {
      return;
    }

    // If game is paused in pause modal, render scene without simulating physics
    if (this.hudController.isPaused) {
      this.renderer.render(this.scene, this.camera);
      return;
    }

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const elapsed = this.clock.getElapsedTime();

    // 1. Update Player & Camera with Multi-tier Ground Physics
    this.player.update(delta, elapsed, this.worldManager);

    // 2. Update Cinematic Train Journey
    if (this.trainJourney) {
      this.trainJourney.update(delta);
    }

    // 3. Update World Zones & Weather Particles
    this.worldManager.update(delta, elapsed, this.player.position);

    // 4. Update Wand Magic Particles, Trailing Ribbons & Screen Shake
    this.wandMagic.update(delta, elapsed, this.camera);

    // 5. Update NPC Crowd Animations & Sorting Hat (distance culled)
    if (this.npcManager) {
      this.npcManager.update(delta, elapsed, this.player.position);
    }

    // 6. Update Horcrux Quest, Spinning Galleons & Mystery Boxes
    if (this.horcruxManager) {
      this.horcruxManager.update(delta, elapsed, this.player.position, this.wandMagic);
    }

    // 7. Update Golden Snitch
    this.goldenSnitch.update(delta, elapsed, this.player.position);
    if (this.goldenSnitch.checkCatch(this.player.position)) {
      this.dialogManager.showToast('गोल्डन स्निच!', 'You caught the Golden Snitch! +150 Points for Gryffindor!', 4500);
    }

    // 6. Proximity Prompt Check for Horcruxes, Train, NPCs, Broom & Water
    const nearHorcrux = this.horcruxManager ? this.horcruxManager.getNearbyHorcrux(this.player.position, 8.5) : null;
    const distToTrain = this.player.position.distanceTo(new THREE.Vector3(-204, 1.0, -108));
    const nearbyDialog = this.npcManager.checkProximity(this.player.position, 6.0);

    if (nearHorcrux) {
      this.dialogManager.setPrompt(`⚔️ Press <b>[E]</b> or <b>Left-Click</b> to Strike ${nearHorcrux.name}! [HP: ${nearHorcrux.hp}/${nearHorcrux.maxHp}]`);
    } else if (distToTrain < 16.0 && (!this.trainJourney || !this.trainJourney.isActive)) {
      this.dialogManager.setPrompt(`🚂 Press <b>[E]</b> to Board the Hogwarts Express 5972!`);
    } else if (nearbyDialog) {
      this.dialogManager.setPrompt(`Press <b>[E]</b> to talk to ${nearbyDialog.who}`);
    } else {
      const dPitch = this.player.position.distanceTo(new THREE.Vector3(130, 1.2, -120));
      if (dPitch < 8.0) {
        this.dialogManager.setPrompt(`Press <b>[E]</b> to Mount Nimbus 2000 Broomstick 🧹`);
      } else if (this.player.isSwimming) {
        this.dialogManager.setPrompt(this.player.isDiving
          ? `🤿 Diving in the Black Lake Depths · <kbd>Space</kbd> Surface to air`
          : `🏊 Swimming in the Black Lake · <kbd>Shift</kbd> Dive underwater · <kbd>WASD</kbd> Stroke`);
      } else {
        this.dialogManager.setPrompt(null);
      }
    }

    // 7. Render
    this.renderer.render(this.scene, this.camera);
  }
}

// Instantiate when DOM is ready
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => new HogwartsGame());
} else {
  new HogwartsGame();
}
