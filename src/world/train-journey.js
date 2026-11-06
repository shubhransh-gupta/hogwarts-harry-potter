// Hogwarts Express: Cinematic Mountain Journey & Movie Story Controller
// Recreates the iconic journey from Lucknow Charbagh Platform 9¾ through the Shivalik foothills
// and across the soaring mountain viaduct to Hogwarts Castle Station.

import * as THREE from 'three';
import { soundSynth } from '../audio/sound-synthesizer.js';

export class TrainJourneyController {
  constructor(scene, camera, player, worldManager, dialogManager) {
    this.scene = scene;
    this.camera = camera;
    this.player = player;
    this.worldManager = worldManager;
    this.dialogManager = dialogManager;

    this.isActive = false;
    this.elapsedTime = 0;
    this.totalDuration = 24.0; // 24-second cinematic sequence

    this.trainModel = null;
    this.subtitlesEl = null;
    this.letterboxTop = null;
    this.letterboxBottom = null;
    this.skipBtn = null;

    this.initDOM();
  }

  initDOM() {
    // Create cinematic letterbox bars and story subtitle elements
    const topBar = document.createElement('div');
    topBar.className = 'cinematic-bar top';
    topBar.hidden = true;
    document.body.appendChild(topBar);
    this.letterboxTop = topBar;

    const bottomBar = document.createElement('div');
    bottomBar.className = 'cinematic-bar bottom';
    bottomBar.hidden = true;
    bottomBar.innerHTML = `
      <div class="cinematic-story-caption" id="cinematic-caption"></div>
      <button class="cinematic-skip-action" id="cinematic-skip">Skip Journey [Space] ➔</button>
    `;
    document.body.appendChild(bottomBar);
    this.letterboxBottom = bottomBar;

    this.subtitlesEl = bottomBar.querySelector('#cinematic-caption');
    this.skipBtn = bottomBar.querySelector('#cinematic-skip');

    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', () => this.completeJourney());
    }

    // Space / Escape key to skip
    window.addEventListener('keydown', (e) => {
      if (this.isActive && (e.code === 'Space' || e.code === 'Escape')) {
        this.completeJourney();
      }
    });
  }

  startJourney() {
    if (this.isActive) return;
    this.isActive = true;
    this.elapsedTime = 0;

    // Put player in cinematic mode (disables physics and camera locking)
    this.player.isCinematic = true;
    this.player.velocity.set(0, 0, 0);

    // Hide standard HUD elements during movie cinematic
    const hud = document.getElementById('hud');
    if (hud) hud.classList.add('cinematic-active');

    // Show letterbox bars
    this.letterboxTop.hidden = false;
    this.letterboxBottom.hidden = false;

    // Start atmospheric music & train whistle
    soundSynth.resume();
    soundSynth.playTrainWhistle();

    // Get station train model
    if (this.worldManager.lucknowStation && this.worldManager.lucknowStation.userData.stationTrain) {
      this.trainModel = this.worldManager.lucknowStation.userData.stationTrain;
      this.trainInitialX = this.trainModel.position.x;
    }
  }

  update(delta) {
    if (!this.isActive) return;
    this.elapsedTime += delta;

    const t = this.elapsedTime;

    // --- ACT I: Departure from Platform 9¾ (0s – 5.5s) ---
    if (t < 5.5) {
      const actProgress = t / 5.5;

      // Low dramatic camera tracking along the locomotive wheelbogies and crimson boiler
      const startCam = new THREE.Vector3(-194, 2.2, -92);
      const endCam = new THREE.Vector3(-180, 4.0, -88);
      this.camera.position.lerpVectors(startCam, endCam, actProgress);

      const lookTarget = new THREE.Vector3(-204 + actProgress * 15, 3.2, -108);
      this.camera.lookAt(lookTarget);

      // Move train forward along Lucknow track 1
      if (this.trainModel) {
        this.trainModel.position.x = this.trainInitialX + Math.pow(actProgress, 1.8) * 35;
      }

      this.setCaption('गार्ड की सीटी: "प्लेटफ़ॉर्म ९¾ से हॉगवॉर्ट्स एक्सप्रेस प्रस्थान कर रही है! All aboard for Hogwarts Castle!"');
    }
    // --- ACT II: Ascent into Shivalik Pine Foothills & Honeydukes Trolley (5.5s – 12.0s) ---
    else if (t < 12.0) {
      const actProgress = (t - 5.5) / 6.5;

      // Carriage side tracking shot through mist and pine trees
      const startCam = new THREE.Vector3(-150, 10.5, -45);
      const endCam = new THREE.Vector3(-105, 18.0, -30);
      this.camera.position.lerpVectors(startCam, endCam, actProgress);

      const lookTarget = new THREE.Vector3(-120 + actProgress * 30, 12.0, -18);
      this.camera.lookAt(lookTarget);

      this.setCaption('हनीड्यूक्स ट्रॉली: "कुछ लेंगे, बच्चों? चॉकलेट फ्रॉग्स? बर्टी बॉट्स की हर स्वाद वाली बीन या कद्दू की पेस्ट्री?"');
    }
    // --- ACT III: The Iconic Mountain Viaduct Flight Over Gorge & Lake (12.0s – 18.5s) ---
    else if (t < 18.5) {
      const actProgress = (t - 12.0) / 6.5;

      // Sweeping wide aerial cinematic shot high above the gorge overlooking the Viaduct
      const startCam = new THREE.Vector3(-45, 46.0, 42);
      const endCam = new THREE.Vector3(15, 42.0, 55);
      this.camera.position.lerpVectors(startCam, endCam, actProgress);

      // Focus on the soaring viaduct arches and Hogwarts Castle towers emerging ahead!
      const castlePos = new THREE.Vector3(20, 24.0, 10);
      this.camera.lookAt(castlePos);

      this.setCaption('पर्वतीय दृश्य: "पहाड़ी कोहरे को चीरते हुए, हिमालय की चोटियों के बीच हॉगवॉर्ट्स के भव्य मीनार और टॉवर प्रकट होते हैं..."');
    }
    // --- ACT IV: Arrival at Hogwarts Station & Hagrid\'s Welcome (18.5s – 24.0s) ---
    else if (t < 24.0) {
      const actProgress = (t - 18.5) / 5.5;

      // Camera pulls down to platform level as the train glides to a stop
      const startCam = new THREE.Vector3(35, 16.0, 48);
      const endCam = new THREE.Vector3(38, 14.2, 54);
      this.camera.position.lerpVectors(startCam, endCam, actProgress);

      const hagridPos = new THREE.Vector3(40, 13.5, 58);
      this.camera.lookAt(hagridPos);

      this.setCaption('हैग्रिड: "चलो भाई! प्रथम वर्ष के छात्र! इस तरफ नावों और ग्रेट हॉल की ओर! डरो मत, आ जाओ!"');
    }
    // Journey Complete!
    else {
      this.completeJourney();
    }
  }

  setCaption(text) {
    if (this.subtitlesEl && this.subtitlesEl.textContent !== text) {
      this.subtitlesEl.textContent = text;
    }
  }

  completeJourney() {
    this.isActive = false;

    // Reset station train position
    if (this.trainModel) {
      this.trainModel.position.x = this.trainInitialX;
    }

    // Hide cinematic letterbox
    if (this.letterboxTop) this.letterboxTop.hidden = true;
    if (this.letterboxBottom) this.letterboxBottom.hidden = true;

    const hud = document.getElementById('hud');
    if (hud) hud.classList.remove('cinematic-active');

    // Teleport player directly to Hogwarts Castle Courtyard & Clock Tower!
    this.player.isCinematic = false;
    const arrivalPos = new THREE.Vector3(38, 12.6, 54);
    this.player.teleport(arrivalPos, 0);

    // Toast announcement
    if (this.dialogManager) {
      this.dialogManager.showToast(
        'हॉगवॉर्ट्स में स्वागत है!',
        'Welcome to Hogwarts Castle! Explore the Great Hall, courtyard and towers.',
        5000
      );
    }
  }
}
