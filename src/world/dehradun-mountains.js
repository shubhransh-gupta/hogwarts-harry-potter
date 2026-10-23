// Dehradun Himalayan Mountain Landscape & Scenic Viaduct
// Towering Garhwal peaks, Mussoorie ridges, Great Lake, pine forests, and mountain viaduct

import * as THREE from 'three';
import { createHogwartsExpress } from './hogwarts-express.js';

export function createDehradunMountains() {
  const landscapeGroup = new THREE.Group();
  landscapeGroup.name = 'DehradunHimalayanLandscape';

  // Materials
  const grassMat = new THREE.MeshToonMaterial({ color: 0x385c34 }); // Himalayan valley green
  const rockMat = new THREE.MeshToonMaterial({ color: 0x4d5154 });
  const snowMat = new THREE.MeshToonMaterial({ color: 0xe8eef5 }); // Distant snow peaks
  const viaductStoneMat = new THREE.MeshToonMaterial({ color: 0x6e6966 });
  const pineTrunkMat = new THREE.MeshToonMaterial({ color: 0x3d271d });
  const pineFoliageMat1 = new THREE.MeshToonMaterial({ color: 0x1b3c26 });
  const pineFoliageMat2 = new THREE.MeshToonMaterial({ color: 0x244d32 });
  const waterMat = new THREE.MeshToonMaterial({
    color: 0x1e3a45,
    transparent: true,
    opacity: 0.88
  });

  // === 1. CENTRAL VALLEY TERRAIN (Broad rolling ground) ===
  const terrainGeo = new THREE.PlaneGeometry(600, 600, 56, 56);
  terrainGeo.rotateX(-Math.PI / 2);

  // Deform terrain vertices for natural hills, lake basin, and valleys
  const pos = terrainGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);

    // 1. Keep Lucknow Station sector completely flat & clean (no green grass hills in station!)
    const distToStation = Math.hypot(x - (-200), z - (-100));
    if (distToStation < 95) {
      pos.setY(i, -0.2);
      continue;
    }

    // 2. Lake depression around (60, -50)
    const distToLake = Math.hypot(x - 60, z + 50);
    let y = 0;

    if (distToLake < 65) {
      y = -4.0 + (distToLake / 65) * 4.0;
    } else {
      // Gentle rolling Himalayan foothills
      y = Math.sin(x * 0.015) * Math.cos(z * 0.015) * 3.2;
      // Slopes rising towards outer perimeter
      const distFromCenter = Math.hypot(x, z);
      if (distFromCenter > 130 && distToStation > 110) {
        y += Math.pow((distFromCenter - 130) / 65, 2) * 5.5;
      }
    }

    pos.setY(i, y);
  }
  terrainGeo.computeVertexNormals();

  const mainTerrain = new THREE.Mesh(terrainGeo, grassMat);
  mainTerrain.receiveShadow = true;
  landscapeGroup.add(mainTerrain);

  // === 2. THE GREAT LAKE (DOON VALLEY LAKE) ===
  const lakeGeo = new THREE.CircleGeometry(64, 32);
  lakeGeo.rotateX(-Math.PI / 2);
  const lake = new THREE.Mesh(lakeGeo, waterMat);
  lake.position.set(60, -0.6, -50);
  landscapeGroup.add(lake);

  // Floating wooden rowboats with lanterns on the lake
  const boatPositions = [
    { x: 45, z: -38, r: 0.4 },
    { x: 75, z: -48, r: -0.7 },
    { x: 55, z: -68, r: 1.2 }
  ];

  const boatWoodMat = new THREE.MeshToonMaterial({ color: 0x503522 });
  const lanternMat = new THREE.MeshBasicMaterial({ color: 0xffcc44 });

  boatPositions.forEach(b => {
    const boat = new THREE.Group();
    boat.position.set(b.x, -0.4, b.z);
    boat.rotation.y = b.r;

    // Boat hull
    const hullGeo = new THREE.BoxGeometry(1.6, 0.7, 3.8);
    const hull = new THREE.Mesh(hullGeo, boatWoodMat);
    hull.position.y = 0.35;
    boat.add(hull);

    // Little lantern at bow
    const lanGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const lan = new THREE.Mesh(lanGeo, lanternMat);
    lan.position.set(0, 0.85, 1.7);
    boat.add(lan);

    landscapeGroup.add(boat);
  });

  // === 3. RING OF DRAMATIC HIMALAYAN MOUNTAINS ===
  // Peaks surrounding the Dehradun Valley & Viaduct (omits Lucknow station)
  const mountainCount = 28;
  const mountainRadius = 240;

  for (let i = 0; i < mountainCount; i++) {
    const angle = (i / mountainCount) * Math.PI * 2;
    const dist = mountainRadius + (Math.sin(i * 3) * 35);
    const mx = Math.cos(angle) * dist;
    const mz = Math.sin(angle) * dist;

    // Do NOT put mountain peaks directly on Lucknow station!
    if (Math.hypot(mx - (-200), mz - (-100)) < 135) {
      continue;
    }

    const height = 95 + Math.random() * 80;
    const radius = 55 + Math.random() * 35;

    // Mountain Cone (Rocky Base)
    const mtnGeo = new THREE.ConeGeometry(radius, height, 9);
    const mtn = new THREE.Mesh(mtnGeo, rockMat);
    mtn.position.set(mx, height / 2 - 4, mz);
    mtn.rotation.y = Math.random() * Math.PI;
    landscapeGroup.add(mtn);

    // Snow-dusted Himalayan Summit cap
    const snowCapGeo = new THREE.ConeGeometry(radius * 0.38, height * 0.32, 9);
    const snowCap = new THREE.Mesh(snowCapGeo, snowMat);
    snowCap.position.set(mx, height - (height * 0.16) - 4, mz);
    snowCap.rotation.y = mtn.rotation.y;
    landscapeGroup.add(snowCap);
  }

  // === 4. THE GRAND MOUNTAIN VIADUCT ===
  // Sweeping curved stone aqueduct bridge crossing across the gorge
  const viaductGroup = new THREE.Group();
  viaductGroup.position.set(-60, 0, -20);
  viaductGroup.name = 'MountainViaduct';

  const viaductSpans = 9;
  const spanSpacing = 16;
  const viaductHeight = 28;

  for (let s = 0; s < viaductSpans; s++) {
    const spanGroup = new THREE.Group();
    // Subtle graceful curve
    const x = (s - viaductSpans / 2) * spanSpacing;
    const z = Math.sin((s / viaductSpans) * Math.PI) * 18;
    spanGroup.position.set(x, 0, z);

    // Massive Stone Pillars
    const pillarGeo = new THREE.BoxGeometry(4.2, viaductHeight, 5.0);
    const pillar = new THREE.Mesh(pillarGeo, viaductStoneMat);
    pillar.position.set(0, viaductHeight / 2, 0);
    spanGroup.add(pillar);

    // Viaduct Stone Arch
    const archGeo = new THREE.TorusGeometry(spanSpacing / 2, 1.2, 8, 16, Math.PI);
    archGeo.rotateZ(Math.PI);
    const arch = new THREE.Mesh(archGeo, viaductStoneMat);
    arch.position.set(spanSpacing / 2, viaductHeight - 1, 0);
    spanGroup.add(arch);

    viaductGroup.add(spanGroup);
  }

  // Viaduct Top Track Deck (y = 29.8)
  const deckLength = viaductSpans * spanSpacing + 20;
  const deckGeo = new THREE.BoxGeometry(deckLength, 1.8, 6.5);
  const deck = new THREE.Mesh(deckGeo, viaductStoneMat);
  deck.position.set(0, viaductHeight + 0.9, 8);
  viaductGroup.add(deck);

  // Parapet safety walls
  [-3.0, 3.0].forEach(z => {
    const wallGeo = new THREE.BoxGeometry(deckLength, 1.4, 0.5);
    const wall = new THREE.Mesh(wallGeo, viaductStoneMat);
    wall.position.set(0, viaductHeight + 2.4, 8 + z);
    viaductGroup.add(wall);
  });

  // Track Rails along Viaduct
  [-0.9, 0.9].forEach(z => {
    const vrailGeo = new THREE.BoxGeometry(deckLength, 0.2, 0.15);
    const vrail = new THREE.Mesh(vrailGeo, rockMat);
    vrail.position.set(0, viaductHeight + 1.9, 8 + z);
    viaductGroup.add(vrail);
  });

  // MOVING HOGWARTS EXPRESS ON THE MOUNTAIN VIADUCT!
  const viaductTrain = createHogwartsExpress(true);
  viaductTrain.position.set(-60, viaductHeight + 1.9, 8);
  viaductTrain.scale.set(0.75, 0.75, 0.75);
  viaductGroup.add(viaductTrain);

  landscapeGroup.add(viaductGroup);
  landscapeGroup.userData.viaductTrain = viaductTrain;
  landscapeGroup.userData.viaductDeckLength = deckLength;

  // === 5. PROCEDURAL DEODAR & PINE TREES ===
  const treeCount = 95;
  const treeGroup = new THREE.Group();

  const trunkGeo = new THREE.CylinderGeometry(0.3, 0.45, 3.5, 8);
  const coneGeo1 = new THREE.ConeGeometry(2.4, 4.2, 8);
  const coneGeo2 = new THREE.ConeGeometry(1.8, 3.6, 8);
  const coneGeo3 = new THREE.ConeGeometry(1.2, 2.8, 8);

  for (let i = 0; i < treeCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 50 + Math.random() * 150;
    const tx = Math.cos(angle) * dist;
    const tz = Math.sin(angle) * dist;

    // Do NOT put trees inside Lucknow Station, Castle courtyard, or Lake
    if (Math.hypot(tx - (-200), tz - (-100)) < 95 ||
        Math.hypot(tx - 40, tz - 40) < 45 ||
        Math.hypot(tx - 60, tz + 50) < 60) {
      continue;
    }

    const tree = new THREE.Group();
    tree.position.set(tx, 0, tz);

    const trunk = new THREE.Mesh(trunkGeo, pineTrunkMat);
    trunk.position.y = 1.75;
    tree.add(trunk);

    const fmat = (i % 2 === 0) ? pineFoliageMat1 : pineFoliageMat2;

    const layer1 = new THREE.Mesh(coneGeo1, fmat);
    layer1.position.y = 4.2;
    tree.add(layer1);

    const layer2 = new THREE.Mesh(coneGeo2, fmat);
    layer2.position.y = 6.2;
    tree.add(layer2);

    const layer3 = new THREE.Mesh(coneGeo3, fmat);
    layer3.position.y = 8.0;
    tree.add(layer3);

    const scale = 0.75 + Math.random() * 0.6;
    tree.scale.set(scale, scale, scale);

    treeGroup.add(tree);
  }
  landscapeGroup.add(treeGroup);

  // === 6. FLOATING MOUNTAIN MIST / CLOUDS ===
  const cloudGroup = new THREE.Group();
  const cloudCount = 14;
  const cloudMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.32,
    depthWrite: false
  });

  const cloudMeshes = [];
  for (let i = 0; i < cloudCount; i++) {
    const cloud = new THREE.Group();
    const puffCount = 4 + Math.floor(Math.random() * 3);
    for (let p = 0; p < puffCount; p++) {
      const puffGeo = new THREE.SphereGeometry(6 + Math.random() * 6, 10, 8);
      const puff = new THREE.Mesh(puffGeo, cloudMat);
      puff.position.set(p * 7 + (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 6);
      cloud.add(puff);
    }
    const cx = (Math.random() - 0.5) * 360;
    const cy = 40 + Math.random() * 30;
    const cz = (Math.random() - 0.5) * 360;
    cloud.position.set(cx, cy, cz);
    cloudGroup.add(cloud);
    cloudMeshes.push(cloud);
  }
  landscapeGroup.add(cloudGroup);

  // Update animation loop for viaduct train & drifting clouds
  landscapeGroup.userData.update = function (delta) {
    if (viaductTrain) {
      viaductTrain.position.x += delta * 14;
      if (viaductTrain.position.x > deckLength / 2 + 10) {
        viaductTrain.position.x = -deckLength / 2 - 30;
      }
      if (viaductTrain.userData.update) {
        viaductTrain.userData.update(delta);
      }
    }

    for (let i = 0; i < cloudMeshes.length; i++) {
      const c = cloudMeshes[i];
      c.position.x += delta * 1.8;
      if (c.position.x > 220) {
        c.position.x = -220;
      }
    }
  };

  return landscapeGroup;
}
