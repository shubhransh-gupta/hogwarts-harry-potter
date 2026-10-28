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

class HogwartsGame {
  constructor() {
    this.canvas = document.getElementById('c');
    this.clock = new THREE.Clock();

    // 1. Setup Three.js WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 2. Setup Scene & Perspective Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.2, 850);

    // 3. Initialize Core Game Subsystems
    this.worldManager = new WorldManager(this.scene);
    this.player = new Player(this.scene, this.camera);
    this.wandMagic = new WandMagic(this.scene, this.player);
    this.goldenSnitch = new GoldenSnitch(this.scene);
    this.npcManager = new NPCManager(this.scene);
    this.dialogManager = new DialogManager();
    this.hudController = new HUDController(this.worldManager, this.wandMagic, this.player, this.dialogManager);

    window.game = this;

    this.isMouseDown = false;
    this.previousMousePosition = { x: 0, y: 0 };

    this.initControls();
    this.initWindowResize();

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

        // Landmark spawn hotkeys (Digit 1-8)
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

    // Mobile touch controls
    const btnCast = document.getElementById('btn-touch-cast');
    if (btnCast) {
      btnCast.addEventListener('touchstart', (e) => {
        e.preventDefault();
        soundSynth.resume();
        this.castActiveWandSpell();
      });
    }

    const btnJump = document.getElementById('btn-touch-jump');
    if (btnJump) {
      btnJump.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.interactProximity();
      });
    }

    // Touch swipe for camera look
    let touchStartX = 0;
    let touchStartY = 0;
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;
        this.player.cameraYaw -= deltaX * 0.005;
        this.player.cameraPitch = Math.max(-0.35, Math.min(0.82, this.player.cameraPitch + deltaY * 0.004));
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    });
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
    const dialog = this.npcManager.checkProximity(this.player.position, 6.0);
    if (dialog) {
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

    // If game is paused in pause modal, render scene without simulating physics
    if (this.hudController.isPaused) {
      this.renderer.render(this.scene, this.camera);
      return;
    }

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const elapsed = this.clock.getElapsedTime();

    // 1. Update Player & Camera with Multi-tier Ground Physics
    this.player.update(delta, elapsed, this.worldManager);

    // 2. Update World Zones & Weather Particles
    this.worldManager.update(delta, elapsed, this.player.position);

    // 3. Update Wand Magic & Projectiles
    this.wandMagic.update(delta, elapsed);

    // 4. Update Golden Snitch
    this.goldenSnitch.update(delta, elapsed, this.player.position);
    if (this.goldenSnitch.checkCatch(this.player.position)) {
      this.dialogManager.showToast('गोल्डन स्निच!', 'You caught the Golden Snitch! +150 Points for Gryffindor!', 4500);
    }

    // 5. Proximity Prompt Check for NPCs, Broom & Water
    const nearbyDialog = this.npcManager.checkProximity(this.player.position, 6.0);
    if (nearbyDialog) {
      this.dialogManager.setPrompt(`Press <b>[E]</b> to talk to ${nearbyDialog.who}`);
    } else {
      const dPitch = this.player.position.distanceTo(new THREE.Vector3(130, 1.2, -120));
      if (dPitch < 8.0) {
        this.dialogManager.setPrompt(`Press <b>[E]</b> to Mount Nimbus 2000 Broomstick 🧹`);
      } else if (this.player.isSwimming) {
        this.dialogManager.setPrompt(`🏊 Swimming in the Black Lake · <kbd>Shift</kbd> fast stroke`);
      } else {
        this.dialogManager.setPrompt(null);
      }
    }

    // 6. Update HUD Coordinates & FPS ticker
    this.hudController.updateCoords();

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
