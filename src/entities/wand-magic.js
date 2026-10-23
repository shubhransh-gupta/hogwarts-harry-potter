// Wand Magic System & Spell Casting Engine
// Lumos, Expecto Patronum, Wingardium Leviosa, Incendio, Aguamenti, Alohomora, Accio
// Includes particle systems, dynamic point lights, object levitation, and sound triggers

import * as THREE from 'three';
import { soundSynth } from '../audio/sound-synthesizer.js';

export class WandMagic {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;

    this.spells = [
      { id: 'lumos', name: 'Lumos', key: '1', keyAlt: 'Q', color: '#88d8ff', desc: 'Illuminating Wand Light' },
      { id: 'patronus', name: 'Expecto Patronum', key: '2', keyAlt: 'E', color: '#d8f4ff', desc: 'Silver Stag Guardian' },
      { id: 'leviosa', name: 'Wingardium Leviosa', key: '3', keyAlt: 'R', color: '#ffd54f', desc: 'Levitation Enchantment' },
      { id: 'incendio', name: 'Incendio', key: '4', keyAlt: 'F', color: '#ff5722', desc: 'Crackling Fire Burst' },
      { id: 'aguamenti', name: 'Aguamenti', key: '5', keyAlt: 'C', color: '#00bcd4', desc: 'Pure Spring Water Jet' },
      { id: 'alohomora', name: 'Alohomora', key: '6', keyAlt: 'X', color: '#ffb300', desc: 'Unlocking Charm' },
      { id: 'accio', name: 'Accio', key: '7', keyAlt: 'Z', color: '#ab47bc', desc: 'Summoning Charm' }
    ];

    this.activeSpellIndex = 0;
    this.isLumosActive = false;

    // Lumos Wand Tip Light
    this.lumosLight = new THREE.PointLight(0xaae8ff, 0, 16);
    this.scene.add(this.lumosLight);

    const orbGeo = new THREE.SphereGeometry(0.12, 12, 8);
    const orbMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
    this.lumosOrb = new THREE.Mesh(orbGeo, orbMat);
    this.scene.add(this.lumosOrb);

    // Active projectiles & spell effects
    this.projectiles = [];
    this.levitatingObjects = [];
    this.particles = [];

    // Particle pool material
    this.sparkleGeo = new THREE.BufferGeometry();
  }

  getActiveSpell() {
    return this.spells[this.activeSpellIndex];
  }

  selectSpell(index) {
    if (index >= 0 && index < this.spells.length) {
      this.activeSpellIndex = index;
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

  castSpellById(spellId, interactiveTargets = []) {
    const wandPos = this.player.getWandTipWorldPosition();
    // Aim vector in the direction player is facing
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
      default:
        return null;
    }
  }

  // 1. LUMOS / NOX
  castLumos() {
    this.isLumosActive = !this.isLumosActive;
    soundSynth.playSpellLumos(this.isLumosActive);

    this.lumosLight.intensity = this.isLumosActive ? 3.5 : 0;
    this.lumosOrb.material.opacity = this.isLumosActive ? 1.0 : 0.0;

    return {
      spell: this.isLumosActive ? 'Lumos!' : 'Nox!',
      color: '#88d8ff',
      message: this.isLumosActive ? 'Wand ignited with radiant white light' : 'Wand light extinguished'
    };
  }

  // 2. EXPECTO PATRONUM (Silver Stag Patronus)
  castPatronus(wandPos, forwardVec) {
    soundSynth.playSpellPatronus();

    // Create silver stag spirit mesh
    const patronusGroup = new THREE.Group();
    patronusGroup.position.copy(wandPos);

    // Ethereal glowing silver material
    const stagMat = new THREE.MeshBasicMaterial({
      color: 0xecf8ff,
      transparent: true,
      opacity: 0.88,
      wireframe: false
    });

    // Stylized deer / stag body
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 1.6, 8), stagMat);
    body.rotation.z = Math.PI / 2;
    body.position.y = 1.0;
    patronusGroup.add(body);

    // Antlers (Majestic branched antlers)
    [-0.2, 0.2].forEach(x => {
      const antler = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.9, 6), stagMat);
      antler.position.set(x, 2.1, 0.6);
      antler.rotation.z = x * 1.5;
      antler.rotation.x = -0.4;
      patronusGroup.add(antler);
    });

    // Neck & Head
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.8, 8), stagMat);
    neck.position.set(0, 1.4, 0.7);
    neck.rotation.x = -Math.PI / 4;
    patronusGroup.add(neck);

    const head = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.6, 8), stagMat);
    head.position.set(0, 1.7, 1.1);
    head.rotation.x = Math.PI / 2;
    patronusGroup.add(head);

    // Dynamic silver light
    const stagLight = new THREE.PointLight(0xcceeff, 4.0, 24);
    stagLight.position.y = 1.2;
    patronusGroup.add(stagLight);

    this.scene.add(patronusGroup);

    this.projectiles.push({
      mesh: patronusGroup,
      velocity: forwardVec.clone().multiplyScalar(22).add(new THREE.Vector3(0, 4.0, 0)),
      life: 0,
      maxLife: 3.2,
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

    // Check for nearby levitatable objects (e.g. Hagrid's pumpkins)
    let levitatedTarget = null;
    let minDist = 30;

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
      levitatedTarget.userData.targetY = levitatedTarget.userData.isFloating ? levitatedTarget.userData.baseY + 5.5 : levitatedTarget.userData.baseY;
      this.levitatingObjects.push(levitatedTarget);

      return {
        spell: 'Wingardium Leviosa!',
        color: '#ffd54f',
        message: 'Swish and flick! Giant pumpkin floating in mid-air!'
      };
    }

    // Swirling golden levitation beam
    this.createSpellBeam(wandPos, forwardVec, 0xf7b32b);

    return {
      spell: 'Wingardium Leviosa!',
      color: '#ffd54f',
      message: 'Swish and flick! Golden levitation sparks cast'
    };
  }

  // 4. INCENDIO (Fire Blast)
  castIncendio(wandPos, forwardVec) {
    soundSynth.playSpellIncendio();

    const fireGroup = new THREE.Group();
    fireGroup.position.copy(wandPos);

    const fireballGeo = new THREE.SphereGeometry(0.35, 10, 8);
    const fireballMat = new THREE.MeshBasicMaterial({ color: 0xff4500 });
    const fireball = new THREE.Mesh(fireballGeo, fireballMat);
    fireGroup.add(fireball);

    const fireLight = new THREE.PointLight(0xff6600, 3.5, 14);
    fireGroup.add(fireLight);

    this.scene.add(fireGroup);

    this.projectiles.push({
      mesh: fireGroup,
      velocity: forwardVec.clone().multiplyScalar(28),
      life: 0,
      maxLife: 1.8,
      type: 'incendio'
    });

    return {
      spell: 'Incendio!',
      color: '#ff5722',
      message: 'A crackling burst of magical flame shoots from your wand!'
    };
  }

  // 5. AGUAMENTI (Water Stream)
  castAguamenti(wandPos, forwardVec) {
    soundSynth.playSpellPatronus(); // watery chime

    const waterGroup = new THREE.Group();
    waterGroup.position.copy(wandPos);

    const streamGeo = new THREE.CylinderGeometry(0.08, 0.28, 2.4, 8);
    streamGeo.rotateX(Math.PI / 2);
    const streamMat = new THREE.MeshBasicMaterial({ color: 0x55ddff, transparent: true, opacity: 0.75 });
    const stream = new THREE.Mesh(streamGeo, streamMat);
    waterGroup.add(stream);

    this.scene.add(waterGroup);

    this.projectiles.push({
      mesh: waterGroup,
      velocity: forwardVec.clone().multiplyScalar(24),
      life: 0,
      maxLife: 1.4,
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

    const keyholeGroup = new THREE.Group();
    keyholeGroup.position.copy(wandPos).add(forwardVec.clone().multiplyScalar(3.0));

    // Spinning golden locking rune
    const ringGeo = new THREE.TorusGeometry(0.65, 0.06, 8, 16);
    const runeMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    const runeRing = new THREE.Mesh(ringGeo, runeMat);
    keyholeGroup.add(runeRing);

    const runeBar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.8, 0.08), runeMat);
    keyholeGroup.add(runeBar);

    this.scene.add(keyholeGroup);

    this.projectiles.push({
      mesh: keyholeGroup,
      velocity: forwardVec.clone().multiplyScalar(4.0),
      life: 0,
      maxLife: 1.2,
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

    return {
      spell: 'Accio!',
      color: '#ab47bc',
      message: 'Summoning charm cast! Attracting magical artifacts & the Golden Snitch!'
    };
  }

  createSpellBeam(wandPos, forwardVec, colorHex) {
    const beamGeo = new THREE.CylinderGeometry(0.04, 0.12, 6.0, 6);
    beamGeo.rotateX(Math.PI / 2);
    const beamMat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.85 });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.copy(wandPos).add(forwardVec.clone().multiplyScalar(3.0));
    this.scene.add(beam);

    this.projectiles.push({
      mesh: beam,
      velocity: forwardVec.clone().multiplyScalar(15),
      life: 0,
      maxLife: 0.6,
      type: 'beam'
    });
  }

  update(delta, elapsed) {
    // 1. Keep Lumos light at player wand tip
    const wandPos = this.player.getWandTipWorldPosition();
    this.lumosLight.position.copy(wandPos);
    this.lumosOrb.position.copy(wandPos);

    // 2. Update active projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.life += delta;
      p.mesh.position.addScaledVector(p.velocity, delta);

      if (p.type === 'patronus') {
        p.mesh.rotation.y = Math.atan2(p.velocity.x, p.velocity.z);
        p.mesh.position.y += Math.sin(p.life * 4) * 0.05;
      } else if (p.type === 'alohomora') {
        p.mesh.rotation.z += delta * 6;
      }

      if (p.life >= p.maxLife) {
        this.scene.remove(p.mesh);
        this.projectiles.splice(i, 1);
      }
    }

    // 3. Update levitating objects
    for (let i = this.levitatingObjects.length - 1; i >= 0; i--) {
      const obj = this.levitatingObjects[i];
      if (obj.userData) {
        // Smooth lerp to target height
        obj.position.y += (obj.userData.targetY - obj.position.y) * 5 * delta;
        if (obj.userData.isFloating) {
          obj.position.y += Math.sin(elapsed * 3 + obj.id) * 0.015;
          obj.rotation.y += delta * 0.8;
        }
      }
    }
  }
}
