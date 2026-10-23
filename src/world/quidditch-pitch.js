// Quidditch Pitch in the Himalayan Mountain Bowl
// Emerald pitch, 4 House spectator towers, 6 golden scoring hoops, spectator stands

import * as THREE from 'three';

export function createQuidditchPitch() {
  const pitchGroup = new THREE.Group();
  pitchGroup.name = 'QuidditchPitch';

  // Materials
  const turfMat = new THREE.MeshToonMaterial({ color: 0x2e6633 }); // Rich manicured grass
  const sandMat = new THREE.MeshToonMaterial({ color: 0xc8b584 });
  const woodStandMat = new THREE.MeshToonMaterial({ color: 0x4a3321 });
  const goldHoopMat = new THREE.MeshToonMaterial({ color: 0xf7b32b }); // Shimmering gold
  const goldPoleMat = new THREE.MeshToonMaterial({ color: 0xd4af37 });

  // === 1. OVAL ARENA BASE ===
  const pitchBaseGeo = new THREE.CylinderGeometry(40, 40, 1.2, 32);
  pitchBaseGeo.scale(1.6, 1, 0.9); // Oval shape: 128m x 72m
  const pitchBase = new THREE.Mesh(pitchBaseGeo, turfMat);
  pitchBase.position.y = 0.6;
  pitchBase.receiveShadow = true;
  pitchGroup.add(pitchBase);

  // Pitch boundary sand ring
  const boundaryGeo = new THREE.TorusGeometry(38, 1.2, 8, 32);
  boundaryGeo.scale(1.6, 0.9, 1);
  boundaryGeo.rotateX(Math.PI / 2);
  const boundary = new THREE.Mesh(boundaryGeo, sandMat);
  boundary.position.y = 1.22;
  pitchGroup.add(boundary);

  // Center Pitch Circle & Line
  const centerCircleGeo = new THREE.TorusGeometry(8, 0.35, 8, 24);
  centerCircleGeo.rotateX(Math.PI / 2);
  const centerCircle = new THREE.Mesh(centerCircleGeo, sandMat);
  centerCircle.position.y = 1.22;
  pitchGroup.add(centerCircle);

  // === 2. THREE GOLDEN GOAL HOOPS AT EACH END (6 HOOPS TOTAL) ===
  const goalEnds = [
    { x: -50, z: 0 },
    { x: 50, z: 0 }
  ];

  const hoopHeights = [14, 20, 16]; // Different regulation heights
  const hoopZOffsets = [-6, 0, 6];

  goalEnds.forEach(end => {
    for (let i = 0; i < 3; i++) {
      const hoopGroup = new THREE.Group();
      hoopGroup.position.set(end.x, 1.2, end.z + hoopZOffsets[i]);

      const h = hoopHeights[i];
      // Slender golden pole
      const poleGeo = new THREE.CylinderGeometry(0.18, 0.25, h, 12);
      const pole = new THREE.Mesh(poleGeo, goldPoleMat);
      pole.position.y = h / 2;
      hoopGroup.add(pole);

      // Golden scoring ring (Torus)
      const ringGeo = new THREE.TorusGeometry(1.8, 0.16, 12, 24);
      ringGeo.rotateY(Math.PI / 2);
      const ring = new THREE.Mesh(ringGeo, goldHoopMat);
      ring.position.y = h + 1.8;
      hoopGroup.add(ring);

      pitchGroup.add(hoopGroup);
    }
  });

  // === 3. FOUR HOUSE SPECTATOR TOWERS ===
  const houseTowers = [
    { name: 'Gryffindor', color: 0x740001, accent: 0xf7b32b, x: -35, z: 32 },
    { name: 'Slytherin', color: 0x1a472a, accent: 0xcccccc, x: 35, z: 32 },
    { name: 'Ravenclaw', color: 0x0e1a40, accent: 0xc49b45, x: 35, z: -32 },
    { name: 'Hufflepuff', color: 0xecb939, accent: 0x222222, x: -35, z: -32 }
  ];

  houseTowers.forEach(t => {
    const tower = new THREE.Group();
    tower.position.set(t.x, 1.2, t.z);

    // Tall wooden scaffold frame
    const frameGeo = new THREE.BoxGeometry(6, 24, 6);
    const frame = new THREE.Mesh(frameGeo, woodStandMat);
    frame.position.y = 12;
    tower.add(frame);

    // Spectator cabin platform
    const cabinGeo = new THREE.BoxGeometry(7.2, 5, 7.2);
    const cabinMat = new THREE.MeshToonMaterial({ color: t.color });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.y = 24.5;
    tower.add(cabin);

    // Striped Canvas Canopy Roof
    const canopyGeo = new THREE.ConeGeometry(5.8, 5, 4);
    canopyGeo.rotateY(Math.PI / 4);
    const canopyMat = new THREE.MeshToonMaterial({ color: t.accent });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.y = 29.5;
    tower.add(canopy);

    // House Pennant Flag
    const flagGeo = new THREE.BoxGeometry(0.08, 1.6, 3.2);
    const flag = new THREE.Mesh(flagGeo, cabinMat);
    flag.position.set(0, 32.5, 1.6);
    tower.add(flag);

    pitchGroup.add(tower);
  });

  // === 4. NIMBUS 2000 BROOMSTICK HOVERING AT CENTER FIELD ===
  const broomGroup = new THREE.Group();
  broomGroup.position.set(0, 1.8, 0); // Hovering above center turf
  broomGroup.name = 'Nimbus2000';

  // Polished mahogany broom handle
  const handleGeo = new THREE.CylinderGeometry(0.04, 0.05, 3.2, 8);
  handleGeo.rotateX(Math.PI / 2);
  const handleMat = new THREE.MeshToonMaterial({ color: 0x4a2810 });
  const handle = new THREE.Mesh(handleGeo, handleMat);
  broomGroup.add(handle);

  // Golden bands
  [-0.6, -0.4, 0.4].forEach(z => {
    const bandGeo = new THREE.TorusGeometry(0.06, 0.015, 6, 12);
    const band = new THREE.Mesh(bandGeo, goldHoopMat);
    band.position.z = z;
    broomGroup.add(band);
  });

  // Twig bristles tail
  const brushGeo = new THREE.ConeGeometry(0.25, 0.9, 10);
  brushGeo.rotateX(-Math.PI / 2);
  const brushMat = new THREE.MeshToonMaterial({ color: 0xd4a359 });
  const brush = new THREE.Mesh(brushGeo, brushMat);
  brush.position.z = -1.8;
  broomGroup.add(brush);

  // Golden glow aura
  const broomLight = new THREE.PointLight(0xf7b32b, 1.8, 8);
  broomLight.position.set(0, 0.2, 0);
  broomGroup.add(broomLight);

  pitchGroup.add(broomGroup);
  pitchGroup.userData.nimbusBroom = broomGroup;

  // Animation update loop for hovering Nimbus 2000
  pitchGroup.userData.update = function (delta, elapsed) {
    if (broomGroup) {
      broomGroup.position.y = 1.8 + Math.sin(elapsed * 2.5) * 0.12;
      broomGroup.rotation.y = Math.sin(elapsed * 0.9) * 0.25;
      broomGroup.rotation.z = Math.cos(elapsed * 1.5) * 0.06;
    }
  };

  // Position Quidditch Pitch in the Dehradun valley bowl
  pitchGroup.position.set(130, 0, -120);

  return pitchGroup;
}
