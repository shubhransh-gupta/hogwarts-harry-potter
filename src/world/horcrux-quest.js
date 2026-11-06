// Horcrux Quest & Magical Progression System
// Lord Voldemort's 7 Horcruxes, Bonus Galleons & Enchanted Mystery Boxes
// Optimized for zero lag: No heavy per-entity PointLights (uses glowing emissive materials & beacons)
// Collapsible HUD dropdown tracker displaying only the active target by default

import * as THREE from 'three';
import { soundSynth } from '../audio/sound-synthesizer.js';

export const VOLDEMORT_VISIONS = {
  diary: {
    id: 'diary',
    name: 'Tom Riddle’s Diary',
    quote: '"I can make bad things happen to people who annoy me... I can make them hurt if I want to."',
    memoryTitle: '1943 · The Chamber of Secrets & Myrtle’s Murder',
    victim: 'Moaning Myrtle & Hogwarts Students',
    body: 'A chilling psychic shockwave strikes your mind! You see 16-year-old Tom Riddle in the girls’ lavatory speaking in sibilant Parseltongue. The massive green Basilisk lunges from the pipes. Student Myrtle Warren looks into its yellow eyes and collapses dead on the wet stone floor. Tom slices into his soul, binding the murder into this dark enchanted journal!',
    color: '#aa22bb'
  },
  ring: {
    id: 'ring',
    name: 'Marvolo Gaunt’s Ring',
    quote: '"The Riddle bloodline is extinguished tonight."',
    memoryTitle: '1943 · The Little Hangleton Massacre',
    victim: 'Tom Riddle Sr. & The Riddle Family',
    body: 'You are plunged into the shadows of the Riddle Manor parlor! Tom Riddle raises his wand with merciless eyes. Blinding flashes of green lightning illuminate the room as he slaughters his Muggle father and grandparents in cold blood. He frames his uncle Morfin Gaunt and curses Cadmus Peverell’s Resurrection Stone ring with dark soul magic!',
    color: '#00ff88'
  },
  locket: {
    id: 'locket',
    name: 'Salazar Slytherin’s Locket',
    quote: '"Drink it, elf! Every last burning drop!"',
    memoryTitle: 'The Sunken Cavern & The Inferi of the Deep',
    victim: 'Regulus Black & Kreacher the Elf',
    body: 'Freezing, pitch-black water surrounds you inside a towering sea cave! Lord Voldemort laughs as he forces the house-elf Kreacher to drink the burning Emerald Potion of Despair. As the victim crawls to the dark lake for water, hundreds of pale skeletal Inferi drag him beneath the depths, guarding Slytherin’s serpentine locket!',
    color: '#00e5ff'
  },
  cup: {
    id: 'cup',
    name: 'Helga Hufflepuff’s Cup',
    quote: '"A delightful vintage to die for, Madam Smith."',
    memoryTitle: 'The Poisoning of Hepzibah Smith',
    victim: 'Hepzibah Smith',
    body: 'Rich velvet and glittering antiques fade into view. Tom Riddle offers a courteous smile to elderly collector Hepzibah Smith while covertly slipping lethal Goblin poison into her teacup. As she gasps her last breath, Riddle seizes the two-handled golden chalice of Hufflepuff, tearing his soul to claim the founder’s relic!',
    color: '#ffea00'
  },
  diadem: {
    id: 'diadem',
    name: 'Rowena Ravenclaw’s Diadem',
    quote: '"Wit beyond measure is man’s greatest treasure... and now it is mine."',
    memoryTitle: 'The Albanian Forest Treachery',
    victim: 'The Grey Lady (Helena Ravenclaw)',
    body: 'The winds of Albania howl through pine trees! The ghost of Helena Ravenclaw screams as Tom Riddle, having extracted the diadem’s hiding place with false love, strikes down her spirit with dark curses. He defiles Rowena Ravenclaw’s sacred sapphire tiara, twisting its wisdom into dark eternal malice!',
    color: '#00b0ff'
  },
  nagini: {
    id: 'nagini',
    name: 'Nagini the Serpent',
    quote: '"Nagini... dinner."',
    memoryTitle: 'The Malfoy Manor & Shrieking Shack Executions',
    victim: 'Severus Snape & Charity Burbage',
    body: 'A terrifying vision fills your sight! Lord Voldemort stands over Severus Snape in the dust of the Shrieking Shack. With a cold flick of his wand, the 12-foot serpent strikes repeatedly, venom burning through the shadows as Voldemort sacrifices his most loyal servant to protect his final living Horcrux!',
    color: '#00e676'
  },
  voldemort: {
    id: 'voldemort',
    name: 'Lord Voldemort',
    quote: '"Avada Kedavra—NOOOOO!"',
    memoryTitle: 'The Rebound of the Elder Wand',
    victim: 'Lord Voldemort',
    body: 'The final emerald lightning bolt collides with your Expelliarmus! With every Horcrux severed, Voldemort’s mortality is stripped bare. The Elder Wand refuses to kill its true master—the Killing Curse rebounds, and Lord Voldemort disintegrates into ribbons of black ash, banishing his reign forever!',
    color: '#ff0033'
  }
};

export class HorcruxQuestManager {
  constructor(scene, player, dialogManager) {
    this.scene = scene;
    this.player = player;
    this.dialogManager = dialogManager;

    this.galleonsCollected = 0;
    this.horcruxesDestroyed = 0;
    this.totalHorcruxes = 7;

    this.horcruxClues = [
      { id: 'diary', name: 'Tom Riddle’s Diary', zone: 'The Great Hall', desc: 'Dark ink vapors seep from this enchanted tome near the hall hearth.' },
      { id: 'ring', name: 'Marvolo Gaunt’s Ring', zone: 'Hagrid’s Pumpkin Patch', desc: 'Cursed golden band set with the Resurrection stone on an altar.' },
      { id: 'locket', name: 'Salazar Slytherin’s Locket', zone: 'Depths of the Black Lake', desc: 'Submerged deep in the sunken cavern bed. Dive underwater to find it!' },
      { id: 'cup', name: 'Helga Hufflepuff’s Cup', zone: 'Platform 9¾ Vault', desc: 'Golden two-handled chalice gleaming in the station vault.' },
      { id: 'diadem', name: 'Rowena Ravenclaw’s Diadem', zone: 'Astronomy Tower Spire', desc: 'Silver tiara with sapphire tears high atop the mountain spires.' },
      { id: 'nagini', name: 'Nagini the Basilisk Kin', zone: 'Forbidden Forest', desc: '12-foot giant venomous viper slithering among ancient pines.' },
      { id: 'voldemort', name: 'Lord Voldemort (Climax)', zone: 'Castle Courtyard', desc: 'The Dark Lord himself has spawned! Strike him down with Avada Kedavra!' }
    ];

    this.horcruxes = [];
    this.coins = [];
    this.mysteryBoxes = [];
    this.voldemortBoss = null;
    this.activeDuelHorcrux = null;

    this.initHorcruxes();
    this.initCoins();
    this.initMysteryBoxes();
    this.initHUDTracker();
    this.initDuelHUD();
    this.updateCurrentTarget();
  }

  initDuelHUD() {
    let duelHud = document.getElementById('horcrux-duel-hud');
    if (!duelHud) {
      duelHud = document.createElement('div');
      duelHud.id = 'horcrux-duel-hud';
      duelHud.className = 'horcrux-duel-hud';
      duelHud.hidden = true;
      duelHud.innerHTML = `
        <div class="hd-badge">⚔️ DARK HORCRUX CONFRONTATION</div>
        <div class="hd-name" id="hd-name">Tom Riddle’s Diary</div>
        <div class="hd-hp-track">
          <div class="hd-hp-fill" id="hd-hp-fill" style="width: 100%;"></div>
        </div>
        <div class="hd-status" id="hd-status">HP: 3 / 3 · Strike with Wand Spells [Left-Click / Q-Z] or Press [E]!</div>
      `;
      document.body.appendChild(duelHud);
    }
    this.duelHudEl = duelHud;
  }

  initHUDTracker() {
    let tracker = document.getElementById('horcrux-tracker');
    if (!tracker) {
      tracker = document.createElement('div');
      tracker.id = 'horcrux-tracker';
      tracker.className = 'horcrux-tracker-hud collapsed';
      tracker.innerHTML = `
        <button class="ht-toggle-pill" id="ht-toggle-btn" aria-expanded="false" title="Click to view 7 Horcruxes details">
          <span class="ht-status-dot">⚡</span>
          <span class="ht-current-label" id="ht-current-label">Horcrux [1/7]: Tom Riddle's Diary</span>
          <span class="ht-arrow">▾</span>
        </button>
        <div class="ht-dropdown-panel" id="ht-dropdown-panel" hidden>
          <div class="ht-panel-header">
            <span class="ht-panel-title">⚡ HUNT FOR THE 7 HORCRUXES</span>
            <span class="ht-score" id="ht-score">0 / 7</span>
          </div>
          <div class="ht-current-clue" id="ht-current-clue">
            <div class="ht-clue-title">Current Objective:</div>
            <div class="ht-clue-name" id="ht-target-name">Tom Riddle's Diary</div>
            <div class="ht-clue-zone" id="ht-target-zone">📍 Location: The Great Hall</div>
            <p class="ht-clue-desc" id="ht-target-desc">Dark ink vapors seep from this enchanted tome. Cast Incendio or Avada Kedavra to destroy it!</p>
          </div>
          <div class="ht-checklist-label">Horcrux Checklist:</div>
          <div class="ht-pips" id="ht-pips">
            <div class="ht-pip-item" id="item-diary"><span class="ht-pip" id="pip-diary">📖</span> Tom Riddle’s Diary</div>
            <div class="ht-pip-item" id="item-ring"><span class="ht-pip" id="pip-ring">💍</span> Marvolo Gaunt’s Ring</div>
            <div class="ht-pip-item" id="item-locket"><span class="ht-pip" id="pip-locket">📿</span> Slytherin’s Locket</div>
            <div class="ht-pip-item" id="item-cup"><span class="ht-pip" id="pip-cup">🏆</span> Hufflepuff’s Cup</div>
            <div class="ht-pip-item" id="item-diadem"><span class="ht-pip" id="pip-diadem">👑</span> Ravenclaw’s Diadem</div>
            <div class="ht-pip-item" id="item-nagini"><span class="ht-pip" id="pip-nagini">🐍</span> Nagini the Serpent</div>
            <div class="ht-pip-item" id="item-voldemort"><span class="ht-pip" id="pip-voldemort">💀</span> Lord Voldemort</div>
          </div>
          <div class="ht-galleons">
            <span>🪙 Collected Galleons: <b id="ht-galleon-count">0</b></span>
          </div>
        </div>
      `;
      document.body.appendChild(tracker);

      const toggleBtn = tracker.querySelector('#ht-toggle-btn');
      const panel = tracker.querySelector('#ht-dropdown-panel');

      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isCollapsed = tracker.classList.toggle('collapsed');
        panel.hidden = isCollapsed;
        toggleBtn.setAttribute('aria-expanded', !isCollapsed);
        const arrow = toggleBtn.querySelector('.ht-arrow');
        if (arrow) arrow.textContent = isCollapsed ? '▾' : '▴';
      });

      // Close dropdown if clicked outside
      document.addEventListener('click', (e) => {
        if (!tracker.contains(e.target) && !tracker.classList.contains('collapsed')) {
          tracker.classList.add('collapsed');
          panel.hidden = true;
          toggleBtn.setAttribute('aria-expanded', 'false');
          const arrow = toggleBtn.querySelector('.ht-arrow');
          if (arrow) arrow.textContent = '▾';
        }
      });
    }
  }

  updateCurrentTarget() {
    const nextIdx = Math.min(this.horcruxesDestroyed, this.totalHorcruxes - 1);
    const target = this.horcruxClues[nextIdx];

    const label = document.getElementById('ht-current-label');
    if (label && target) {
      if (this.horcruxesDestroyed >= this.totalHorcruxes) {
        label.textContent = '🏆 All 7 Horcruxes Destroyed!';
      } else {
        label.textContent = `Horcrux [${this.horcruxesDestroyed + 1}/7]: ${target.name}`;
      }
    }

    const tName = document.getElementById('ht-target-name');
    const tZone = document.getElementById('ht-target-zone');
    const tDesc = document.getElementById('ht-target-desc');
    if (tName && target) tName.textContent = target.name;
    if (tZone && target) tZone.textContent = `📍 Location: ${target.zone}`;
    if (tDesc && target) tDesc.textContent = target.desc;
  }

  initHorcruxes() {
    const definitions = [
      {
        id: 'diary',
        name: 'Tom Riddle’s Diary',
        pos: new THREE.Vector3(26, 12.8, 46),
        zone: 'The Great Hall',
        auraColor: 0xaa22bb,
        createMesh: () => {
          const group = new THREE.Group();
          const coverMat = new THREE.MeshStandardMaterial({ color: 0x1c1a1f, roughness: 0.6 });
          const pagesMat = new THREE.MeshStandardMaterial({ color: 0xdfd3b8, roughness: 0.9 });
          const silverMat = new THREE.MeshStandardMaterial({ color: 0xc0c5ce, metalness: 0.8, roughness: 0.2 });

          const book = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 1.1), coverMat);
          group.add(book);

          const pages = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.18, 1.02), pagesMat);
          pages.position.x = 0.02;
          group.add(pages);

          [-0.38, 0.38].forEach(x => {
            [-0.5, 0.5].forEach(z => {
              const corner = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.24, 0.12), silverMat);
              corner.position.set(x, 0, z);
              group.add(corner);
            });
          });

          return group;
        }
      },
      {
        id: 'ring',
        name: 'Marvolo Gaunt’s Ring',
        pos: new THREE.Vector3(-66, 1.25, 94),
        zone: 'Hagrid’s Pumpkin Patch',
        auraColor: 0x00ff88,
        createMesh: () => {
          const group = new THREE.Group();
          const pedMat = new THREE.MeshStandardMaterial({ color: 0x3d3835, roughness: 0.85 });
          const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 0.85, 8), pedMat);
          ped.position.y = -0.4;
          group.add(ped);

          const goldMat = new THREE.MeshStandardMaterial({ color: 0xf5d033, metalness: 0.9, roughness: 0.15 });
          const ring = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.06, 8, 16), goldMat);
          ring.position.y = 0.15;
          ring.rotateX(Math.PI / 2);
          group.add(ring);

          const stoneMat = new THREE.MeshStandardMaterial({ color: 0x0f0c1b, roughness: 0.1, metalness: 0.5 });
          const stone = new THREE.Mesh(new THREE.OctahedronGeometry(0.14), stoneMat);
          stone.position.set(0, 0.26, 0.18);
          group.add(stone);

          return group;
        }
      },
      {
        id: 'locket',
        name: 'Salazar Slytherin’s Locket',
        pos: new THREE.Vector3(68, -3.8, -45),
        zone: 'Depths of the Black Lake',
        auraColor: 0x00ff66,
        createMesh: () => {
          const group = new THREE.Group();
          const goldMat = new THREE.MeshStandardMaterial({ color: 0xdfb022, metalness: 0.85, roughness: 0.2 });
          const emeraldMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });

          const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.15, 6), goldMat);
          body.rotateX(Math.PI / 2);
          group.add(body);

          const sCurve = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.04, 6, 12, Math.PI * 1.5), emeraldMat);
          sCurve.position.z = 0.09;
          group.add(sCurve);

          return group;
        }
      },
      {
        id: 'cup',
        name: 'Helga Hufflepuff’s Cup',
        pos: new THREE.Vector3(-196, 1.4, -88),
        zone: 'Platform 9¾ Vault',
        auraColor: 0xffea00,
        createMesh: () => {
          const group = new THREE.Group();
          const goldMat = new THREE.MeshStandardMaterial({ color: 0xffca28, metalness: 0.9, roughness: 0.1 });

          const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.15, 0.5, 12, 1, true), goldMat);
          bowl.position.y = 0.3;
          group.add(bowl);

          const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 8), goldMat);
          stem.position.y = -0.05;
          group.add(stem);

          const base = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.35, 0.08, 12), goldMat);
          base.position.y = -0.25;
          group.add(base);

          [-0.32, 0.32].forEach(x => {
            const handle = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.035, 6, 12, Math.PI), goldMat);
            handle.position.set(x, 0.28, 0);
            handle.rotation.z = x > 0 ? -Math.PI / 2 : Math.PI / 2;
            group.add(handle);
          });

          return group;
        }
      },
      {
        id: 'diadem',
        name: 'Rowena Ravenclaw’s Diadem',
        pos: new THREE.Vector3(58, 52.3, 18),
        zone: 'Astronomy Tower Spire',
        auraColor: 0x00e5ff,
        createMesh: () => {
          const group = new THREE.Group();
          const platMat = new THREE.MeshStandardMaterial({ color: 0xd8e6f0, metalness: 0.9, roughness: 0.15 });
          const sapphireMat = new THREE.MeshBasicMaterial({ color: 0x00b0ff });

          const band = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.05, 8, 16, Math.PI), platMat);
          band.rotateX(Math.PI / 2);
          group.add(band);

          const eagle = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.35, 4), platMat);
          eagle.position.set(0, 0.3, 0.32);
          group.add(eagle);

          const gem = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), sapphireMat);
          gem.position.set(0, 0.15, 0.34);
          group.add(gem);

          return group;
        }
      },
      {
        id: 'nagini',
        name: 'Nagini the Basilisk Kin',
        pos: new THREE.Vector3(-105, 1.2, 105),
        zone: 'Forbidden Forest',
        auraColor: 0x00e676,
        isCreature: true,
        createMesh: () => {
          const group = new THREE.Group();
          const skinMat = new THREE.MeshStandardMaterial({ color: 0x1a4329, roughness: 0.3, metalness: 0.1 });
          const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff1744 });

          this.snakeSegments = [];
          for (let s = 0; s < 10; s++) {
            const rad = s === 0 ? 0.28 : Math.max(0.08, 0.26 - s * 0.02);
            const seg = new THREE.Mesh(new THREE.SphereGeometry(rad, 10, 8), skinMat);
            seg.position.set(0, 0.2, -s * 0.45);
            group.add(seg);
            this.snakeSegments.push(seg);
          }

          const head = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.6, 6), skinMat);
          head.rotateX(-Math.PI / 2);
          head.position.set(0, 0.35, 0.2);
          group.add(head);

          [-0.14, 0.14].forEach(x => {
            const eye = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), eyeMat);
            eye.position.set(x, 0.42, 0.25);
            group.add(eye);
          });

          return group;
        }
      }
    ];

    definitions.forEach(def => {
      const mesh = def.createMesh();
      mesh.position.copy(def.pos);

      // Lightweight glowing beacon sphere (zero dynamic light cost)
      const beaconGeo = new THREE.SphereGeometry(0.2, 8, 8);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: def.auraColor,
        transparent: true,
        opacity: 0.9
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.y = 0.9;
      mesh.add(beacon);

      // Glowing dark ward shield around the Horcrux
      const wardGeo = new THREE.SphereGeometry(1.35, 12, 10);
      const wardMat = new THREE.MeshBasicMaterial({
        color: def.auraColor,
        wireframe: true,
        transparent: true,
        opacity: 0.5
      });
      const wardShield = new THREE.Mesh(wardGeo, wardMat);
      wardShield.position.y = 0.2;
      mesh.add(wardShield);

      this.scene.add(mesh);

      this.horcruxes.push({
        id: def.id,
        name: def.name,
        zone: def.zone,
        pos: def.pos,
        auraColor: def.auraColor,
        mesh,
        beacon,
        wardShield,
        hp: 3,
        maxHp: 3,
        isCreature: def.isCreature || false,
        isDestroyed: false,
        initialY: def.pos.y
      });
    });
  }

  initCoins() {
    const coinSpawns = [
      new THREE.Vector3(-190, 1.4, -98),
      new THREE.Vector3(-208, 1.4, -112),
      new THREE.Vector3(-165, 1.4, -75),
      new THREE.Vector3(-60, 30.8, -12),
      new THREE.Vector3(-45, 30.8, -25),
      new THREE.Vector3(38, 13.2, 54),
      new THREE.Vector3(44, 13.2, 65),
      new THREE.Vector3(26, 13.2, 28),
      new THREE.Vector3(24, 13.2, 42),
      new THREE.Vector3(58, 52.6, 22),
      new THREE.Vector3(130, 2.2, -115),
      new THREE.Vector3(115, 2.2, -125),
      new THREE.Vector3(-72, 1.4, 88),
      new THREE.Vector3(-62, 1.4, 98),
      new THREE.Vector3(-115, 1.4, 115),
      new THREE.Vector3(60, -2.5, -50),
      new THREE.Vector3(75, -3.2, -40),
      new THREE.Vector3(32, 13.2, 85)
    ];

    const coinGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.08, 12);
    coinGeo.rotateX(Math.PI / 2);
    // Emissive metallic material (zero dynamic light cost)
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x554400
    });

    coinSpawns.forEach((pos, idx) => {
      const mesh = new THREE.Mesh(coinGeo, coinMat);
      mesh.position.copy(pos);
      this.scene.add(mesh);
      this.coins.push({
        id: `coin_${idx}`,
        mesh,
        pos,
        isCollected: false,
        initialY: pos.y
      });
    });
  }

  initMysteryBoxes() {
    const boxDefs = [
      {
        id: 'box_expelliarmus',
        spellId: 'expelliarmus',
        spellName: 'Expelliarmus',
        hint: 'Disarming Charm (Fires crimson knockback beam)',
        pos: new THREE.Vector3(-55, 30.5, -18)
      },
      {
        id: 'box_sectumsempra',
        spellId: 'sectumsempra',
        spellName: 'Sectumsempra',
        hint: 'Dark Slashing Curse (Fires piercing silver blade arcs)',
        pos: new THREE.Vector3(55, 0.8, -45)
      },
      {
        id: 'box_crucio',
        spellId: 'crucio',
        spellName: 'Crucio',
        hint: 'Unforgivable Curse (Crackling crimson lightning)',
        pos: new THREE.Vector3(56, 52.2, 14)
      },
      {
        id: 'box_avadakedavra',
        spellId: 'avadakedavra',
        spellName: 'Avada Kedavra',
        hint: 'The Ultimate Killing Curse! (Emerald lightning of instant obliteration)',
        pos: new THREE.Vector3(-125, 1.2, 125)
      },
      {
        id: 'box_potions',
        spellId: 'bonus_galleons',
        spellName: 'Felix Felicis Cache',
        hint: 'Liquid Luck + 150 Golden Galleons!',
        pos: new THREE.Vector3(-78, 1.2, 98)
      },
      {
        id: 'box_elderwand',
        spellId: 'elder_power',
        spellName: 'Elder Wand Power Surge',
        hint: 'Amplifies all wand spells with +200% explosive radius!',
        pos: new THREE.Vector3(28, 12.8, 38)
      }
    ];

    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x2a1810,
      roughness: 0.5,
      metalness: 0.3
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xf5b041,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x332200
    });

    boxDefs.forEach(def => {
      const group = new THREE.Group();
      group.position.copy(def.pos);

      const chestBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.65, 0.85), boxMat);
      chestBase.position.y = 0.32;
      group.add(chestBase);

      const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 1.2, 10, 1, false, 0, Math.PI), brassMat);
      lid.position.set(0, 0.65, 0);
      lid.rotation.z = Math.PI / 2;
      group.add(lid);

      const lock = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.1), brassMat);
      lock.position.set(0, 0.45, 0.45);
      group.add(lock);

      this.scene.add(group);
      this.mysteryBoxes.push({
        id: def.id,
        spellId: def.spellId,
        spellName: def.spellName,
        hint: def.hint,
        pos: def.pos,
        group,
        isOpened: false
      });
    });
  }

  update(delta, elapsed, playerPos, wandMagic) {
    let nearbyDuelHorcrux = null;
    let minDuelDist = 14.0;

    // Animate Horcruxes (hovering, beacon pulsing, ward shields)
    this.horcruxes.forEach(h => {
      if (h.isDestroyed) return;

      if (!h.isCreature) {
        h.mesh.rotation.y += delta * 1.2;
        h.mesh.position.y = h.initialY + Math.sin(elapsed * 2.5 + h.pos.x) * 0.18;
      } else {
        if (this.snakeSegments) {
          this.snakeSegments.forEach((seg, sIdx) => {
            const wave = Math.sin(elapsed * 4 - sIdx * 0.65) * 0.22;
            seg.position.x = wave;
          });
        }
      }

      if (h.wardShield) {
        h.wardShield.rotation.y += delta * 1.8;
        h.wardShield.rotation.z += delta * 1.1;
      }

      if (h.beacon) {
        const sc = 0.85 + Math.sin(elapsed * 3.5) * 0.25;
        h.beacon.scale.set(sc, sc, sc);
      }

      const dist = playerPos.distanceTo(h.pos);
      if (dist < minDuelDist) {
        minDuelDist = dist;
        nearbyDuelHorcrux = h;
      }
    });

    // Update Dark Duel HUD
    if (nearbyDuelHorcrux) {
      this.activeDuelHorcrux = nearbyDuelHorcrux;
      if (this.duelHudEl) {
        this.duelHudEl.hidden = false;
        const nameEl = document.getElementById('hd-name');
        const fillEl = document.getElementById('hd-hp-fill');
        const statusEl = document.getElementById('hd-status');
        if (nameEl) nameEl.textContent = nearbyDuelHorcrux.name;
        if (fillEl) fillEl.style.width = `${Math.max(0, (nearbyDuelHorcrux.hp / nearbyDuelHorcrux.maxHp) * 100)}%`;
        if (statusEl) {
          statusEl.textContent = `HP: ${nearbyDuelHorcrux.hp} / ${nearbyDuelHorcrux.maxHp} · Cast Wand Spells [Left-Click / Q-Z] or Press [E]!`;
        }
      }
    } else {
      if (this.activeDuelHorcrux) {
        this.activeDuelHorcrux = null;
        if (this.duelHudEl) this.duelHudEl.hidden = true;
      }
    }

    // Animate Golden Galleons & check collection
    this.coins.forEach(c => {
      if (c.isCollected) return;

      c.mesh.rotation.z += delta * 3.5;
      c.mesh.position.y = c.initialY + Math.sin(elapsed * 3.0 + c.pos.x) * 0.12;

      if (playerPos.distanceTo(c.pos) < 2.2) {
        this.collectCoin(c);
      }
    });

    // Check proximity to Mystery Boxes
    this.mysteryBoxes.forEach(b => {
      if (b.isOpened) return;

      if (playerPos.distanceTo(b.pos) < 3.2) {
        this.dialogManager.setPrompt(`✨ Press <b>[E]</b> to Open Mystery Box (${b.spellName})`);
      }
    });

    // Update Voldemort Boss if active
    if (this.voldemortBoss && !this.voldemortBoss.isDefeated) {
      this.updateVoldemortBoss(delta, elapsed, playerPos);
    }
  }

  getNearbyHorcrux(playerPos, maxDistance = 6.0) {
    for (let i = 0; i < this.horcruxes.length; i++) {
      const h = this.horcruxes[i];
      if (!h.isDestroyed && playerPos.distanceTo(h.pos) < maxDistance) {
        return h;
      }
    }
    return null;
  }

  collectCoin(coin) {
    coin.isCollected = true;
    this.scene.remove(coin.mesh);
    this.galleonsCollected += 10;

    soundSynth.playCoinPickup();

    const galleonEl = document.getElementById('ht-galleon-count');
    if (galleonEl) galleonEl.textContent = this.galleonsCollected;

    this.dialogManager.showToast('गैलियन मिले!', `+10 Galleons! Total: ${this.galleonsCollected} 🪙`, 1800);
  }

  openNearbyMysteryBox(playerPos, wandMagic) {
    for (let i = 0; i < this.mysteryBoxes.length; i++) {
      const b = this.mysteryBoxes[i];
      if (!b.isOpened && playerPos.distanceTo(b.pos) < 3.8) {
        b.isOpened = true;
        this.scene.remove(b.group);
        soundSynth.playMysteryBoxOpen();

        if (wandMagic && b.spellId !== 'bonus_galleons' && b.spellId !== 'elder_power') {
          wandMagic.unlockSpell(b.spellId);
        } else if (b.spellId === 'bonus_galleons') {
          this.galleonsCollected += 150;
          const galleonEl = document.getElementById('ht-galleon-count');
          if (galleonEl) galleonEl.textContent = this.galleonsCollected;
        }

        this.dialogManager.showToast(
          `रहस्यमयी बक्सा खुला: ${b.spellName}!`,
          `Unlocked: ${b.spellName}! ${b.hint}`,
          5000
        );
        return true;
      }
    }
    return false;
  }

  checkSpellHit(hitPos, spellId, wandMagic) {
    for (let i = 0; i < this.horcruxes.length; i++) {
      const h = this.horcruxes[i];
      if (h.isDestroyed) continue;

      if (hitPos.distanceTo(h.pos) < 3.8) {
        this.damageHorcrux(h, spellId, wandMagic);
        return true;
      }
    }

    if (this.voldemortBoss && !this.voldemortBoss.isDefeated) {
      if (hitPos.distanceTo(this.voldemortBoss.pos) < 4.5) {
        this.damageVoldemort(spellId, wandMagic);
        return true;
      }
    }

    return false;
  }

  damageHorcrux(horcrux, spellId, wandMagic) {
    if (horcrux.isDestroyed) return;

    let damage = 1;
    if (spellId === 'avadakedavra') damage = 3;
    else if (spellId === 'incendio' || spellId === 'sectumsempra' || spellId === 'expelliarmus') damage = 2;

    horcrux.hp -= damage;
    soundSynth.playHorcruxHit();

    // Visual ward flash effect
    if (horcrux.wardShield) {
      horcrux.wardShield.material.color.setHex(0xff0033);
      horcrux.wardShield.scale.set(1.5, 1.5, 1.5);
      setTimeout(() => {
        if (horcrux.wardShield && !horcrux.isDestroyed) {
          horcrux.wardShield.material.color.setHex(horcrux.auraColor);
          horcrux.wardShield.scale.set(1.0, 1.0, 1.0);
        }
      }, 240);
    }

    // Dark soul damage sparks
    this.createDarkSoulBurst(horcrux.pos, 16);

    // Update Duel HUD
    if (this.duelHudEl) {
      this.duelHudEl.hidden = false;
      const nameEl = document.getElementById('hd-name');
      const fillEl = document.getElementById('hd-hp-fill');
      const statusEl = document.getElementById('hd-status');
      if (nameEl) nameEl.textContent = horcrux.name;
      if (fillEl) fillEl.style.width = `${Math.max(0, (horcrux.hp / horcrux.maxHp) * 100)}%`;
      if (statusEl) {
        statusEl.textContent = `HP: ${Math.max(0, horcrux.hp)} / ${horcrux.maxHp} · Cast Wand Spells [Left-Click / Q-Z] or Press [E]!`;
      }
    }

    if (horcrux.hp <= 0) {
      this.destroyHorcrux(horcrux, spellId, wandMagic);
    } else {
      this.dialogManager.showToast(
        `हॉरक्रक्स पर प्रहार!`,
        `⚔️ ${horcrux.name} struck! HP: ${horcrux.hp}/${horcrux.maxHp}`,
        1800
      );
    }
  }

  destroyHorcrux(horcrux, spellId, wandMagic) {
    horcrux.isDestroyed = true;
    this.horcruxesDestroyed++;

    soundSynth.playHorcruxDestroyed();
    soundSynth.playVoldemortVision();
    this.createDarkSoulBurst(horcrux.pos, 55);
    this.scene.remove(horcrux.mesh);

    // Hide duel HUD
    if (this.duelHudEl) this.duelHudEl.hidden = true;
    this.activeDuelHorcrux = null;

    const pip = document.getElementById(`pip-${horcrux.id}`);
    const item = document.getElementById(`item-${horcrux.id}`);
    if (pip) {
      pip.classList.add('destroyed');
      pip.textContent = '⚡';
    }
    if (item) {
      item.classList.add('destroyed');
    }

    const score = document.getElementById('ht-score');
    if (score) score.textContent = `${this.horcruxesDestroyed} / ${this.totalHorcruxes}`;

    this.updateCurrentTarget();

    // Trigger Voldemort Killing Vision Modal
    const vision = VOLDEMORT_VISIONS[horcrux.id];
    if (vision) {
      this.dialogManager.showVoldemortVision(vision);
    }

    if (this.horcruxesDestroyed === 6) {
      this.spawnLordVoldemortClimax(wandMagic);
    }
  }

  createDarkSoulBurst(pos, burstCount = 50) {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(burstCount * 3);
    const velocities = [];

    for (let i = 0; i < burstCount; i++) {
      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y + 0.5;
      positions[i * 3 + 2] = pos.z;

      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        Math.random() * 7 + 2,
        (Math.random() - 0.5) * 8
      ));
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x00ff66,
      size: 0.35,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const p = new THREE.Points(geo, mat);
    this.scene.add(p);

    let life = 0;
    const interval = setInterval(() => {
      life += 0.05;
      const arr = p.geometry.attributes.position.array;
      for (let i = 0; i < burstCount; i++) {
        arr[i * 3] += velocities[i].x * 0.05;
        arr[i * 3 + 1] += velocities[i].y * 0.05;
        arr[i * 3 + 2] += velocities[i].z * 0.05;
      }
      p.geometry.attributes.position.needsUpdate = true;
      mat.opacity = Math.max(0, 0.9 - life);

      if (life >= 1.0) {
        clearInterval(interval);
        this.scene.remove(p);
      }
    }, 50);
  }

  spawnLordVoldemortClimax(wandMagic) {
    if (wandMagic) wandMagic.unlockSpell('avadakedavra');

    const voldemortPos = new THREE.Vector3(40, 12.6, 58);
    const group = new THREE.Group();
    group.position.copy(voldemortPos);

    const robeMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 0.9 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xded8d0, roughness: 0.4 });
    const redEyeMat = new THREE.MeshBasicMaterial({ color: 0xff0033 });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.65, 1.85, 10), robeMat);
    body.position.y = 1.0;
    group.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 8), skinMat);
    head.position.y = 2.15;
    group.add(head);

    [-0.1, 0.1].forEach(x => {
      const eye = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.025, 0.06), redEyeMat);
      eye.position.set(x, 2.18, 0.28);
      group.add(eye);
    });

    const bossLight = new THREE.PointLight(0x00ff44, 2.8, 18);
    bossLight.position.set(0, 2.0, 0);
    group.add(bossLight);

    this.scene.add(group);

    this.voldemortBoss = {
      group,
      pos: voldemortPos,
      hp: 3,
      isDefeated: false
    };

    this.updateCurrentTarget();

    this.dialogManager.showToast(
      'लॉर्ड वोल्डमॉर्ट प्रकट हुआ!',
      'LORD VOLDEMORT HAS ENTERED THE COURTYARD! Strike him down with Avada Kedavra!',
      7000
    );
  }

  updateVoldemortBoss(delta, elapsed, playerPos) {
    if (!this.voldemortBoss || this.voldemortBoss.isDefeated) return;
    this.voldemortBoss.group.lookAt(playerPos.x, this.voldemortBoss.pos.y, playerPos.z);
    this.voldemortBoss.group.position.y = 12.6 + Math.sin(elapsed * 3.5) * 0.45;
  }

  damageVoldemort(spellId, wandMagic) {
    if (!this.voldemortBoss || this.voldemortBoss.isDefeated) return;

    const damage = spellId === 'avadakedavra' ? 3 : 1;
    this.voldemortBoss.hp -= damage;

    soundSynth.playSpellAvadaKedavra();

    if (this.voldemortBoss.hp <= 0) {
      this.voldemortBoss.isDefeated = true;
      this.horcruxesDestroyed++;

      soundSynth.playVoldemortVision();
      this.createDarkSoulBurst(this.voldemortBoss.pos, 75);
      this.scene.remove(this.voldemortBoss.group);

      const pip = document.getElementById('pip-voldemort');
      const item = document.getElementById('item-voldemort');
      if (pip) {
        pip.classList.add('destroyed');
        pip.textContent = '⚡';
      }
      if (item) {
        item.classList.add('destroyed');
      }

      const score = document.getElementById('ht-score');
      if (score) score.textContent = `7 / 7`;

      this.updateCurrentTarget();

      // Show Final Voldemort Defeat Vision Modal
      this.dialogManager.showVoldemortVision(VOLDEMORT_VISIONS.voldemort);

      this.dialogManager.showToast(
        'अंतिम विजय: वोल्डमॉर्ट पराजित!',
        'VICTORY! All 7 Horcruxes destroyed! Lord Voldemort is banished forever! +500 Gryffindor Points!',
        9000
      );
    } else {
      this.dialogManager.showToast(
        'वोल्डमॉर्ट पर प्रहार!',
        `Voldemort struck! HP remaining: ${this.voldemortBoss.hp}`,
        2200
      );
    }
  }
}
