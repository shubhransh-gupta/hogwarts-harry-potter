// Stylized 3D Miniature Models for Courier City Home Screen Cards
// Pure procedural Three.js, lightweight, optimized for orthographic slot rendering

import * as THREE from 'three';

// Materials
const stoneMat = new THREE.MeshToonMaterial({ color: 0x5a5450 });
const sandstoneMat = new THREE.MeshToonMaterial({ color: 0xb58b57 });
const crimsonMat = new THREE.MeshToonMaterial({ color: 0x8a151b });
const blackMat = new THREE.MeshToonMaterial({ color: 0x222226 });
const brassMat = new THREE.MeshToonMaterial({ color: 0xd4af37 });
const goldMat = new THREE.MeshToonMaterial({ color: 0xf7b32b });
const slateMat = new THREE.MeshToonMaterial({ color: 0x3d4452 });
const grassMat = new THREE.MeshToonMaterial({ color: 0x2d5a37 });
const lakeMat = new THREE.MeshToonMaterial({ color: 0x1a4556, transparent: true, opacity: 0.9 });
const woodMat = new THREE.MeshToonMaterial({ color: 0x4a2e18 });
const lightMat = new THREE.MeshBasicMaterial({ color: 0xffe680 });
const steamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });

// 1. Lucknow Charbagh Platform 9¾ Mini Model
export function createMiniCharbagh() {
  const g = new THREE.Group();

  // Base platform
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.95, 0.18, 24), sandstoneMat);
  base.position.y = -0.4;
  g.add(base);

  // Brick barrier wall
  const wall = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.65, 0.22), crimsonMat);
  wall.position.set(0, -0.05, 0);
  g.add(wall);

  // Arched portal & Indo-Saracenic pillars
  [-0.38, 0.38].forEach(x => {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.8, 12), sandstoneMat);
    pillar.position.set(x, 0, 0);
    g.add(pillar);

    const dome = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.25, 12), brassMat);
    dome.position.set(x, 0.5, 0);
    g.add(dome);
  });

  // Hanging Platform 9¾ sign
  const sign = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.16, 0.04), blackMat);
  sign.position.set(0, 0.22, 0.12);
  g.add(sign);

  const signRing = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.015, 8, 16), brassMat);
  signRing.position.set(0, 0.22, 0.15);
  g.add(signRing);

  // Brass lantern on wall
  const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), lightMat);
  lantern.position.set(0, 0.42, 0.14);
  g.add(lantern);

  g.scale.setScalar(0.9);
  return g;
}

// 2. Hogwarts Express 5972 Locomotive Mini Model
export function createMiniExpress() {
  const g = new THREE.Group();

  // Train track base disc
  const track = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.95, 0.12, 24), slateMat);
  track.position.y = -0.4;
  g.add(track);

  // Rails ring
  const rail = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.025, 6, 24), brassMat);
  rail.rotation.x = Math.PI / 2;
  rail.position.y = -0.32;
  g.add(rail);

  // Boiler cylinder
  const boilerGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.82, 16);
  boilerGeo.rotateZ(Math.PI / 2);
  const boiler = new THREE.Mesh(boilerGeo, crimsonMat);
  boiler.position.set(-0.05, -0.05, 0);
  g.add(boiler);

  // Smokebox & Smokestack
  const smokebox = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.25, 16), blackMat);
  smokebox.rotation.z = Math.PI / 2;
  smokebox.position.set(0.38, -0.05, 0);
  g.add(smokebox);

  const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.05, 0.28, 12), blackMat);
  chimney.position.set(0.36, 0.22, 0);
  g.add(chimney);

  const chimneyCap = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.06, 12), brassMat);
  chimneyCap.position.set(0.36, 0.37, 0);
  g.add(chimneyCap);

  // Brass dome & headlight
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), brassMat);
  dome.position.set(0.08, 0.2, 0);
  g.add(dome);

  const headlight = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.08, 12), goldMat);
  headlight.rotation.z = Math.PI / 2;
  headlight.position.set(0.52, -0.05, 0);
  g.add(headlight);

  // Driver Cab
  const cab = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.44, 0.42), crimsonMat);
  cab.position.set(-0.42, 0.05, 0);
  g.add(cab);

  // Steam puff cloud
  for (let i = 0; i < 4; i++) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.09 + i * 0.04, 8, 8), steamMat);
    puff.position.set(0.36 - i * 0.12, 0.42 + i * 0.14, (Math.random() - 0.5) * 0.08);
    g.add(puff);
  }

  g.scale.setScalar(0.95);
  return g;
}

// 3. The Great Hall Mini Model
export function createMiniGreatHall() {
  const g = new THREE.Group();

  // Mountain stone cliff base
  const cliff = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.95, 0.24, 20), stoneMat);
  cliff.position.y = -0.4;
  g.add(cliff);

  // Main Great Hall building
  const hall = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.48, 0.46), stoneMat);
  hall.position.set(-0.06, -0.05, 0);
  g.add(hall);

  // High-pitched slate roof
  const roofGeo = new THREE.ConeGeometry(0.42, 0.36, 4);
  roofGeo.rotateY(Math.PI / 4);
  roofGeo.scale(1.2, 1, 1.8);
  const roof = new THREE.Mesh(roofGeo, slateMat);
  roof.position.set(-0.06, 0.36, 0);
  g.add(roof);

  // Stained glass tall window
  const windowMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.34), lightMat);
  windowMesh.position.set(0.31, 0, 0);
  windowMesh.rotation.y = Math.PI / 2;
  g.add(windowMesh);

  // Corner castle turrets
  [[-0.42, -0.22], [-0.42, 0.22], [0.32, -0.22], [0.32, 0.22]].forEach(([x, z]) => {
    const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.72, 12), stoneMat);
    turret.position.set(x, 0.08, z);
    g.add(turret);

    const spire = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.3, 12), slateMat);
    spire.position.set(x, 0.55, z);
    g.add(spire);
  });

  // House banner colored shields
  const colors = [0x740001, 0x1a472a, 0x0e1a40, 0xecb939];
  colors.forEach((col, idx) => {
    const shield = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.02), new THREE.MeshBasicMaterial({ color: col }));
    shield.position.set(-0.35 + idx * 0.18, 0.02, 0.24);
    g.add(shield);
  });

  g.scale.setScalar(0.95);
  return g;
}

// 4. Castle Courtyard & Clock Tower Mini Model
export function createMiniCourtyard() {
  const g = new THREE.Group();

  // Flagstone court base
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.95, 0.18, 24), stoneMat);
  base.position.y = -0.4;
  g.add(base);

  // Cloister perimeter walls
  const wallGeo = new THREE.TorusGeometry(0.68, 0.06, 6, 24);
  const wall = new THREE.Mesh(wallGeo, stoneMat);
  wall.rotation.x = Math.PI / 2;
  wall.position.y = -0.28;
  g.add(wall);

  // Center stone fountain
  const fountain = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.18, 12), stoneMat);
  fountain.position.set(0.12, -0.22, 0);
  g.add(fountain);

  const water = new THREE.Mesh(new THREE.CircleGeometry(0.15, 12), lakeMat);
  water.rotation.x = -Math.PI / 2;
  water.position.set(0.12, -0.12, 0);
  g.add(water);

  // Tall Clock Tower
  const tower = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.95, 0.36), stoneMat);
  tower.position.set(-0.35, 0.18, 0);
  g.add(tower);

  // Clock faces
  const clock = new THREE.Mesh(new THREE.CircleGeometry(0.11, 16), lightMat);
  clock.position.set(-0.35, 0.44, 0.19);
  g.add(clock);

  // Tower Spire
  const spire = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.44, 4), slateMat);
  spire.rotateY(Math.PI / 4);
  spire.position.set(-0.35, 0.86, 0);
  g.add(spire);

  g.scale.setScalar(0.9);
  return g;
}

// 5. Astronomy Tower Spire Mini Model
export function createMiniAstronomy() {
  const g = new THREE.Group();

  // Cloud & mountain peak base
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.92, 0.2, 20), slateMat);
  base.position.y = -0.4;
  g.add(base);

  // Main towering turret shaft
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.32, 1.1, 16), stoneMat);
  shaft.position.set(0, 0.15, 0);
  g.add(shaft);

  // Upper observation colonnade ring
  const colonnade = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.34, 0.18, 16), stoneMat);
  colonnade.position.set(0, 0.72, 0);
  g.add(colonnade);

  // Slender pillars
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2;
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.22, 8), stoneMat);
    p.position.set(Math.cos(ang) * 0.3, 0.86, Math.sin(ang) * 0.3);
    g.add(p);
  }

  // Telescope observation dome
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 12), brassMat);
  dome.position.set(0, 1.0, 0);
  g.add(dome);

  // Brass celestial ring
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.02, 8, 24), goldMat);
  ring.rotation.x = Math.PI / 3;
  ring.position.set(0, 1.0, 0);
  g.add(ring);

  g.scale.setScalar(0.78);
  return g;
}

// 6. Quidditch Pitch Mini Model
export function createMiniQuidditch() {
  const g = new THREE.Group();

  // Oval turf pitch
  const turfGeo = new THREE.CylinderGeometry(0.85, 0.92, 0.14, 24);
  turfGeo.scale(1.25, 1, 0.75);
  const turf = new THREE.Mesh(turfGeo, grassMat);
  turf.position.y = -0.4;
  g.add(turf);

  // Sand track border
  const border = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.05, 6, 24), sandstoneMat);
  border.scale.set(1.25, 0.75, 1);
  border.rotation.x = Math.PI / 2;
  border.position.y = -0.32;
  g.add(border);

  // Three Golden Goal Hoops
  [-0.65, 0.65].forEach(x => {
    [-0.15, 0, 0.15].forEach((z, i) => {
      const h = 0.45 + (i === 1 ? 0.15 : 0);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, h, 8), brassMat);
      pole.position.set(x, -0.32 + h / 2, z);
      g.add(pole);

      const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.015, 8, 16), goldMat);
      hoop.rotation.y = Math.PI / 2;
      hoop.position.set(x, -0.32 + h, z);
      g.add(hoop);
    });
  });

  // Four House Spectator Towers
  [[-0.8, -0.4], [-0.8, 0.4], [0.8, -0.4], [0.8, 0.4]].forEach(([x, z], idx) => {
    const col = [0x740001, 0x1a472a, 0x0e1a40, 0xecb939][idx];
    const tower = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.6, 0.14), new THREE.MeshToonMaterial({ color: col }));
    tower.position.set(x, -0.05, z);
    g.add(tower);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 4), slateMat);
    roof.rotateY(Math.PI / 4);
    roof.position.set(x, 0.32, z);
    g.add(roof);
  });

  // Golden Snitch hover at center
  const snitch = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), goldMat);
  snitch.position.set(0, 0.12, 0);
  g.add(snitch);

  // Tiny wings
  [-0.1, 0.1].forEach(x => {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.04), lightMat);
    wing.position.set(x, 0.15, 0);
    g.add(wing);
  });

  g.scale.setScalar(0.9);
  return g;
}

// 7. The Black Lake & Whomping Willow Mini Model
export function createMiniBlackLake() {
  const g = new THREE.Group();

  // Lake bed shore
  const shore = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.95, 0.16, 24), stoneMat);
  shore.position.y = -0.4;
  g.add(shore);

  // Deep water plane
  const water = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 0.12, 24), lakeMat);
  water.position.y = -0.32;
  g.add(water);

  // Floating wooden rowboat
  const boat = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 0.14), woodMat);
  boat.position.set(0.24, -0.25, -0.15);
  boat.rotation.y = 0.4;
  g.add(boat);

  const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), lightMat);
  lantern.position.set(0.36, -0.18, -0.11);
  g.add(lantern);

  // The Whomping Willow Tree
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 0.45, 10), woodMat);
  trunk.position.set(-0.35, -0.12, 0.15);
  g.add(trunk);

  // Gnarly branches reaching out
  for (let i = 0; i < 5; i++) {
    const ang = (i / 5) * Math.PI * 2;
    const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.07, 0.36, 6), woodMat);
    branch.rotation.z = Math.sin(ang) * 0.6;
    branch.rotation.x = Math.cos(ang) * 0.6;
    branch.position.set(-0.35 + Math.sin(ang) * 0.16, 0.18, 0.15 + Math.cos(ang) * 0.16);
    g.add(branch);
  }

  g.scale.setScalar(0.95);
  return g;
}
