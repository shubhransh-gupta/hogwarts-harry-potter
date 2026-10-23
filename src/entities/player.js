// Wizard Student Player Character Model & Movement Controller
// Stylized 3D wizard boy with Hogwarts robe, scarf, animated wand, and physics controls

import * as THREE from 'three';

export class Player {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;

    // Movement state
    this.position = new THREE.Vector3(-180, 1.2, -74); // Spawn initially at Platform 9¾
    this.velocity = new THREE.Vector3();
    this.isGrounded = true;
    this.moveSpeed = 11;
    this.sprintMultiplier = 1.9;
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
    this.cameraDistance = 7.5;
    this.cameraHeight = 3.2;
    this.cameraYaw = 0;
    this.cameraPitch = 0.22;

    this.mesh = this.createPlayerMesh();
    this.scene.add(this.mesh);

    this.walkCycle = 0;
    this.isMoving = false;
  }

  createPlayerMesh() {
    const group = new THREE.Group();
    group.name = 'PlayerWizard';

    // Materials
    const skinMat = new THREE.MeshToonMaterial({ color: 0xdca882 });
    const hairMat = new THREE.MeshToonMaterial({ color: 0x1f1a18 });
    const robeMat = new THREE.MeshToonMaterial({ color: 0x18181c }); // Hogwarts black robe
    const scarfMat1 = new THREE.MeshToonMaterial({ color: 0x740001 }); // Gryffindor Scarlet
    const scarfMat2 = new THREE.MeshToonMaterial({ color: 0xf7b32b }); // Gryffindor Gold
    const pantsMat = new THREE.MeshToonMaterial({ color: 0x222226 });
    const shoeMat = new THREE.MeshToonMaterial({ color: 0x111112 });
    const wandWoodMat = new THREE.MeshToonMaterial({ color: 0x4a2e18 });

    // 1. Torso & Robes
    const torsoGeo = new THREE.CylinderGeometry(0.38, 0.52, 1.35, 12);
    const torso = new THREE.Mesh(torsoGeo, robeMat);
    torso.position.y = 1.35;
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
    group.add(head);

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

    // Right hand
    const handGeo = new THREE.SphereGeometry(0.09, 8, 8);
    const hand = new THREE.Mesh(handGeo, skinMat);
    hand.position.set(0, -0.65, 0.48);
    rightArmGroup.add(hand);

    // 11-inch Holly Wand with Phoenix Feather core!
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

    // 5. Legs & Boots
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
    this.mesh.position.copy(this.position);
    if (lookAngle !== null) {
      this.cameraYaw = lookAngle;
    }
  }

  update(delta, elapsed) {
    // Determine movement direction relative to camera yaw
    const forward = (this.keys.forward ? 1 : 0) - (this.keys.backward ? 1 : 0);
    const side = (this.keys.right ? 1 : 0) - (this.keys.left ? 1 : 0);

    this.isMoving = forward !== 0 || side !== 0;
    const currentSpeed = (this.keys.sprint ? this.moveSpeed * this.sprintMultiplier : this.moveSpeed);

    if (this.isMoving) {
      const moveAngle = this.cameraYaw + Math.atan2(side, forward);
      this.velocity.x = Math.sin(moveAngle) * currentSpeed;
      this.velocity.z = Math.cos(moveAngle) * currentSpeed;

      // Smoothly rotate character to face movement direction
      const targetRotation = moveAngle;
      let diff = targetRotation - this.mesh.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.mesh.rotation.y += diff * 12 * delta;

      // Animate walk/run legs & scarf
      this.walkCycle += delta * (this.keys.sprint ? 14 : 9);
      this.leftLeg.rotation.x = Math.sin(this.walkCycle) * 0.6;
      this.rightLeg.rotation.x = -Math.sin(this.walkCycle) * 0.6;
      this.leftArm.rotation.x = -Math.sin(this.walkCycle) * 0.5;

      if (this.scarfTail) {
        this.scarfTail.rotation.x = -0.3 + Math.sin(this.walkCycle * 2) * 0.2;
      }
    } else {
      // Decelerate
      this.velocity.x *= 0.15;
      this.velocity.z *= 0.15;
      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;
      this.leftArm.rotation.x = 0;

      // Idle breathing
      this.mesh.position.y = this.position.y + Math.sin(elapsed * 2.5) * 0.02;
    }

    // Apply movement
    this.position.x += this.velocity.x * delta;
    this.position.z += this.velocity.z * delta;

    // Ground clamping
    this.mesh.position.x = this.position.x;
    this.mesh.position.z = this.position.z;

    // Camera following
    this.updateCamera();
  }

  updateCamera() {
    if (this.isFirstPerson) {
      // First person view from wizard's eye level
      this.camera.position.set(this.position.x, this.position.y + 2.1, this.position.z);
      const lookTarget = new THREE.Vector3(
        this.position.x + Math.sin(this.cameraYaw) * Math.cos(this.cameraPitch) * 20,
        this.position.y + 2.1 - Math.sin(this.cameraPitch) * 20,
        this.position.z + Math.cos(this.cameraYaw) * Math.cos(this.cameraPitch) * 20
      );
      this.camera.lookAt(lookTarget);
      this.mesh.visible = false;
    } else {
      // Third-person cinematic orbit camera
      this.mesh.visible = true;
      const camX = this.position.x - Math.sin(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;
      const camY = this.position.y + this.cameraHeight + Math.sin(this.cameraPitch) * this.cameraDistance;
      const camZ = this.position.z - Math.cos(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;

      this.camera.position.set(camX, camY, camZ);
      this.camera.lookAt(this.position.x, this.position.y + 1.6, this.position.z);
    }
  }
}
