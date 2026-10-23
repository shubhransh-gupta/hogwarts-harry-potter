// World Manager: Environment, Sky, Dynamic Lighting, Weather & Landmarks
// Handles Time-of-Day cycles, Snow/Rain weather particles, and zone coordination

import * as THREE from 'three';
import { createLucknowStation } from './lucknow-station.js';
import { createHogwartsCastle } from './hogwarts-castle.js';
import { createDehradunMountains } from './dehradun-mountains.js';
import { createQuidditchPitch } from './quidditch-pitch.js';
import { createHagridHut } from './hagrid-hut.js';
import { createForbiddenForest } from './forbidden-forest.js';

export class WorldManager {
  constructor(scene) {
    this.scene = scene;

    // Time of Day states
    this.timesOfDay = [
      {
        id: 'golden',
        name: 'Sunset Golden Hour',
        skyColor: 0xf39c59,
        fogColor: 0xe6a172,
        sunColor: 0xffeedd,
        sunIntensity: 1.8,
        ambientColor: 0x8a6a58,
        sunPos: new THREE.Vector3(120, 60, -80)
      },
      {
        id: 'night',
        name: 'Magical Midnight',
        skyColor: 0x090a14,
        fogColor: 0x0d111d,
        sunColor: 0x6e88b5,
        sunIntensity: 0.6,
        ambientColor: 0x1e2538,
        sunPos: new THREE.Vector3(-80, 70, 60)
      },
      {
        id: 'dawn',
        name: 'Himalayan Dawn',
        skyColor: 0x9fb5c9,
        fogColor: 0xb5c6d4,
        sunColor: 0xfff0d0,
        sunIntensity: 1.4,
        ambientColor: 0x647080,
        sunPos: new THREE.Vector3(-140, 50, -120)
      },
      {
        id: 'noon',
        name: 'Clear Mountain Noon',
        skyColor: 0x76a5d4,
        fogColor: 0x94bbdf,
        sunColor: 0xffffff,
        sunIntensity: 2.2,
        ambientColor: 0x7a8d9e,
        sunPos: new THREE.Vector3(20, 160, 40)
      }
    ];

    this.currentTimeIndex = 0; // Starts at Golden Hour

    // Weather states
    this.weatherStates = ['clear', 'snow', 'mist'];
    this.currentWeatherIndex = 0;

    // Setup Sky, Fog & Lighting
    this.initLightingAndFog();

    // Setup Zones
    this.initZones();

    // Setup Weather Particles
    this.initWeatherParticles();

    // Handcrafted Grounded Landmarks for spawning
    this.landmarks = [
      { id: 1, key: '1', name: 'Platform 9¾ (Lucknow)', devanagari: 'प्लेटफ़ॉर्म ९¾ (लखनऊ)', pos: new THREE.Vector3(-200, 1.0, -96), look: 0 },
      { id: 2, key: '2', name: 'Himalayan Viaduct & Train', devanagari: 'हिमालयन वायाडक्ट', pos: new THREE.Vector3(-60, 29.8, -12), look: Math.PI / 2 },
      { id: 3, key: '3', name: 'Castle Courtyard & Clock', devanagari: 'हॉगवॉर्ट्स प्रांगण', pos: new THREE.Vector3(40, 12.6, 58), look: 0 },
      { id: 4, key: '4', name: 'The Great Hall', devanagari: 'द ग्रेट हॉल', pos: new THREE.Vector3(25, 12.6, 30), look: Math.PI },
      { id: 5, key: '5', name: 'Astronomy Tower Spire', devanagari: 'एस्ट्रोनॉमी टॉवर', pos: new THREE.Vector3(58, 52.0, 18), look: -Math.PI / 2 },
      { id: 6, key: '6', name: 'Quidditch Pitch', devanagari: 'क्विडिच पिच', pos: new THREE.Vector3(130, 1.2, -120), look: 0 },
      { id: 7, key: '7', name: 'Hagrid’s Hut & Pumpkins', devanagari: 'हैग्रिड की कुटिया', pos: new THREE.Vector3(-70, 0.8, 90), look: Math.PI / 4 },
      { id: 8, key: '8', name: 'Forbidden Deodar Forest', devanagari: 'निषिद्ध देवदार वन', pos: new THREE.Vector3(-110, 0.8, 110), look: 0 }
    ];
  }

  initLightingAndFog() {
    const time = this.timesOfDay[this.currentTimeIndex];

    this.scene.background = new THREE.Color(time.skyColor);
    this.scene.fog = new THREE.FogExp2(time.fogColor, 0.0035);

    this.ambientLight = new THREE.AmbientLight(time.ambientColor, 1.25);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(time.sunColor, time.sunIntensity);
    this.sunLight.position.copy(time.sunPos);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 400;
    this.sunLight.shadow.camera.left = -150;
    this.sunLight.shadow.camera.right = 150;
    this.sunLight.shadow.camera.top = 150;
    this.sunLight.shadow.camera.bottom = -150;
    this.scene.add(this.sunLight);
  }

  initZones() {
    this.lucknowStation = createLucknowStation();
    this.scene.add(this.lucknowStation);

    this.hogwartsCastle = createHogwartsCastle();
    this.scene.add(this.hogwartsCastle);

    this.mountains = createDehradunMountains();
    this.scene.add(this.mountains);

    this.quidditch = createQuidditchPitch();
    this.scene.add(this.quidditch);

    this.hagridHut = createHagridHut();
    this.scene.add(this.hagridHut);

    this.forbiddenForest = createForbiddenForest();
    this.scene.add(this.forbiddenForest);
  }

  initWeatherParticles() {
    const count = 500;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    this.particleData = [];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 220;
      const y = Math.random() * 50;
      const z = (Math.random() - 0.5) * 220;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      this.particleData.push({
        x, y, z,
        vy: -(12 + Math.random() * 8),
        vx: (Math.random() - 0.5) * 1.5
      });
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.weatherMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.45,
      transparent: true,
      opacity: 0,
      depthWrite: false
    });

    this.weatherPoints = new THREE.Points(geo, this.weatherMat);
    this.scene.add(this.weatherPoints);
  }

  // ACCURATE MULTI-TIER GROUND HEIGHT SYSTEM
  // Respects current player elevation so walking underneath viaducts/bridges doesn't jump to the sky
  getGroundHeight(x, z, currentY = 1e9) {
    // 1. Calculate natural valley terrain base height
    let baseTerrain = 0.2;
    const distToLake = Math.hypot(x - 60, z + 50);
    if (distToLake < 65) {
      baseTerrain = -0.5;
    } else {
      let y = Math.sin(x * 0.015) * Math.cos(z * 0.015) * 3.2;
      const distFromCenter = Math.hypot(x, z);
      if (distFromCenter > 130 && Math.hypot(x - (-200), z - (-100)) > 110) {
        y += Math.pow((distFromCenter - 130) / 65, 2) * 5.5;
      }
      baseTerrain = Math.max(0.2, y);
    }

    // 2. Lucknow Station Sector (station center: x: -200, z: -100)
    const relX = x - (-200);
    const relZ = z - (-100);
    if (Math.hypot(relX, relZ) < 85) {
      // Overhead footbridge at y = 8.6
      if (Math.abs(relX - 35) <= 2.8 && Math.abs(relZ) <= 27) {
        // Only walk on footbridge deck if player is near its height
        if (currentY >= 5.5 || currentY > 500) {
          return 8.6;
        }
      }
      // Platforms 9 & 9¾ (relX: [-65, 65], relZ: [-8.5, 8.5])
      if (Math.abs(relX) <= 65 && Math.abs(relZ) <= 8.5) return 1.0;
      // Platform 8: relZ in [-30, -18]
      if (Math.abs(relX) <= 65 && relZ >= -30 && relZ <= -18) return 1.0;
      // Platform 10: relZ in [18, 30]
      if (Math.abs(relX) <= 65 && relZ >= 18 && relZ <= 30) return 1.0;
      // Palace Concourse: relZ in [34, 52]
      if (Math.abs(relX) <= 62 && relZ >= 34 && relZ <= 52) return 1.0;
      // Track ballast beds
      if (Math.abs(relX) <= 70 && (Math.abs(relZ - 12) <= 3.5 || Math.abs(relZ - (-12)) <= 3.5)) {
        return 0.52;
      }
      return 0.4;
    }

    // 3. Himalayan Mountain Viaduct (deck at y = 29.8, x in [-135, 15], |z - (-12)| <= 4.2)
    if (x >= -135 && x <= 15 && Math.abs(z - (-12)) <= 4.2) {
      // Crucial fix: Only ground to viaduct deck if player is already elevated near deck height (or spawning)
      // When walking in the valley beneath the viaduct (currentY < 18m), return the valley floor!
      if (currentY >= 18.0 || currentY > 500) {
        return 29.8;
      }
      return baseTerrain;
    }

    // Viaduct West Approach (mountain railway grade from Lucknow x: [-165, -135])
    if (x >= -165 && x < -135 && Math.abs(z - (-12)) <= 4.5) {
      const t = (x - (-165)) / 30; // 0 at -165, 1 at -135
      const rampDeck = 1.0 + t * (29.8 - 1.0);
      if (currentY >= rampDeck - 2.5 || currentY > 500) {
        return rampDeck;
      }
    }

    // Viaduct East Approach to Hogwarts Castle Ridge (x: [15, 35])
    if (x > 15 && x <= 35 && Math.abs(z - (-12)) <= 4.5) {
      const t = (x - 15) / 20;
      const rampDeck = 29.8 - t * (29.8 - 12.6);
      if (currentY >= rampDeck - 2.5 || currentY > 500) {
        return rampDeck;
      }
    }

    // 4. Hogwarts Castle (around x: 40, z: 40)
    const castRelX = x - 40;
    const castRelZ = z - 40;
    const castDist = Math.hypot(castRelX, castRelZ);

    if (castDist < 52) {
      // Astronomy Tower Top Terrace (world x: 58, z: 18)
      if (Math.hypot(x - 58, z - 18) < 8.5) {
        if (currentY >= 38.0 || currentY > 500) {
          return 52.0;
        }
      }
      // Courtyard & Great Hall main level
      return 12.6;
    }

    // Castle Entrance Ramp from valley path
    if (x >= -10 && x <= 25 && z >= 15 && z <= 40) {
      const t = Math.max(0, Math.min(1, (x - (-10)) / 35));
      const rampY = 2.0 + t * (12.6 - 2.0);
      if (currentY >= rampY - 2.0 || currentY > 500) {
        return rampY;
      }
    }

    // 5. Quidditch Pitch (around x: 130, z: -120)
    if (Math.hypot((x - 130) / 1.6, z - (-120)) < 42) {
      return 1.2;
    }

    // 6. Hagrid's Hut & Pumpkin Patch
    if (Math.hypot(x - (-70), z - 90) < 20) {
      return 0.8;
    }

    // 7. Forbidden Deodar Forest Stone Circle
    if (Math.hypot(x - (-110), z - 110) < 25) {
      return 0.8;
    }

    return baseTerrain;
  }

  cycleTimeOfDay() {
    this.currentTimeIndex = (this.currentTimeIndex + 1) % this.timesOfDay.length;
    const time = this.timesOfDay[this.currentTimeIndex];

    this.scene.background.setHex(time.skyColor);
    this.scene.fog.color.setHex(time.fogColor);
    this.ambientLight.color.setHex(time.ambientColor);
    this.sunLight.color.setHex(time.sunColor);
    this.sunLight.intensity = time.sunIntensity;
    this.sunLight.position.copy(time.sunPos);

    return time;
  }

  cycleWeather() {
    this.currentWeatherIndex = (this.currentWeatherIndex + 1) % this.weatherStates.length;
    const weather = this.weatherStates[this.currentWeatherIndex];

    if (weather === 'snow') {
      this.weatherMat.opacity = 0.85;
      this.weatherMat.size = 0.5;
      this.scene.fog.density = 0.0055;
    } else if (weather === 'mist') {
      this.weatherMat.opacity = 0.25;
      this.scene.fog.density = 0.0085;
    } else {
      this.weatherMat.opacity = 0;
      this.scene.fog.density = 0.0035;
    }

    return weather;
  }

  getLandmark(id) {
    return this.landmarks.find(l => l.id === id);
  }

  getInteractiveObjects() {
    const list = [];
    if (this.hagridHut && this.hagridHut.userData && this.hagridHut.userData.pumpkins) {
      list.push(...this.hagridHut.userData.pumpkins);
    }
    return list;
  }

  update(delta, elapsed, playerPos) {
    // 1. Update station train steam
    if (this.lucknowStation.userData.stationTrain && this.lucknowStation.userData.stationTrain.userData.update) {
      this.lucknowStation.userData.stationTrain.userData.update(delta);
    }

    // 2. Update castle floating candles & armillary
    if (this.hogwartsCastle.userData.update) {
      this.hogwartsCastle.userData.update(delta, elapsed);
    }

    // 3. Update mountain viaduct train & drifting mist
    if (this.mountains.userData.update) {
      this.mountains.userData.update(delta);
    }

    // 4. Update forbidden forest wisps & runes
    if (this.forbiddenForest.userData.update) {
      this.forbiddenForest.userData.update(delta, elapsed);
    }

    // 5. Update weather particles around player
    if (this.weatherMat.opacity > 0 && playerPos) {
      const positions = this.weatherPoints.geometry.attributes.position.array;
      for (let i = 0; i < this.particleData.length; i++) {
        const p = this.particleData[i];
        p.y += p.vy * delta;
        p.x += p.vx * delta;

        if (p.y < 0) {
          p.y = 45;
          p.x = playerPos.x + (Math.random() - 0.5) * 120;
          p.z = playerPos.z + (Math.random() - 0.5) * 120;
        }

        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;
      }
      this.weatherPoints.geometry.attributes.position.needsUpdate = true;
    }
  }
}
