// Grand Lucknow Charbagh Railway Station & Platform 9¾
// Authentic Indian Railway Architecture: Red brick palace facade, multi-track yard,
// platform canopies, passenger footbridge, tea stalls, Platform 9¾ brick barrier & trolley

import * as THREE from 'three';
import { createHogwartsExpress } from './hogwarts-express.js';

export function createLucknowStation() {
  const stationGroup = new THREE.Group();
  stationGroup.name = 'LucknowCharbaghPlatform934';

  // Materials
  const tarmacMat = new THREE.MeshToonMaterial({ color: 0x222026 }); // Station yard ground
  const platformMat = new THREE.MeshToonMaterial({ color: 0x3d3a40 }); // Concrete platform flags
  const platformEdgeMat = new THREE.MeshToonMaterial({ color: 0xf5df65 }); // Yellow tactile safety line
  const redBrickMat = new THREE.MeshToonMaterial({ color: 0x8b2525 }); // Lucknow Charbagh terracotta brick
  const darkBrickMat = new THREE.MeshToonMaterial({ color: 0x661818 });
  const creamStoneMat = new THREE.MeshToonMaterial({ color: 0xded0b8 }); // Sandstone trim
  const ironGreenMat = new THREE.MeshToonMaterial({ color: 0x1f2e26 }); // Victorian iron pillars
  const glassRoofMat = new THREE.MeshToonMaterial({ color: 0x98c5d6, transparent: true, opacity: 0.55 });
  const ballastMat = new THREE.MeshToonMaterial({ color: 0x2c2b30 }); // Track gravel
  const steelRailMat = new THREE.MeshToonMaterial({ color: 0x4a4a52 });
  const sleeperMat = new THREE.MeshToonMaterial({ color: 0x38281e });
  const woodMat = new THREE.MeshToonMaterial({ color: 0x4a3220 });
  const brassMat = new THREE.MeshToonMaterial({ color: 0xd4af37 });
  const whitePlasterMat = new THREE.MeshToonMaterial({ color: 0xf2ece4 }); // Charbagh domes
  const yellowSignMat = new THREE.MeshToonMaterial({ color: 0xf7b32b }); // Indian Railways yellow board
  const warmLightMat = new THREE.MeshBasicMaterial({ color: 0xffd175 });

  // === 1. EXPANSIVE STATION GROUND SLAB (Eliminates green grass!) ===
  // 180m x 140m urban railway yard base
  const yardGroundGeo = new THREE.BoxGeometry(180, 0.4, 140);
  const yardGround = new THREE.Mesh(yardGroundGeo, tarmacMat);
  yardGround.position.set(0, 0.2, 0);
  yardGround.receiveShadow = true;
  stationGroup.add(yardGround);

  // === 2. MULTIPLE PASSENGER PLATFORMS ===
  // Platform 9 & 9¾ (Main Island Platform)
  const mainPlatGeo = new THREE.BoxGeometry(130, 0.8, 16);
  const mainPlatform = new THREE.Mesh(mainPlatGeo, platformMat);
  mainPlatform.position.set(0, 0.6, 0); // Top of platform is y = 1.0
  mainPlatform.receiveShadow = true;
  stationGroup.add(mainPlatform);

  // Yellow safety edge lines on both sides of platform
  [-7.75, 7.75].forEach(z => {
    const lineGeo = new THREE.BoxGeometry(130, 0.05, 0.4);
    const line = new THREE.Mesh(lineGeo, platformEdgeMat);
    line.position.set(0, 1.02, z);
    stationGroup.add(line);
  });

  // Second Platform (Platform 8) across the tracks
  const plat8Geo = new THREE.BoxGeometry(130, 0.8, 12);
  const plat8 = new THREE.Mesh(plat8Geo, platformMat);
  plat8.position.set(0, 0.6, -24);
  stationGroup.add(plat8);

  const plat8Line = new THREE.Mesh(new THREE.BoxGeometry(130, 0.05, 0.4), platformEdgeMat);
  plat8Line.position.set(0, 1.02, -18.25);
  stationGroup.add(plat8Line);

  // Third Platform (Platform 10) on other side
  const plat10Geo = new THREE.BoxGeometry(130, 0.8, 12);
  const plat10 = new THREE.Mesh(plat10Geo, platformMat);
  plat10.position.set(0, 0.6, 24);
  stationGroup.add(plat10);

  const plat10Line = new THREE.Mesh(new THREE.BoxGeometry(130, 0.05, 0.4), platformEdgeMat);
  plat10Line.position.set(0, 1.02, 18.25);
  stationGroup.add(plat10Line);

  // === 3. MULTI-TRACK RAIL YARDS WITH BALLAST & SLEEPERS ===
  // Track 1 (Between Plat 8 and Plat 9)
  // Track 2 (Between Plat 9¾ and Plat 10)
  [-12, 12].forEach(trackZ => {
    // Ballast stone bed
    const bGeo = new THREE.BoxGeometry(140, 0.15, 6);
    const ballast = new THREE.Mesh(bGeo, ballastMat);
    ballast.position.set(0, 0.35, trackZ);
    stationGroup.add(ballast);

    // Two parallel steel rails
    [-1.0, 1.0].forEach(rz => {
      const railGeo = new THREE.BoxGeometry(140, 0.18, 0.12);
      const rail = new THREE.Mesh(railGeo, steelRailMat);
      rail.position.set(0, 0.52, trackZ + rz);
      stationGroup.add(rail);
    });

    // Sleepers along the line
    for (let x = -65; x <= 65; x += 1.4) {
      const slpGeo = new THREE.BoxGeometry(0.35, 0.12, 2.8);
      const slp = new THREE.Mesh(slpGeo, sleeperMat);
      slp.position.set(x, 0.42, trackZ);
      stationGroup.add(slp);
    }
  });

  // STATIONED 5972 HOGWARTS EXPRESS ON TRACK 1!
  const expressTrain = createHogwartsExpress(false);
  expressTrain.position.set(-8, 0.52, -12);
  stationGroup.add(expressTrain);
  stationGroup.userData.stationTrain = expressTrain;

  // === 4. GRAND LUCKNOW CHARBAGH PALACE STATION HALL (Backdrop) ===
  const palaceGroup = new THREE.Group();
  palaceGroup.position.set(0, 0, 42); // Along the back concourse

  // Massive Red-Brick Facade (110m long, 16m high)
  const facadeGeo = new THREE.BoxGeometry(120, 16, 12);
  const facade = new THREE.Mesh(facadeGeo, redBrickMat);
  facade.position.set(0, 8, 0);
  palaceGroup.add(facade);

  // Sandstone belt courses and decorative cornices
  [4.5, 9.5, 14.5, 16.2].forEach(y => {
    const cGeo = new THREE.BoxGeometry(122, 0.45, 12.6);
    const corn = new THREE.Mesh(cGeo, creamStoneMat);
    corn.position.set(0, y, 0);
    palaceGroup.add(corn);
  });

  // Central Grand Portico
  const porticoGeo = new THREE.BoxGeometry(32, 18, 8);
  const portico = new THREE.Mesh(porticoGeo, redBrickMat);
  portico.position.set(0, 9, -8);
  palaceGroup.add(portico);

  // Arched passenger entry tunnels
  [-8, 8].forEach(x => {
    const archGeo = new THREE.BoxGeometry(6, 8, 8.5);
    const arch = new THREE.Mesh(archGeo, tarmacMat);
    arch.position.set(x, 4, -8);
    palaceGroup.add(arch);
  });

  // Iconic Charbagh White Domes & Awadhi Chhatris
  // Central Great Bulbous Dome
  const domeBase = new THREE.Mesh(new THREE.CylinderGeometry(7, 7.5, 3.5, 24), creamStoneMat);
  domeBase.position.set(0, 19.5, -8);
  palaceGroup.add(domeBase);

  const centralDome = new THREE.Mesh(new THREE.SphereGeometry(7.2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 1.7), whitePlasterMat);
  centralDome.position.set(0, 22, -8);
  palaceGroup.add(centralDome);

  const domeFinial = new THREE.Mesh(new THREE.ConeGeometry(0.6, 4.5, 12), brassMat);
  domeFinial.position.set(0, 29.5, -8);
  palaceGroup.add(domeFinial);

  // Flanking Chhatri Domes along palace roofline
  [-45, -25, 25, 45].forEach(x => {
    const chhatriBase = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.8, 4, 12), redBrickMat);
    chhatriBase.position.set(x, 18, 0);
    palaceGroup.add(chhatriBase);

    const cDome = new THREE.Mesh(new THREE.SphereGeometry(3.0, 16, 12, 0, Math.PI * 2, 0, Math.PI / 1.8), whitePlasterMat);
    cDome.position.set(x, 21, 0);
    palaceGroup.add(cDome);

    const cFinial = new THREE.Mesh(new THREE.ConeGeometry(0.3, 2.5, 8), brassMat);
    cFinial.position.set(x, 24.5, 0);
    palaceGroup.add(cFinial);
  });

  // Station Clock Tower with moving hands
  const clockTowerGeo = new THREE.BoxGeometry(9, 10, 9);
  const clockTower = new THREE.Mesh(clockTowerGeo, redBrickMat);
  clockTower.position.set(0, 23, -8);
  palaceGroup.add(clockTower);

  const clockFaceGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.3, 24);
  clockFaceGeo.rotateX(Math.PI / 2);
  const clockFace = new THREE.Mesh(clockFaceGeo, whitePlasterMat);
  clockFace.position.set(0, 24, -12.6);
  palaceGroup.add(clockFace);

  stationGroup.add(palaceGroup);

  // === 5. THE ICONIC PLATFORM 9¾ BRICK PILLAR BARRIER ===
  // Positioned right in the middle of Platform 9/10
  const barrierGroup = new THREE.Group();
  barrierGroup.position.set(0, 1.0, 0);

  // Central Brick Pillar Dividing Wall
  const pillarWallGeo = new THREE.BoxGeometry(14, 6.5, 2.6);
  const pillarWall = new THREE.Mesh(pillarWallGeo, redBrickMat);
  pillarWall.position.set(0, 3.25, 0);
  barrierGroup.add(pillarWall);

  // Sandstone cornice atop barrier pillar
  const pillarCapGeo = new THREE.BoxGeometry(15, 0.6, 3.2);
  const pillarCap = new THREE.Mesh(pillarCapGeo, creamStoneMat);
  pillarCap.position.set(0, 6.75, 0);
  barrierGroup.add(pillarCap);

  // Round Brass & Red Enamel Sign: "PLATFORM 9¾"
  const signBack = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.14, 32), brassMat);
  signBack.rotateX(Math.PI / 2);
  signBack.position.set(0, 5.0, 1.35);
  barrierGroup.add(signBack);

  const signInner = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.16, 32), new THREE.MeshToonMaterial({ color: 0x740001 }));
  signInner.rotateX(Math.PI / 2);
  signInner.position.set(0, 5.0, 1.36);
  barrierGroup.add(signInner);

  // "PLATFORM 9¾ - HOGWARTS EXPRESS" Plaque
  const plaqueGeo = new THREE.BoxGeometry(3.6, 0.55, 0.1);
  const plaque = new THREE.Mesh(plaqueGeo, creamStoneMat);
  plaque.position.set(0, 3.4, 1.36);
  barrierGroup.add(plaque);

  // LUGGAGE TROLLEY EMBEDDED IN THE BRICK WALL!
  const trolley = new THREE.Group();
  trolley.position.set(0, 0, 0.4);

  // Brass trolley frame
  const handleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8), brassMat);
  handleBar.position.set(0, 1.15, 0.9);
  trolley.add(handleBar);

  const trolleyBase = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.1, 1.4), brassMat);
  trolleyBase.position.set(0, 0.3, 0.5);
  trolley.add(trolleyBase);

  // Leather wizard trunks stacked on trolley
  const trunk1 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.45, 0.8), woodMat);
  trunk1.position.set(0, 0.55, 0.4);
  trolley.add(trunk1);

  const trunk2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.38, 0.65), darkBrickMat);
  trunk2.position.set(0.05, 0.95, 0.35);
  trolley.add(trunk2);

  // Hedwig's Owl Cage
  const cage = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.55, 12, 1, true), new THREE.MeshBasicMaterial({ color: 0xd4af37, wireframe: true }));
  cage.position.set(-0.15, 1.45, 0.35);
  trolley.add(cage);

  const snowyOwl = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 8), new THREE.MeshToonMaterial({ color: 0xffffff }));
  snowyOwl.position.set(-0.15, 1.45, 0.35);
  trolley.add(snowyOwl);

  barrierGroup.add(trolley);

  // Magical Portal Golden Light
  const barrierGlow = new THREE.PointLight(0xffea60, 2.5, 8);
  barrierGlow.position.set(0, 2.5, 1.5);
  barrierGroup.add(barrierGlow);

  stationGroup.add(barrierGroup);

  // === 6. EXPANSIVE VICTORIAN ARCHED PLATFORM CANOPY ===
  // Arched ironwork roof covering the entire platform
  for (let x = -50; x <= 50; x += 15) {
    // Twin iron support columns
    [-5.5, 5.5].forEach(z => {
      const colGeo = new THREE.CylinderGeometry(0.32, 0.4, 8, 12);
      const col = new THREE.Mesh(colGeo, ironGreenMat);
      col.position.set(x, 5.0, z);
      stationGroup.add(col);

      // Hanging station lantern
      const lan = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 0.5, 6), warmLightMat);
      lan.position.set(x, 6.2, z);
      stationGroup.add(lan);

      const lLight = new THREE.PointLight(0xffaa44, 0.9, 10);
      lLight.position.set(x, 6.2, z);
      stationGroup.add(lLight);
    });

    // Curved ironwork arch truss
    const trussGeo = new THREE.TorusGeometry(6.2, 0.16, 8, 16, Math.PI);
    trussGeo.rotateZ(Math.PI);
    const truss = new THREE.Mesh(trussGeo, ironGreenMat);
    truss.position.set(x, 9.0, 0);
    stationGroup.add(truss);
  }

  // Vaulted Glass Canopy Roof
  const canopyGeo = new THREE.CylinderGeometry(6.5, 6.5, 115, 16, 1, true, 0, Math.PI);
  canopyGeo.rotateZ(Math.PI / 2);
  const canopy = new THREE.Mesh(canopyGeo, glassRoofMat);
  canopy.position.set(0, 9.0, 0);
  stationGroup.add(canopy);

  // === 7. OVERHEAD PASSENGER FOOTBRIDGE (Connects Platforms) ===
  const bridgeGroup = new THREE.Group();
  bridgeGroup.position.set(35, 1.0, 0);

  // Overhead Walkway
  const bridgeWalkway = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.8, 54), ironGreenMat);
  bridgeWalkway.position.set(0, 7.8, 0);
  bridgeGroup.add(bridgeWalkway);

  // Parapets
  [-2.2, 2.2].forEach(bx => {
    const bParapet = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.4, 54), creamStoneMat);
    bParapet.position.set(bx, 8.8, 0);
    bridgeGroup.add(bParapet);
  });

  // Stairs descending to each platform
  [-24, 0, 24].forEach(sz => {
    const stairGeo = new THREE.BoxGeometry(3.5, 7.5, 6);
    const stair = new THREE.Mesh(stairGeo, ironGreenMat);
    stair.position.set(0, 3.75, sz);
    bridgeGroup.add(stair);
  });

  stationGroup.add(bridgeGroup);

  // === 8. AUTHENTIC STATION AMENITIES (Chai Stall, Signs, Benches) ===
  // Lucknow Special Kulhad Chai Stall
  const chaiStall = new THREE.Group();
  chaiStall.position.set(-22, 1.0, 3.8);

  const stallCounter = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.2, 1.8), woodMat);
  stallCounter.position.y = 0.6;
  chaiStall.add(stallCounter);

  const stallCanopy = new THREE.Mesh(new THREE.ConeGeometry(2.8, 1.2, 4), new THREE.MeshToonMaterial({ color: 0x8b0000 }));
  stallCanopy.rotateY(Math.PI / 4);
  stallCanopy.position.y = 2.4;
  chaiStall.add(stallCanopy);

  // Copper Samovar / Kettle
  const kettle = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 0.6, 10), brassMat);
  kettle.position.set(0.8, 1.5, 0);
  chaiStall.add(kettle);

  stationGroup.add(chaiStall);

  // Yellow Indian Railways Station Nameboards (Charbagh LKO)
  [-40, 40].forEach(x => {
    const signPost = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.2, 8), steelRailMat);
    signPost.position.set(x, 2.6, 0);
    stationGroup.add(signPost);

    const signBoard = new THREE.Mesh(new THREE.BoxGeometry(5.5, 1.2, 0.15), yellowSignMat);
    signBoard.position.set(x, 3.8, 0);
    stationGroup.add(signBoard);
  });

  // Station Wooden Benches
  [-30, -10, 15, 28].forEach(bx => {
    const bench = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.55, 0.8), woodMat);
    bench.position.set(bx, 1.28, -3.5);
    stationGroup.add(bench);
  });

  // Position Lucknow Station in its own dedicated sector
  stationGroup.position.set(-200, 0, -100);

  return stationGroup;
}
