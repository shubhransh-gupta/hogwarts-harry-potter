// Hogwarts Express & Dehradun Realms Home Screen Manager
// Reverse engineered from Courier City: 3D interactive spinning card slots, route progression, lifting transitions

import * as THREE from 'three';
import {
  createMiniCharbagh,
  createMiniExpress,
  createMiniGreatHall,
  createMiniCourtyard,
  createMiniAstronomy,
  createMiniQuidditch,
  createMiniBlackLake
} from './mini-models.js';

export const HOGWARTS_REALMS = [
  {
    id: 'charbagh',
    name: 'Lucknow Charbagh',
    script: 'लखनऊ चारबाग',
    line: 'Platform 9¾ Express Line',
    season: 'Misty Winter Morning',
    accent: '#c8402a',
    spawnId: 1,
    createModel: createMiniCharbagh,
    stations: [
      'Charbagh Portico Arches',
      'Pillars 9 & 10 Brick Barrier',
      'Platform 9¾ Enchanted Line',
      'Brass Luggage Trolley'
    ]
  },
  {
    id: 'express',
    name: '5972 Himalayan Engine',
    script: 'हॉगवॉर्ट्स एक्सप्रेस',
    line: 'Mountain Steam Locomotive',
    season: 'Shivalik Ridge Crossing',
    accent: '#d4af37',
    spawnId: 2,
    createModel: createMiniExpress,
    stations: [
      'Dehradun Foothills Ascent',
      'Arched Stone Viaduct',
      '5972 Crimson Engine Cab',
      'Himalayan Pine Forest'
    ]
  },
  {
    id: 'greathall',
    name: 'The Great Hall',
    script: 'द ग्रेट हॉल',
    line: 'Ancient Feasting Chambers',
    season: 'Floating Candles & Hearth',
    accent: '#e8492a',
    spawnId: 4,
    createModel: createMiniGreatHall,
    stations: [
      'Grand Oak Entrance',
      'Four House Wall Banners',
      'High Professor Table',
      'The Sorting Hat'
    ]
  },
  {
    id: 'courtyard',
    name: 'Castle Courtyard & Clock',
    script: 'हॉगवॉर्ट्स प्रांगण',
    line: 'Paved Gothic Quadrangle',
    season: 'Mountain Mist & Chimes',
    accent: '#4a69bd',
    spawnId: 3,
    createModel: createMiniCourtyard,
    stations: [
      'Stone Fountain Quad',
      'The Grand Clock Tower',
      'Transfiguration Cloisters',
      'Viaduct Bridge Approach'
    ]
  },
  {
    id: 'astronomy',
    name: 'Astronomy Tower Spire',
    script: 'एस्ट्रोनॉमी टॉवर',
    line: 'Celestial Mountain Lookout',
    season: 'Clear Himalayan Sky',
    accent: '#6c5ce7',
    spawnId: 5,
    createModel: createMiniAstronomy,
    stations: [
      'Spiral Turret Stairs',
      'Observation Colonnade',
      'Armillary Dome Spire',
      'Cloud Peak Lookout'
    ]
  },
  {
    id: 'quidditch',
    name: 'Quidditch Pitch & Broom',
    script: 'क्विडिच पिच',
    line: 'Valley Flying Arena',
    season: 'Swift Mountain Breezes',
    accent: '#27ae60',
    spawnId: 6,
    createModel: createMiniQuidditch,
    stations: [
      'House Spectator Towers',
      'Center Flying Turf',
      'Nimbus 2000 Broomstick',
      'Golden Snitch Sky Flight'
    ]
  },
  {
    id: 'blacklake',
    name: 'The Black Lake & Willow',
    script: 'द ब्लैक लेक',
    line: 'Deep Mountain Waters',
    season: 'Rippling Midnight Waters',
    accent: '#0984e3',
    spawnId: 8,
    createModel: createMiniBlackLake,
    stations: [
      'Lakeside Wooden Jetty',
      'Floating Lantern Rowboats',
      'Deep Swimming Basin',
      'The Whomping Willow'
    ]
  }
];

// Orthographic 3D Canvas Stage for Home Screen Cards
class HomeStage {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -5000, 5000);

    const dirLight = new THREE.DirectionalLight(0xffeedc, 2.4);
    dirLight.position.set(-0.6, 0.8, 1).normalize();
    this.scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0xd8e4f0, 0x8a6a5e, 1.3);
    this.scene.add(hemiLight);

    this.items = [];
    this.running = true;
    this.last = performance.now();
    this.resize();
    window.addEventListener('resize', () => this.resize());

    const loop = () => {
      if (this.running) {
        this.frame();
        requestAnimationFrame(loop);
      }
    };
    requestAnimationFrame(loop);
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    Object.assign(this.camera, {
      left: -w / 2,
      right: w / 2,
      top: h / 2,
      bottom: -h / 2
    });
    this.camera.updateProjectionMatrix();
    for (const it of this.items) it.fit?.();
  }

  add(mesh, slotEl, { tilt = 0.36, lean = 0.22, speed = 0.1, phase = 0 } = {}) {
    const outer = new THREE.Group();
    const spin = new THREE.Group();
    outer.add(spin);
    spin.add(mesh);
    outer.rotation.set(-(Math.PI / 2 - tilt), 0, lean, 'ZXY');
    spin.rotation.z = phase;
    this.scene.add(outer);

    const item = {
      outer,
      spin,
      slot: slotEl,
      speed,
      boost: 1,
      hover: 0,
      fade: 1.0,
      fit: () => {
        const rect = slotEl.getBoundingClientRect();
        item.cx = rect.left + rect.width / 2 - window.innerWidth / 2;
        item.cy = -(rect.top + rect.height / 2 - window.innerHeight / 2);
        item.cr = (rect.width / 2) * 0.82;
      }
    };
    item.fit();
    this.items.push(item);
    return item;
  }

  frame() {
    const now = performance.now();
    const delta = Math.min(0.1, (now - this.last) / 1000);
    this.last = now;

    for (const item of this.items) {
      item.fit?.();
      item.boost += ((item.hover ? 2.8 : 1.0) - item.boost) * 0.12;
      item.spin.rotation.z += item.speed * item.boost * delta * 2.2;

      item.outer.position.set(item.cx, item.cy, 0);
      item.outer.scale.setScalar(Math.max(0.001, item.cr * item.fade));
    }
    this.renderer.render(this.scene, this.camera);
  }

  stop() {
    this.running = false;
  }

  resume() {
    if (!this.running) {
      this.running = true;
      this.last = performance.now();
      const loop = () => {
        if (this.running) {
          this.frame();
          requestAnimationFrame(loop);
        }
      };
      requestAnimationFrame(loop);
    }
  }
}

export class HomeScreen {
  constructor(onRealmChosen) {
    this.onRealmChosen = onRealmChosen;
    this.root = document.getElementById('home');
    this.citiesEl = this.root ? this.root.querySelector('.cities') : null;
    this.canvas = document.getElementById('home-c');

    this.realms = HOGWARTS_REALMS;
    this.blocks = [];
    this.items = [];
    this.selectedRealm = null;

    if (this.root && this.citiesEl && this.canvas) {
      this.init();
    }
  }

  init() {
    this.stage = new HomeStage(this.canvas);
    this.citiesEl.innerHTML = '';

    this.blocks = this.realms.map((realm, idx) => {
      const block = document.createElement('button');
      block.className = 'city';
      block.dataset.realm = realm.id;
      block.style.setProperty('--accent', realm.accent);
      block.setAttribute('aria-label', `${realm.name}, ${realm.line}`);

      const stationsHtml = realm.stations
        .map(st => `<li><i></i><span>${st}</span></li>`)
        .join('');

      block.innerHTML = `
        <div class="slot" aria-hidden="true"></div>
        <div class="words">
          <div class="script">${realm.script}</div>
          <div class="latin">${realm.name}</div>
          <p class="about"><b>${realm.line}.</b> <span>${realm.season}</span></p>
        </div>
        <ol class="route" aria-label="Stations">${stationsHtml}<em class="fill"></em><em class="head"></em></ol>
        <div class="step" aria-live="polite"></div>
      `;

      this.citiesEl.appendChild(block);

      block.addEventListener('click', () => this.handleRealmClick(realm, block, idx));
      return block;
    });

    // Mount 3D items into card slots
    requestAnimationFrame(() => {
      setTimeout(() => {
        this.realms.forEach((realm, idx) => {
          const model = realm.createModel();
          const slotEl = this.blocks[idx].querySelector('.slot');
          const item = this.stage.add(model, slotEl, {
            phase: idx * 1.5,
            speed: 0.08 + (idx % 3) * 0.02,
            lean: idx % 2 ? -0.2 : 0.22
          });
          item.fade = 1.0;
          this.items.push(item);

          const block = this.blocks[idx];
          block.addEventListener('pointerenter', () => { item.hover = 1; });
          block.addEventListener('pointerleave', () => { item.hover = 0; });
          block.addEventListener('focus', () => { item.hover = 1; });
          block.addEventListener('blur', () => { item.hover = 0; });
        });

        this.root.classList.add('shown');

        // Smooth fade-in of 3D miniature models
        const fadeIn = () => {
          let more = false;
          for (const it of this.items) {
            it.fade = Math.min(1, it.fade + 0.04);
            if (it.fade < 1) more = true;
          }
          if (more) requestAnimationFrame(fadeIn);
        };
        fadeIn();
      }, 40);
    });

    if (window.matchMedia('(pointer: coarse)').matches) {
      this.root.classList.add('touch');
    }
  }

  async handleRealmClick(realm, block, chosenIdx) {
    this.selectedRealm = realm;
    this.root.classList.add('loading');
    block.classList.add('chosen');

    this.blocks.forEach((b, idx) => {
      if (idx !== chosenIdx) {
        b.classList.add('gone');
        b.disabled = true;
      }
    });

    // Fade out other 3D models while speeding up the chosen one
    this.items.forEach((it, idx) => {
      it.hover = 0;
      if (idx !== chosenIdx) {
        const fadeOut = () => {
          it.fade = Math.max(0, it.fade - 0.08);
          if (it.fade > 0) requestAnimationFrame(fadeOut);
        };
        fadeOut();
      } else {
        it.speed *= 1.8;
      }
    });

    // Simulated Courier City station line loading sequence
    const steps = [
      { p: 0.18, text: 'Polishing wand & preparing trunk...' },
      { p: 0.45, text: 'Chanting Alohomora at the platform barrier...' },
      { p: 0.75, text: 'Ascending through the Dehradun mountain mists...' },
      { p: 1.0, text: `Arriving at ${realm.name}!` }
    ];

    for (const step of steps) {
      this.setProgress(block, step.p, step.text);
      await new Promise(r => setTimeout(r, 260));
    }

    await new Promise(r => setTimeout(r, 280));
    await this.reveal(realm);
  }

  setProgress(block, p, text) {
    if (!block) return;
    block.style.setProperty('--p', p.toFixed(3));
    const items = block.querySelectorAll('.route li');
    items.forEach((item, idx) => {
      item.classList.toggle('lit', p >= (idx + 0.5) / items.length || p >= 0.999);
    });
    const stepEl = block.querySelector('.step');
    if (stepEl && text) {
      stepEl.textContent = text;
    }
  }

  async reveal(realm) {
    this.root.classList.add('ready');
    await new Promise(r => setTimeout(r, 450));
    this.root.classList.add('lifting');
    await new Promise(r => setTimeout(r, 900));

    this.root.hidden = true;
    this.stage.stop();

    if (this.onRealmChosen) {
      this.onRealmChosen(realm);
    }
  }

  // Restore the Home Screen (when user clicks "Choose another realm" on card)
  show() {
    this.root.hidden = false;
    this.root.classList.remove('lifting', 'ready', 'loading');
    this.blocks.forEach(b => {
      b.classList.remove('chosen', 'gone');
      b.disabled = false;
      b.style.removeProperty('--p');
      const stepEl = b.querySelector('.step');
      if (stepEl) stepEl.textContent = '';
      const items = b.querySelectorAll('.route li');
      items.forEach(it => it.classList.remove('lit'));
    });
    this.items.forEach(it => {
      it.fade = 1;
      it.speed = 0.1;
      it.fit?.();
    });
    this.stage.resume();
  }
}
