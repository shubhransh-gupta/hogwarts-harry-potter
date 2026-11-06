// Atmospheric Sky Dome & Celestial Environment
// Realistic atmospheric sky dome with horizon haze, billowing Himalayan cloud banks,
// distant mountain silhouette layers, and dynamic sun/moon corona.

import * as THREE from 'three';

export class SkyDome {
  constructor(scene) {
    this.scene = scene;
    this.skyMesh = null;
    this.celestialCorona = null;
    this.initSky();
  }

  initSky() {
    // Inverted sky sphere
    const geo = new THREE.SphereGeometry(700, 36, 24);
    const mat = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false
    });

    this.skyMesh = new THREE.Mesh(geo, mat);
    this.skyMesh.name = 'AtmosphericSkyDome';
    this.scene.add(this.skyMesh);

    // Glowing Celestial Sprite (Sun / Moon)
    const coronaGeo = new THREE.PlaneGeometry(90, 90);
    const coronaCanvas = document.createElement('canvas');
    coronaCanvas.width = 128;
    coronaCanvas.height = 128;
    const ctx = coronaCanvas.getContext('2d');

    const grd = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grd.addColorStop(0.3, 'rgba(255, 230, 160, 0.75)');
    grd.addColorStop(0.7, 'rgba(255, 190, 90, 0.25)');
    grd.addColorStop(1, 'rgba(255, 150, 50, 0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 128, 128);

    const coronaTexture = new THREE.CanvasTexture(coronaCanvas);
    const coronaMat = new THREE.MeshBasicMaterial({
      map: coronaTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false
    });

    this.celestialCorona = new THREE.Mesh(coronaGeo, coronaMat);
    this.scene.add(this.celestialCorona);

    this.setTimeOfDay('golden');
  }

  setTimeOfDay(timeId) {
    const w = 512;
    const h = 256;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    if (timeId === 'night') {
      // Midnight Velvet Himalayan Sky
      const skyGrd = ctx.createLinearGradient(0, 0, 0, h);
      skyGrd.addColorStop(0, '#04060c');
      skyGrd.addColorStop(0.55, '#090d18');
      skyGrd.addColorStop(0.85, '#121826');
      skyGrd.addColorStop(1.0, '#1c2438');
      ctx.fillStyle = skyGrd;
      ctx.fillRect(0, 0, w, h);

      // Twinkling Himalayan stars (optimized count)
      ctx.fillStyle = '#ffffff';
      for (let s = 0; s < 160; s++) {
        const sx = Math.random() * w;
        const sy = Math.random() * (h * 0.72);
        const sr = Math.random() * 1.5;
        const alpha = 0.3 + Math.random() * 0.7;
        ctx.fillStyle = `rgba(235, 240, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }

      // Silver Moon Corona
      this.celestialCorona.position.set(-80, 70, 60);
      this.celestialCorona.lookAt(0, 0, 0);

    } else if (timeId === 'dawn') {
      // Rose & Golden Himalayan Mountain Dawn
      const skyGrd = ctx.createLinearGradient(0, 0, 0, h);
      skyGrd.addColorStop(0, '#2d3b54');
      skyGrd.addColorStop(0.45, '#5a627d');
      skyGrd.addColorStop(0.72, '#c88a82');
      skyGrd.addColorStop(0.9, '#f3b495');
      skyGrd.addColorStop(1.0, '#feddb4');
      ctx.fillStyle = skyGrd;
      ctx.fillRect(0, 0, w, h);

      // Soft dawn clouds
      this.drawCloudBands(ctx, w, h, 'rgba(255, 230, 210, 0.28)');

      this.celestialCorona.position.set(-140, 50, -120);
      this.celestialCorona.lookAt(0, 0, 0);

    } else if (timeId === 'noon') {
      // Pure Alpine Mountain Cerulean
      const skyGrd = ctx.createLinearGradient(0, 0, 0, h);
      skyGrd.addColorStop(0, '#1c5aa0');
      skyGrd.addColorStop(0.5, '#4082cc');
      skyGrd.addColorStop(0.82, '#88b8e8');
      skyGrd.addColorStop(1.0, '#cce3fa');
      ctx.fillStyle = skyGrd;
      ctx.fillRect(0, 0, w, h);

      // Bright white cumulus clouds
      this.drawCloudBands(ctx, w, h, 'rgba(255, 255, 255, 0.42)');

      this.celestialCorona.position.set(20, 160, 40);
      this.celestialCorona.lookAt(0, 0, 0);

    } else {
      // Golden Hour (Default): Warm amethyst, radiant amber, burning gold
      const skyGrd = ctx.createLinearGradient(0, 0, 0, h);
      skyGrd.addColorStop(0, '#2b294c');
      skyGrd.addColorStop(0.4, '#6b4055');
      skyGrd.addColorStop(0.68, '#c25841');
      skyGrd.addColorStop(0.86, '#e88938');
      skyGrd.addColorStop(0.96, '#f7be54');
      skyGrd.addColorStop(1.0, '#ffdf88');
      ctx.fillStyle = skyGrd;
      ctx.fillRect(0, 0, w, h);

      // Billowing Himalayan clouds catching sunset light
      this.drawCloudBands(ctx, w, h, 'rgba(255, 195, 120, 0.35)');

      this.celestialCorona.position.set(120, 60, -80);
      this.celestialCorona.lookAt(0, 0, 0);
    }

    // Paint multi-layered distant Himalayan silhouette mountain ridges along the horizon!
    this.drawDistantMountainRidges(ctx, w, h, timeId);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    if (this.skyMesh.material.map) {
      this.skyMesh.material.map.dispose();
    }
    this.skyMesh.material.map = texture;
    this.skyMesh.material.needsUpdate = true;
  }

  drawCloudBands(ctx, w, h, color) {
    ctx.fillStyle = color;
    for (let c = 0; c < 12; c++) {
      const cx = (c / 12) * w + (Math.random() - 0.5) * 80;
      const cy = h * 0.45 + (Math.sin(c * 2) * 35);
      const rw = 120 + Math.random() * 140;
      const rh = 28 + Math.random() * 32;

      ctx.beginPath();
      ctx.ellipse(cx, cy, rw, rh, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawDistantMountainRidges(ctx, w, h, timeId) {
    const horizonY = h * 0.88;

    // Layer 1: Farthest distant snow summits (pale, hazy)
    ctx.fillStyle = timeId === 'night' ? 'rgba(18, 25, 40, 0.7)' : 'rgba(180, 160, 180, 0.45)';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 16) {
      const peakY = horizonY - 45 - Math.sin(x * 0.015) * 35 - Math.sin(x * 0.04) * 20;
      ctx.lineTo(x, peakY);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    // Layer 2: Mid-distance Garhwal ridges
    ctx.fillStyle = timeId === 'night' ? 'rgba(12, 17, 28, 0.85)' : 'rgba(125, 95, 110, 0.55)';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 14) {
      const peakY = horizonY - 25 - Math.cos(x * 0.02) * 28 - Math.sin(x * 0.05) * 15;
      ctx.lineTo(x, peakY);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    // Layer 3: Closer pine ridge foothills
    ctx.fillStyle = timeId === 'night' ? 'rgba(8, 12, 20, 0.95)' : 'rgba(75, 55, 65, 0.75)';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 12) {
      const peakY = horizonY - 10 - Math.sin(x * 0.028) * 18 - Math.cos(x * 0.07) * 10;
      ctx.lineTo(x, peakY);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
  }
}
