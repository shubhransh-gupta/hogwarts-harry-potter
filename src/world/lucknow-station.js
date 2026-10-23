// Platform 9¾ at Lucknow Charbagh Railway Station
// Blends King's Cross Platform 9¾ (brick pillar barrier, trolley in wall) with Lucknow Charbagh's iconic red brick arches & domes

import * as THREE from 'three';
import { createHogwartsExpress } from './hogwarts-express.js';

export function createLucknowStation() {
  const stationGroup = new THREE.Group();
  stationGroup.name = 'LucknowPlatform934';

  // Materials
  const redBrickMat = new THREE.MeshToonMaterial({ color: 0x8b2b2b }); // Lucknow red brick
  const darkBrickMat = new THREE.MeshToonMaterial({ color: 0x6e2222 });
  const sandstoneCreamMat = new THREE.MeshToonMaterial({ color: 0xdfc7a3 }); // Indo-Saracenic sandstone
  const platformMat = new THREE.MeshToonMaterial({ color: 0x3d383b }); // Paved stone flags
  const ironWorkMat = new THREE.MeshToonMaterial({ color: 0x24302c }); // Victorian dark green iron
  const glassRoofMat = new THREE.MeshToonMaterial({ color: 0xaad2dd, transparent: true, opacity: 0.65 });
  const woodMat = new THREE.MeshToonMaterial({ color: 0x5c3c26 });
  const brassGoldMat = new THREE.MeshToonMaterial({ color: 0xd4af37 });
  const warmGlowMat = new THREE.MeshBasicMaterial({ color: 0xffdf80 });
  const trackMat = new THREE.MeshToonMaterial({ color: 0x3a3a40 });
  const sleeperMat = new THREE.MeshToonMaterial({ color: 0x422d20 });

  // === 1. PLATFORM SLAB ===
  // 90m long platform
  const platformGeo = new THREE.BoxGeometry(90, 0.9, 14);
  const platform = new THREE.Mesh(platformGeo, platformMat);
  platform.position.set(0, 0.45, 7);
  platform.receiveShadow = true;
  stationGroup.add(platform);

  // Platform Edge Safety Line (Golden / Cream brick edge)
  const edgeGeo = new THREE.BoxGeometry(90, 0.05, 0.5);
  const edgeLine = new THREE.Mesh(edgeGeo, sandstoneCreamMat);
  edgeLine.position.set(0, 0.91, 0.25);
  stationGroup.add(edgeLine);

  // === 2. RAILWAY TRACKS (Alongside Platform) ===
  // Two parallel steel rails
  [-0.9, 0.9].forEach(z => {
    const railGeo = new THREE.BoxGeometry(100, 0.15, 0.12);
    const rail = new THREE.Mesh(railGeo, trackMat);
    rail.position.set(0, 0.15, -1.8 + z);
    stationGroup.add(rail);
  });

  // Wooden Sleepers along track
  for (let x = -48; x <= 48; x += 1.2) {
    const sleeperGeo = new THREE.BoxGeometry(0.35, 0.12, 2.6);
    const sleeper = new THREE.Mesh(sleeperGeo, sleeperMat);
    sleeper.position.set(x, 0.06, -1.8);
    stationGroup.add(sleeper);
  }

  // Gravel ballast under tracks
  const ballastGeo = new THREE.BoxGeometry(100, 0.08, 3.4);
  const ballast = new THREE.Mesh(ballastGeo, darkBrickMat);
  ballast.position.set(0, 0.04, -1.8);
  stationGroup.add(ballast);

  // Stationed Hogwarts Express 5972 on the tracks!
  const stationTrain = createHogwartsExpress(false);
  stationTrain.position.set(-6, 0.15, -1.8);
  stationGroup.add(stationTrain);
  stationGroup.userData.stationTrain = stationTrain;

  // === 3. THE ICONIC PLATFORM 9¾ BRICK PILLAR BARRIER ===
  // Wall running along back of platform with the magical central arch
  const wallLength = 70;
  const backWallGeo = new THREE.BoxGeometry(wallLength, 8, 1.2);
  const backWall = new THREE.Mesh(backWallGeo, redBrickMat);
  backWall.position.set(0, 4.0, 13.4);
  stationGroup.add(backWall);

  // Sandstone arch mouldings and cornices
  const corniceGeo = new THREE.BoxGeometry(wallLength + 2, 0.6, 1.6);
  const cornice = new THREE.Mesh(corniceGeo, sandstoneCreamMat);
  cornice.position.set(0, 8.2, 13.4);
  stationGroup.add(cornice);

  // Platform 9¾ Main Brick Pillar (Where trolley enters)
  const barrierPillarGeo = new THREE.BoxGeometry(5.2, 7.5, 2.0);
  const barrierPillar = new THREE.Mesh(barrierPillarGeo, redBrickMat);
  barrierPillar.position.set(0, 3.75, 13.0);
  stationGroup.add(barrierPillar);

  // Sandstone decorative quoins on the pillar
  [-2.6, 2.6].forEach(x => {
    for (let y = 1.0; y < 7.0; y += 1.2) {
      const quoinGeo = new THREE.BoxGeometry(0.5, 0.5, 2.1);
      const quoin = new THREE.Mesh(quoinGeo, sandstoneCreamMat);
      quoin.position.set(x, y, 13.0);
      stationGroup.add(quoin);
    }
  });

  // Famous Round "PLATFORM 9¾" Enamel Sign
  const signBackGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.12, 32);
  signBackGeo.rotateX(Math.PI / 2);
  const signBack = new THREE.Mesh(signBackGeo, brassGoldMat);
  signBack.position.set(0, 5.8, 11.9);
  stationGroup.add(signBack);

  const signInnerGeo = new THREE.CylinderGeometry(0.88, 0.88, 0.14, 32);
  signInnerGeo.rotateX(Math.PI / 2);
  const signInnerMat = new THREE.MeshToonMaterial({ color: 0x740001 }); // Gryffindor / Express Red
  const signInner = new THREE.Mesh(signInnerGeo, signInnerMat);
  signInner.position.set(0, 5.8, 11.92);
  stationGroup.add(signInner);

  // Sign text banner plaque
  const signPlaqueGeo = new THREE.BoxGeometry(2.4, 0.45, 0.1);
  const signPlaque = new THREE.Mesh(signPlaqueGeo, sandstoneCreamMat);
  signPlaque.position.set(0, 4.4, 11.92);
  stationGroup.add(signPlaque);

  // === 4. LUGGAGE TROLLEY HALF-EMBEDDED IN THE WALL! ===
  const trolleyGroup = new THREE.Group();
  trolleyGroup.position.set(0, 0.9, 12.5); // Resting on platform, back half disappearing in wall

  // Brass trolley frame & handle
  const handleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.1, 8);
  const handle = new THREE.Mesh(handleGeo, brassGoldMat);
  handle.position.set(0, 1.15, -0.7);
  trolleyGroup.add(handle);

  const frameBar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 8), brassGoldMat);
  frameBar1.rotation.x = Math.PI / 4;
  frameBar1.position.set(-0.45, 0.65, -0.4);
  trolleyGroup.add(frameBar1);

  const frameBar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 8), brassGoldMat);
  frameBar2.rotation.x = Math.PI / 4;
  frameBar2.position.set(0.45, 0.65, -0.4);
  trolleyGroup.add(frameBar2);

  // Trolley platform base (front half sticks out)
  const trolleyBaseGeo = new THREE.BoxGeometry(1.0, 0.08, 1.0);
  const trolleyBase = new THREE.Mesh(trolleyBaseGeo, brassGoldMat);
  trolleyBase.position.set(0, 0.25, -0.3);
  trolleyGroup.add(trolleyBase);

  // Trolley front wheels
  [-0.45, 0.45].forEach(x => {
    const wGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.06, 12);
    wGeo.rotateZ(Math.PI / 2);
    const twheel = new THREE.Mesh(wGeo, brassGoldMat);
    twheel.position.set(x, 0.12, -0.6);
    trolleyGroup.add(twheel);
  });

  // Vintage Leather Wizard Trunks (Stacked on trolley)
  const trunk1Geo = new THREE.BoxGeometry(0.9, 0.42, 0.7);
  const trunk1 = new THREE.Mesh(trunk1Geo, woodMat);
  trunk1.position.set(0, 0.5, -0.2);
  trolleyGroup.add(trunk1);

  const trunk2Geo = new THREE.BoxGeometry(0.75, 0.35, 0.6);
  const trunk2Mat = new THREE.MeshToonMaterial({ color: 0x4a1818 });
  const trunk2 = new THREE.Mesh(trunk2Geo, trunk2Mat);
  trunk2.position.set(0.04, 0.88, -0.25);
  trolleyGroup.add(trunk2);

  // Owl Cage (Hedwig's cage on top of trunks)
  const cageGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.5, 12, 1, true);
  const cageMat = new THREE.MeshBasicMaterial({ color: 0xd4af37, wireframe: true });
  const cage = new THREE.Mesh(cageGeo, cageMat);
  cage.position.set(-0.15, 1.35, -0.25);
  trolleyGroup.add(cage);

  // Snowy Owl inside cage (White sphere + yellow beak)
  const owlGeo = new THREE.SphereGeometry(0.14, 12, 8);
  const owlMat = new THREE.MeshToonMaterial({ color: 0xfcfcfc });
  const owl = new THREE.Mesh(owlGeo, owlMat);
  owl.position.set(-0.15, 1.35, -0.25);
  trolleyGroup.add(owl);

  stationGroup.add(trolleyGroup);

  // Magical Barrier Portal Glow (Soft shimmering particles around wall entrance)
  const portalLight = new THREE.PointLight(0xffd700, 1.5, 6);
  portalLight.position.set(0, 2.5, 12.0);
  stationGroup.add(portalLight);

  // === 5. VICTORIAN / CHARBAGH ARCHES & ROOF CANOPY ===
  // Cast iron arches spanning platform every 12 meters
  for (let x = -36; x <= 36; x += 12) {
    // Arch columns
    const colGeo = new THREE.CylinderGeometry(0.28, 0.35, 7.5, 12);
    const col = new THREE.Mesh(colGeo, ironWorkMat);
    col.position.set(x, 4.65, 3.5);
    stationGroup.add(col);

    // Arch curved rib
    const ribGeo = new THREE.TorusGeometry(5.0, 0.14, 8, 16, Math.PI);
    ribGeo.rotateZ(Math.PI);
    const rib = new THREE.Mesh(ribGeo, ironWorkMat);
    rib.position.set(x, 8.4, 8.5);
    stationGroup.add(rib);

    // Hanging Gas Lantern from column
    const lanternGeo = new THREE.CylinderGeometry(0.15, 0.22, 0.45, 6);
    const lantern = new THREE.Mesh(lanternGeo, warmGlowMat);
    lantern.position.set(x, 5.8, 3.5);
    stationGroup.add(lantern);

    // Subtle warm point light
    const lanternLight = new THREE.PointLight(0xffaa44, 0.8, 8);
    lanternLight.position.set(x, 5.8, 3.5);
    stationGroup.add(lanternLight);
  }

  // Glass & Steel Arched Canopy
  const canopyGeo = new THREE.CylinderGeometry(5.2, 5.2, 84, 16, 1, true, 0, Math.PI);
  canopyGeo.rotateZ(Math.PI / 2);
  const canopy = new THREE.Mesh(canopyGeo, glassRoofMat);
  canopy.position.set(0, 8.4, 8.5);
  stationGroup.add(canopy);

  // === 6. LUCKNOW CHARBAGH DOMES (Over station roof) ===
  // Iconic Lucknow minarets and domed chattris
  [-30, 30].forEach(x => {
    // Minaret tower
    const minaretGeo = new THREE.CylinderGeometry(1.0, 1.2, 14, 16);
    const minaret = new THREE.Mesh(minaretGeo, redBrickMat);
    minaret.position.set(x, 8.0, 14.5);
    stationGroup.add(minaret);

    // Sandstone ribbed dome / chattri
    const domeGeo = new THREE.SphereGeometry(1.6, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, sandstoneCreamMat);
    dome.position.set(x, 15.0, 14.5);
    stationGroup.add(dome);

    // Golden spire on top
    const finialGeo = new THREE.ConeGeometry(0.3, 1.8, 12);
    const finial = new THREE.Mesh(finialGeo, brassGoldMat);
    finial.position.set(x, 17.5, 14.5);
    stationGroup.add(finial);
  });

  // Central Grand Dome
  const centralDomeGeo = new THREE.SphereGeometry(3.5, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const centralDome = new THREE.Mesh(centralDomeGeo, sandstoneCreamMat);
  centralDome.position.set(0, 10.0, 15.5);
  stationGroup.add(centralDome);

  // === 7. ENCHANTED DEPARTURE TIMETABLE BOARD ===
  const boardGeo = new THREE.BoxGeometry(6.5, 2.2, 0.25);
  const board = new THREE.Mesh(boardGeo, darkBrickMat);
  board.position.set(0, 6.2, 7.5);
  stationGroup.add(board);

  const boardFrameGeo = new THREE.BoxGeometry(6.8, 2.5, 0.28);
  const boardFrame = new THREE.Mesh(boardFrameGeo, brassGoldMat);
  boardFrame.position.set(0, 6.2, 7.48);
  stationGroup.add(boardFrame);

  // Hanging Clock with spinning hands
  const clockGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 24);
  clockGeo.rotateX(Math.PI / 2);
  const clock = new THREE.Mesh(clockGeo, sandstoneCreamMat);
  clock.position.set(0, 4.2, 7.5);
  stationGroup.add(clock);

  // Platform benches & parcel stacks
  [-18, 18].forEach(x => {
    // Bench
    const benchGeo = new THREE.BoxGeometry(3.2, 0.5, 0.8);
    const bench = new THREE.Mesh(benchGeo, woodMat);
    bench.position.set(x, 1.15, 8.5);
    stationGroup.add(bench);

    // Parcels / mail sacks
    const parcelGeo = new THREE.BoxGeometry(0.8, 0.6, 0.8);
    const parcel = new THREE.Mesh(parcelGeo, sandstoneCreamMat);
    parcel.position.set(x + 2.5, 1.2, 8.5);
    stationGroup.add(parcel);
  });

  // Station Group Position in the World
  // Lucknow Platform 9¾ is located on its own platform plateau
  stationGroup.position.set(-180, 0, -80);
  stationGroup.rotation.y = Math.PI / 6;

  return stationGroup;
}
