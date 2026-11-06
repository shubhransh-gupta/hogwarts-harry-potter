// Stylized 3D Miniature Artifact Dioramas for Hogwarts Dehradun
// Pure procedural Three.js, lightweight, optimized for perspective diorama rendering

import * as THREE from 'three';

// Materials with enhanced Hogwarts palette and warm specular response
const stoneMat = new THREE.MeshToonMaterial({ color: 0x4a474d });
const cliffMat = new THREE.MeshToonMaterial({ color: 0x363438 });
const sandstoneMat = new THREE.MeshToonMaterial({ color: 0xb58b57 });
const crimsonMat = new THREE.MeshToonMaterial({ color: 0x8a151b });
const blackMat = new THREE.MeshToonMaterial({ color: 0x1f1f24 });
const brassMat = new THREE.MeshToonMaterial({ color: 0xd4af37 });
const goldMat = new THREE.MeshToonMaterial({ color: 0xf5b027 });
const slateMat = new THREE.MeshToonMaterial({ color: 0x2b3342 });
const grassMat = new THREE.MeshToonMaterial({ color: 0x224a2e });
const lakeMat = new THREE.MeshToonMaterial({ color: 0x103648, transparent: true, opacity: 0.92 });
const woodMat = new THREE.MeshToonMaterial({ color: 0x3f2514 });
const lightMat = new THREE.MeshBasicMaterial({ color: 0xffe277 });
const glowMat = new THREE.MeshBasicMaterial({ color: 0xffd152 });
const steamMat = new THREE.MeshBasicMaterial({ color: 0xf0f3f8, transparent: true, opacity: 0.65 });

// Helper: adds an ornate Hogwarts gilded pedestal ring
function addPedestalRing(group, radius = 0.96) {
  const ringGeo = new THREE.TorusGeometry(radius, 0.038, 12, 40);
  ringGeo.rotateX(Math.PI / 2);
  const ring = new THREE.Mesh(ringGeo, brassMat);
  ring.position.y = -0.44;
  group.add(ring);

  const innerRingGeo = new THREE.TorusGeometry(radius * 0.88, 0.02, 8, 36);
  innerRingGeo.rotateX(Math.PI / 2);
  const innerRing = new THREE.Mesh(innerRingGeo, goldMat);
  innerRing.position.y = -0.43;
  group.add(innerRing);
}

// 1. Lucknow Charbagh Platform 9¾ Mini Model
export function createMiniCharbagh() {
  const g = new THREE.Group();

  // Sandstone platform plinth
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.95, 0.18, 28), sandstoneMat);
  base.position.y = -0.4;
  g.add(base);
  addPedestalRing(g, 0.94);

  // Brick barrier wall
  const wall = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.68, 0.22), crimsonMat);
  wall.position.set(0, -0.04, 0);
  g.add(wall);

  // Arched portal & Indo-Saracenic pillars
  [-0.38, 0.38].forEach(x => {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.82, 14), sandstoneMat);
    pillar.position.set(x, 0.02, 0);
    g.add(pillar);

    const dome = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.28, 14), brassMat);
    dome.position.set(x, 0.54, 0);
    g.add(dome);
  });

  // Hanging Platform 9¾ sign
  const sign = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.18, 0.05), blackMat);
  sign.position.set(0, 0.24, 0.13);
  g.add(sign);

  const signRing = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.016, 8, 18), brassMat);
  signRing.position.set(0, 0.24, 0.16);
  g.add(signRing);

  // Brass lantern on wall
  const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), lightMat);
  lantern.position.set(0, 0.44, 0.15);
  g.add(lantern);

  // Luggage trolley embedded halfway in barrier
  const trolley = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 0.35), woodMat);
  trolley.position.set(0, -0.15, 0.16);
  g.add(trolley);

  const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.26), brassMat);
  trunk.position.set(0, -0.04, 0.16);
  g.add(trunk);

  g.scale.setScalar(1.05);
  return g;
}

// 2. Hogwarts Express 5972 Locomotive Mini Model
export function createMiniExpress() {
  const g = new THREE.Group();

  // Mountain stone viaduct track base disc
  const track = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.96, 0.14, 28), slateMat);
  track.position.y = -0.4;
  g.add(track);
  addPedestalRing(g, 0.95);

  // Curved rails ring
  const rail1 = new THREE.Mesh(new THREE.TorusGeometry(0.74, 0.02, 6, 32), brassMat);
  rail1.rotation.x = Math.PI / 2;
  rail1.position.y = -0.31;
  g.add(rail1);

  const rail2 = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.02, 6, 32), brassMat);
  rail2.rotation.x = Math.PI / 2;
  rail2.position.y = -0.31;
  g.add(rail2);

  // 5972 Locomotive Boiler
  const boilerGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.88, 18);
  boilerGeo.rotateZ(Math.PI / 2);
  const boiler = new THREE.Mesh(boilerGeo, crimsonMat);
  boiler.position.set(-0.04, -0.03, 0);
  g.add(boiler);

  // Smokebox & Smokestack
  const smokebox = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.28, 18), blackMat);
  smokebox.rotation.z = Math.PI / 2;
  smokebox.position.set(0.42, -0.03, 0);
  g.add(smokebox);

  const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.055, 0.3, 14), blackMat);
  chimney.position.set(0.4, 0.24, 0);
  g.add(chimney);

  const chimneyCap = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.075, 0.07, 14), brassMat);
  chimneyCap.position.set(0.4, 0.4, 0);
  g.add(chimneyCap);

  // Brass dome & glowing Headlight
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 10), brassMat);
  dome.position.set(0.1, 0.22, 0);
  g.add(dome);

  const headlight = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.09, 14), goldMat);
  headlight.rotation.z = Math.PI / 2;
  headlight.position.set(0.57, -0.03, 0);
  g.add(headlight);

  const beam = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.45, 14), lightMat);
  beam.rotation.z = -Math.PI / 2;
  beam.position.set(0.78, -0.03, 0);
  g.add(beam);

  // Driver Cab
  const cab = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.46, 0.44), crimsonMat);
  cab.position.set(-0.44, 0.07, 0);
  g.add(cab);

  // Tender Coal Wagon
  const tender = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.34, 0.38), crimsonMat);
  tender.position.set(-0.8, 0.01, 0);
  g.add(tender);

  // Animated volumetric steam puffs
  for (let i = 0; i < 5; i++) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.1 + i * 0.045, 10, 10), steamMat);
    puff.position.set(0.4 - i * 0.13, 0.46 + i * 0.15, (Math.sin(i * 1.5)) * 0.09);
    g.add(puff);
  }

  g.scale.setScalar(1.05);
  return g;
}

// 3. The Great Hall Mini Model
export function createMiniGreatHall() {
  const g = new THREE.Group();

  // Mountain stone cliff base
  const cliff = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.98, 0.26, 24), cliffMat);
  cliff.position.y = -0.4;
  g.add(cliff);
  addPedestalRing(g, 0.96);

  // Main Great Hall building
  const hall = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.52, 0.48), stoneMat);
  hall.position.set(-0.06, -0.04, 0);
  g.add(hall);

  // High-pitched slate roof
  const roofGeo = new THREE.ConeGeometry(0.44, 0.38, 4);
  roofGeo.rotateY(Math.PI / 4);
  roofGeo.scale(1.22, 1, 1.85);
  const roof = new THREE.Mesh(roofGeo, slateMat);
  roof.position.set(-0.06, 0.38, 0);
  g.add(roof);

  // Stained glass tall rose window (illuminated)
  const windowMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.36), lightMat);
  windowMesh.position.set(0.33, 0.02, 0);
  windowMesh.rotation.y = Math.PI / 2;
  g.add(windowMesh);

  // Corner castle turrets
  [[-0.44, -0.24], [-0.44, 0.24], [0.33, -0.24], [0.33, 0.24]].forEach(([x, z]) => {
    const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 0.76, 14), stoneMat);
    turret.position.set(x, 0.09, z);
    g.add(turret);

    const spire = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.32, 14), slateMat);
    spire.position.set(x, 0.58, z);
    g.add(spire);
  });

  // House banner colored shields
  const colors = [0x8b151b, 0x1a472a, 0x123456, 0xd89f18];
  colors.forEach((col, idx) => {
    const shield = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.13, 0.03), new THREE.MeshBasicMaterial({ color: col }));
    shield.position.set(-0.36 + idx * 0.19, 0.03, 0.26);
    g.add(shield);
  });

  // Entrance stone steps
  const steps = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 0.16), stoneMat);
  steps.position.set(0.4, -0.22, 0);
  g.add(steps);

  g.scale.setScalar(1.05);
  return g;
}

// 4. Castle Courtyard & Clock Tower Mini Model
export function createMiniCourtyard() {
  const g = new THREE.Group();

  // Flagstone court base
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.98, 0.18, 28), stoneMat);
  base.position.y = -0.4;
  g.add(base);
  addPedestalRing(g, 0.95);

  // Cloister perimeter walls
  const wallGeo = new THREE.TorusGeometry(0.7, 0.065, 8, 28);
  const wall = new THREE.Mesh(wallGeo, stoneMat);
  wall.rotation.x = Math.PI / 2;
  wall.position.y = -0.27;
  g.add(wall);

  // Center stone fountain
  const fountain = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.15, 0.19, 14), stoneMat);
  fountain.position.set(0.12, -0.21, 0);
  g.add(fountain);

  const water = new THREE.Mesh(new THREE.CircleGeometry(0.16, 14), lakeMat);
  water.rotation.x = -Math.PI / 2;
  water.position.set(0.12, -0.11, 0);
  g.add(water);

  // Tall Clock Tower
  const tower = new THREE.Mesh(new THREE.BoxGeometry(0.38, 1.0, 0.38), stoneMat);
  tower.position.set(-0.35, 0.2, 0);
  g.add(tower);

  // Glowing Clock faces
  const clock = new THREE.Mesh(new THREE.CircleGeometry(0.12, 18), glowMat);
  clock.position.set(-0.35, 0.48, 0.2);
  g.add(clock);

  // Tower Spire
  const spire = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.48, 4), slateMat);
  spire.rotateY(Math.PI / 4);
  spire.position.set(-0.35, 0.92, 0);
  g.add(spire);

  g.scale.setScalar(1.02);
  return g;
}

// 5. Astronomy Tower Spire Mini Model
export function createMiniAstronomy() {
  const g = new THREE.Group();

  // Cloud & mountain peak base
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.94, 0.22, 24), slateMat);
  base.position.y = -0.4;
  g.add(base);
  addPedestalRing(g, 0.94);

  // Main towering turret shaft
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.34, 1.15, 18), stoneMat);
  shaft.position.set(0, 0.16, 0);
  g.add(shaft);

  // Upper observation colonnade ring
  const colonnade = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.36, 0.19, 18), stoneMat);
  colonnade.position.set(0, 0.74, 0);
  g.add(colonnade);

  // Slender pillars
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2;
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.24, 8), stoneMat);
    p.position.set(Math.cos(ang) * 0.32, 0.88, Math.sin(ang) * 0.32);
    g.add(p);
  }

  // Telescope observation dome
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.32, 18, 14), brassMat);
  dome.position.set(0, 1.04, 0);
  g.add(dome);

  // Brass celestial armillary ring
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.022, 8, 28), goldMat);
  ring.rotation.x = Math.PI / 3;
  ring.position.set(0, 1.04, 0);
  g.add(ring);

  g.scale.setScalar(0.92);
  return g;
}

// 6. Quidditch Pitch & Nimbus 2000 Mini Model
export function createMiniQuidditch() {
  const g = new THREE.Group();

  // Oval turf pitch
  const turfGeo = new THREE.CylinderGeometry(0.88, 0.94, 0.15, 28);
  turfGeo.scale(1.25, 1, 0.75);
  const turf = new THREE.Mesh(turfGeo, grassMat);
  turf.position.y = -0.4;
  g.add(turf);
  addPedestalRing(g, 0.96);

  // Sand track border
  const border = new THREE.Mesh(new THREE.TorusGeometry(0.74, 0.05, 6, 28), sandstoneMat);
  border.scale.set(1.25, 0.75, 1);
  border.rotation.x = Math.PI / 2;
  border.position.y = -0.32;
  g.add(border);

  // Three Golden Goal Hoops on each side
  [-0.68, 0.68].forEach(x => {
    [-0.16, 0, 0.16].forEach((z, i) => {
      const h = 0.48 + (i === 1 ? 0.16 : 0);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.019, h, 8), brassMat);
      pole.position.set(x, -0.32 + h / 2, z);
      g.add(pole);

      const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.016, 8, 18), goldMat);
      hoop.rotation.y = Math.PI / 2;
      hoop.position.set(x, -0.32 + h, z);
      g.add(hoop);
    });
  });

  // Four House Spectator Towers
  [[-0.82, -0.42], [-0.82, 0.42], [0.82, -0.42], [0.82, 0.42]].forEach(([x, z], idx) => {
    const col = [0x8b151b, 0x1a472a, 0x123456, 0xd89f18][idx];
    const tower = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.62, 0.15), new THREE.MeshToonMaterial({ color: col }));
    tower.position.set(x, -0.04, z);
    g.add(tower);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.24, 4), slateMat);
    roof.rotateY(Math.PI / 4);
    roof.position.set(x, 0.34, z);
    g.add(roof);
  });

  // Hovering Nimbus 2000 Broomstick & Golden Snitch
  const broomShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.024, 0.65, 8), woodMat);
  broomShaft.rotation.z = Math.PI / 4;
  broomShaft.position.set(0, 0.12, 0);
  g.add(broomShaft);

  const bristles = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.22, 8), sandstoneMat);
  bristles.rotation.z = Math.PI / 4;
  bristles.position.set(-0.25, -0.12, 0);
  g.add(bristles);

  const snitch = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), goldMat);
  snitch.position.set(0.12, 0.32, 0);
  g.add(snitch);

  [-0.08, 0.08].forEach(x => {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.015, 0.035), lightMat);
    wing.position.set(0.12 + x, 0.34, 0);
    g.add(wing);
  });

  g.scale.setScalar(1.02);
  return g;
}

// 7. The Black Lake & Whomping Willow Mini Model
export function createMiniBlackLake() {
  const g = new THREE.Group();

  // Lake bed shore
  const shore = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.98, 0.18, 28), cliffMat);
  shore.position.y = -0.4;
  g.add(shore);
  addPedestalRing(g, 0.96);

  // Deep water plane
  const water = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.13, 28), lakeMat);
  water.position.y = -0.31;
  g.add(water);

  // Floating wooden rowboat with lantern
  const boat = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.11, 0.15), woodMat);
  boat.position.set(0.24, -0.24, -0.15);
  boat.rotation.y = 0.45;
  g.add(boat);

  const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), lightMat);
  lantern.position.set(0.37, -0.16, -0.1);
  g.add(lantern);

  // The Whomping Willow Tree
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.22, 0.48, 12), woodMat);
  trunk.position.set(-0.35, -0.1, 0.15);
  g.add(trunk);

  // Gnarly branches reaching out
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2;
    const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.075, 0.4, 8), woodMat);
    branch.rotation.z = Math.sin(ang) * 0.65;
    branch.rotation.x = Math.cos(ang) * 0.65;
    branch.position.set(-0.35 + Math.sin(ang) * 0.18, 0.22, 0.15 + Math.cos(ang) * 0.18);
    g.add(branch);
  }

  g.scale.setScalar(1.02);
  return g;
}
