// Wizard Student Player Character Model & Movement Controller
// Stylized 3D wizard boy with Hogwarts robe, scarf, animated wand, grounded physics & drop shadow

import * as THREE from 'three';
import { soundSynth } from '../audio/sound-synthesizer.js';

export class Player {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;

    // Movement state (Spawned firmly on Platform 9¾)
    this.position = new THREE.Vector3(-200, 1.0, -96);
    this.velocity = new THREE.Vector3();
    this.isGrounded = true;
    this.isSwimming = false;
    this.swimStrokeTimer = 0;
    this.moveSpeed = 11.5;
    this.sprintMultiplier = 1.85;
    this.isSprinting = false;
    this.isFirstPerson = false;

    // Input state
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      sprint: false,
      jump: false
    };

    // Camera angles
    this.cameraDistance = 7.0;
    this.cameraHeight = 2.8;
    this.cameraYaw = 0;
    this.cameraPitch = 0.18;

    this.mesh = this.createPlayerMesh();
    this.scene.add(this.mesh);

    this.walkCycle = 0;
    this.isMoving = false;
    this.isCinematic = false;
    this.castAnimTimer = 0;
    this.house = 'gryffindor';
    this.isDiving = false;
    this.diveDepth = 0;
  }

  playCastAnimation() {
    this.castAnimTimer = 0.35;
  }

  createPlayerMesh() {
    const group = new THREE.Group();
    group.name = 'PlayerWizard';

    // High-Fidelity PBR Wizard Materials
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xdca882, roughness: 0.65 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1f1a18, roughness: 0.85 });
    const robeMat = new THREE.MeshStandardMaterial({ color: 0x18181c, roughness: 0.88, metalness: 0.05 }); // Hogwarts wool robe
    const scarfMat1 = new THREE.MeshStandardMaterial({ color: 0x7e1215, roughness: 0.75 }); // Gryffindor Scarlet
    const scarfMat2 = new THREE.MeshStandardMaterial({ color: 0xdf9a20, roughness: 0.75 }); // Gryffindor Gold
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x222226, roughness: 0.9 });
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x111112, roughness: 0.45, metalness: 0.1 });
    const wandWoodMat = new THREE.MeshStandardMaterial({ color: 0x4a2e18, roughness: 0.5 });

    this.scarfMat1 = scarfMat1;
    this.scarfMat2 = scarfMat2;
    this.robeMat = robeMat;

    // 0. Contact Drop Shadow Decal (Grounded shadow blob)
    const shadowGeo = new THREE.CircleGeometry(0.62, 16);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x08060a,
      transparent: true,
      opacity: 0.42,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.y = 0.02;
    group.add(shadowMesh);
    this.shadowMesh = shadowMesh;

    // 1. Torso & Robes
    const torsoGeo = new THREE.CylinderGeometry(0.38, 0.52, 1.35, 12);
    const torso = new THREE.Mesh(torsoGeo, robeMat);
    torso.position.y = 1.35;
    torso.castShadow = true;
    group.add(torso);

    // Robe lower skirt flair
    const robeSkirtGeo = new THREE.ConeGeometry(0.68, 1.0, 12, 1, true);
    const robeSkirt = new THREE.Mesh(robeSkirtGeo, robeMat);
    robeSkirt.position.y = 0.85;
    group.add(robeSkirt);

    // 2. Head & Hair
    const headGeo = new THREE.SphereGeometry(0.32, 16, 12);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 2.25;
    head.castShadow = true;
    group.add(head);
    this.head = head;

    // Dark ruffled hair
    const hairGeo = new THREE.SphereGeometry(0.35, 12, 8, 0, Math.PI * 2, 0, Math.PI / 1.7);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 2.32, -0.04);
    group.add(hair);

    // Round Wizard Glasses
    const glassMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    [-0.11, 0.11].forEach(x => {
      const ringGeo = new THREE.TorusGeometry(0.08, 0.015, 6, 12);
      const ring = new THREE.Mesh(ringGeo, glassMat);
      ring.position.set(x, 2.26, 0.31);
      group.add(ring);
    });

    // 3. Striped Hogwarts Scarf
    const scarfBand1 = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.08, 8, 16), scarfMat1);
    scarfBand1.rotateX(Math.PI / 2);
    scarfBand1.position.y = 2.0;
    group.add(scarfBand1);

    const scarfTailGeo = new THREE.BoxGeometry(0.18, 0.65, 0.08);
    const scarfTail = new THREE.Mesh(scarfTailGeo, scarfMat2);
    scarfTail.position.set(0.15, 1.68, 0.3);
    scarfTail.rotation.z = -0.2;
    group.add(scarfTail);
    this.scarfTail = scarfTail;

    // 4. Arms & Hands
    // Left Arm (Relaxed at side)
    const leftArmGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.75, 8);
    const leftArm = new THREE.Mesh(leftArmGeo, robeMat);
    leftArm.position.set(-0.52, 1.45, 0);
    leftArm.rotation.z = 0.2;
    group.add(leftArm);
    this.leftArm = leftArm;

    // Right Arm (Forward / Holding Wand!)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.52, 1.75, 0);

    const rightArmGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.75, 8);
    const rightArm = new THREE.Mesh(rightArmGeo, robeMat);
    rightArm.position.set(0, -0.32, 0.2);
    rightArm.rotation.x = -Math.PI / 3.8;
    rightArmGroup.add(rightArm);
    this.rightArm = rightArm;

    // Right hand
    const handGeo = new THREE.SphereGeometry(0.09, 8, 8);
    const hand = new THREE.Mesh(handGeo, skinMat);
    hand.position.set(0, -0.65, 0.48);
    rightArmGroup.add(hand);

    // 11-inch Holly Wand
    const wandGeo = new THREE.CylinderGeometry(0.02, 0.038, 0.9, 8);
    const wand = new THREE.Mesh(wandGeo, wandWoodMat);
    wand.position.set(0, -0.72, 0.9);
    wand.rotation.x = Math.PI / 2.3;
    rightArmGroup.add(wand);

    // Wand Tip Glow Anchor
    const tipAnchor = new THREE.Group();
    tipAnchor.position.set(0, -0.72, 1.35);
    rightArmGroup.add(tipAnchor);
    this.wandTip = tipAnchor;

    group.add(rightArmGroup);
    this.rightArmGroup = rightArmGroup;

    // 5. Legs & Boots (Solidly grounded at y = 0)
    const legGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.75, 8);
    const leftLeg = new THREE.Mesh(legGeo, pantsMat);
    leftLeg.position.set(-0.2, 0.45, 0);
    group.add(leftLeg);
    this.leftLeg = leftLeg;

    const rightLeg = new THREE.Mesh(legGeo, pantsMat);
    rightLeg.position.set(0.2, 0.45, 0);
    group.add(rightLeg);
    this.rightLeg = rightLeg;

    [-0.2, 0.2].forEach(x => {
      const bootGeo = new THREE.BoxGeometry(0.22, 0.18, 0.38);
      const boot = new THREE.Mesh(bootGeo, shoeMat);
      boot.position.set(x, 0.09, 0.06);
      boot.castShadow = true;
      group.add(boot);
    });

    group.position.copy(this.position);
    return group;
  }

  getWandTipWorldPosition() {
    if (!this.wandTip) return this.position.clone().add(new THREE.Vector3(0, 1.4, 0));
    const worldPos = new THREE.Vector3();
    this.wandTip.getWorldPosition(worldPos);
    return worldPos;
  }

  teleport(pos, lookAngle = null) {
    this.position.copy(pos);
    this.velocity.set(0, 0, 0);
    this.isGrounded = true;
    this.mesh.position.copy(this.position);
    if (lookAngle !== null) {
      this.cameraYaw = lookAngle;
    }
    this.updateCamera();
  }

  setHouse(house) {
    this.house = house;
    const houseColors = {
      gryffindor: { primary: 0x7e1215, secondary: 0xdf9a20 },
      slytherin: { primary: 0x1a472a, secondary: 0xcccccc },
      ravenclaw: { primary: 0x0e1a40, secondary: 0x946b2d },
      hufflepuff: { primary: 0xecb939, secondary: 0x111111 }
    };
    const c = houseColors[house] || houseColors.gryffindor;
    if (this.scarfMat1) this.scarfMat1.color.setHex(c.primary);
    if (this.scarfMat2) this.scarfMat2.color.setHex(c.secondary);
  }

  jump() {
    if (this.isSwimming) {
      // Ascend to surface when swimming
      this.isDiving = false;
      this.diveDepth = Math.max(0, this.diveDepth - 1.5);
      return;
    }

    if (this.isGrounded) {
      this.velocity.y = 10.0;
      this.isGrounded = false;
    }
  }

  update(delta, elapsed, worldManager) {
    if (this.isCinematic) {
      return;
    }

    // Wand Cast "Swish and Flick" Whip Motion
    if (this.castAnimTimer > 0 && this.rightArmGroup) {
      this.castAnimTimer -= delta;
      const t = 1.0 - (this.castAnimTimer / 0.35);
      if (t < 0.28) {
        this.rightArmGroup.rotation.x = -Math.PI / 3.0 + t * 1.2;
      } else if (t < 0.68) {
        this.rightArmGroup.rotation.x = -Math.PI / 1.75;
        this.rightArmGroup.rotation.y = 0.28;
      } else {
        const settle = (t - 0.68) / 0.32;
        this.rightArmGroup.rotation.x = -Math.PI / 1.75 + settle * (Math.PI / 1.75 - Math.PI / 3.8);
        this.rightArmGroup.rotation.y = (1.0 - settle) * 0.28;
      }
    }

    // 1. Realistic Water & Swimming Physics Engine (Black Lake / Great Lake)
    const water = worldManager ? worldManager.isWaterAt(this.position.x, this.position.z) : { isWater: false };

    if (water.isWater) {
      if (!this.isSwimming) {
        this.isSwimming = true;
        soundSynth.playWaterSplash();
      }

      // Check diving toggle (Shift while moving forward or looking down)
      const forwardInput = (this.keys.forward ? 1 : 0) - (this.keys.backward ? 1 : 0);
      if (this.keys.sprint && forwardInput > 0 && this.cameraPitch > 0.2) {
        this.isDiving = true;
        this.diveDepth = Math.min(3.5, this.diveDepth + delta * 2.2);
      } else if (!this.keys.sprint && this.diveDepth > 0) {
        // Natural buoyant resurgence to water surface
        this.diveDepth = Math.max(0, this.diveDepth - delta * 2.5);
        if (this.diveDepth === 0) this.isDiving = false;
      }

      // Buoyant water equilibrium: body bobs smoothly on water surface, submerged to chest/shoulders
      const targetSwimY = (water.surfaceY - 1.25 - this.diveDepth) + Math.sin(elapsed * 2.8) * 0.08;
      this.position.y += (targetSwimY - this.position.y) * Math.min(1, 8 * delta);
      this.velocity.y = 0;
      this.isGrounded = false;

      // Swimming horizontal displacement with hydrodynamic fluid drag
      const swimSpeed = this.isDiving ? 8.5 : (this.keys.sprint ? 7.2 : 4.8);
      const strafeInput = (this.keys.right ? 1 : 0) - (this.keys.left ? 1 : 0);
      const isMoving = forwardInput !== 0 || strafeInput !== 0;

      if (isMoving) {
        const len = Math.hypot(forwardInput, strafeInput);
        const fwdNorm = forwardInput / len;
        const strNorm = strafeInput / len;
        const u = Math.sin(this.cameraYaw);
        const d = Math.cos(this.cameraYaw);
        const dirX = (u * fwdNorm - d * strNorm);
        const dirZ = (d * fwdNorm + u * strNorm);

        this.position.x += dirX * swimSpeed * delta;
        this.position.z += dirZ * swimSpeed * delta;

        // Face swim direction
        const targetRotation = Math.atan2(dirX, dirZ);
        let diff = targetRotation - this.mesh.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        this.mesh.rotation.y += diff * 12 * delta;

        // Prone horizontal swimming pose: body lies flat on the water
        this.mesh.rotation.x = -Math.PI / 2.15;
        if (this.head) this.head.rotation.x = 0.68; // Lift head out of water to breathe and look ahead

        // Freestyle crawl arm strokes and flutter kicking legs
        this.walkCycle += delta * (this.keys.sprint ? 11 : 7);
        this.leftArm.rotation.x = Math.sin(this.walkCycle) * 1.8;
        this.rightArm.rotation.x = Math.sin(this.walkCycle + Math.PI) * 1.8;
        this.leftLeg.rotation.x = Math.sin(this.walkCycle * 2) * 0.65;
        this.rightLeg.rotation.x = -Math.sin(this.walkCycle * 2) * 0.65;

        this.swimStrokeTimer += delta;
        if (this.swimStrokeTimer > 0.95) {
          soundSynth.playWaterSplash();
          this.swimStrokeTimer = 0;
        }
      } else {
        // Treading water idle: inclined body, sculling arms, treading flutter
        this.mesh.rotation.x = -0.32;
        if (this.head) this.head.rotation.x = 0.25;

        this.leftArm.rotation.x = 0.2;
        this.rightArm.rotation.x = 0.2;
        this.leftArm.rotation.z = 0.65 + Math.sin(elapsed * 2.5) * 0.2;
        this.rightArm.rotation.z = -0.65 - Math.sin(elapsed * 2.5) * 0.2;
        this.leftLeg.rotation.x = Math.sin(elapsed * 2.5) * 0.3;
        this.rightLeg.rotation.x = -Math.sin(elapsed * 2.5) * 0.3;
      }

      if (this.shadowMesh) {
        this.shadowMesh.visible = false;
      }

      this.mesh.position.set(this.position.x, this.position.y, this.position.z);
      this.updateCamera();
      return;
    } else {
      if (this.isSwimming) {
        this.isSwimming = false;
        this.isDiving = false;
        this.diveDepth = 0;
        this.mesh.rotation.x = 0;
        if (this.head) this.head.rotation.x = 0;
        if (this.leftArm) {
          this.leftArm.rotation.x = 0;
          this.leftArm.rotation.z = 0.2;
        }
        if (this.rightArm) {
          this.rightArm.rotation.x = -Math.PI / 3.8;
          this.rightArm.rotation.z = 0;
        }
        if (this.leftLeg) this.leftLeg.rotation.x = 0;
        if (this.rightLeg) this.rightLeg.rotation.x = 0;
        if (this.shadowMesh) {
          this.shadowMesh.visible = true;
        }
      }
    }

    // 2. Horizontal movement relative to camera orientation
    // forward: +1 for W/Up, -1 for S/Down
    // strafe: +1 for D/Right, -1 for A/Left
    const forward = (this.keys.forward ? 1 : 0) - (this.keys.backward ? 1 : 0);
    const strafe = (this.keys.right ? 1 : 0) - (this.keys.left ? 1 : 0);

    this.isMoving = forward !== 0 || strafe !== 0;
    const currentSpeed = (this.keys.sprint ? this.moveSpeed * this.sprintMultiplier : this.moveSpeed);

    if (this.isMoving) {
      // Normalize input so diagonals aren't faster
      const len = Math.hypot(forward, strafe);
      const fwdNorm = forward / len;
      const strNorm = strafe / len;

      // Courier City camera-relative movement physics:
      // When looking forward (yaw = 0):
      // W (fwd = +1, str = 0) -> dirX = 0, dirZ = +1 (forward)
      // S (fwd = -1, str = 0) -> dirX = 0, dirZ = -1 (backward)
      // D (fwd = 0, str = +1) -> dirX = -1, dirZ = 0 (screen right in Three.js)
      // A (fwd = 0, str = -1) -> dirX = +1, dirZ = 0 (screen left in Three.js)
      const u = Math.sin(this.cameraYaw);
      const d = Math.cos(this.cameraYaw);
      const dirX = (u * fwdNorm - d * strNorm);
      const dirZ = (d * fwdNorm + u * strNorm);

      // Target horizontal velocity
      const targetVx = dirX * currentSpeed;
      const targetVz = dirZ * currentSpeed;

      this.velocity.x += (targetVx - this.velocity.x) * Math.min(1, 14 * delta);
      this.velocity.z += (targetVz - this.velocity.z) * Math.min(1, 14 * delta);

      // Smooth mesh rotation to face movement direction
      const targetRotation = Math.atan2(dirX, dirZ);
      let diff = targetRotation - this.mesh.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.mesh.rotation.y += diff * 15 * delta;

      // Animate walking limbs
      this.walkCycle += delta * (this.keys.sprint ? 14 : 9);
      this.leftLeg.rotation.x = Math.sin(this.walkCycle) * 0.6;
      this.rightLeg.rotation.x = -Math.sin(this.walkCycle) * 0.6;
      this.leftArm.rotation.x = -Math.sin(this.walkCycle) * 0.5;

      if (this.scarfTail) {
        this.scarfTail.rotation.x = -0.3 + Math.sin(this.walkCycle * 2) * 0.25;
      }
    } else {
      this.velocity.x *= 0.75;
      this.velocity.z *= 0.75;
      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;
      this.leftArm.rotation.x = 0;
    }

    // 2. Physics Displacement, Slope Climbing & Wall Collision
    const nextX = this.position.x + this.velocity.x * delta;
    const nextZ = this.position.z + this.velocity.z * delta;
    let currentGroundY = this.position.y;

    if (worldManager) {
      const targetGroundY = worldManager.getGroundHeight(nextX, nextZ, this.position.y);
      const elevationRise = targetGroundY - this.position.y;

      // When grounded, player can ascend walkable slopes and steps (up to 2.2m per frame)
      const maxClimbStep = this.isGrounded ? 2.2 : 0.6;

      if (elevationRise > maxClimbStep) {
        // Collision: Obstacle is a steep wall or cliff face. Prevent penetrating inside!
        // Allow sliding along open axis:
        const xGroundY = worldManager.getGroundHeight(nextX, this.position.z, this.position.y);
        const zGroundY = worldManager.getGroundHeight(this.position.x, nextZ, this.position.y);

        if (xGroundY - this.position.y <= maxClimbStep) {
          this.position.x = nextX;
          this.velocity.z = 0;
        } else if (zGroundY - this.position.y <= maxClimbStep) {
          this.position.z = nextZ;
          this.velocity.x = 0;
        } else {
          // Block horizontal penetration into wall
          this.velocity.x = 0;
          this.velocity.z = 0;
        }
      } else {
        // Walkable ground/slope: advance horizontally
        this.position.x = nextX;
        this.position.z = nextZ;

        // When grounded and walking UP a slope:
        // Follow real physics and ASCEND the slope!
        if (this.isGrounded && elevationRise > 0) {
          this.position.y = targetGroundY;
          this.velocity.y = 0;
        }
      }

      // Vertical physics (gravity and surface adherence)
      const currentGroundY = worldManager.getGroundHeight(this.position.x, this.position.z, this.position.y);

      if (this.isGrounded && Math.abs(this.position.y - currentGroundY) < 0.65) {
        // Firmly planted on ground/slope
        this.position.y = currentGroundY;
        this.velocity.y = 0;
      } else {
        // Airborne (jumping or descending): apply gravity
        this.velocity.y -= 26 * delta;
        this.position.y += this.velocity.y * delta;

        if (this.position.y <= currentGroundY) {
          this.position.y = currentGroundY;
          this.velocity.y = 0;
          this.isGrounded = true;
        } else {
          this.isGrounded = false;
        }
      }
    } else {
      this.position.x = nextX;
      this.position.z = nextZ;
    }

    // Update mesh position
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);

    // Update drop-shadow scale & opacity based on jump height
    if (this.shadowMesh) {
      const heightAboveGround = Math.max(0, this.position.y - (currentGroundY ?? this.position.y));
      const scale = Math.max(0.3, 1.0 - heightAboveGround * 0.15);
      this.shadowMesh.scale.set(scale, scale, scale);
      this.shadowMesh.material.opacity = Math.max(0.05, 0.42 - heightAboveGround * 0.08);
    }

    // 3. Update Camera
    this.updateCamera();
  }

  updateCamera() {
    if (this.isFirstPerson) {
      this.camera.position.set(this.position.x, this.position.y + 2.1, this.position.z);
      const lookTarget = new THREE.Vector3(
        this.position.x + Math.sin(this.cameraYaw) * Math.cos(this.cameraPitch) * 20,
        this.position.y + 2.1 - Math.sin(this.cameraPitch) * 20,
        this.position.z + Math.cos(this.cameraYaw) * Math.cos(this.cameraPitch) * 20
      );
      this.camera.lookAt(lookTarget);
      this.mesh.visible = false;
    } else {
      this.mesh.visible = true;
      const camX = this.position.x - Math.sin(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;
      const camY = this.position.y + this.cameraHeight + Math.sin(this.cameraPitch) * this.cameraDistance;
      const camZ = this.position.z - Math.cos(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;

      this.camera.position.set(camX, camY, camZ);
      this.camera.lookAt(this.position.x, this.position.y + 1.45, this.position.z);
    }
  }
}
