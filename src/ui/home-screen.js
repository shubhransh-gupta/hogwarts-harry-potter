// Hogwarts Dehradun: Grand Home Screen & 3D Interactive Sanctum
// OpenDesign Architectural Standard: Editorial Gothic Typography, Perspective 3D Dioramas,
// Seamless Chapter Navigation, Drag-to-Rotate Physics, and Cinematic Audio Integration

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
    script: 'लखनऊ चारबाग · ९¾',
    subtitle: 'The Indo-Saracenic Gateway to Hogwarts',
    line: 'Platform 9¾ Express Line',
    season: 'Misty Winter Morning in Awadh',
    accent: '#c8402a',
    spawnId: 1,
    createModel: createMiniCharbagh,
    description: 'Between Platforms 9 and 10 of the majestic Indo-Saracenic red-brick arches of Lucknow Charbagh Station lies the enchanted barrier. Trust the magic, keep a steady pace, and emerge onto Platform 9¾ where the steam-belching 5972 engine awaits.',
    features: ['Indo-Saracenic Brick Barrier', 'Luggage Trolley Passage', 'Station Master Interaction', 'Vintage Gaslight Lanterns'],
    stations: [
      'Charbagh Portico Arches',
      'Pillars 9 & 10 Brick Barrier',
      'Platform 9¾ Enchanted Line',
      '5972 Luggage Trolley'
    ]
  },
  {
    id: 'express',
    name: '5972 Himalayan Engine',
    script: 'हॉगवॉर्ट्स एक्सप्रेस ५९७२',
    subtitle: 'Locomotive Crossing the Shivalik Viaduct',
    line: 'Mountain Steam Locomotive',
    season: 'Shivalik Ridge Pine Crossing',
    accent: '#d4af37',
    spawnId: 2,
    createModel: createMiniExpress,
    description: 'The iconic crimson locomotive steams north from the plains into the steep pine gorges of Dehradun. Roaring across the soaring mountain viaduct, thick white steam rises into the crisp Himalayan air as student carriages approach the castle.',
    features: ['Rideable 5972 Steam Engine', 'Soaring Mountain Viaduct', 'Interactive Conductor NPC', 'Volumetric Whistle Steam'],
    stations: [
      'Dehradun Foothills Ascent',
      'Arched Stone Viaduct',
      '5972 Crimson Engine Cab',
      'Himalayan Pine Highline'
    ]
  },
  {
    id: 'greathall',
    name: 'The Great Hall',
    script: 'द ग्रेट हॉल · हॉगवॉर्ट्स',
    subtitle: 'Ancient Feasting Chamber of the Founders',
    line: 'Hogwarts Castle Heart',
    season: '1,000 Floating Candles & Warm Hearth',
    accent: '#e8492a',
    spawnId: 4,
    createModel: createMiniGreatHall,
    description: 'Beneath the vaulted gothic ceiling enchanted to mirror the starry Himalayan night, long house tables gleam with golden goblets. Four house tapestries hang proudly as Professor McGonagall and the Sorting Hat welcome first-year students.',
    features: ['4 House Tapestry Banners', 'The Talking Sorting Hat', 'Floating Candelabras', 'Professor McGonagall NPC'],
    stations: [
      'Grand Castle Oak Portal',
      'Four House Wall Tapestries',
      'High Professor Podium',
      'The Sorting Hat Chair'
    ]
  },
  {
    id: 'courtyard',
    name: 'Castle Courtyard & Clock',
    script: 'हॉगवॉर्ट्स प्रांगण एवं घड़ी',
    subtitle: 'Paved Gothic Quadrangle & Transfiguration Cloister',
    line: 'Central Castle Grounds',
    season: 'Chilled Mountain Breezes & Chimes',
    accent: '#4a69bd',
    spawnId: 3,
    createModel: createMiniCourtyard,
    description: 'Surrounded by weathered stone cloisters and soaring buttresses, the courtyard fountain ripples under the shadow of the monumental Hogwarts Clock Tower. Paved flagstones lead outward to the mountain viaduct bridge and high ramparts.',
    features: ['Astronomical Clock Tower', 'Central Stone Fountain', 'Gothic Perimeter Cloisters', 'Viaduct Approach Bridge'],
    stations: [
      'Stone Fountain Quad',
      'The Grand Clock Tower',
      'Transfiguration Cloisters',
      'High Viaduct Bridge Approach'
    ]
  },
  {
    id: 'astronomy',
    name: 'Astronomy Tower Spire',
    script: 'एस्ट्रोनॉमी टॉवर शिखर',
    subtitle: 'Highest Lookout in the Garhwal Range',
    line: 'Celestial Observation Turret',
    season: 'Clear Himalayan Night Constellations',
    accent: '#8e44ad',
    spawnId: 5,
    createModel: createMiniAstronomy,
    description: 'The loftiest spire of Hogwarts Castle pierces the Himalayan cloud layer at over 680 meters elevation. Here, brass armillary spheres, lunar globes, and ancient telescopes track celestial alignments over the snowcapped peaks of Garhwal.',
    features: ['High-Altitude Sky Overlook', 'Brass Armillary Rings', 'Spiral Turret Stairs', '360° Mountain Panorama'],
    stations: [
      'Spiral Turret Stairs',
      'Observation Colonnade',
      'Armillary Dome Spire',
      'Garhwal Peak Lookout'
    ]
  },
  {
    id: 'quidditch',
    name: 'Quidditch Pitch & Nimbus 2000',
    script: 'क्विडिच पिच एवं झाड़ू',
    subtitle: 'High-Altitude Mountain Flying Grounds',
    line: 'Valley Flying Arena',
    season: 'Swift Valley Winds & Golden Snitch Flight',
    accent: '#27ae60',
    spawnId: 6,
    createModel: createMiniQuidditch,
    description: 'Nestled in a natural mountain amphitheater, the oval turf pitch is flanked by towering house spectator towers. Mount the hovering Nimbus 2000 broomstick at center field to soar through the goal hoops and chase the elusive Golden Snitch.',
    features: ['Mountable Nimbus 2000 Broom', 'Active Golden Snitch Chase', 'Six Golden Goal Hoops', 'Madam Hooch Flight Coach'],
    stations: [
      'House Spectator Towers',
      'Center Flying Turf',
      'Nimbus 2000 Broom Hover',
      'Golden Snitch Sky Chase'
    ]
  },
  {
    id: 'blacklake',
    name: 'The Black Lake & Willow',
    script: 'द ब्लैक लेक एवं विलो',
    subtitle: 'Deep Mountain Basin & Thrashing Roots',
    line: 'Great Lake Highland Basin',
    season: 'Rippling Glacial Waters & Mist',
    accent: '#0984e3',
    spawnId: 8,
    createModel: createMiniBlackLake,
    description: 'Fed by Himalayan snowmelt, the mysterious waters of the Black Lake cradle lantern-lit wooden rowboats. Dive into the deep lake with functional swimming physics, or tread cautiously around the thrashing limbs of the ancient Whomping Willow.',
    features: ['Real-Time Swimming Physics', 'Buoyant Water Bobbing', 'The Animated Whomping Willow', 'Floating Lantern Rowboats'],
    stations: [
      'Lakeside Wooden Jetty',
      'Floating Lantern Boats',
      'Deep Swimming Basin',
      'The Whomping Willow Roots'
    ]
  }
];

// 3D Perspective Diorama Stage for the Active Chapter (Ultra-lightweight)
class HeroDioramaStage {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: 'low-power'
    });
    this.renderer.setPixelRatio(1);
    this.renderer.shadowMap.enabled = false;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    this.camera.position.set(0, 1.25, 3.8);
    this.camera.lookAt(0, 0.05, 0);

    // Warm Hogwarts Key Lighting (zero shadow map overhead)
    this.keyLight = new THREE.DirectionalLight(0xffeedb, 2.5);
    this.keyLight.position.set(2.5, 3.5, 2.5);
    this.keyLight.castShadow = false;
    this.scene.add(this.keyLight);

    // Ambient mountain moonlight fill
    this.fillLight = new THREE.DirectionalLight(0x8fa8d6, 1.2);
    this.fillLight.position.set(-2.5, 1.2, -1.5);
    this.scene.add(this.fillLight);

    // Subtle hemisphere ambient fill
    this.hemiLight = new THREE.HemisphereLight(0xfffaed, 0x14161f, 0.85);
    this.scene.add(this.hemiLight);

    // Base obsidian stage disc
    const stageGeo = new THREE.CylinderGeometry(1.25, 1.35, 0.12, 24);
    const stageMat = new THREE.MeshToonMaterial({ color: 0x14161f });
    const stageMesh = new THREE.Mesh(stageGeo, stageMat);
    stageMesh.position.y = -0.56;
    this.scene.add(stageMesh);

    const rimGeo = new THREE.TorusGeometry(1.3, 0.035, 10, 48);
    rimGeo.rotateX(Math.PI / 2);
    const rimMesh = new THREE.Mesh(rimGeo, new THREE.MeshToonMaterial({ color: 0xd4af37 }));
    rimMesh.position.y = -0.52;
    this.scene.add(rimMesh);

    // Floating Golden Magical Spark Particles
    this.initMagicParticles();

    // Model Container
    this.modelPivot = new THREE.Group();
    this.scene.add(this.modelPivot);

    this.currentMesh = null;
    this.currentRealmId = null;
    this.rotationVelocity = 0.0035;
    this.isDragging = false;
    this.dragStartX = 0;
    this.lastDragDelta = 0;

    this.initDragControls();
    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.running = true;
    this.lastTime = performance.now();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initMagicParticles() {
    const particleCount = 45;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 2.8;
      positions[i * 3 + 1] = -0.4 + Math.random() * 2.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2.8;
      speeds[i] = 0.3 + Math.random() * 0.7;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particleSpeeds = speeds;

    const mat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.055,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);
  }

  initDragControls() {
    const onDown = (clientX) => {
      this.isDragging = true;
      this.dragStartX = clientX;
      this.lastDragDelta = 0;
    };

    const onMove = (clientX) => {
      if (!this.isDragging) return;
      const deltaX = clientX - this.dragStartX;
      this.dragStartX = clientX;
      this.lastDragDelta = deltaX;
      this.modelPivot.rotation.y += deltaX * 0.009;
    };

    const onUp = () => {
      this.isDragging = false;
    };

    this.canvas.addEventListener('mousedown', (e) => onDown(e.clientX));
    window.addEventListener('mousemove', (e) => onMove(e.clientX));
    window.addEventListener('mouseup', onUp);

    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches[0]) onDown(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches[0]) onMove(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchend', onUp);
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const w = Math.max(280, rect.width || 480);
    const h = Math.max(280, rect.height || 480);

    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  loadRealmModel(realm) {
    if (this.currentRealmId === realm.id) return;
    this.currentRealmId = realm.id;

    // Smooth model swap transition
    if (this.currentMesh) {
      const oldMesh = this.currentMesh;
      let scale = 1;
      const shrink = () => {
        scale -= 0.15;
        if (scale > 0.05) {
          oldMesh.scale.setScalar(scale);
          requestAnimationFrame(shrink);
        } else {
          this.modelPivot.remove(oldMesh);
        }
      };
      shrink();
    }

    const newMesh = realm.createModel();
    newMesh.scale.setScalar(0.05);
    this.modelPivot.add(newMesh);
    this.currentMesh = newMesh;

    let targetScale = 1;
    let currScale = 0.05;
    const grow = () => {
      currScale += (targetScale - currScale) * 0.22;
      if (Math.abs(targetScale - currScale) > 0.01) {
        newMesh.scale.setScalar(currScale);
        requestAnimationFrame(grow);
      } else {
        newMesh.scale.setScalar(1);
      }
    };
    grow();
  }

  animate() {
    if (!this.running) return;
    this.animId = requestAnimationFrame(this.animate);

    if (document.hidden) return;

    const now = performance.now();
    // Cap preview diorama to 30 FPS to save CPU/GPU cycles
    if (this.lastRenderTime && now - this.lastRenderTime < 33) return;
    this.lastRenderTime = now;

    const delta = Math.min(0.1, (now - this.lastTime) / 1000);
    this.lastTime = now;

    // Smooth inertia rotation when idle
    if (!this.isDragging) {
      if (Math.abs(this.lastDragDelta) > 0.1) {
        this.modelPivot.rotation.y += this.lastDragDelta * 0.005;
        this.lastDragDelta *= 0.94;
      } else {
        this.modelPivot.rotation.y += this.rotationVelocity;
      }
    }

    // Subtle breathing float on model
    if (this.currentMesh) {
      this.currentMesh.position.y = Math.sin(now * 0.0018) * 0.04;
    }

    // Float magical spark particles upward
    if (this.particles) {
      const pos = this.particles.geometry.attributes.position.array;
      for (let i = 0; i < pos.length / 3; i++) {
        pos[i * 3 + 1] += this.particleSpeeds[i] * delta * 0.6;
        if (pos[i * 3 + 1] > 2.0) {
          pos[i * 3 + 1] = -0.4;
          pos[i * 3 + 0] = (Math.random() - 0.5) * 2.8;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 2.8;
        }
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
      this.particles.rotation.y += delta * 0.1;
    }

    this.renderer.render(this.scene, this.camera);
  }

  stop() {
    this.running = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  resume() {
    if (!this.running) {
      this.running = true;
      this.lastTime = performance.now();
      this.animId = requestAnimationFrame(this.animate);
    }
  }

  dispose() {
    this.stop();
    if (this.renderer) {
      try {
        this.renderer.dispose();
        this.renderer.forceContextLoss();
      } catch (e) {}
    }
  }
}

// Grand Hogwarts Home Screen Controller
export class HomeScreen {
  constructor(onRealmChosen) {
    this.onRealmChosen = onRealmChosen;
    this.root = document.getElementById('home');
    this.canvas = document.getElementById('home-c');

    this.realms = HOGWARTS_REALMS;
    this.currentIndex = 0;
    this.activeRealm = this.realms[0];

    if (this.root && this.canvas) {
      this.init();
    }
  }

  init() {
    this.renderUI();
    this.canvas = document.getElementById('home-c');
    this.stage = new HeroDioramaStage(this.canvas);
    this.bindEvents();
    this.selectRealm(0);
  }

  renderUI() {
    // Construct rich, realistic, editorial Hogwarts Landing Experience
    this.root.innerHTML = `
      <!-- Fixed Ambient Golden Embers Layer -->
      <div class="hogwarts-ambient-glow"></div>

      <!-- Top Navigation Bar -->
      <nav class="hw-navbar">
        <div class="hw-nav-brand">
          <div class="hw-crest-seal">5972</div>
          <div class="hw-brand-text">
            <span class="hw-brand-latin">HOGWARTS DEHRADUN</span>
            <span class="hw-brand-deva">हिमालयन ९¾ एक्सप्रेस</span>
          </div>
        </div>

        <div class="hw-nav-status">
          <span class="status-dot"></span>
          <span class="status-text">Platform 9¾ Lucknow ➔ Himalayan Shivalik Spire</span>
        </div>

        <div class="hw-nav-actions">
          <button id="hw-btn-fullscreen" class="hw-ghost-btn" aria-label="Toggle Fullscreen">
            <span class="btn-icon">⛶</span>
            <span class="btn-label">Fullscreen</span>
          </button>
          <button id="hw-btn-sound" class="hw-ghost-btn" aria-label="Toggle Sound (Key M)">
            <span class="btn-icon">🎵</span>
            <span class="btn-label">Hedwig's Theme</span>
          </button>
          <button id="hw-btn-quick-play" class="hw-cta-btn">
            <span>Board Express Now</span>
            <span class="btn-arrow">➔</span>
          </button>
        </div>
      </nav>

      <!-- Main Interactive Sanctum & Hero Section -->
      <main class="hw-hero-sanctum">
        <!-- Left: Chapter Dossier & Action Controls -->
        <div class="hw-dossier-panel">
          <div class="chapter-badge">
            <span class="chapter-roman" id="dossier-chapter-num">CHAPTER 01 OF 07</span>
            <span class="chapter-line-tag" id="dossier-line-tag">Platform 9¾ Express Line</span>
          </div>

          <div class="hw-titles-block">
            <h1 class="dossier-title-deva" id="dossier-title-deva">लखनऊ चारबाग · ९¾</h1>
            <div class="dossier-title-latin" id="dossier-title-latin">Lucknow Charbagh Platform 9¾</div>
            <div class="dossier-subtitle" id="dossier-subtitle">The Indo-Saracenic Gateway to Hogwarts</div>
          </div>

          <p class="dossier-narrative" id="dossier-desc">
            Between Platforms 9 and 10 of the majestic Indo-Saracenic arches of Lucknow Charbagh Station lies the enchanted barrier. Walk straight through with confidence, board the scarlet 5972 engine, and journey into the mist-veiled pine mountains of Dehradun.
          </p>

          <!-- 4-Step Route Progress Line -->
          <div class="hw-itinerary-card">
            <div class="itinerary-header">
              <span class="itinerary-icon">🛤️</span>
              <span class="itinerary-label">EXPEDITION ITINERARY & STATIONS:</span>
            </div>
            <ol class="hw-route-timeline" id="dossier-route-list"></ol>
          </div>

          <!-- Feature Highlights Tags -->
          <div class="hw-feature-pills" id="dossier-features"></div>

          <!-- Primary Actions (Board Express / Wander) -->
          <div class="hw-action-dock">
            <button id="hw-board-express-btn" class="hw-cta-primary">
              <span class="btn-sheen"></span>
              <span class="btn-text">Board 5972 Express</span>
              <span class="btn-icon-right">🚂</span>
            </button>
            <button id="hw-wander-grounds-btn" class="hw-cta-secondary">
              <span class="btn-text">Wander Grounds</span>
              <span class="btn-icon-right">🌲</span>
            </button>
          </div>

          <div class="hw-keyboard-legend">
            <span>Controls:</span>
            <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> Walk · <kbd>Shift</kbd> Run · <kbd>Q</kbd>-<kbd>Z</kbd> Cast Wand Spells · <kbd>E</kbd> Mount Broom / Talk · <kbd>1-8</kbd> Spawn
          </div>
        </div>

        <!-- Right: 3D Miniature Artifact Viewing Chamber -->
        <div class="hw-stage-container">
          <div class="hw-stage-frame">
            <div class="stage-corner tl"></div>
            <div class="stage-corner tr"></div>
            <div class="stage-corner bl"></div>
            <div class="stage-corner br"></div>

            <div class="stage-view-badge">
              <span class="view-pulse"></span>
              <span>LIVE 3D ARTIFACT VIEWPORT</span>
            </div>

            <!-- The Three.js Canvas container -->
            <div class="canvas-viewport" id="viewport-box">
              <canvas id="home-c"></canvas>
            </div>

            <div class="stage-footer-hint">
              <span class="hint-icon">✦</span>
              <span>Click & drag to rotate diorama 360° · Use <kbd>←</kbd> <kbd>→</kbd> or 1-7 to cycle chapters</span>
            </div>
          </div>
        </div>
      </main>

      <!-- Bottom Horizontal Realm Carousel Ribbon -->
      <section class="hw-carousel-ribbon">
        <div class="ribbon-header">
          <span class="ribbon-title">HOGWARTS EXPEDITION CHAPTERS</span>
          <span class="ribbon-counter" id="ribbon-counter">01 / 07</span>
        </div>
        <div class="hw-cards-grid" id="hw-cards-grid"></div>
      </section>

      <!-- Marketing & Game Features Section -->
      <section class="hw-marketing-section">
        <div class="marketing-intro">
          <span class="gold-subtitle">THE FIRST CELL-SHADED HIMALAYAN HARRY POTTER ODYSSEY</span>
          <h2>Explore a Living, Enchanted Mountain World</h2>
          <p>Crafted with ultra-lightweight procedural WebGL geometry without 100MB downloads. Fast, responsive, and playable in your browser on desktop and mobile.</p>
        </div>

        <div class="hw-marketing-grid">
          <div class="marketing-card">
            <div class="mc-icon">⚡</div>
            <h3>Procedural 3D Realm</h3>
            <p>From the bustling platforms of Lucknow Charbagh to the Shivalik Viaduct and high Astronomy Spire, explore hand-sculpted procedural architecture that loads in under 1 second.</p>
          </div>

          <div class="marketing-card">
            <div class="mc-icon">🪄</div>
            <h3>7 Authentic Wand Spells</h3>
            <p>Harness Lumos, Expecto Patronum, Wingardium Leviosa, Incendio, Aguamenti, Alohomora, and Accio with dynamic procedural spell effects and interactive world reactions.</p>
          </div>

          <div class="marketing-card">
            <div class="mc-icon">🏊</div>
            <h3>Swimming & Aerial Flight</h3>
            <p>Dive into the Black Lake with functional buoyancy and stroke mechanics, or mount the hovering Nimbus 2000 broomstick to hunt the swift Golden Snitch above the pitch.</p>
          </div>

          <div class="marketing-card">
            <div class="mc-icon">📜</div>
            <h3>Bilingual Cultural Fusion</h3>
            <p>Experience a unique fusion of Indian heritage and British wizarding lore with bilingual cinema toasts and voice dialogues from McGonagall, Hagrid, and the Sorting Hat.</p>
          </div>
        </div>
      </section>
    `;

    // Populate Carousel Cards
    const grid = document.getElementById('hw-cards-grid');
    if (grid) {
      grid.innerHTML = '';
      this.realms.forEach((realm, idx) => {
        const card = document.createElement('button');
        card.className = `hw-ribbon-card ${idx === this.currentIndex ? 'active' : ''}`;
        card.dataset.index = idx;
        card.style.setProperty('--card-accent', realm.accent);
        card.innerHTML = `
          <div class="rc-num">0${idx + 1}</div>
          <div class="rc-content">
            <div class="rc-deva">${realm.script}</div>
            <div class="rc-latin">${realm.name}</div>
            <div class="rc-line">${realm.line}</div>
          </div>
        `;
        card.addEventListener('click', () => {
          this.selectRealm(idx);
        });
        grid.appendChild(card);
      });
    }
  }

  selectRealm(index) {
    if (index < 0 || index >= this.realms.length) return;
    this.currentIndex = index;
    const realm = this.realms[index];
    this.activeRealm = realm;

    // 1. Update 3D Stage Model
    this.stage.loadRealmModel(realm);

    // 2. Update Dossier Elements
    const chapNum = document.getElementById('dossier-chapter-num');
    if (chapNum) chapNum.textContent = `CHAPTER 0${index + 1} OF 07`;

    const lineTag = document.getElementById('dossier-line-tag');
    if (lineTag) lineTag.textContent = realm.line;

    const titleDeva = document.getElementById('dossier-title-deva');
    if (titleDeva) titleDeva.textContent = realm.script;

    const titleLatin = document.getElementById('dossier-title-latin');
    if (titleLatin) titleLatin.textContent = realm.name;

    const sub = document.getElementById('dossier-subtitle');
    if (sub) sub.textContent = realm.subtitle || realm.season;

    const desc = document.getElementById('dossier-desc');
    if (desc) desc.textContent = realm.description;

    // 3. Update Itinerary Timeline
    const routeList = document.getElementById('dossier-route-list');
    if (routeList) {
      routeList.innerHTML = realm.stations
        .map((st, i) => `
          <li class="timeline-step">
            <span class="step-dot"></span>
            <span class="step-text">${st}</span>
          </li>
        `)
        .join('');
    }

    // 4. Update Features
    const featContainer = document.getElementById('dossier-features');
    if (featContainer) {
      featContainer.innerHTML = realm.features
        .map(f => `<span class="feat-pill"><span class="fp-spark">✦</span> ${f}</span>`)
        .join('');
    }

    // 5. Update Carousel Active State
    const cards = document.querySelectorAll('.hw-ribbon-card');
    cards.forEach((c, idx) => {
      c.classList.toggle('active', idx === index);
    });

    const counter = document.getElementById('ribbon-counter');
    if (counter) counter.textContent = `0${index + 1} / 07`;

    // 6. Update Primary Action text
    const boardBtn = document.getElementById('hw-board-express-btn');
    if (boardBtn) {
      const btnText = boardBtn.querySelector('.btn-text');
      if (btnText) {
        btnText.textContent = index === 0 ? 'Board 5972 Express' : `Explore ${realm.name}`;
      }
    }
  }

  bindEvents() {
    // Quick Play from Nav
    const quickPlay = document.getElementById('hw-btn-quick-play');
    if (quickPlay) {
      quickPlay.addEventListener('click', () => this.launchGame(this.activeRealm));
    }

    // Board Express CTA
    const boardBtn = document.getElementById('hw-board-express-btn');
    if (boardBtn) {
      boardBtn.addEventListener('click', () => this.launchGame(this.activeRealm));
    }

    // Wander Grounds CTA
    const wanderBtn = document.getElementById('hw-wander-grounds-btn');
    if (wanderBtn) {
      wanderBtn.addEventListener('click', () => {
        const randIdx = Math.floor(Math.random() * this.realms.length);
        this.launchGame(this.realms[randIdx]);
      });
    }

    // Sound toggle from Nav
    const soundBtn = document.getElementById('hw-btn-sound');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const musicPlayBtn = document.getElementById('music-play-btn');
        if (musicPlayBtn) musicPlayBtn.click();
      });
    }

    // Fullscreen toggle from Nav
    const fsBtn = document.getElementById('hw-btn-fullscreen');
    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
          const docEl = document.documentElement;
          if (docEl.requestFullscreen) docEl.requestFullscreen();
          else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen();
        } else {
          if (document.exitFullscreen) document.exitFullscreen();
          else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        }
      });
    }

    // Keyboard cycling: Arrow Left / Right and 1-7
    window.addEventListener('keydown', (e) => {
      if (this.root && !this.root.hidden) {
        if (e.key === 'ArrowRight') {
          this.selectRealm((this.currentIndex + 1) % this.realms.length);
        } else if (e.key === 'ArrowLeft') {
          this.selectRealm((this.currentIndex - 1 + this.realms.length) % this.realms.length);
        } else if (e.key >= '1' && e.key <= '7') {
          this.selectRealm(parseInt(e.key, 10) - 1);
        } else if (e.key === 'Enter') {
          this.launchGame(this.activeRealm);
        }
      }
    });
  }

  async launchGame(realm) {
    this.root.classList.add('lifting');
    await new Promise(r => setTimeout(r, 650));
    this.root.hidden = true;
    if (this.stage) {
      this.stage.dispose();
      this.stage = null;
    }

    if (this.onRealmChosen) {
      this.onRealmChosen(realm);
    }
  }

  show() {
    this.root.hidden = false;
    this.root.classList.remove('lifting');
    if (!this.stage) {
      this.canvas = document.getElementById('home-c');
      if (this.canvas) {
        this.stage = new HeroDioramaStage(this.canvas);
        this.stage.setModel(this.realms[this.currentIndex]);
      }
    } else {
      this.stage.resume();
      this.stage.resize();
    }
  }
}
