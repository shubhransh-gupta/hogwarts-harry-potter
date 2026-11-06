// Procedural Texture & PBR Material Engine
// Generates photorealistic, lightweight procedural canvas textures in-memory
// eliminating heavy 50MB+ downloads while delivering AAA atmospheric fidelity.

import * as THREE from 'three';

// Cache generated textures & materials so they are created once and reused
const textureCache = new Map();
const materialCache = new Map();

// Helper: Fast pseudo-random noise generator
function createNoiseCanvas(width, height, fn) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const [r, g, b, a] = fn(x, y, width, height);
      data[idx + 0] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = a !== undefined ? a : 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

// 1. Gothic Castle Ashlar Stone Masonry Texture (Diffuse + Bump)
export function getCastleStoneTextures() {
  if (textureCache.has('castleStone')) return textureCache.get('castleStone');

  const w = 256;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = w;
  bumpCanvas.height = h;
  const bCtx = bumpCanvas.getContext('2d');

  // Base weathered grey-limestone tone
  ctx.fillStyle = '#65636a';
  ctx.fillRect(0, 0, w, h);
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, w, h);

  const rows = 8;
  const rowH = h / rows;

  for (let r = 0; r < rows; r++) {
    const y = r * rowH;
    const blockCount = 4;
    const blockW = w / blockCount;
    const rowOffset = (r % 2) * (blockW * 0.5);

    for (let c = -1; c <= blockCount + 1; c++) {
      const x = c * blockW + rowOffset;
      const shade = 95 + Math.floor(Math.random() * 45);
      const warm = shade + 4;
      const cool = shade - 2;

      ctx.fillStyle = `rgb(${warm},${shade},${cool})`;
      ctx.fillRect(x + 2, y + 2, blockW - 4, rowH - 4);

      for (let g = 0; g < 6; g++) {
        const gx = x + 2 + Math.random() * (blockW - 4);
        const gy = y + 2 + Math.random() * (rowH - 4);
        const gShade = shade + (Math.random() - 0.5) * 35;
        ctx.fillStyle = `rgba(${gShade},${gShade},${gShade}, 0.25)`;
        ctx.fillRect(gx, gy, 2, 2);
      }

      bCtx.fillStyle = '#b0b0b0';
      bCtx.fillRect(x + 2, y + 2, blockW - 4, rowH - 4);

      ctx.fillStyle = '#2d2b30';
      ctx.fillRect(x, y, blockW, 2);
      ctx.fillRect(x, y, 2, rowH);

      bCtx.fillStyle = '#202020';
      bCtx.fillRect(x, y, blockW, 2);
      bCtx.fillRect(x, y, 2, rowH);
    }
  }

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;

  const result = { map, bumpMap };
  textureCache.set('castleStone', result);
  return result;
}

// 2. Himalayan Mountain Granite Strata Texture
export function getMountainRockTextures() {
  if (textureCache.has('mountainRock')) return textureCache.get('mountainRock');

  const w = 256;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const bCanvas = document.createElement('canvas');
  bCanvas.width = w;
  bCanvas.height = h;
  const bCtx = bCanvas.getContext('2d');

  // Base dark granite
  ctx.fillStyle = '#424449';
  ctx.fillRect(0, 0, w, h);
  bCtx.fillStyle = '#606060';
  bCtx.fillRect(0, 0, w, h);

  // Horizontal geological rock strata and fissures
  for (let y = 0; y < h; y += 8) {
    const band = 55 + Math.sin(y * 0.16) * 22;
    ctx.fillStyle = `rgb(${band + 8},${band},${band - 4})`;
    ctx.fillRect(0, y, w, 8);

    bCtx.fillStyle = `rgb(${band},${band},${band})`;
    bCtx.fillRect(0, y, w, 8);
  }

  // Vertical fractures and fissures
  for (let f = 0; f < 12; f++) {
    const fx = Math.random() * w;
    const fy = Math.random() * h;
    const fLen = 20 + Math.random() * 50;

    ctx.strokeStyle = '#222326';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(fx + (Math.random() - 0.5) * 15, fy + fLen);
    ctx.stroke();

    bCtx.strokeStyle = '#101010';
    bCtx.lineWidth = 2;
    bCtx.beginPath();
    bCtx.moveTo(fx, fy);
    bCtx.lineTo(fx + (Math.random() - 0.5) * 15, fy + fLen);
    bCtx.stroke();
  }

  // Lichen & alpine moss flecks
  for (let m = 0; m < 15; m++) {
    const mx = Math.random() * w;
    const my = Math.random() * h;
    ctx.fillStyle = 'rgba(70, 85, 55, 0.45)';
    ctx.beginPath();
    ctx.arc(mx, my, 4 + Math.random() * 8, 0, Math.PI * 2);
    ctx.fill();
  }

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;

  const bumpMap = new THREE.CanvasTexture(bCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;

  const result = { map, bumpMap };
  textureCache.set('mountainRock', result);
  return result;
}

// 3. Himalayan Valley Grass & Pine Meadow Texture
export function getGrassTextures() {
  if (textureCache.has('grass')) return textureCache.get('grass');

  const w = 256;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const bCanvas = document.createElement('canvas');
  bCanvas.width = w;
  bCanvas.height = h;
  const bCtx = bCanvas.getContext('2d');

  // Deep rich pine meadow green base
  ctx.fillStyle = '#2f4f2c';
  ctx.fillRect(0, 0, w, h);
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, w, h);

  // Soft moss & soil undertones
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = 15 + Math.random() * 25;
    const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, 'rgba(65, 95, 55, 0.5)');
    grd.addColorStop(1, 'rgba(40, 60, 30, 0)');
    ctx.fillStyle = grd;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // Fine grass blades (optimized for instant startup)
  for (let b = 0; b < 180; b++) {
    const bx = Math.random() * w;
    const by = Math.random() * h;
    const g = 60 + Math.floor(Math.random() * 55);
    const r = Math.floor(g * 0.65);
    const bl = Math.floor(g * 0.4);

    ctx.strokeStyle = `rgb(${r},${g},${bl})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx + (Math.random() - 0.5) * 3, by - (3 + Math.random() * 5));
    ctx.stroke();

    bCtx.strokeStyle = g > 85 ? '#b8b8b8' : '#505050';
    bCtx.lineWidth = 1;
    bCtx.beginPath();
    bCtx.moveTo(bx, by);
    bCtx.lineTo(bx + (Math.random() - 0.5) * 3, by - (3 + Math.random() * 5));
    bCtx.stroke();
  }

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;

  const bumpMap = new THREE.CanvasTexture(bCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;

  const result = { map, bumpMap };
  textureCache.set('grass', result);
  return result;
}

// 4. Cobblestone Paving Texture (Courtyard Quad & Station Platforms)
export function getCobblestoneTextures() {
  if (textureCache.has('cobble')) return textureCache.get('cobble');

  const w = 256;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const bCanvas = document.createElement('canvas');
  bCanvas.width = w;
  bCanvas.height = h;
  const bCtx = bCanvas.getContext('2d');

  // Sand/mortar base
  ctx.fillStyle = '#3c3a40';
  ctx.fillRect(0, 0, w, h);
  bCtx.fillStyle = '#202020';
  bCtx.fillRect(0, 0, w, h);

  const cols = 6;
  const rows = 6;
  const cw = w / cols;
  const ch = h / rows;

  for (let r = 0; r < rows; r++) {
    const rowOffset = (r % 2) * (cw * 0.5);
    for (let c = -1; c <= cols; c++) {
      const cx = c * cw + rowOffset + (Math.random() - 0.5) * 2;
      const cy = r * ch + (Math.random() - 0.5) * 2;
      const stoneW = cw - 3;
      const stoneH = ch - 3;

      const shade = 80 + Math.floor(Math.random() * 45);
      ctx.fillStyle = `rgb(${shade + 4},${shade},${shade - 2})`;
      ctx.beginPath();
      ctx.roundRect(cx + 2, cy + 2, stoneW, stoneH, 3);
      ctx.fill();

      // Bump: Rounded stone top is bright, edges dark
      bCtx.fillStyle = '#b0b0b0';
      bCtx.beginPath();
      bCtx.roundRect(cx + 3, cy + 3, stoneW - 2, stoneH - 2, 3);
      bCtx.fill();
    }
  }

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;

  const bumpMap = new THREE.CanvasTexture(bCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;

  const result = { map, bumpMap };
  textureCache.set('cobble', result);
  return result;
}

// 5. Slate Shingle Roof Texture
export function getSlateRoofTextures() {
  if (textureCache.has('slateRoof')) return textureCache.get('slateRoof');

  const w = 256;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const bCanvas = document.createElement('canvas');
  bCanvas.width = w;
  bCanvas.height = h;
  const bCtx = bCanvas.getContext('2d');

  ctx.fillStyle = '#1c242c';
  ctx.fillRect(0, 0, w, h);
  bCtx.fillStyle = '#303030';
  bCtx.fillRect(0, 0, w, h);

  const rows = 8;
  const rh = h / rows;
  const cols = 6;
  const cw = w / cols;

  for (let r = 0; r < rows; r++) {
    const y = r * rh;
    const offset = (r % 2) * (cw * 0.5);
    for (let c = -1; c <= cols; c++) {
      const x = c * cw + offset;
      const tileShade = 35 + Math.floor(Math.random() * 25);
      ctx.fillStyle = `rgb(${tileShade},${tileShade + 6},${tileShade + 14})`;
      ctx.fillRect(x + 1, y + 1, cw - 2, rh - 2);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(x + 1, y + rh - 2, cw - 2, 2);

      bCtx.fillStyle = '#909090';
      bCtx.fillRect(x + 1, y + 1, cw - 2, rh - 2);
    }
  }

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;

  const bumpMap = new THREE.CanvasTexture(bCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;

  const result = { map, bumpMap };
  textureCache.set('slateRoof', result);
  return result;
}

// 6. Lucknow Charbagh Terracotta Red Brick Texture
export function getCharbaghBrickTextures() {
  if (textureCache.has('charbaghBrick')) return textureCache.get('charbaghBrick');

  const w = 256;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const bCanvas = document.createElement('canvas');
  bCanvas.width = w;
  bCanvas.height = h;
  const bCtx = bCanvas.getContext('2d');

  ctx.fillStyle = '#ded5c5'; // Cream mortar
  ctx.fillRect(0, 0, w, h);
  bCtx.fillStyle = '#202020';
  bCtx.fillRect(0, 0, w, h);

  const rows = 8;
  const rh = h / rows;
  const cols = 6;
  const cw = w / cols;

  for (let r = 0; r < rows; r++) {
    const y = r * rh;
    const offset = (r % 2) * (cw * 0.5);
    for (let c = -1; c <= cols; c++) {
      const x = c * cw + offset;
      const red = 135 + Math.floor(Math.random() * 40);
      const green = 38 + Math.floor(Math.random() * 20);
      const blue = 35 + Math.floor(Math.random() * 15);

      ctx.fillStyle = `rgb(${red},${green},${blue})`;
      ctx.fillRect(x + 1.5, y + 1.5, cw - 3, rh - 3);

      bCtx.fillStyle = '#a8a8a8';
      bCtx.fillRect(x + 1.5, y + 1.5, cw - 3, rh - 3);
    }
  }

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;

  const bumpMap = new THREE.CanvasTexture(bCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;

  const result = { map, bumpMap };
  textureCache.set('charbaghBrick', result);
  return result;
}

// 7. Leaded Gothic Stained Glass Texture (Glowing Candlelight)
export function getStainedGlassTexture() {
  if (textureCache.has('stainedGlass')) return textureCache.get('stainedGlass');

  const w = 128;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  // Warm golden lantern amber glow
  const grd = ctx.createLinearGradient(0, 0, 0, h);
  grd.addColorStop(0, '#fcd34d');
  grd.addColorStop(0.5, '#f59e0b');
  grd.addColorStop(1, '#b45309');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, w, h);

  // Leaded diamond tracery lattice
  ctx.strokeStyle = '#18181b';
  ctx.lineWidth = 2;

  const step = 32;
  for (let d = -h; d < w + h; d += step) {
    ctx.beginPath();
    ctx.moveTo(d, 0);
    ctx.lineTo(d + h, h);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(d, 0);
    ctx.lineTo(d - h, h);
    ctx.stroke();
  }

  // Outer gothic arch border
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, w, h);

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('stainedGlass', texture);
  return texture;
}

// =========================================================================
// STANDARD PBR MATERIAL GETTERS (Cached for high performance & 60 FPS)
// =========================================================================

export function getCastleStoneMat(repeatX = 4, repeatY = 4) {
  const key = `castleStone_${repeatX}_${repeatY}`;
  if (materialCache.has(key)) return materialCache.get(key);

  const { map, bumpMap } = getCastleStoneTextures();
  const m = map.clone();
  m.repeat.set(repeatX, repeatY);
  const bm = bumpMap.clone();
  bm.repeat.set(repeatX, repeatY);

  const mat = new THREE.MeshStandardMaterial({
    map: m,
    bumpMap: bm,
    bumpScale: 0.12,
    roughness: 0.88,
    metalness: 0.04
  });

  materialCache.set(key, mat);
  return mat;
}

export function getMountainRockMat(repeatX = 6, repeatY = 12) {
  const key = `mtnRock_${repeatX}_${repeatY}`;
  if (materialCache.has(key)) return materialCache.get(key);

  const { map, bumpMap } = getMountainRockTextures();
  const m = map.clone();
  m.repeat.set(repeatX, repeatY);
  const bm = bumpMap.clone();
  bm.repeat.set(repeatX, repeatY);

  const mat = new THREE.MeshStandardMaterial({
    map: m,
    bumpMap: bm,
    bumpScale: 0.22,
    roughness: 0.92,
    metalness: 0.05
  });

  materialCache.set(key, mat);
  return mat;
}

export function getMountainSnowMat(repeatX = 4, repeatY = 4) {
  const key = `mtnSnow_${repeatX}_${repeatY}`;
  if (materialCache.has(key)) return materialCache.get(key);

  const { map, bumpMap } = getMountainRockTextures();
  const m = map.clone();
  m.repeat.set(repeatX, repeatY);

  const mat = new THREE.MeshStandardMaterial({
    color: 0xf0f5fa,
    map: m,
    roughness: 0.55,
    metalness: 0.02
  });

  materialCache.set(key, mat);
  return mat;
}

export function getValleyGrassMat(repeatX = 16, repeatY = 16) {
  const key = `grass_${repeatX}_${repeatY}`;
  if (materialCache.has(key)) return materialCache.get(key);

  const { map, bumpMap } = getGrassTextures();
  const m = map.clone();
  m.repeat.set(repeatX, repeatY);
  const bm = bumpMap.clone();
  bm.repeat.set(repeatX, repeatY);

  const mat = new THREE.MeshStandardMaterial({
    map: m,
    bumpMap: bm,
    bumpScale: 0.08,
    roughness: 0.82,
    metalness: 0.02
  });

  materialCache.set(key, mat);
  return mat;
}

export function getCobblestoneMat(repeatX = 6, repeatY = 6) {
  const key = `cobble_${repeatX}_${repeatY}`;
  if (materialCache.has(key)) return materialCache.get(key);

  const { map, bumpMap } = getCobblestoneTextures();
  const m = map.clone();
  m.repeat.set(repeatX, repeatY);
  const bm = bumpMap.clone();
  bm.repeat.set(repeatX, repeatY);

  const mat = new THREE.MeshStandardMaterial({
    map: m,
    bumpMap: bm,
    bumpScale: 0.14,
    roughness: 0.78,
    metalness: 0.08
  });

  materialCache.set(key, mat);
  return mat;
}

export function getSlateRoofMat(repeatX = 4, repeatY = 4) {
  const key = `slateRoof_${repeatX}_${repeatY}`;
  if (materialCache.has(key)) return materialCache.get(key);

  const { map, bumpMap } = getSlateRoofTextures();
  const m = map.clone();
  m.repeat.set(repeatX, repeatY);
  const bm = bumpMap.clone();
  bm.repeat.set(repeatX, repeatY);

  const mat = new THREE.MeshStandardMaterial({
    map: m,
    bumpMap: bm,
    bumpScale: 0.09,
    roughness: 0.52,
    metalness: 0.12
  });

  materialCache.set(key, mat);
  return mat;
}

export function getCharbaghBrickMat(repeatX = 8, repeatY = 4) {
  const key = `charbaghBrick_${repeatX}_${repeatY}`;
  if (materialCache.has(key)) return materialCache.get(key);

  const { map, bumpMap } = getCharbaghBrickTextures();
  const m = map.clone();
  m.repeat.set(repeatX, repeatY);
  const bm = bumpMap.clone();
  bm.repeat.set(repeatX, repeatY);

  const mat = new THREE.MeshStandardMaterial({
    map: m,
    bumpMap: bm,
    bumpScale: 0.11,
    roughness: 0.85,
    metalness: 0.03
  });

  materialCache.set(key, mat);
  return mat;
}

export function getStainedGlassMat() {
  if (materialCache.has('stainedGlassMat')) return materialCache.get('stainedGlassMat');

  const texture = getStainedGlassTexture();
  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    emissiveMap: texture,
    emissive: new THREE.Color(0xffba38),
    emissiveIntensity: 0.85,
    roughness: 0.25,
    metalness: 0.1
  });

  materialCache.set('stainedGlassMat', mat);
  return mat;
}

export function getGildedBrassMat() {
  if (materialCache.has('brassMat')) return materialCache.get('brassMat');

  const mat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.28,
    metalness: 0.82
  });

  materialCache.set('brassMat', mat);
  return mat;
}

export function getRealisticWaterMat() {
  if (materialCache.has('waterMat')) return materialCache.get('waterMat');

  const mat = new THREE.MeshStandardMaterial({
    color: 0x143445,
    roughness: 0.15,
    metalness: 0.35,
    transparent: true,
    opacity: 0.88
  });

  materialCache.set('waterMat', mat);
  return mat;
}

export function getPineTrunkMat() {
  if (materialCache.has('pineTrunk')) return materialCache.get('pineTrunk');

  const mat = new THREE.MeshStandardMaterial({
    color: 0x3d271c,
    roughness: 0.95,
    metalness: 0.02
  });

  materialCache.set('pineTrunk', mat);
  return mat;
}

export function getPineNeedleMat(level = 1) {
  const key = `pineNeedle_${level}`;
  if (materialCache.has(key)) return materialCache.get(key);

  const color = level === 1 ? 0x163422 : 0x1f472f;
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.8,
    metalness: 0.04
  });

  materialCache.set(key, mat);
  return mat;
}
