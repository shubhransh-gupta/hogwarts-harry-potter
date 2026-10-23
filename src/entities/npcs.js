// Interactive NPCs with Courier-City Style Bilingual Dialogues
// Station Master, Train Conductor, McGonagall, Sorting Hat, Hagrid, Madam Hooch

import * as THREE from 'three';

export class NPCManager {
  constructor(scene) {
    this.scene = scene;
    this.npcs = [];

    this.initNPCs();
  }

  initNPCs() {
    const npcData = [
      {
        id: 'station_master',
        name: 'Lucknow Station Master',
        nativeName: 'लखनऊ स्टेशन मास्टर',
        pos: { x: -176, y: 1.2, z: -69 },
        color: 0x1f2937,
        accent: 0xd4af37,
        dialog: {
          who: 'Lucknow Station Master',
          native: 'बेटा, ९ और १० के बीच की दीवार से सीधे निकल जाओ! डरो मत!',
          english: 'Son, walk straight through the brick barrier between 9 and 10! Keep a steady pace and trust the magic!'
        }
      },
      {
        id: 'train_conductor',
        name: 'Hogwarts Express Conductor',
        nativeName: 'हॉगवॉर्ट्स एक्सप्रेस कंडक्टर',
        pos: { x: -172, y: 1.2, z: -83 },
        color: 0x740001,
        accent: 0xf7b32b,
        dialog: {
          who: '5972 Train Conductor',
          native: 'देहरादून एक्सप्रेस तैयार है! सभी विद्यार्थी अपनी सीट लें!',
          english: 'The 5972 Dehradun Express departs on the hour! First years please board with your luggage!'
        }
      },
      {
        id: 'mcgonagall',
        name: 'Professor McGonagall',
        nativeName: 'प्रोफ़ेसर मैकगोनागल',
        pos: { x: 26, y: 13.2, z: 28 }, // Great Hall entrance
        color: 0x1a472a,
        accent: 0x000000,
        dialog: {
          who: 'Professor McGonagall',
          native: 'देहरादून की घाटी में हॉगवॉर्ट्स में आपका स्वागत है।',
          english: 'Welcome to Hogwarts in the Doon Valley. Here among the Himalayan pines, our ancient magic thrives.'
        }
      },
      {
        id: 'sorting_hat',
        name: 'The Sorting Hat',
        nativeName: 'द सॉर्टिंग हैट',
        pos: { x: 25, y: 13.8, z: 42 }, // Inside Great Hall
        color: 0x4a2e18,
        accent: 0x2e1a0d,
        isHat: true,
        dialog: {
          who: 'The Sorting Hat',
          native: 'अरे वाह! साहस और चतुराई का अनोखा संगम!',
          english: 'Ah! A keen wizard who traveled from Lucknow to our mountain castle... Better be GRYFFINDOR!'
        }
      },
      {
        id: 'hagrid',
        name: 'Rubeus Hagrid',
        nativeName: 'रूबियस हैग्रिड',
        pos: { x: -68, y: 1.2, z: 86 }, // By Hagrid's Hut
        color: 0x3d2716,
        accent: 0x6e583c,
        isGiant: true,
        dialog: {
          who: 'Rubeus Hagrid',
          native: 'पहाड़ी हवा जादूगरों के लिए सबसे अच्छी होती है!',
          english: 'Fresh Himalayan air of Dehradun! Watch out for the giant pumpkins, lad, they float high if you flick yer wand!'
        }
      },
      {
        id: 'madam_hooch',
        name: 'Madam Hooch',
        nativeName: 'मैडम हूच',
        pos: { x: 130, y: 1.2, z: -105 }, // Quidditch Pitch
        color: 0xf7b32b,
        accent: 0x222222,
        dialog: {
          who: 'Madam Hooch',
          native: 'झाड़ू कसकर पकड़ो और उड़ने के लिए तैयार रहो!',
          english: 'Keep your eyes on the Golden Snitch! The mountain breeze in the valley makes it extraordinarily swift!'
        }
      }
    ];

    npcData.forEach(data => {
      const npcGroup = new THREE.Group();
      npcGroup.position.set(data.pos.x, data.pos.y, data.pos.z);
      npcGroup.userData = data;

      // Stylized character mesh
      const scale = data.isGiant ? 1.6 : 1.0;

      if (data.isHat) {
        // Sorting hat cone on stool
        const stool = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.8, 8), new THREE.MeshToonMaterial({ color: 0x553311 }));
        stool.position.y = 0.4;
        npcGroup.add(stool);

        const hatGeo = new THREE.ConeGeometry(0.35, 0.7, 8);
        const hat = new THREE.Mesh(hatGeo, new THREE.MeshToonMaterial({ color: 0x3a2212 }));
        hat.position.y = 1.15;
        hat.rotation.z = 0.15;
        npcGroup.add(hat);
      } else {
        // Humanoid Body
        const bodyGeo = new THREE.CylinderGeometry(0.35 * scale, 0.45 * scale, 1.4 * scale, 10);
        const body = new THREE.Mesh(bodyGeo, new THREE.MeshToonMaterial({ color: data.color }));
        body.position.y = 0.9 * scale;
        npcGroup.add(body);

        // Head
        const headGeo = new THREE.SphereGeometry(0.28 * scale, 12, 10);
        const head = new THREE.Mesh(headGeo, new THREE.MeshToonMaterial({ color: 0xdca882 }));
        head.position.y = 1.8 * scale;
        npcGroup.add(head);

        // Hat or Hair
        const hatGeo = new THREE.ConeGeometry(0.32 * scale, 0.6 * scale, 8);
        const hat = new THREE.Mesh(hatGeo, new THREE.MeshToonMaterial({ color: data.accent }));
        hat.position.y = 2.15 * scale;
        npcGroup.add(hat);
      }

      this.scene.add(npcGroup);
      this.npcs.push(npcGroup);
    });
  }

  checkProximity(playerPos, maxDistance = 4.5) {
    for (const npc of this.npcs) {
      const dist = npc.position.distanceTo(playerPos);
      if (dist < maxDistance) {
        return npc.userData.dialog;
      }
    }
    return null;
  }
}
