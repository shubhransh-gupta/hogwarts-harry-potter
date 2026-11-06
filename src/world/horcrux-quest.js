// Horcrux Quest & Magical Progression System
// Lord Voldemort's 7 Horcruxes, Bonus Galleons & Enchanted Mystery Boxes
// Unlocks forbidden & advanced magic: Avada Kedavra, Expelliarmus, Sectumsempra, Crucio

import * as THREE from 'three';
import { soundSynth } from '../audio/sound-synthesizer.js';

export class HorcruxQuestManager {
  constructor(scene, player, dialogManager) {
    this.scene = scene;
    this.player = player;
    this.dialogManager = dialogManager;

    this.galleonsCollected = 0;
    this.horcruxesDestroyed = 0;
    this.totalHorcruxes = 7;

    this.horcruxes = [];
    this.coins = [];
    this.mysteryBoxes = [];
    this.voldemortBoss = null;

    this.initHorcruxes();
    this.initCoins();
    this.initMysteryBoxes();
    this.initHUDTracker();
  }

  initHUDTracker() {
    let tracker = document.getElementById('horcrux-tracker');
    if (!tracker) {
      tracker = document.createElement('div');
      tracker.id = 'horcrux-tracker';
      tracker.className = 'horcrux-tracker-hud';
      tracker.innerHTML = `
        <div class="ht-header">
          <span class="ht-icon">⚡</span>
          <span class="ht-title">HUNT FOR THE 7 HORCRUXES</span>
          <span class="ht-score" id="ht-score">0 / 7</span>
        </div>
        <div class="ht-pips" id="ht-pips">
          <span class="ht-pip" id="pip-diary" title="Tom Riddle's Diary">📖</span>
          <span class="ht-pip" id="pip-ring" title="Marvolo Gaunt's Ring">💍</span>
          <span class="ht-pip" id="pip-locket" title="Slytherin's Locket">📿</span>
          <span class="ht-pip" id="pip-cup" title="Hufflepuff's Cup">🏆</span>
          <span class="ht-pip" id="pip-diadem" title="Ravenclaw's Diadem">👑</span>
          <span class="ht-pip" id="pip-nagini" title="Nagini">🐍</span>
          <span class="ht-pip" id="pip-voldemort" title="Lord Voldemort">💀</span>
        </div>
        <div class="ht-galleons">
          <span>🪙 Galleons: <b id="ht-galleon-count">0</b></span>
          <span class="ht-sub-hint" id="ht-hint">Find and destroy all 7 Horcruxes to banish Voldemort!</span>
        </div>
      `;
      document.body.appendChild(tracker);
    }
  }

  initHorcruxes() {
    const definitions = [
      {
        id: 'diary',
        name: 'Tom Riddle’s Diary',
        pos: new THREE.Vector3(26, 12.8, 46),
        zone: 'The Great Hall',
        color: 0x111111,
        auraColor: 0x4a0e4e,
        createMesh: () => {
          const group = new THREE.Group();
          // Leather book
          const coverMat = new THREE.MeshStandardMaterial({ color: 0x1c1a1f, roughness: 0.6 });
          const pagesMat = new THREE.MeshStandardMaterial({ color: 0xdfd3b8, roughness: 0.9 });
          const silverMat = new THREE.MeshStandardMaterial({ color: 0xc0c5ce, metalness: 0.8, roughness: 0.2 });

          const book = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 1.1), coverMat);
          group.add(book);

          const pages = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.18, 1.02), pagesMat);
          pages.position.x = 0.02;
          group.add(pages);

          // Corner silver clasps
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
        color: 0xd4af37,
        auraColor: 0x00ff88,
        createMesh: () => {
          const group = new THREE.Group();
          // Stone Pedestal
          const pedMat = new THREE.MeshStandardMaterial({ color: 0x3d3835, roughness: 0.85 });
          const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 0.85, 8), pedMat);
          ped.position.y = -0.4;
          group.add(ped);

          // Golden Band with Black Cracked Resurrection Stone
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
        pos: new THREE.Vector3(68, -3.8, -45), // Deep inside Black Lake!
        zone: 'Depths of the Black Lake',
        color: 0x00cc44,
        auraColor: 0x00ff66,
        createMesh: () => {
          const group = new THREE.Group();
          const goldMat = new THREE.MeshStandardMaterial({ color: 0xdfb022, metalness: 0.85, roughness: 0.2 });
          const emeraldMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });

          // Heavy ornate locket body
          const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.15, 6), goldMat);
          body.rotateX(Math.PI / 2);
          group.add(body);

          // Glowing Serpentine 'S' emblem
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
        color: 0xfbc02d,
        auraColor: 0xffea00,
        createMesh: () => {
          const group = new THREE.Group();
          const goldMat = new THREE.MeshStandardMaterial({ color: 0xffca28, metalness: 0.9, roughness: 0.1 });

          // Chalice bowl and stem
          const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.15, 0.5, 12, 1, true), goldMat);
          bowl.position.y = 0.3;
          group.add(bowl);

          const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 8), goldMat);
          stem.position.y = -0.05;
          group.add(stem);

          const base = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.35, 0.08, 12), goldMat);
          base.position.y = -0.25;
          group.add(base);

          // Twin Badger handles
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
        color: 0x4fc3f7,
        auraColor: 0x00e5ff,
        createMesh: () => {
          const group = new THREE.Group();
          const platMat = new THREE.MeshStandardMaterial({ color: 0xd8e6f0, metalness: 0.9, roughness: 0.15 });
          const sapphireMat = new THREE.MeshBasicMaterial({ color: 0x00b0ff });

          // Arched tiara band with eagle wing spread
          const band = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.05, 8, 16, Math.PI), platMat);
          band.rotateX(Math.PI / 2);
          group.add(band);

          // Eagle finial & center teardrop sapphire
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
        color: 0x1b5e20,
        auraColor: 0x00e676,
        isCreature: true,
        createMesh: () => {
          const group = new THREE.Group();
          const skinMat = new THREE.MeshStandardMaterial({ color: 0x1a4329, roughness: 0.3, metalness: 0.1 });
          const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff1744 });

          // Multi-segment serpentine body
          this.snakeSegments = [];
          for (let s = 0; s < 10; s++) {
            const rad = s === 0 ? 0.28 : Math.max(0.08, 0.26 - s * 0.02);
            const seg = new THREE.Mesh(new THREE.SphereGeometry(rad, 10, 8), skinMat);
            seg.position.set(0, 0.2, -s * 0.45);
            group.add(seg);
            this.snakeSegments.push(seg);
          }

          // Viper head & glowing ruby eyes
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

      // Mystical levitating aura light
      const aura = new THREE.PointLight(def.auraColor, 1.8, 12);
      mesh.add(aura);

      // Levitating glow beacon
      const beaconGeo = new THREE.SphereGeometry(0.18, 8, 8);
      const beaconMat = new THREE.MeshBasicMaterial({ color: def.auraColor, transparent: true, opacity: 0.85 });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.y = 0.9;
      mesh.add(beacon);

      this.scene.add(mesh);

      this.horcruxes.push({
        id: def.id,
        name: def.name,
        zone: def.zone,
        pos: def.pos,
        mesh,
        aura,
        beacon,
        isCreature: def.isCreature || false,
        isDestroyed: false,
        initialY: def.pos.y
      });
    });
  }

  initCoins() {
    // 18 Spinning Golden Galleons spread across prominent exploration paths
    const coinSpawns = [
      new THREE.Vector3(-190, 1.4, -98), // Platform 9¾
      new THREE.Vector3(-208, 1.4, -112), // Locomotive tender
      new THREE.Vector3(-165, 1.4, -75), // Station concourse
      new THREE.Vector3(-60, 30.8, -12), // Mountain Viaduct midspan
      new THREE.Vector3(-45, 30.8, -25), // Viaduct arch
      new THREE.Vector3(38, 13.2, 54), // Castle Courtyard
      new THREE.Vector3(44, 13.2, 65), // Sundial lawn
      new THREE.Vector3(26, 13.2, 28), // Great Hall entrance
      new THREE.Vector3(24, 13.2, 42), // High table
      new THREE.Vector3(58, 52.6, 22), // Astronomy Tower walkway
      new THREE.Vector3(130, 2.2, -115), // Quidditch Goal post
      new THREE.Vector3(115, 2.2, -125), // Quidditch Pitch turf
      new THREE.Vector3(-72, 1.4, 88), // Hagrid's Doorstep
      new THREE.Vector3(-62, 1.4, 98), // Giant Pumpkin patch
      new THREE.Vector3(-115, 1.4, 115), // Forbidden Forest clearing
      new THREE.Vector3(60, -2.5, -50), // Black Lake sunken boat
      new THREE.Vector3(75, -3.2, -40), // Black Lake deep trench
      new THREE.Vector3(32, 13.2, 85) // Clock Tower arch
    ];

    const coinGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.08, 14);
    coinGeo.rotateX(Math.PI / 2);
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x443300
    });

    coinSpawns.forEach((pos, idx) => {
      const mesh = new THREE.Mesh(coinGeo, coinMat);
      mesh.position.copy(pos);
      mesh.castShadow = true;

      const coinLight = new THREE.PointLight(0xffe066, 0.8, 4);
      mesh.add(coinLight);

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
    // 6 Enchanted Mystery Boxes unlocking powerful spells
    const boxDefs = [
      {
        id: 'box_expelliarmus',
        spellId: 'expelliarmus',
        spellName: 'Expelliarmus',
        hint: 'Disarming Charm (Fires crimson knockback beam)',
        pos: new THREE.Vector3(-55, 30.5, -18) // Viaduct overlook
      },
      {
        id: 'box_sectumsempra',
        spellId: 'sectumsempra',
        spellName: 'Sectumsempra',
        hint: 'Dark Slashing Curse (Fires piercing silver blade arcs)',
        pos: new THREE.Vector3(55, 0.8, -45) // Black Lake Island shore
      },
      {
        id: 'box_crucio',
        spellId: 'crucio',
        spellName: 'Crucio',
        hint: 'Unforgivable Curse (Crackling crimson lightning)',
        pos: new THREE.Vector3(56, 52.2, 14) // Astronomy Tower apex
      },
      {
        id: 'box_avadakedavra',
        spellId: 'avadakedavra',
        spellName: 'Avada Kedavra',
        hint: 'The Ultimate Killing Curse! (Emerald lightning of instant obliteration)',
        pos: new THREE.Vector3(-125, 1.2, 125) // Deep Forbidden Forest grove
      },
      {
        id: 'box_potions',
        spellId: 'bonus_galleons',
        spellName: 'Felix Felicis Cache',
        hint: 'Liquid Luck + 150 Golden Galleons!',
        pos: new THREE.Vector3(-78, 1.2, 98) // Behind Hagrid's hut
      },
      {
        id: 'box_elderwand',
        spellId: 'elder_power',
        spellName: 'Elder Wand Power Surge',
        hint: 'Amplifies all wand spells with +200% explosive radius!',
        pos: new THREE.Vector3(28, 12.8, 38) // Great Hall podium
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
      roughness: 0.2
    });

    boxDefs.forEach(def => {
      const group = new THREE.Group();
      group.position.copy(def.pos);

      // Chest Base & Curved Lid
      const chestBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.65, 0.85), boxMat);
      chestBase.position.y = 0.32;
      group.add(chestBase);

      const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 1.2, 12, 1, false, 0, Math.PI), brassMat);
      lid.position.set(0, 0.65, 0);
      lid.rotation.z = Math.PI / 2;
      group.add(lid);

      // Luminous Rune Lock
      const lock = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.1), brassMat);
      lock.position.set(0, 0.45, 0.45);
      group.add(lock);

      const boxLight = new THREE.PointLight(0xffaa22, 1.2, 6);
      boxLight.position.set(0, 0.7, 0);
      group.add(boxLight);

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
    // 1. Animate Horcruxes (hovering, rotating, aura pulsing)
    this.horcruxes.forEach(h => {
      if (h.isDestroyed) return;

      if (!h.isCreature) {
        h.mesh.rotation.y += delta * 1.2;
        h.mesh.position.y = h.initialY + Math.sin(elapsed * 2.5 + h.pos.x) * 0.18;
      } else {
        // Nagini serpentine slither motion!
        if (this.snakeSegments) {
          this.snakeSegments.forEach((seg, sIdx) => {
            const wave = Math.sin(elapsed * 4 - sIdx * 0.65) * 0.22;
            seg.position.x = wave;
          });
        }
      }

      h.aura.intensity = 1.2 + Math.sin(elapsed * 3.5) * 0.6;
    });

    // 2. Animate Golden Galleons & check collection
    this.coins.forEach(c => {
      if (c.isCollected) return;

      c.mesh.rotation.z += delta * 3.5;
      c.mesh.position.y = c.initialY + Math.sin(elapsed * 3.0 + c.pos.x) * 0.12;

      // Distance to player
      if (playerPos.distanceTo(c.pos) < 2.2) {
        this.collectCoin(c);
      }
    });

    // 3. Check proximity to Mystery Boxes
    this.mysteryBoxes.forEach(b => {
      if (b.isOpened) return;

      if (playerPos.distanceTo(b.pos) < 3.2) {
        this.dialogManager.setPrompt(`✨ Press <b>[E]</b> to Open Mystery Box (${b.spellName})`);
      }
    });

    // 4. Update Voldemort Boss if active
    if (this.voldemortBoss && !this.voldemortBoss.isDefeated) {
      this.updateVoldemortBoss(delta, elapsed, playerPos);
    }
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

        // Unlock spell or grant bonus
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

  // Spell impact check against Horcruxes
  checkSpellHit(hitPos, spellId, wandMagic) {
    for (let i = 0; i < this.horcruxes.length; i++) {
      const h = this.horcruxes[i];
      if (h.isDestroyed) continue;

      if (hitPos.distanceTo(h.pos) < 3.5) {
        this.destroyHorcrux(h, spellId, wandMagic);
        return true;
      }
    }

    // Check hit against Voldemort
    if (this.voldemortBoss && !this.voldemortBoss.isDefeated) {
      if (hitPos.distanceTo(this.voldemortBoss.pos) < 4.0) {
        this.damageVoldemort(spellId, wandMagic);
        return true;
      }
    }

    return false;
  }

  destroyHorcrux(horcrux, spellId, wandMagic) {
    horcrux.isDestroyed = true;
    this.horcruxesDestroyed++;

    soundSynth.playHorcruxDestroyed();

    // Spawn dark explosive smoke burst
    this.createDarkSoulBurst(horcrux.pos);

    // Remove mesh from scene
    this.scene.remove(horcrux.mesh);

    // Update HUD
    const pip = document.getElementById(`pip-${horcrux.id}`);
    if (pip) {
      pip.classList.add('destroyed');
      pip.textContent = '⚡';
    }

    const score = document.getElementById('ht-score');
    if (score) score.textContent = `${this.horcruxesDestroyed} / ${this.totalHorcruxes}`;

    this.dialogManager.showToast(
      `हॉरक्रक्स नष्ट: ${horcrux.name}!`,
      `HORCRUX DESTROYED! [${this.horcruxesDestroyed}/7] Soul fragment banished!`,
      5500
    );

    // Check if 6 Horcruxes are destroyed -> Trigger Climax: Lord Voldemort Duel!
    if (this.horcruxesDestroyed === 6) {
      this.spawnLordVoldemortClimax(wandMagic);
    }
  }

  createDarkSoulBurst(pos) {
    const burstCount = 60;
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
    // Unlock Avada Kedavra if not already unlocked!
    if (wandMagic) wandMagic.unlockSpell('avadakedavra');

    const voldemortPos = new THREE.Vector3(40, 12.6, 58); // Castle Courtyard
    const group = new THREE.Group();
    group.position.copy(voldemortPos);

    // Dark Lord Mesh: billowing charcoal robes, chalk-white gaunt face, snake-slit eyes, yew wand
    const robeMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 0.9 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xded8d0, roughness: 0.4 });
    const redEyeMat = new THREE.MeshBasicMaterial({ color: 0xff0033 });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.65, 1.85, 12), robeMat);
    body.position.y = 1.0;
    group.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 10), skinMat);
    head.position.y = 2.15;
    group.add(head);

    [-0.1, 0.1].forEach(x => {
      const eye = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.025, 0.06), redEyeMat);
      eye.position.set(x, 2.18, 0.28);
      group.add(eye);
    });

    // Dark Aura Light
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

    const hint = document.getElementById('ht-hint');
    if (hint) hint.innerHTML = '⚡ <b>LORD VOLDEMORT HAS SPAWNED IN THE COURTYARD!</b> Use <kbd>Avada Kedavra</kbd> or <kbd>Incendio</kbd> to defeat him!';

    this.dialogManager.showToast(
      'लॉर्ड वोल्डमॉर्ट प्रकट हुआ!',
      'LORD VOLDEMORT HAS ENTERED THE COURTYARD! Strike him down to finish the 7th Horcrux!',
      7000
    );
  }

  updateVoldemortBoss(delta, elapsed, playerPos) {
    if (!this.voldemortBoss || this.voldemortBoss.isDefeated) return;

    // Face player
    this.voldemortBoss.group.lookAt(playerPos.x, this.voldemortBoss.pos.y, playerPos.z);

    // Billowing hovering motion
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

      this.createDarkSoulBurst(this.voldemortBoss.pos);
      this.scene.remove(this.voldemortBoss.group);

      const pip = document.getElementById('pip-voldemort');
      if (pip) {
        pip.classList.add('destroyed');
        pip.textContent = '⚡';
      }

      const score = document.getElementById('ht-score');
      if (score) score.textContent = `7 / 7`;

      const hint = document.getElementById('ht-hint');
      if (hint) hint.innerHTML = '🏆 <b>VOLDEMORT IS FINISHED! ALL 7 HORCRUXES DESTROYED! HOGWARTS IS SAVED!</b>';

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
