// Hagrid's Hut & Giant Magical Pumpkin Patch
// Cozy octagonal stone cottage, smoking chimney, and interactive levitating pumpkins

import * as THREE from 'three';

export function createHagridHut() {
  const hutGroup = new THREE.Group();
  hutGroup.name = 'HagridsHut';

  // Materials
  const rusticStoneMat = new THREE.MeshToonMaterial({ color: 0x544e47 });
  const thatchRoofMat = new THREE.MeshToonMaterial({ color: 0x6e583c });
  const timberMat = new THREE.MeshToonMaterial({ color: 0x3d2716 });
  const pumpkinMat = new THREE.MeshToonMaterial({ color: 0xe66e19 });
  const pumpkinStemMat = new THREE.MeshToonMaterial({ color: 0x2e4420 });
  const warmGlowMat = new THREE.MeshBasicMaterial({ color: 0xffb84d });

  // === 1. MAIN OCTAGONAL STONE HUT ===
  const mainHut = new THREE.Group();
  mainHut.position.set(0, 0, 0);

  // Octagonal Stone Wall Body
  const wallGeo = new THREE.CylinderGeometry(5.2, 5.6, 5.5, 8);
  const wall = new THREE.Mesh(wallGeo, rusticStoneMat);
  wall.position.y = 2.75;
  mainHut.add(wall);

  // Thatched / Slate Conical Roof
  const roofGeo = new THREE.ConeGeometry(7.2, 5.5, 8);
  const roof = new THREE.Mesh(roofGeo, thatchRoofMat);
  roof.position.y = 8.2;
  mainHut.add(roof);

  // Heavy Timber Door
  const doorGeo = new THREE.BoxGeometry(1.6, 3.2, 0.4);
  const door = new THREE.Mesh(doorGeo, timberMat);
  door.position.set(0, 1.8, 5.3);
  mainHut.add(door);

  // Stone Chimney
  const chimneyGeo = new THREE.BoxGeometry(1.4, 6.5, 1.4);
  const chimney = new THREE.Mesh(chimneyGeo, rusticStoneMat);
  chimney.position.set(3.2, 7.5, -1.5);
  mainHut.add(chimney);

  // Small Window with glowing warm fireplace light
  const windowGeo = new THREE.BoxGeometry(1.2, 1.2, 0.2);
  const win = new THREE.Mesh(windowGeo, warmGlowMat);
  win.position.set(-4.8, 3.2, 1.5);
  win.rotation.y = Math.PI / 4;
  mainHut.add(win);

  // Small Annex Room
  const annexGeo = new THREE.CylinderGeometry(3.2, 3.5, 4.2, 8);
  const annex = new THREE.Mesh(annexGeo, rusticStoneMat);
  annex.position.set(5.5, 2.1, 2.0);
  mainHut.add(annex);

  const annexRoofGeo = new THREE.ConeGeometry(4.2, 3.8, 8);
  const annexRoof = new THREE.Mesh(annexRoofGeo, thatchRoofMat);
  annexRoof.position.set(5.5, 5.8, 2.0);
  mainHut.add(annexRoof);

  hutGroup.add(mainHut);

  // === 2. PUMPKIN PATCH WITH INTERACTIVE LEVITATING PUMPKINS ===
  const patchGroup = new THREE.Group();
  patchGroup.position.set(-8, 0, 6);

  const interactivePumpkins = [];
  const pumpkinCoords = [
    { x: -2, z: 0, s: 1.6 },
    { x: 1, z: -2, s: 2.2 },
    { x: 3, z: 1, s: 1.8 },
    { x: -1, z: 3, s: 2.6 }, // Giant prize pumpkin!
    { x: 2, z: 4, s: 1.4 }
  ];

  pumpkinCoords.forEach((p, idx) => {
    const pumpkin = new THREE.Group();
    pumpkin.position.set(p.x, p.s * 0.45, p.z);
    pumpkin.name = `MagicPumpkin_${idx}`;
    pumpkin.userData.isLevitatable = true;
    pumpkin.userData.baseY = p.s * 0.45;
    pumpkin.userData.targetY = p.s * 0.45;
    pumpkin.userData.isFloating = false;

    // Segmented ribbed pumpkin
    const bodyGeo = new THREE.SphereGeometry(p.s * 0.65, 14, 10);
    bodyGeo.scale(1.2, 0.85, 1.2);
    const body = new THREE.Mesh(bodyGeo, pumpkinMat);
    pumpkin.add(body);

    // Green twisted stem
    const stemGeo = new THREE.CylinderGeometry(0.08 * p.s, 0.12 * p.s, 0.5 * p.s, 8);
    const stem = new THREE.Mesh(stemGeo, pumpkinStemMat);
    stem.position.y = p.s * 0.6;
    stem.rotation.z = 0.2;
    pumpkin.add(stem);

    patchGroup.add(pumpkin);
    interactivePumpkins.push(pumpkin);
  });

  hutGroup.add(patchGroup);
  hutGroup.userData.pumpkins = interactivePumpkins;

  // Wooden fence around pumpkin patch
  const fenceMat = new THREE.MeshToonMaterial({ color: 0x44301e });
  for (let a = 0; a < Math.PI * 1.5; a += Math.PI / 6) {
    const postGeo = new THREE.CylinderGeometry(0.08, 0.1, 1.2, 6);
    const post = new THREE.Mesh(postGeo, fenceMat);
    post.position.set(-8 + Math.cos(a) * 6, 0.6, 6 + Math.sin(a) * 6);
    hutGroup.add(post);
  }

  // Position Hagrid's Hut on the forest fringe below the castle
  hutGroup.position.set(-70, 0, 90);

  return hutGroup;
}
