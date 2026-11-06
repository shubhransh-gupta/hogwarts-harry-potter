// Wand Magic System & Movie-Grade Spell Casting Engine
// Lumos, Expecto Patronum, Wingardium Leviosa, Incendio, Aguamenti, Alohomora, Accio
// Features authentic "Swish and Flick" wand motions, trailing particle ribbon physics,
// dynamic moving point lights, explosive impact detonations, scorch marks, and camera shake.

import * as THREE from 'three';
import { soundSynth } from '../audio/sound-synthesizer.js';

export class WandMagic {
  constructor(scene, player, worldManager = null) {
    this.scene = scene;
    this.player = player;
    this.worldManager = worldManager;

    this.spells = [
      { id: 'lumos', name: 'Lumos', key: '1', keyAlt: 'Q', color: '#88d8ff', desc: 'Illuminating Wand Light', unlocked: true },
      { id: 'patronus', name: 'Expecto Patronum', key: '2', keyAlt: 'E', color: '#d8f4ff', desc: 'Silver Stag Guardian', unlocked: true },
      { id: 'leviosa', name: 'Wingardium Leviosa', key: '3', keyAlt: 'R', color: '#ffd54f', desc: 'Levitation Enchantment', unlocked: true },
      { id: 'incendio', name: 'Incendio', key: '4', keyAlt: 'F', color: '#ff5722', desc: 'Crackling Fire Burst', unlocked: true },
      { id: 'aguamenti', name: 'Aguamenti', key: '5', keyAlt: 'C', color: '#00bcd4', desc: 'Pure Spring Water Jet', unlocked: true },
      { id: 'alohomora', name: 'Alohomora', key: '6', keyAlt: 'X', color: '#ffb300', desc: 'Unlocking Charm', unlocked: true },
      { id: 'accio', name: 'Accio', key: '7', keyAlt: 'Z', color: '#ab47bc', desc: 'Summoning Charm', unlocked: true },
      { id: 'avadakedavra', name: 'Avada Kedavra', key: '8', keyAlt: 'G', color: '#00ff44', desc: 'The Killing Curse (Emerald Obliteration)', unlocked: false },
      { id: 'expelliarmus', name: 'Expelliarmus', key: '9', keyAlt: 'H', color: '#ff2222', desc: 'Disarming Charm (Crimson Stun)', unlocked: false },
      { id: 'sectumsempra', name: 'Sectumsempra', key: '0', keyAlt: 'J', color: '#d8e6f0', desc: 'Dark Slashing Curse (Silver Crescent)', unlocked: false }
    ];

    this.activeSpellIndex = 0;
    this.isLumosActive = false;
    this.horcruxManager = null;

    // Lumos Wand Tip Light & Radial Glow Halo
    this.lumosLight = new THREE.PointLight(0xb0e8ff, 0, 18);
    this.scene.add(this.lumosLight);

    const orbGeo = new THREE.SphereGeometry(0.14, 16, 12);
    const orbMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
    this.lumosOrb = new THREE.Mesh(orbGeo, orbMat);
    this.scene.add(this.lumosOrb);

    // Wand Tip Muzzle Flash
    this.wandFlashLight = new THREE.PointLight(0xffffff, 0, 8);
    this.scene.add(this.wandFlashLight);
    this.wandFlashTimer = 0;

    // Active projectiles, particles, and impact effects
    this.projectiles = [];
    this.levitatingObjects = [];
    this.particles = [];
    this.scorchMarks = [];

    // Camera shake intensity
    this.cameraShakeIntensity = 0;

    // High-performance particle system pool
    this.maxParticles = 600;
    this.particlePositions = new Float32Array(this.maxParticles * 3);
    this.particleColors = new Float32Array(this.maxParticles * 3);
    this.particleData = [];

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(this.particleColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particlePoints = new THREE.Points(pGeo, pMat);
    this.scene.add(this.particlePoints);
  }

  setWorldManager(wm) {
    this.worldManager = wm;
  }

  setHorcruxManager(hm) {
    this.horcruxManager = hm;
  }

  unlockSpell(spellId) {
    const s = this.spells.find(sp => sp.id === spellId);
    if (s) {
      s.unlocked = true;
    }
  }

  getActiveSpell() {
    return this.spells[this.activeSpellIndex];
  }

  selectSpell(index) {
    if (index >= 0 && index < this.spells.length) {
      const target = this.spells[index];
      if (target.unlocked) {
        this.activeSpellIndex = index;
      }
    }
  }

  nextSpell() {
    this.activeSpellIndex = (this.activeSpellIndex + 1) % this.spells.length;
    return this.getActiveSpell();
  }

  prevSpell() {
    this.activeSpellIndex = (this.activeSpellIndex - 1 + this.spells.length) % this.spells.length;
    return this.getActiveSpell();
  }

  castActiveSpell(interactiveTargets = []) {
    const spell = this.getActiveSpell();
    return this.castSpellById(spell.id, interactiveTargets);
  }

  triggerWandCastFlash(colorHex) {
    if (this.player && this.player.playCastAnimation) {
      this.player.playCastAnimation();
    }
    const wandPos = this.player.getWandTipWorldPosition();
    this.wandFlashLight.color.setHex(colorHex);
    this.wandFlashLight.intensity = 5.0;
    this.wandFlashLight.position.copy(wandPos);
    this.wandFlashTimer = 0.12;

    // Spawn 10 bursting sparks at wand tip
    this.spawnParticleBurst(wandPos, colorHex, 12, 4.0);
  }

  castSpellById(spellId, interactiveTargets = []) {
    const wandPos = this.player.getWandTipWorldPosition();
    const forwardVec = new THREE.Vector3(
      Math.sin(this.player.mesh.rotation.y),
      0,
      Math.cos(this.player.mesh.rotation.y)
    ).normalize();

    switch (spellId) {
      case 'lumos':
        return this.castLumos();
      case 'patronus':
        return this.castPatronus(wandPos, forwardVec);
      case 'leviosa':
        return this.castLeviosa(wandPos, forwardVec, interactiveTargets);
      case 'incendio':
        return this.castIncendio(wandPos, forwardVec);
      case 'aguamenti':
        return this.castAguamenti(wandPos, forwardVec);
      case 'alohomora':
        return this.castAlohomora(wandPos, forwardVec);
      case 'accio':
        return this.castAccio(wandPos, forwardVec);
      case 'avadakedavra':
        return this.castAvadaKedavra(wandPos, forwardVec);
      case 'expelliarmus':
        return this.castExpelliarmus(wandPos, forwardVec);
      case 'sectumsempra':
        return this.castSectumsempra(wandPos, forwardVec);
      default:
        return null;
    }
  }

  // 1. LUMOS / NOX
  castLumos() {
    this.isLumosActive = !this.isLumosActive;
    soundSynth.playSpellLumos(this.isLumosActive);

    this.lumosLight.intensity = this.isLumosActive ? 4.5 : 0;
    this.lumosOrb.material.opacity = this.isLumosActive ? 1.0 : 0.0;

    const wandPos = this.player.getWandTipWorldPosition();
    this.triggerWandCastFlash(0xb0e8ff);

    if (this.isLumosActive) {
      // Spawn floating radiant dust motes around the player
      for (let i = 0; i < 25; i++) {
        const offset = new THREE.Vector3(
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 3
        );
        this.addParticle(wandPos.clone().add(offset), new THREE.Vector3(0, 0.4 + Math.random() * 0.4, 0), 0xd8f4ff, 2.5);
      }
    }

    return {
      spell: this.isLumosActive ? 'Lumos!' : 'Nox!',
      color: '#88d8ff',
      message: this.isLumosActive ? 'Wand ignited with radiant white light' : 'Wand light extinguished'
    };
  }

  // 2. EXPECTO PATRONUM (Silver Stag Patronus)
  castPatronus(wandPos, forwardVec) {
    soundSynth.playSpellPatronus();
    this.triggerWandCastFlash(0xecf8ff);
    this.cameraShakeIntensity = 0.08;

    // Create silver stag spirit mesh with translucent ethereal shader
    const patronusGroup = new THREE.Group();
    patronusGroup.position.copy(wandPos);

    const stagMat = new THREE.MeshBasicMaterial({
      color: 0xecf8ff,
      transparent: true,
      opacity: 0.9,
      wireframe: false
    });

    // Anatomical stag body
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.48, 1.8, 10), stagMat);
    body.rotation.z = Math.PI / 2;
    body.position.y = 1.0;
    patronusGroup.add(body);

    // Branched majestic antlers
    [-0.22, 0.22].forEach(x => {
      const antler = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.07, 1.1, 6), stagMat);
      antler.position.set(x, 2.2, 0.7);
      antler.rotation.z = x * 1.6;
      antler.rotation.x = -0.4;
      patronusGroup.add(antler);

      // Antler prongs
      const prong = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.04, 0.4, 6), stagMat);
      prong.position.set(x * 1.8, 2.4, 0.5);
      prong.rotation.z = x * 2.2;
      patronusGroup.add(prong);
    });

    // Neck & Head
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.9, 8), stagMat);
    neck.position.set(0, 1.45, 0.75);
    neck.rotation.x = -Math.PI / 4;
    patronusGroup.add(neck);

    const head = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.65, 8), stagMat);
    head.position.set(0, 1.78, 1.15);
    head.rotation.x = Math.PI / 2;
    patronusGroup.add(head);

    // Ethereal silver aura ring
    const auraGeo = new THREE.TorusGeometry(1.2, 0.05, 8, 24);
    auraGeo.rotateX(Math.PI / 2);
    const auraMesh = new THREE.Mesh(auraGeo, stagMat);
    auraMesh.position.y = 1.0;
    patronusGroup.add(auraMesh);

    // Dynamic silver moonlight illumination
    const stagLight = new THREE.PointLight(0xcceeff, 5.0, 32);
    stagLight.position.y = 1.2;
    patronusGroup.add(stagLight);

    this.scene.add(patronusGroup);

    this.projectiles.push({
      mesh: patronusGroup,
      velocity: forwardVec.clone().multiplyScalar(24).add(new THREE.Vector3(0, 3.5, 0)),
      light: stagLight,
      color: 0xcceeff,
      life: 0,
      maxLife: 3.5,
      type: 'patronus'
    });

    return {
      spell: 'Expecto Patronum!',
      color: '#d8f4ff',
      message: 'A radiant silver stag patronus charges forth!'
    };
  }

  // 3. WINGARDIUM LEVIOSA (Object Levitation)
  castLeviosa(wandPos, forwardVec, targets = []) {
    soundSynth.playSpellLeviosa();
    this.triggerWandCastFlash(0xffd54f);

    // Check for nearby levitatable objects (e.g. Hagrid's giant pumpkins)
    let levitatedTarget = null;
    let minDist = 35;

    targets.forEach(obj => {
      if (obj.userData && obj.userData.isLevitatable) {
        const objPos = new THREE.Vector3();
        obj.getWorldPosition(objPos);
        const dist = objPos.distanceTo(wandPos);
        if (dist < minDist) {
          minDist = dist;
          levitatedTarget = obj;
        }
      }
    });

    if (levitatedTarget) {
      levitatedTarget.userData.isFloating = !levitatedTarget.userData.isFloating;
      levitatedTarget.userData.targetY = levitatedTarget.userData.isFloating ? levitatedTarget.userData.baseY + 6.0 : levitatedTarget.userData.baseY;
      this.levitatingObjects.push(levitatedTarget);

      // Golden levitation aura particles around the pumpkin
      const targetPos = new THREE.Vector3();
      levitatedTarget.getWorldPosition(targetPos);
      this.spawnParticleBurst(targetPos, 0xffd54f, 25, 3.0);

      return {
        spell: 'Wingardium Leviosa!',
        color: '#ffd54f',
        message: 'Swish and flick! Giant pumpkin floating gracefully in mid-air!'
      };
    }

    // Swirling golden levitation beam with helical sparks
    this.createSpellBeam(wandPos, forwardVec, 0xf7b32b);

    return {
      spell: 'Wingardium Leviosa!',
      color: '#ffd54f',
      message: 'Swish and flick! Golden levitation sparks cast'
    };
  }

  // 4. INCENDIO (Fire Blast with Explosive Impact Detonation)
  castIncendio(wandPos, forwardVec) {
    soundSynth.playSpellIncendio();
    this.triggerWandCastFlash(0xff4500);
    this.cameraShakeIntensity = 0.06;

    const fireGroup = new THREE.Group();
    fireGroup.position.copy(wandPos);

    // Core fireball
    const fireballGeo = new THREE.SphereGeometry(0.38, 12, 10);
    const fireballMat = new THREE.MeshBasicMaterial({ color: 0xff3b00 });
    const fireball = new THREE.Mesh(fireballGeo, fireballMat);
    fireGroup.add(fireball);

    // Surrounding flame corona
    const coronaGeo = new THREE.SphereGeometry(0.55, 10, 8);
    const coronaMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.65 });
    const corona = new THREE.Mesh(coronaGeo, coronaMat);
    fireGroup.add(corona);

    const fireLight = new THREE.PointLight(0xff6600, 4.5, 18);
    fireGroup.add(fireLight);

    this.scene.add(fireGroup);

    this.projectiles.push({
      mesh: fireGroup,
      velocity: forwardVec.clone().multiplyScalar(32),
      light: fireLight,
      color: 0xff4500,
      life: 0,
      maxLife: 2.2,
      type: 'incendio'
    });

    return {
      spell: 'Incendio!',
      color: '#ff5722',
      message: 'A roaring crackling blast of magical fire shoots from your wand!'
    };
  }

  // 5. AGUAMENTI (Water Jet with Gravity Droplets & Splash)
  castAguamenti(wandPos, forwardVec) {
    soundSynth.playWaterSplash();
    this.triggerWandCastFlash(0x00bcd4);

    const waterGroup = new THREE.Group();
    waterGroup.position.copy(wandPos);

    const streamGeo = new THREE.CylinderGeometry(0.09, 0.32, 2.6, 8);
    streamGeo.rotateX(Math.PI / 2);
    const streamMat = new THREE.MeshStandardMaterial({
      color: 0x55ddff,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.82
    });
    const stream = new THREE.Mesh(streamGeo, streamMat);
    waterGroup.add(stream);

    const waterLight = new THREE.PointLight(0x40c4ff, 2.5, 12);
    waterGroup.add(waterLight);

    this.scene.add(waterGroup);

    this.projectiles.push({
      mesh: waterGroup,
      velocity: forwardVec.clone().multiplyScalar(26).add(new THREE.Vector3(0, 1.5, 0)),
      light: waterLight,
      color: 0x00bcd4,
      life: 0,
      maxLife: 1.6,
      type: 'aguamenti'
    });

    return {
      spell: 'Aguamenti!',
      color: '#00bcd4',
      message: 'A clean jet of pure mountain water surges forth'
    };
  }

  // 6. ALOHOMORA (Unlocking Charm)
  castAlohomora(wandPos, forwardVec) {
    soundSynth.playSpellAlohomora();
    this.triggerWandCastFlash(0xffd700);

    const keyholeGroup = new THREE.Group();
    keyholeGroup.position.copy(wandPos).add(forwardVec.clone().multiplyScalar(2.5));

    // Spinning golden locking rune
    const ringGeo = new THREE.TorusGeometry(0.75, 0.07, 8, 20);
    const runeMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 });
    const runeRing = new THREE.Mesh(ringGeo, runeMat);
    keyholeGroup.add(runeRing);

    const runeBar = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.95, 0.09), runeMat);
    keyholeGroup.add(runeBar);

    const runeLight = new THREE.PointLight(0xffcc00, 3.0, 10);
    keyholeGroup.add(runeLight);

    this.scene.add(keyholeGroup);

    this.projectiles.push({
      mesh: keyholeGroup,
      velocity: forwardVec.clone().multiplyScalar(5.5),
      light: runeLight,
      color: 0xffd700,
      life: 0,
      maxLife: 1.4,
      type: 'alohomora'
    });

    return {
      spell: 'Alohomora!',
      color: '#ffb300',
      message: 'Golden runes spin and unlock ancient Hogwarts doors!'
    };
  }

  // 7. ACCIO (Summoning Charm)
  castAccio(wandPos, forwardVec) {
    soundSynth.playSpellLeviosa();
    this.triggerWandCastFlash(0xab47bc);

    // Purple gravitational tractor beam
    this.createSpellBeam(wandPos, forwardVec, 0xab47bc);

    return {
      spell: 'Accio!',
      color: '#ab47bc',
      message: 'Summoning charm cast! Attracting magical artifacts & the Golden Snitch!'
    };
  }

  createSpellBeam(wandPos, forwardVec, colorHex) {
    const beamGeo = new THREE.CylinderGeometry(0.06, 0.16, 7.0, 8);
    beamGeo.rotateX(Math.PI / 2);
    const beamMat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.88 });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.copy(wandPos).add(forwardVec.clone().multiplyScalar(3.5));
    this.scene.add(beam);

    this.projectiles.push({
      mesh: beam,
      velocity: forwardVec.clone().multiplyScalar(18),
      color: colorHex,
      life: 0,
      maxLife: 0.7,
      type: 'beam'
    });
  }

  // 8. AVADA KEDAVRA (The Killing Curse - Emerald Lightning of Total Obliteration)
  castAvadaKedavra(wandPos, forwardVec) {
    soundSynth.playSpellAvadaKedavra();
    this.triggerWandCastFlash(0x00ff44);
    this.cameraShakeIntensity = 0.35;

    const curseGroup = new THREE.Group();
    curseGroup.position.copy(wandPos);

    // Blinding emerald plasma core
    const boltGeo = new THREE.CylinderGeometry(0.12, 0.28, 3.8, 8);
    boltGeo.rotateX(Math.PI / 2);
    const boltMat = new THREE.MeshBasicMaterial({ color: 0x00ff44 });
    const bolt = new THREE.Mesh(boltGeo, boltMat);
    curseGroup.add(bolt);

    const coronaGeo = new THREE.SphereGeometry(0.7, 10, 8);
    const coronaMat = new THREE.MeshBasicMaterial({ color: 0x33ff77, transparent: true, opacity: 0.85 });
    const corona = new THREE.Mesh(coronaGeo, coronaMat);
    curseGroup.add(corona);

    // Searing emerald point light
    const curseLight = new THREE.PointLight(0x00ff44, 8.0, 28);
    curseGroup.add(curseLight);

    this.scene.add(curseGroup);

    this.projectiles.push({
      mesh: curseGroup,
      velocity: forwardVec.clone().multiplyScalar(38),
      light: curseLight,
      color: 0x00ff44,
      life: 0,
      maxLife: 2.2,
      type: 'avadakedavra'
    });

    return {
      spell: 'Avada Kedavra!',
      color: '#00ff44',
      message: 'A deafening roar of blinding emerald lightning surges from your wand!'
    };
  }

  // 9. EXPELLIARMUS (Disarming Red Charm)
  castExpelliarmus(wandPos, forwardVec) {
    soundSynth.playSpellIncendio();
    this.triggerWandCastFlash(0xff1122);
    this.cameraShakeIntensity = 0.08;

    const disarmGroup = new THREE.Group();
    disarmGroup.position.copy(wandPos);

    const core = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 8), new THREE.MeshBasicMaterial({ color: 0xff2222 }));
    disarmGroup.add(core);

    const redLight = new THREE.PointLight(0xff1122, 4.5, 16);
    disarmGroup.add(redLight);

    this.scene.add(disarmGroup);

    this.projectiles.push({
      mesh: disarmGroup,
      velocity: forwardVec.clone().multiplyScalar(30),
      light: redLight,
      color: 0xff1122,
      life: 0,
      maxLife: 2.0,
      type: 'expelliarmus'
    });

    return {
      spell: 'Expelliarmus!',
      color: '#ff2222',
      message: 'A concentrated scarlet disarming jet streaks forward!'
    };
  }

  // 10. SECTUMSEMPRA (Dark Slashing Curse)
  castSectumsempra(wandPos, forwardVec) {
    soundSynth.playSpellPatronus();
    this.triggerWandCastFlash(0xd8e6f0);

    const slashGroup = new THREE.Group();
    slashGroup.position.copy(wandPos);

    // Silver crescent blade
    const blade = new THREE.Mesh(
      new THREE.TorusGeometry(0.8, 0.05, 4, 16, Math.PI / 1.5),
      new THREE.MeshBasicMaterial({ color: 0xeef4fa })
    );
    slashGroup.add(blade);

    const bladeLight = new THREE.PointLight(0xd8e6f0, 3.5, 14);
    slashGroup.add(bladeLight);

    this.scene.add(slashGroup);

    this.projectiles.push({
      mesh: slashGroup,
      velocity: forwardVec.clone().multiplyScalar(32),
      light: bladeLight,
      color: 0xd8e6f0,
      life: 0,
      maxLife: 1.8,
      type: 'sectumsempra'
    });

    return {
      spell: 'Sectumsempra!',
      color: '#d8e6f0',
      message: 'Razor-sharp invisible silver blades slice through the air!'
    };
  }

  // Particle Utilities
  addParticle(pos, vel, colorHex, maxLife = 1.0) {
    if (this.particleData.length >= this.maxParticles) {
      this.particleData.shift();
    }
    const color = new THREE.Color(colorHex);
    this.particleData.push({
      x: pos.x,
      y: pos.y,
      z: pos.z,
      vx: vel.x,
      vy: vel.y,
      vz: vel.z,
      r: color.r,
      g: color.g,
      b: color.b,
      life: 0,
      maxLife
    });
  }

  spawnParticleBurst(pos, colorHex, count = 16, speed = 3.5) {
    for (let i = 0; i < count; i++) {
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * speed * 2,
        Math.random() * speed * 1.5,
        (Math.random() - 0.5) * speed * 2
      );
      this.addParticle(pos, vel, colorHex, 0.6 + Math.random() * 0.8);
    }
  }

  createGroundScorch(pos) {
    const scorchGeo = new THREE.CircleGeometry(1.4, 16);
    scorchGeo.rotateX(-Math.PI / 2);
    const scorchMat = new THREE.MeshBasicMaterial({
      color: 0x180b06,
      transparent: true,
      opacity: 0.75,
      depthWrite: false
    });
    const scorch = new THREE.Mesh(scorchGeo, scorchMat);
    scorch.position.set(pos.x, pos.y + 0.04, pos.z);
    this.scene.add(scorch);

    this.scorchMarks.push({ mesh: scorch, life: 0, maxLife: 7.0 });
  }

  update(delta, elapsed, camera = null) {
    // 1. Keep Lumos light at player wand tip
    const wandPos = this.player.getWandTipWorldPosition();
    this.lumosLight.position.copy(wandPos);
    this.lumosOrb.position.copy(wandPos);

    // Wand tip cast flash decay
    if (this.wandFlashTimer > 0) {
      this.wandFlashTimer -= delta;
      if (this.wandFlashTimer <= 0) {
        this.wandFlashLight.intensity = 0;
      }
    }

    // Camera shake decay
    if (this.cameraShakeIntensity > 0 && camera) {
      camera.position.x += (Math.random() - 0.5) * this.cameraShakeIntensity;
      camera.position.y += (Math.random() - 0.5) * this.cameraShakeIntensity;
      this.cameraShakeIntensity = Math.max(0, this.cameraShakeIntensity - delta * 0.4);
    }

    // 2. Update active projectiles & spawn trailing sparks
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.life += delta;

      // Projectile gravity (especially for Aguamenti water)
      if (p.type === 'aguamenti') {
        p.velocity.y -= 12.0 * delta;
      }

      p.mesh.position.addScaledVector(p.velocity, delta);

      // Trailing sparks along projectile flight
      if (p.type === 'incendio') {
        this.spawnParticleBurst(p.mesh.position, 0xff7700, 3, 1.2);
      } else if (p.type === 'patronus') {
        p.mesh.rotation.y = Math.atan2(p.velocity.x, p.velocity.z);
        p.mesh.position.y += Math.sin(p.life * 5) * 0.06;
        this.spawnParticleBurst(p.mesh.position, 0xcceeff, 2, 0.8);
      } else if (p.type === 'aguamenti') {
        this.spawnParticleBurst(p.mesh.position, 0x55ddff, 2, 0.6);
      } else if (p.type === 'avadakedavra') {
        this.spawnParticleBurst(p.mesh.position, 0x00ff44, 4, 1.8);
      } else if (p.type === 'expelliarmus') {
        this.spawnParticleBurst(p.mesh.position, 0xff2222, 3, 1.4);
      } else if (p.type === 'sectumsempra') {
        this.spawnParticleBurst(p.mesh.position, 0xd8e6f0, 2, 1.2);
      } else if (p.type === 'alohomora') {
        p.mesh.rotation.z += delta * 7;
      }

      // Ground collision detection
      let hitGround = false;
      if (this.worldManager) {
        const groundY = this.worldManager.getGroundHeight(p.mesh.position.x, p.mesh.position.z, p.mesh.position.y);
        if (p.mesh.position.y <= groundY + 0.3) {
          hitGround = true;
          p.mesh.position.y = groundY;
        }
      }

      // Detonation on impact or expiration
      if (hitGround || p.life >= p.maxLife) {
        // Horcrux impact check!
        if (this.horcruxManager) {
          this.horcruxManager.checkSpellHit(p.mesh.position, p.type, this);
        }

        if (p.type === 'avadakedavra') {
          soundSynth.playSpellAvadaKedavra();
          this.spawnParticleBurst(p.mesh.position, 0x00ff44, 50, 9.0);
          this.spawnParticleBurst(p.mesh.position, 0x66ffaa, 25, 5.0);
          this.createGroundScorch(p.mesh.position);
          this.cameraShakeIntensity = 0.45;
        } else if (p.type === 'incendio') {
          // Explosive fire detonation!
          soundSynth.playSpellIncendio();
          this.spawnParticleBurst(p.mesh.position, 0xff4500, 35, 6.0);
          this.spawnParticleBurst(p.mesh.position, 0xffd54f, 20, 4.0);
          this.createGroundScorch(p.mesh.position);
          this.cameraShakeIntensity = 0.12;
        } else if (p.type === 'expelliarmus') {
          this.spawnParticleBurst(p.mesh.position, 0xff2222, 28, 5.5);
          this.cameraShakeIntensity = 0.08;
        } else if (p.type === 'sectumsempra') {
          this.spawnParticleBurst(p.mesh.position, 0xeef4fa, 26, 6.0);
        } else if (p.type === 'patronus') {
          this.spawnParticleBurst(p.mesh.position, 0xecf8ff, 30, 4.5);
        } else if (p.type === 'aguamenti') {
          soundSynth.playWaterSplash();
          this.spawnParticleBurst(p.mesh.position, 0x00bcd4, 25, 4.0);
        }

        this.scene.remove(p.mesh);
        this.projectiles.splice(i, 1);
      }
    }

    // 3. Update active particle points
    const posArr = this.particlePositions;
    const colArr = this.particleColors;
    let activeCount = 0;

    for (let i = this.particleData.length - 1; i >= 0; i--) {
      const pt = this.particleData[i];
      pt.life += delta;

      if (pt.life >= pt.maxLife) {
        this.particleData.splice(i, 1);
        continue;
      }

      pt.x += pt.vx * delta;
      pt.y += pt.vy * delta;
      pt.z += pt.vz * delta;
      pt.vy -= 4.0 * delta; // slight gravity

      const lifeRatio = 1.0 - (pt.life / pt.maxLife);

      posArr[activeCount * 3 + 0] = pt.x;
      posArr[activeCount * 3 + 1] = pt.y;
      posArr[activeCount * 3 + 2] = pt.z;

      colArr[activeCount * 3 + 0] = pt.r * lifeRatio;
      colArr[activeCount * 3 + 1] = pt.g * lifeRatio;
      colArr[activeCount * 3 + 2] = pt.b * lifeRatio;

      activeCount++;
    }

    // Zero out unused particle slots
    for (let i = activeCount; i < this.maxParticles; i++) {
      posArr[i * 3 + 1] = -1000;
    }

    this.particlePoints.geometry.attributes.position.needsUpdate = true;
    this.particlePoints.geometry.attributes.color.needsUpdate = true;

    // 4. Update scorch marks
    for (let i = this.scorchMarks.length - 1; i >= 0; i--) {
      const sm = this.scorchMarks[i];
      sm.life += delta;
      if (sm.life >= sm.maxLife) {
        this.scene.remove(sm.mesh);
        this.scorchMarks.splice(i, 1);
      } else {
        sm.mesh.material.opacity = 0.75 * (1.0 - sm.life / sm.maxLife);
      }
    }

    // 5. Update levitating objects
    for (let i = this.levitatingObjects.length - 1; i >= 0; i--) {
      const obj = this.levitatingObjects[i];
      if (obj.userData) {
        obj.position.y += (obj.userData.targetY - obj.position.y) * 5 * delta;
        if (obj.userData.isFloating) {
          obj.position.y += Math.sin(elapsed * 3 + obj.id) * 0.015;
          obj.rotation.y += delta * 0.8;
          // Spawn golden hovering motes
          if (Math.random() < 0.25) {
            const pos = new THREE.Vector3();
            obj.getWorldPosition(pos);
            this.addParticle(pos, new THREE.Vector3(0, 0.3, 0), 0xffd54f, 1.2);
          }
        }
      }
    }
  }
}
