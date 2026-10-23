// Hogwarts Express 5972 Locomotive & Carriages Model
// Movie-accurate 4-6-0 crimson scarlet & black steam engine with brass fittings and animated steam puffs

import * as THREE from 'three';

export function createHogwartsExpress(isMovingInstance = false) {
  const trainGroup = new THREE.Group();
  trainGroup.name = isMovingInstance ? 'MovingHogwartsExpress' : 'StationHogwartsExpress';

  // Materials (Cel-shaded Toon style)
  const crimsonMat = new THREE.MeshToonMaterial({ color: 0x7a0c10 }); // Iconic deep scarlet
  const blackMat = new THREE.MeshToonMaterial({ color: 0x18181a });
  const darkGreyMat = new THREE.MeshToonMaterial({ color: 0x2d2d30 });
  const brassMat = new THREE.MeshToonMaterial({ color: 0xd4af37 }); // Golden brass
  const redBogieMat = new THREE.MeshToonMaterial({ color: 0x8a1418 });
  const windowGlowMat = new THREE.MeshBasicMaterial({ color: 0xffe6a3 });
  const wheelMat = new THREE.MeshToonMaterial({ color: 0x111113 });
  const creamMat = new THREE.MeshToonMaterial({ color: 0xf5ebd0 });

  // === 1. LOCOMOTIVE ENGINE (4-6-0) ===
  const engine = new THREE.Group();

  // Cylindrical Boiler (Horizontal)
  const boilerGeo = new THREE.CylinderGeometry(1.2, 1.2, 6.2, 24);
  boilerGeo.rotateZ(Math.PI / 2);
  const boiler = new THREE.Mesh(boilerGeo, crimsonMat);
  boiler.position.set(0, 2.5, 0);
  engine.add(boiler);

  // Smokebox (Front Black Section)
  const smokeBoxGeo = new THREE.CylinderGeometry(1.22, 1.22, 1.8, 24);
  smokeBoxGeo.rotateZ(Math.PI / 2);
  const smokeBox = new THREE.Mesh(smokeBoxGeo, blackMat);
  smokeBox.position.set(3.8, 2.5, 0);
  engine.add(smokeBox);

  // Front Smokebox Curved Door & Golden Plate
  const frontDoorGeo = new THREE.SphereGeometry(1.22, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  frontDoorGeo.rotateZ(-Math.PI / 2);
  const frontDoor = new THREE.Mesh(frontDoorGeo, blackMat);
  frontDoor.position.set(4.7, 2.5, 0);
  engine.add(frontDoor);

  // 5972 Round Brass Number Plate / Crest
  const crestGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.1, 16);
  crestGeo.rotateZ(Math.PI / 2);
  const crest = new THREE.Mesh(crestGeo, brassMat);
  crest.position.set(5.35, 2.5, 0);
  engine.add(crest);

  // Brass Nameplate Banner: "HOGWARTS CASTLE"
  const nameplateGeo = new THREE.BoxGeometry(0.08, 0.28, 1.5);
  const nameplate = new THREE.Mesh(nameplateGeo, brassMat);
  nameplate.position.set(4.7, 3.2, 0);
  engine.add(nameplate);

  // Golden Boiler Bands (3 brass bands along boiler)
  [-1.8, 0, 1.8].forEach(x => {
    const bandGeo = new THREE.TorusGeometry(1.21, 0.03, 8, 24);
    bandGeo.rotateY(Math.PI / 2);
    const band = new THREE.Mesh(bandGeo, brassMat);
    band.position.set(x, 2.5, 0);
    engine.add(band);
  });

  // Smokestack / Funnel (Chimney with brass cap)
  const chimneyGeo = new THREE.CylinderGeometry(0.35, 0.28, 1.0, 16);
  const chimney = new THREE.Mesh(chimneyGeo, blackMat);
  chimney.position.set(3.8, 3.9, 0);
  engine.add(chimney);

  const chimneyCapGeo = new THREE.CylinderGeometry(0.42, 0.35, 0.2, 16);
  const chimneyCap = new THREE.Mesh(chimneyCapGeo, brassMat);
  chimneyCap.position.set(3.8, 4.4, 0);
  engine.add(chimneyCap);

  // Steam Dome & Brass Safety Valve
  const steamDomeGeo = new THREE.SphereGeometry(0.45, 16, 12);
  steamDomeGeo.scale(1, 1.2, 1);
  const steamDome = new THREE.Mesh(steamDomeGeo, crimsonMat);
  steamDome.position.set(1.4, 3.7, 0);
  engine.add(steamDome);

  const safetyValveGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.5, 12);
  const safetyValve = new THREE.Mesh(safetyValveGeo, brassMat);
  safetyValve.position.set(-0.6, 3.8, 0);
  engine.add(safetyValve);

  // Driver Cab (Cabin)
  const cabGeo = new THREE.BoxGeometry(3.0, 2.8, 2.6);
  const cab = new THREE.Mesh(cabGeo, crimsonMat);
  cab.position.set(-3.2, 2.9, 0);
  engine.add(cab);

  // Cab Arched Roof
  const cabRoofGeo = new THREE.CylinderGeometry(1.35, 1.35, 3.1, 16, 1, false, 0, Math.PI);
  cabRoofGeo.rotateZ(Math.PI / 2);
  const cabRoof = new THREE.Mesh(cabRoofGeo, blackMat);
  cabRoof.position.set(-3.2, 4.3, 0);
  engine.add(cabRoof);

  // Cab Windows (Warm glow)
  const sideWinGeo = new THREE.BoxGeometry(0.8, 0.7, 2.65);
  const cabWins = new THREE.Mesh(sideWinGeo, windowGlowMat);
  cabWins.position.set(-3.2, 3.2, 0);
  engine.add(cabWins);

  // Running Board / Chassis Frame
  const chassisGeo = new THREE.BoxGeometry(10.6, 0.35, 2.7);
  const chassis = new THREE.Mesh(chassisGeo, blackMat);
  chassis.position.set(0.2, 1.2, 0);
  engine.add(chassis);

  // Red Buffer Beam (Front Cowcatcher)
  const bufferBeamGeo = new THREE.BoxGeometry(0.4, 0.7, 2.8);
  const bufferBeam = new THREE.Mesh(bufferBeamGeo, redBogieMat);
  bufferBeam.position.set(5.4, 1.1, 0);
  engine.add(bufferBeam);

  // Front Buffers (Left and Right)
  [-1.0, 1.0].forEach(z => {
    const bufGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 12);
    bufGeo.rotateZ(Math.PI / 2);
    const buf = new THREE.Mesh(bufGeo, blackMat);
    buf.position.set(5.7, 1.1, z);
    engine.add(buf);
  });

  // Vintage Brass Headlamp (Glowing warm lantern)
  const headlampBaseGeo = new THREE.BoxGeometry(0.4, 0.5, 0.4);
  const headlampBase = new THREE.Mesh(headlampBaseGeo, brassMat);
  headlampBase.position.set(5.3, 3.2, 0);
  engine.add(headlampBase);

  const headlampGlowGeo = new THREE.SphereGeometry(0.22, 16, 12);
  const headlampGlow = new THREE.Mesh(headlampGlowGeo, windowGlowMat);
  headlampGlow.position.set(5.5, 3.2, 0);
  engine.add(headlampGlow);

  // Locomotive Driving Wheels (3 large red/black wheels on each side)
  const largeWheelGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.2, 20);
  largeWheelGeo.rotateX(Math.PI / 2);

  [-1.6, 0.3, 2.2].forEach(x => {
    [-1.4, 1.4].forEach(z => {
      const wheel = new THREE.Mesh(largeWheelGeo, wheelMat);
      wheel.position.set(x, 0.85, z);
      engine.add(wheel);

      // Red wheel spokes / center hub
      const hubGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.22, 12);
      hubGeo.rotateX(Math.PI / 2);
      const hub = new THREE.Mesh(hubGeo, redBogieMat);
      hub.position.set(x, 0.85, z);
      engine.add(hub);
    });
  });

  // Front Small Bogie Wheels (2 pairs)
  const smallWheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.18, 16);
  smallWheelGeo.rotateX(Math.PI / 2);
  [3.8, 4.7].forEach(x => {
    [-1.35, 1.35].forEach(z => {
      const wheel = new THREE.Mesh(smallWheelGeo, wheelMat);
      wheel.position.set(x, 0.45, z);
      engine.add(wheel);
    });
  });

  // Steam connecting drive rods
  const rodGeo = new THREE.BoxGeometry(4.0, 0.12, 0.08);
  [-1.45, 1.45].forEach(z => {
    const rod = new THREE.Mesh(rodGeo, brassMat);
    rod.position.set(0.3, 0.65, z);
    engine.add(rod);
  });

  trainGroup.add(engine);

  // === 2. TENDER (Coal Wagon) ===
  const tender = new THREE.Group();
  tender.position.set(-7.5, 0, 0);

  const tenderBodyGeo = new THREE.BoxGeometry(4.8, 2.2, 2.6);
  const tenderBody = new THREE.Mesh(tenderBodyGeo, crimsonMat);
  tenderBody.position.set(0, 2.2, 0);
  tender.add(tenderBody);

  // Tender Coal Mound
  const coalGeo = new THREE.BoxGeometry(4.2, 0.6, 2.2);
  const coal = new THREE.Mesh(coalGeo, blackMat);
  coal.position.set(0, 3.4, 0);
  tender.add(coal);

  // Tender Crest / Name
  const tenderCrestGeo = new THREE.BoxGeometry(0.05, 0.6, 1.8);
  [-1.32, 1.32].forEach(z => {
    const tcrest = new THREE.Mesh(tenderCrestGeo, brassMat);
    tcrest.position.set(0, 2.3, z);
    tender.add(tcrest);
  });

  // Tender Wheels
  [-1.5, -0.5, 0.5, 1.5].forEach(x => {
    [-1.35, 1.35].forEach(z => {
      const wheel = new THREE.Mesh(smallWheelGeo, wheelMat);
      wheel.position.set(x, 0.45, z);
      tender.add(wheel);
    });
  });

  trainGroup.add(tender);

  // === 3. PASSENGER CARRIAGES ===
  // 3 vintage compartments with warm illuminated windows
  const carriageCount = isMovingInstance ? 3 : 2;
  const carriageSpacing = 9.2;
  const carriages = [];

  for (let i = 0; i < carriageCount; i++) {
    const carriage = new THREE.Group();
    carriage.position.set(-14.5 - (i * carriageSpacing), 0, 0);

    // Carriage Body (Scarlet Crimson)
    const coachGeo = new THREE.BoxGeometry(8.5, 2.6, 2.7);
    const coach = new THREE.Mesh(coachGeo, crimsonMat);
    coach.position.set(0, 2.4, 0);
    carriage.add(coach);

    // Curved Black Roof
    const roofGeo = new THREE.CylinderGeometry(1.4, 1.4, 8.6, 16, 1, false, 0, Math.PI);
    roofGeo.rotateZ(Math.PI / 2);
    const roof = new THREE.Mesh(roofGeo, blackMat);
    roof.position.set(0, 3.7, 0);
    carriage.add(roof);

    // Cream window stripe along the side
    const stripeGeo = new THREE.BoxGeometry(8.52, 0.95, 2.72);
    const stripe = new THREE.Mesh(stripeGeo, creamMat);
    stripe.position.set(0, 2.5, 0);
    carriage.add(stripe);

    // Passenger Windows (Glowing amber light)
    for (let w = -3.2; w <= 3.2; w += 1.3) {
      [-1.38, 1.38].forEach(z => {
        const winGeo = new THREE.BoxGeometry(0.8, 0.65, 0.04);
        const win = new THREE.Mesh(winGeo, windowGlowMat);
        win.position.set(w, 2.5, z);
        carriage.add(win);
      });
    }

    // Carriage Wheels (Bogies at each end)
    [-3.0, 3.0].forEach(bx => {
      [-0.7, 0.7].forEach(wx => {
        [-1.35, 1.35].forEach(wz => {
          const wheel = new THREE.Mesh(smallWheelGeo, wheelMat);
          wheel.position.set(bx + wx, 0.45, wz);
          carriage.add(wheel);
        });
      });
    });

    trainGroup.add(carriage);
    carriages.push(carriage);
  }

  // === 4. ANIMATED STEAM PARTICLES ===
  const particleCount = 45;
  const steamGeo = new THREE.BufferGeometry();
  const steamPositions = new Float32Array(particleCount * 3);
  const steamSizes = new Float32Array(particleCount);
  const steamAlphas = new Float32Array(particleCount);
  const particleData = [];

  for (let i = 0; i < particleCount; i++) {
    particleData.push({
      x: 3.8 + (Math.random() - 0.5) * 0.4,
      y: 4.5 + Math.random() * 0.3,
      z: (Math.random() - 0.5) * 0.4,
      vx: -(Math.random() * 0.05 + (isMovingInstance ? 0.35 : 0.05)),
      vy: Math.random() * 0.06 + 0.04,
      vz: (Math.random() - 0.5) * 0.04,
      size: Math.random() * 0.6 + 0.4,
      life: Math.random()
    });
  }

  // Steam particle material
  const steamMat = new THREE.PointsMaterial({
    color: 0xeeece8,
    size: 1.4,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.NormalBlending
  });

  const steamPoints = new THREE.Points(steamGeo, steamMat);
  engine.add(steamPoints);

  // Update loop for steam particles
  trainGroup.userData.update = function (delta) {
    for (let i = 0; i < particleCount; i++) {
      const p = particleData[i];
      p.life += delta * 0.65;
      p.x += p.vx * 60 * delta;
      p.y += p.vy * 60 * delta;
      p.z += p.vz * 60 * delta;
      p.size += delta * 0.8;

      if (p.life > 1.0) {
        p.life = 0;
        p.x = 3.8 + (Math.random() - 0.5) * 0.3;
        p.y = 4.5;
        p.z = (Math.random() - 0.5) * 0.3;
        p.size = Math.random() * 0.5 + 0.3;
      }

      steamPositions[i * 3] = p.x;
      steamPositions[i * 3 + 1] = p.y;
      steamPositions[i * 3 + 2] = p.z;
    }
    steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));
    steamGeo.attributes.position.needsUpdate = true;
  };

  // Position train so it rests neatly on tracks
  trainGroup.position.y = 0.0;

  return trainGroup;
}
