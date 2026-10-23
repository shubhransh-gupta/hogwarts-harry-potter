// Forbidden Himalayan Deodar Forest
// Ancient towering cedars, glowing mystical runes, luminescent blue mushrooms, and spirit wisps

import * as THREE from 'three';

export function createForbiddenForest() {
  const forestGroup = new THREE.Group();
  forestGroup.name = 'ForbiddenForest';

  // Materials
  const ancientTrunkMat = new THREE.MeshToonMaterial({ color: 0x271911 });
  const darkFoliageMat = new THREE.MeshToonMaterial({ color: 0x0f2416 });
  const runestoneMat = new THREE.MeshToonMaterial({ color: 0x3d4247 });
  const glowingRuneMat = new THREE.MeshBasicMaterial({ color: 0x55ccff });
  const mushroomCapMat = new THREE.MeshBasicMaterial({ color: 0x44ddff });
  const mushroomStemMat = new THREE.MeshToonMaterial({ color: 0xddd8cd });

  // === 1. TENSE ANCIENT DEODAR CEDAR TREES ===
  const treeCount = 45;
  for (let i = 0; i < treeCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 8 + Math.random() * 55;
    const tx = Math.cos(angle) * dist;
    const tz = Math.sin(angle) * dist;

    // Skip center standing stone circle
    if (Math.hypot(tx, tz) < 14) continue;

    const tree = new THREE.Group();
    tree.position.set(tx, 0, tz);

    const height = 12 + Math.random() * 8;
    const trunkGeo = new THREE.CylinderGeometry(0.4, 0.9, height * 0.5, 8);
    const trunk = new THREE.Mesh(trunkGeo, ancientTrunkMat);
    trunk.position.y = height * 0.25;
    tree.add(trunk);

    // Gnarled drooping branches
    for (let b = 0; b < 4; b++) {
      const branchGeo = new THREE.ConeGeometry(4.5 - b * 0.8, 4.0, 7);
      const branch = new THREE.Mesh(branchGeo, darkFoliageMat);
      branch.position.y = height * 0.35 + b * 2.8;
      branch.scale.set(1 + (Math.random() - 0.5) * 0.2, 0.8, 1 + (Math.random() - 0.5) * 0.2);
      tree.add(branch);
    }

    forestGroup.add(tree);
  }

  // === 2. ANCIENT STONEHENGE RUNIC CIRCLE ===
  const circleRadius = 11;
  const stoneCount = 8;
  const runes = [];

  for (let i = 0; i < stoneCount; i++) {
    const angle = (i / stoneCount) * Math.PI * 2;
    const sx = Math.cos(angle) * circleRadius;
    const sz = Math.sin(angle) * circleRadius;

    // Upright Standing Megalith
    const stoneGeo = new THREE.BoxGeometry(1.6, 5.5, 1.2);
    const stone = new THREE.Mesh(stoneGeo, runestoneMat);
    stone.position.set(sx, 2.75, sz);
    stone.rotation.y = -angle;
    forestGroup.add(stone);

    // Glowing Ancient Arcane Glyph on stone
    const runeGeo = new THREE.PlaneGeometry(0.7, 1.4);
    const rune = new THREE.Mesh(runeGeo, glowingRuneMat);
    rune.position.set(sx * 0.92, 3.2, sz * 0.92);
    rune.rotation.y = -angle + Math.PI;
    forestGroup.add(rune);
    runes.push(rune);
  }

  // Central Altar Stone
  const altarGeo = new THREE.CylinderGeometry(2.4, 2.8, 1.2, 8);
  const altar = new THREE.Mesh(altarGeo, runestoneMat);
  altar.position.set(0, 0.6, 0);
  forestGroup.add(altar);

  // Ethereal Blue Altar Light
  const altarLight = new THREE.PointLight(0x44aaff, 2.0, 18);
  altarLight.position.set(0, 2.5, 0);
  forestGroup.add(altarLight);

  // === 3. GLOWING LUMINESCENT MUSHROOMS ===
  const mushroomCount = 18;
  for (let i = 0; i < mushroomCount; i++) {
    const ma = Math.random() * Math.PI * 2;
    const md = 2 + Math.random() * 8;
    const mx = Math.cos(ma) * md;
    const mz = Math.sin(ma) * md;

    const shroom = new THREE.Group();
    shroom.position.set(mx, 0, mz);

    const stemGeo = new THREE.CylinderGeometry(0.06, 0.1, 0.5, 6);
    const stem = new THREE.Mesh(stemGeo, mushroomStemMat);
    stem.position.y = 0.25;
    shroom.add(stem);

    const capGeo = new THREE.SphereGeometry(0.24, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2);
    const cap = new THREE.Mesh(capGeo, mushroomCapMat);
    cap.position.y = 0.5;
    shroom.add(cap);

    forestGroup.add(shroom);
  }

  // === 4. SPIRIT WILL-O'-THE-WISPS ===
  const wispCount = 6;
  const wisps = [];
  const wispMat = new THREE.MeshBasicMaterial({ color: 0x88eeff });

  for (let i = 0; i < wispCount; i++) {
    const wispGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const wisp = new THREE.Mesh(wispGeo, wispMat);
    const wispAngle = (i / wispCount) * Math.PI * 2;
    wisp.position.set(Math.cos(wispAngle) * 6, 1.5 + Math.random(), Math.sin(wispAngle) * 6);
    forestGroup.add(wisp);

    wisps.push({
      mesh: wisp,
      angle: wispAngle,
      speed: 0.5 + Math.random() * 0.5,
      radius: 4 + Math.random() * 4,
      baseY: 1.2 + Math.random() * 1.5
    });
  }

  forestGroup.userData.update = function (delta, elapsed) {
    // Animate wisps floating around stones
    wisps.forEach(w => {
      w.angle += delta * w.speed;
      w.mesh.position.x = Math.cos(w.angle) * w.radius;
      w.mesh.position.z = Math.sin(w.angle) * w.radius;
      w.mesh.position.y = w.baseY + Math.sin(elapsed * 2 + w.angle) * 0.4;
    });

    // Pulsing rune glow
    const pulse = 0.6 + Math.sin(elapsed * 2.5) * 0.4;
    glowingRuneMat.opacity = pulse;
    altarLight.intensity = 1.5 + Math.sin(elapsed * 2.0) * 0.5;
  };

  // Position the Forbidden Forest deep in the valley
  forestGroup.position.set(-110, 0, 110);

  return forestGroup;
}
