// Grand Hogwarts Castle Complex in Dehradun
// Great Hall, Astronomy Tower, 4 House Spires, Clock Tower Courtyard, Viaduct Bridge, Floating Candles

import * as THREE from 'three';

export function createHogwartsCastle() {
  const castleGroup = new THREE.Group();
  castleGroup.name = 'HogwartsCastleDehradun';

  // Materials
  const castleStoneMat = new THREE.MeshToonMaterial({ color: 0x5a575e }); // Weathered Himalayan stone
  const darkStoneMat = new THREE.MeshToonMaterial({ color: 0x3d3a42 });
  const slateRoofMat = new THREE.MeshToonMaterial({ color: 0x222e38 }); // Deep slate blue-grey
  const stainedGlassMat = new THREE.MeshBasicMaterial({ color: 0xffda73 }); // Golden candlelight glow
  const goldBrassMat = new THREE.MeshToonMaterial({ color: 0xd4af37 });
  const woodMat = new THREE.MeshToonMaterial({ color: 0x4a3525 });
  const waterMat = new THREE.MeshToonMaterial({ color: 0x205060, transparent: true, opacity: 0.85 });

  // Floating candle list for animation
  const floatingCandles = [];

  // === 1. CASTLE FOUNDATION ROCK / TERRACE ===
  // Elevated plateau for the castle
  const terraceGeo = new THREE.CylinderGeometry(65, 75, 12, 16);
  const terrace = new THREE.Mesh(terraceGeo, darkStoneMat);
  terrace.position.set(0, 6, 0);
  terrace.receiveShadow = true;
  castleGroup.add(terrace);

  // Grand Stone Approach Ramp leading from valley up to castle courtyard (south-west face)
  const rampShape = new THREE.Shape();
  rampShape.moveTo(-8, 0);
  rampShape.lineTo(8, 0);
  rampShape.lineTo(8, 28);
  rampShape.lineTo(-8, 28);
  rampShape.closePath();

  const rampGeo = new THREE.BoxGeometry(16, 12, 26);
  rampGeo.rotateX(-Math.PI / 8.2);
  const castleRamp = new THREE.Mesh(rampGeo, darkStoneMat);
  castleRamp.position.set(-35, 5.2, 55);
  castleRamp.rotation.y = -Math.PI / 5;
  castleGroup.add(castleRamp);

  // === 2. THE GREAT HALL ===
  const greatHall = new THREE.Group();
  greatHall.position.set(-15, 12, -10);

  // Hall Main Body
  const hallBodyGeo = new THREE.BoxGeometry(22, 16, 40);
  const hallBody = new THREE.Mesh(hallBodyGeo, castleStoneMat);
  hallBody.position.set(0, 8, 0);
  greatHall.add(hallBody);

  // High Peaked Slate Roof
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-11.5, 0);
  roofShape.lineTo(0, 14);
  roofShape.lineTo(11.5, 0);
  roofShape.closePath();

  const roofExtrudeSettings = { depth: 41, bevelEnabled: false };
  const roofGeo = new THREE.ExtrudeGeometry(roofShape, roofExtrudeSettings);
  roofGeo.translate(0, 16, -20.5);
  const hallRoof = new THREE.Mesh(roofGeo, slateRoofMat);
  greatHall.add(hallRoof);

  // Gothic Arched Buttresses along sides
  for (let z = -16; z <= 16; z += 8) {
    [-11.4, 11.4].forEach(x => {
      const buttressGeo = new THREE.BoxGeometry(1.6, 15, 1.8);
      const buttress = new THREE.Mesh(buttressGeo, darkStoneMat);
      buttress.position.set(x, 7.5, z);
      greatHall.add(buttress);

      // Buttress slope cap
      const capGeo = new THREE.ConeGeometry(1.1, 2.5, 4);
      capGeo.rotateY(Math.PI / 4);
      const cap = new THREE.Mesh(capGeo, slateRoofMat);
      cap.position.set(x, 16.2, z);
      greatHall.add(cap);
    });
  }

  // Giant Stained Glass Windows (Back & Front)
  const windowEndGeo = new THREE.BoxGeometry(8, 11, 0.2);
  [-20.1, 20.1].forEach(z => {
    const endWin = new THREE.Mesh(windowEndGeo, stainedGlassMat);
    endWin.position.set(0, 10, z);
    greatHall.add(endWin);
  });

  // Side Arched Windows
  for (let z = -14; z <= 14; z += 7) {
    [-11.1, 11.1].forEach(x => {
      const sideWinGeo = new THREE.BoxGeometry(0.2, 7, 3);
      const sideWin = new THREE.Mesh(sideWinGeo, stainedGlassMat);
      sideWin.position.set(x, 9, z);
      greatHall.add(sideWin);
    });
  }

  // Warm Great Hall Interior Light Source
  const greatHallLight = new THREE.PointLight(0xffb84d, 2.8, 38);
  greatHallLight.position.set(0, 10, 0);
  greatHall.add(greatHallLight);

  // 4 Long House Banquet Tables (Gryffindor, Ravenclaw, Hufflepuff, Slytherin)
  [-6, -2, 2, 6].forEach(tx => {
    const tableGeo = new THREE.BoxGeometry(2.2, 0.75, 26);
    const table = new THREE.Mesh(tableGeo, woodMat);
    table.position.set(tx, 0.75, 0);
    table.castShadow = true;
    table.receiveShadow = true;
    greatHall.add(table);

    // Golden plates and goblets on table
    for (let pz = -11; pz <= 11; pz += 3.5) {
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.05, 10), goldBrassMat);
      plate.position.set(tx, 1.15, pz);
      greatHall.add(plate);

      const goblet = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.28, 8), goldBrassMat);
      goblet.position.set(tx + 0.4, 1.25, pz);
      greatHall.add(goblet);
    }
  });

  // Grand Stone Fireplace Hearth at the end of the Great Hall
  const hearthGeo = new THREE.BoxGeometry(7, 6, 2.5);
  const hearth = new THREE.Mesh(hearthGeo, darkStoneMat);
  hearth.position.set(0, 3, -19);
  greatHall.add(hearth);

  const fireCavity = new THREE.Mesh(new THREE.BoxGeometry(4, 3.5, 2), new THREE.MeshBasicMaterial({ color: 0x110808 }));
  fireCavity.position.set(0, 2, -18.8);
  greatHall.add(fireCavity);

  const flameGlow = new THREE.PointLight(0xff6600, 3.2, 18);
  flameGlow.position.set(0, 2.5, -18);
  greatHall.add(flameGlow);

  // 4 Hogwarts House Tapestry Banners hanging on Great Hall walls
  const houseBanners = [
    { color: 0x740001, fringe: 0xf7b32b, x: -10.8, z: -10 }, // Gryffindor
    { color: 0x1a472a, fringe: 0xcccccc, x: -10.8, z: 10 },  // Slytherin
    { color: 0x0e1a40, fringe: 0xc49b45, x: 10.8, z: -10 },  // Ravenclaw
    { color: 0xecb939, fringe: 0x222222, x: 10.8, z: 10 }    // Hufflepuff
  ];

  houseBanners.forEach(b => {
    const bannerGroup = new THREE.Group();
    bannerGroup.position.set(b.x, 8, b.z);

    const bannerGeo = new THREE.BoxGeometry(0.1, 7.5, 3.2);
    const bannerMat = new THREE.MeshToonMaterial({ color: b.color });
    const banner = new THREE.Mesh(bannerGeo, bannerMat);
    bannerGroup.add(banner);

    // Gold/accent fringe trimming at bottom
    const fringeGeo = new THREE.BoxGeometry(0.12, 0.45, 3.2);
    const fringeMat = new THREE.MeshToonMaterial({ color: b.fringe });
    const fringe = new THREE.Mesh(fringeGeo, fringeMat);
    fringe.position.y = -3.8;
    bannerGroup.add(fringe);

    greatHall.add(bannerGroup);
  });

  // FLOATING CANDLES (Enchanted floating candles inside Great Hall)
  const candleCount = 28;
  const candleMat = new THREE.MeshBasicMaterial({ color: 0xfffbe8 });
  const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa22 });

  for (let i = 0; i < candleCount; i++) {
    const candleGroup = new THREE.Group();
    const cx = (Math.random() - 0.5) * 14;
    const cy = 7 + Math.random() * 6;
    const cz = (Math.random() - 0.5) * 30;
    candleGroup.position.set(cx, cy, cz);

    // Candle wax body
    const waxGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.9, 8);
    const wax = new THREE.Mesh(waxGeo, candleMat);
    candleGroup.add(wax);

    // Flickering Flame
    const flameGeo = new THREE.ConeGeometry(0.1, 0.3, 8);
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.y = 0.55;
    candleGroup.add(flame);

    greatHall.add(candleGroup);
    floatingCandles.push({
      group: candleGroup,
      baseY: cy,
      speed: 1.5 + Math.random() * 2.0,
      phase: Math.random() * Math.PI * 2
    });
  }

  castleGroup.add(greatHall);

  // === 3. THE ASTRONOMY TOWER (Tallest Pinnacle) ===
  const astroTower = new THREE.Group();
  astroTower.position.set(18, 12, -22);

  // Massive round base tower
  const towerBaseGeo = new THREE.CylinderGeometry(6, 7.5, 38, 20);
  const towerBase = new THREE.Mesh(towerBaseGeo, castleStoneMat);
  towerBase.position.set(0, 19, 0);
  astroTower.add(towerBase);

  // Upper observation terrace balcony
  const balconyGeo = new THREE.CylinderGeometry(7.8, 6.2, 4, 20);
  const balcony = new THREE.Mesh(balconyGeo, darkStoneMat);
  balcony.position.set(0, 40, 0);
  astroTower.add(balcony);

  // Battlement crenellations
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
    const crenGeo = new THREE.BoxGeometry(1.2, 1.4, 0.8);
    const cren = new THREE.Mesh(crenGeo, darkStoneMat);
    cren.position.set(Math.cos(a) * 7.5, 42.5, Math.sin(a) * 7.5);
    cren.rotation.y = -a;
    astroTower.add(cren);
  }

  // Upper Spire
  const upperSpireGeo = new THREE.CylinderGeometry(3.5, 4.2, 18, 16);
  const upperSpire = new THREE.Mesh(upperSpireGeo, castleStoneMat);
  upperSpire.position.set(0, 50, 0);
  astroTower.add(upperSpire);

  // Pointed Conical Spire Roof (Slate)
  const spireRoofGeo = new THREE.ConeGeometry(4.8, 16, 16);
  const spireRoof = new THREE.Mesh(spireRoofGeo, slateRoofMat);
  spireRoof.position.set(0, 67, 0);
  astroTower.add(spireRoof);

  // Rotating Brass Armillary Sphere & Astrological Rings on Spire
  const armillaryGroup = new THREE.Group();
  armillaryGroup.position.set(0, 75.5, 0);

  const ringGeo1 = new THREE.TorusGeometry(1.8, 0.08, 8, 24);
  const ring1 = new THREE.Mesh(ringGeo1, goldBrassMat);
  armillaryGroup.add(ring1);

  const ringGeo2 = new THREE.TorusGeometry(1.5, 0.08, 8, 24);
  const ring2 = new THREE.Mesh(ringGeo2, goldBrassMat);
  ring2.rotation.x = Math.PI / 3;
  armillaryGroup.add(ring2);

  const ringGeo3 = new THREE.TorusGeometry(1.2, 0.08, 8, 24);
  const ring3 = new THREE.Mesh(ringGeo3, goldBrassMat);
  ring3.rotation.y = Math.PI / 3;
  armillaryGroup.add(ring3);

  astroTower.add(armillaryGroup);
  astroTower.userData.armillary = armillaryGroup;

  castleGroup.add(astroTower);

  // === 4. FOUR HOUSE TOWERS & SPIRES ===
  const houseTowers = [
    { name: 'Gryffindor', color: 0x740001, accent: 0xd4af37, x: -28, z: 12, h: 42, r: 4.5 },
    { name: 'Ravenclaw', color: 0x0e1a40, accent: 0x946b2d, x: 25, z: 10, h: 46, r: 4.2 },
    { name: 'Slytherin', color: 0x1a472a, accent: 0xaaaaaa, x: -22, z: -30, h: 36, r: 5.0 },
    { name: 'Hufflepuff', color: 0xecb939, accent: 0x222222, x: 22, z: -10, h: 38, r: 4.6 }
  ];

  houseTowers.forEach(t => {
    const tower = new THREE.Group();
    tower.position.set(t.x, 12, t.z);

    // Tower Body
    const bodyGeo = new THREE.CylinderGeometry(t.r * 0.85, t.r, t.h, 16);
    const body = new THREE.Mesh(bodyGeo, castleStoneMat);
    body.position.set(0, t.h / 2, 0);
    tower.add(body);

    // Conical Slate Roof
    const cRoofGeo = new THREE.ConeGeometry(t.r * 1.15, 12, 16);
    const cRoof = new THREE.Mesh(cRoofGeo, slateRoofMat);
    cRoof.position.set(0, t.h + 6, 0);
    tower.add(cRoof);

    // Fluttering House Banner
    const bannerGeo = new THREE.BoxGeometry(0.1, 5, 2.2);
    const bannerMat = new THREE.MeshToonMaterial({ color: t.color });
    const banner = new THREE.Mesh(bannerGeo, bannerMat);
    banner.position.set(t.r + 0.1, t.h - 4, 0);
    tower.add(banner);

    // Glowing window slit
    const slitGeo = new THREE.BoxGeometry(0.2, 4, 1.2);
    const slit = new THREE.Mesh(slitGeo, stainedGlassMat);
    slit.position.set(0, t.h - 8, t.r + 0.05);
    tower.add(slit);

    castleGroup.add(tower);
  });

  // === 5. CLOCK TOWER & QUAD COURTYARD ===
  const courtyard = new THREE.Group();
  courtyard.position.set(0, 12, 18);

  // Cobblestone Quad Floor
  const quadFloorGeo = new THREE.BoxGeometry(38, 0.6, 32);
  const quadFloor = new THREE.Mesh(quadFloorGeo, darkStoneMat);
  quadFloor.position.set(0, 0.3, 0);
  courtyard.add(quadFloor);

  // Gothic Cloisters (Arched walkways along courtyard perimeter)
  [-17, 17].forEach(x => {
    for (let z = -12; z <= 12; z += 6) {
      const archPillar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 6, 0.8), castleStoneMat);
      archPillar.position.set(x, 3.3, z);
      courtyard.add(archPillar);
    }
    const arcadeRoof = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.6, 28), slateRoofMat);
    arcadeRoof.position.set(x, 6.4, 0);
    courtyard.add(arcadeRoof);
  });

  // Central Stone Fountain
  const fountainBaseGeo = new THREE.CylinderGeometry(3.6, 4.0, 1.2, 16);
  const fountainBase = new THREE.Mesh(fountainBaseGeo, castleStoneMat);
  fountainBase.position.set(0, 0.9, 0);
  courtyard.add(fountainBase);

  const fountainWaterGeo = new THREE.CylinderGeometry(3.3, 3.3, 0.2, 16);
  const fountainWater = new THREE.Mesh(fountainWaterGeo, waterMat);
  fountainWater.position.set(0, 1.4, 0);
  courtyard.add(fountainWater);

  const fountainSpireGeo = new THREE.ConeGeometry(0.6, 2.8, 8);
  const fountainSpire = new THREE.Mesh(fountainSpireGeo, darkStoneMat);
  fountainSpire.position.set(0, 2.5, 0);
  courtyard.add(fountainSpire);

  // Glowing Stone Braziers at Courtyard Corners
  [[-13, -10], [13, -10], [-13, 10], [13, 10]].forEach(([bx, bz]) => {
    const brazier = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.5, 1.4, 8), darkStoneMat);
    brazier.position.set(bx, 1.0, bz);
    courtyard.add(brazier);

    const bFire = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.75, 8), new THREE.MeshBasicMaterial({ color: 0xff7700 }));
    bFire.position.set(bx, 1.9, bz);
    courtyard.add(bFire);

    const bLight = new THREE.PointLight(0xff8822, 1.4, 14);
    bLight.position.set(bx, 2.1, bz);
    courtyard.add(bLight);
  });

  // CLOCK TOWER (At end of Courtyard)
  const clockTower = new THREE.Group();
  clockTower.position.set(0, 0, 18);

  const ctBodyGeo = new THREE.BoxGeometry(10, 32, 10);
  const ctBody = new THREE.Mesh(ctBodyGeo, castleStoneMat);
  ctBody.position.set(0, 16, 0);
  clockTower.add(ctBody);

  // Clock Faces (Front and Back)
  [-5.1, 5.1].forEach(z => {
    const clockFaceGeo = new THREE.CylinderGeometry(2.4, 2.4, 0.2, 24);
    clockFaceGeo.rotateX(Math.PI / 2);
    const clockFace = new THREE.Mesh(clockFaceGeo, stainedGlassMat);
    clockFace.position.set(0, 24, z);
    clockTower.add(clockFace);

    // Brass hands
    const hand1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.4, 0.3), darkStoneMat);
    hand1.position.set(0, 24.6, z + (z > 0 ? 0.1 : -0.1));
    clockTower.add(hand1);

    const hand2 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.1, 0.3), darkStoneMat);
    hand2.position.set(0.4, 24, z + (z > 0 ? 0.1 : -0.1));
    clockTower.add(hand2);
  });

  // Clock Tower Steeple Roof
  const ctRoofGeo = new THREE.ConeGeometry(7.2, 14, 4);
  ctRoofGeo.rotateY(Math.PI / 4);
  const ctRoof = new THREE.Mesh(ctRoofGeo, slateRoofMat);
  ctRoof.position.set(0, 39, 0);
  clockTower.add(ctRoof);

  courtyard.add(clockTower);
  castleGroup.add(courtyard);

  // === 6. GRAND VIADUCT ENTRANCE BRIDGE ===
  // Arched stone bridge spanning outwards from castle towards mountains
  const viaductBridge = new THREE.Group();
  viaductBridge.position.set(0, 12, 38);

  const bridgeDeckGeo = new THREE.BoxGeometry(7, 1.2, 45);
  const bridgeDeck = new THREE.Mesh(bridgeDeckGeo, darkStoneMat);
  bridgeDeck.position.set(0, 0.6, 22.5);
  viaductBridge.add(bridgeDeck);

  // Bridge Parapet Walls
  [-3.4, 3.4].forEach(x => {
    const parapetGeo = new THREE.BoxGeometry(0.6, 1.2, 45);
    const parapet = new THREE.Mesh(parapetGeo, castleStoneMat);
    parapet.position.set(x, 1.6, 22.5);
    viaductBridge.add(parapet);
  });

  // Tall Stone Arches underneath the bridge
  for (let z = 8; z <= 38; z += 12) {
    const archPillar = new THREE.Mesh(new THREE.BoxGeometry(4.5, 20, 3.5), castleStoneMat);
    archPillar.position.set(0, -9.5, z);
    viaductBridge.add(archPillar);
  }

  castleGroup.add(viaductBridge);

  // === 7. MEDIEVAL BOATHOUSE (By the Great Lake below cliff) ===
  const boathouse = new THREE.Group();
  boathouse.position.set(38, 0, -35);

  const bhBodyGeo = new THREE.BoxGeometry(12, 7, 16);
  const bhBody = new THREE.Mesh(bhBodyGeo, darkStoneMat);
  bhBody.position.set(0, 3.5, 0);
  boathouse.add(bhBody);

  const bhRoofGeo = new THREE.ConeGeometry(9.5, 6, 4);
  bhRoofGeo.rotateY(Math.PI / 4);
  const bhRoof = new THREE.Mesh(bhRoofGeo, slateRoofMat);
  bhRoof.position.set(0, 9.8, 0);
  boathouse.add(bhRoof);

  // Wooden jetty / dock into water
  const jettyGeo = new THREE.BoxGeometry(5, 0.4, 18);
  const jetty = new THREE.Mesh(jettyGeo, woodMat);
  jetty.position.set(0, 0.4, 14);
  boathouse.add(jetty);

  castleGroup.add(boathouse);

  // Animation loop for floating candles and armillary sphere
  castleGroup.userData.update = function (delta, elapsed) {
    // Floating candles gentle bobbing
    for (let i = 0; i < floatingCandles.length; i++) {
      const c = floatingCandles[i];
      c.group.position.y = c.baseY + Math.sin(elapsed * c.speed + c.phase) * 0.45;
    }

    // Armillary rings rotation
    if (astroTower.userData.armillary) {
      astroTower.userData.armillary.rotation.y += delta * 0.25;
      astroTower.userData.armillary.rotation.x = Math.sin(elapsed * 0.3) * 0.15;
    }
  };

  // Center the castle in the world
  castleGroup.position.set(40, 0, 40);

  return castleGroup;
}
