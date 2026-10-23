// Interactive Golden Snitch Entity
// Flutters across the Quidditch Pitch with fluttering wings and gold sparkle trail

import * as THREE from 'three';
import { soundSynth } from '../audio/sound-synthesizer.js';

export class GoldenSnitch {
  constructor(scene) {
    this.scene = scene;
    this.pitchCenter = new THREE.Vector3(130, 18, -120); // Quidditch Pitch coordinates
    this.position = this.pitchCenter.clone();
    this.target = this.pitchCenter.clone();
    this.speed = 18;
    this.isCaught = false;

    this.mesh = this.createSnitchMesh();
    this.scene.add(this.mesh);

    this.nextWaypointTimer = 0;
  }

  createSnitchMesh() {
    const group = new THREE.Group();
    group.name = 'GoldenSnitch';

    // Gold core
    const coreGeo = new THREE.SphereGeometry(0.35, 16, 12);
    const coreMat = new THREE.MeshToonMaterial({ color: 0xffd700 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Dynamic golden light
    const glow = new THREE.PointLight(0xffea00, 2.0, 10);
    group.add(glow);

    // Delicate silver fluttering wings
    const wingMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });

    const leftWing = new THREE.Group();
    const lWingMesh = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.4, 4), wingMat);
    lWingMesh.position.set(-0.8, 0, 0);
    lWingMesh.rotation.z = Math.PI / 2;
    leftWing.add(lWingMesh);
    leftWing.position.set(-0.35, 0.1, 0);
    group.add(leftWing);
    this.leftWing = leftWing;

    const rightWing = new THREE.Group();
    const rWingMesh = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.4, 4), wingMat);
    rWingMesh.position.set(0.8, 0, 0);
    rWingMesh.rotation.z = -Math.PI / 2;
    rightWing.add(rWingMesh);
    rightWing.position.set(0.35, 0.1, 0);
    group.add(rightWing);
    this.rightWing = rightWing;

    group.position.copy(this.position);
    return group;
  }

  checkCatch(playerPosition) {
    if (this.isCaught) return false;
    const dist = this.mesh.position.distanceTo(playerPosition);
    if (dist < 4.2) {
      this.isCaught = true;
      soundSynth.playSnitchFlutter();
      soundSynth.playSpellPatronus();
      return true;
    }
    return false;
  }

  respawn() {
    this.isCaught = false;
    this.mesh.position.copy(this.pitchCenter);
    this.mesh.position.y += 10;
  }

  update(delta, elapsed, playerPos) {
    if (this.isCaught) {
      // Orbit around player triumphant
      if (playerPos) {
        this.mesh.position.x = playerPos.x + Math.cos(elapsed * 4) * 1.8;
        this.mesh.position.y = playerPos.y + 2.2 + Math.sin(elapsed * 4) * 0.4;
        this.mesh.position.z = playerPos.z + Math.sin(elapsed * 4) * 1.8;
      }
      return;
    }

    // Wing flutter animation (very fast fluttering)
    const flutter = Math.sin(elapsed * 45) * 0.85;
    this.leftWing.rotation.z = flutter;
    this.rightWing.rotation.z = -flutter;

    // Pick new waypoint every 1.5 - 2.5 seconds
    this.nextWaypointTimer -= delta;
    if (this.nextWaypointTimer <= 0) {
      this.nextWaypointTimer = 1.2 + Math.random() * 1.8;
      this.target.set(
        this.pitchCenter.x + (Math.random() - 0.5) * 60,
        this.pitchCenter.y + (Math.random() - 0.5) * 14,
        this.pitchCenter.z + (Math.random() - 0.5) * 35
      );
    }

    // Fly towards target
    const dir = this.target.clone().sub(this.mesh.position);
    if (dir.length() > 0.5) {
      dir.normalize();
      this.mesh.position.addScaledVector(dir, this.speed * delta);
    }
  }
}
