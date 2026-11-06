// Interactive NPCs & Bustling Hogwarts Student Crowd System
// Station Master, Conductor, McGonagall, Sorting Hat, Hagrid, Madam Hooch
// Plus 36+ living animated Hogwarts students (Gryffindor, Slytherin, Ravenclaw, Hufflepuff)

import * as THREE from 'three';

export class NPCManager {
  constructor(scene) {
    this.scene = scene;
    this.npcs = [];
    this.students = [];

    this.initKeyNPCs();
    this.initStudentCrowd();
  }

  initKeyNPCs() {
    const keyNPCs = [
      {
        id: 'station_master',
        name: 'Lucknow Station Master',
        nativeName: 'लखनऊ स्टेशन मास्टर',
        pos: { x: -195, y: 1.0, z: -94 },
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
        pos: { x: -206, y: 1.0, z: -104 },
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
        pos: { x: 26, y: 12.6, z: 28 },
        color: 0x1a472a,
        accent: 0x000000,
        dialog: {
          who: 'Professor McGonagall',
          native: 'देहरादून की घाटी में हॉगवॉर्ट्स में आपका स्वागत है। हॉरक्रक्स खोजकर वोल्डमॉर्ट को पराजित करो!',
          english: 'Welcome to Hogwarts in the Doon Valley. Dark forces stir—seek out the 7 Horcruxes to finish Lord Voldemort!'
        }
      },
      {
        id: 'sorting_hat',
        name: 'The Sorting Hat',
        nativeName: 'द सॉर्टिंग हैट',
        pos: { x: 25, y: 12.6, z: 42 },
        color: 0x4a2e18,
        accent: 0x2e1a0d,
        isHat: true,
        dialog: {
          isSortingHat: true,
          who: 'The Sorting Hat',
          native: 'सॉर्टिंग हैट पर बैठें और अपना पसंदीदा सदन चुनें!',
          english: 'Step forward and choose your House: Gryffindor, Slytherin, Ravenclaw, or Hufflepuff!'
        }
      },
      {
        id: 'hagrid',
        name: 'Rubeus Hagrid',
        nativeName: 'रूबियस हैग्रिड',
        pos: { x: -68, y: 0.8, z: 86 },
        color: 0x3d2716,
        accent: 0x6e583c,
        isGiant: true,
        dialog: {
          who: 'Rubeus Hagrid',
          native: 'पहाड़ी हवा जादूगरों के लिए सबसे अच्छी होती है! कद्दू के पास एक हॉरक्रक्स छिपा है!',
          english: 'Fresh Himalayan air! Keep an eye on my pumpkin patch, lad—dark magic lingers near that ancient ring!'
        }
      },
      {
        id: 'madam_hooch',
        name: 'Madam Hooch',
        nativeName: 'मैडम हूच',
        pos: { x: 130, y: 1.2, z: -105 },
        color: 0xf7b32b,
        accent: 0x222222,
        dialog: {
          who: 'Madam Hooch',
          native: 'झाड़ू कसकर पकड़ो और उड़ने के लिए तैयार रहो!',
          english: 'Keep your eyes on the Golden Snitch! The mountain breeze in the valley makes it extraordinarily swift!'
        }
      }
    ];

    keyNPCs.forEach(data => {
      const npcGroup = new THREE.Group();
      npcGroup.position.set(data.pos.x, data.pos.y, data.pos.z);
      npcGroup.userData = data;

      const scale = data.isGiant ? 1.6 : 1.0;

      // Contact shadow under NPC
      const sGeo = new THREE.CircleGeometry(0.55 * scale, 12);
      sGeo.rotateX(-Math.PI / 2);
      const sMat = new THREE.MeshBasicMaterial({ color: 0x08060a, transparent: true, opacity: 0.38 });
      const shadow = new THREE.Mesh(sGeo, sMat);
      shadow.position.y = 0.02;
      npcGroup.add(shadow);

      if (data.isHat) {
        // Sorting hat on wooden stool with golden aura
        const stool = new THREE.Mesh(
          new THREE.CylinderGeometry(0.55, 0.55, 0.8, 8),
          new THREE.MeshStandardMaterial({ color: 0x4a2e18, roughness: 0.8 })
        );
        stool.position.y = 0.4;
        npcGroup.add(stool);

        const hatGeo = new THREE.ConeGeometry(0.38, 0.85, 8);
        const hat = new THREE.Mesh(hatGeo, new THREE.MeshStandardMaterial({ color: 0x321a0d, roughness: 0.9 }));
        hat.position.y = 1.25;
        hat.rotation.z = 0.15;
        npcGroup.add(hat);
        this.sortingHatMesh = hat;

        const hatLight = new THREE.PointLight(0xffd700, 1.2, 5);
        hatLight.position.y = 1.4;
        npcGroup.add(hatLight);
      } else {
        // Humanoid Wizard NPC
        const bodyGeo = new THREE.CylinderGeometry(0.35 * scale, 0.48 * scale, 1.4 * scale, 10);
        const body = new THREE.Mesh(bodyGeo, new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.85 }));
        body.position.y = 0.9 * scale;
        body.castShadow = true;
        npcGroup.add(body);

        const headGeo = new THREE.SphereGeometry(0.28 * scale, 12, 10);
        const head = new THREE.Mesh(headGeo, new THREE.MeshStandardMaterial({ color: 0xdca882, roughness: 0.6 }));
        head.position.y = 1.8 * scale;
        head.castShadow = true;
        npcGroup.add(head);

        const hatGeo = new THREE.ConeGeometry(0.32 * scale, 0.6 * scale, 8);
        const hat = new THREE.Mesh(hatGeo, new THREE.MeshStandardMaterial({ color: data.accent, roughness: 0.7 }));
        hat.position.y = 2.15 * scale;
        npcGroup.add(hat);
      }

      this.scene.add(npcGroup);
      this.npcs.push(npcGroup);
    });
  }

  initStudentCrowd() {
    // 36 Living Hogwarts Students spread across castle, hall, viaduct & pitch
    const houses = [
      { name: 'Gryffindor', color: 0x7e1215, trim: 0xdf9a20, badge: '🦁' },
      { name: 'Slytherin', color: 0x1a472a, trim: 0xcccccc, badge: '🐍' },
      { name: 'Ravenclaw', color: 0x0e1a40, trim: 0x946b2d, badge: '🦅' },
      { name: 'Hufflepuff', color: 0xecb939, trim: 0x111111, badge: '🦡' }
    ];

    const studentQuotes = [
      "Have you checked the Black Lake depths? Something dark glimmers at the bottom!",
      "I heard Tom Riddle's Diary was seen near the Great Hall hearth!",
      "Avada Kedavra is forbidden, but Voldemort's followers don't care...",
      "Look at the Nimbus 2000 on the pitch! Madam Hooch let us fly it!",
      "Hagrid's giant pumpkins grow bigger every day!",
      "Ravenclaw's Diadem is lost somewhere high in the Astronomy Spire!",
      "If you collect enough Galleons, you can unlock rare ancient magic!"
    ];

    // Clustered realistic student positions
    const studentLocations = [
      // Courtyard Clusters (Groups talking, sitting, practicing)
      { x: 38, y: 12.6, z: 52 }, { x: 39.5, y: 12.6, z: 53 }, { x: 37, y: 12.6, z: 54 },
      { x: 44, y: 12.6, z: 62 }, { x: 45.2, y: 12.6, z: 63.5 },
      { x: 32, y: 12.6, z: 58 }, { x: 33.5, y: 12.6, z: 59 }, { x: 31, y: 12.6, z: 60 },
      { x: 48, y: 12.6, z: 54 }, { x: 49.5, y: 12.6, z: 55 },
      { x: 42, y: 12.6, z: 68 }, { x: 40.5, y: 12.6, z: 67 },
      { x: 35, y: 12.6, z: 66 }, { x: 36.5, y: 12.6, z: 65 },
      { x: 46, y: 12.6, z: 50 }, { x: 47.5, y: 12.6, z: 51 },

      // Great Hall Dining Tables & Aisles
      { x: 23, y: 12.6, z: 32 }, { x: 23, y: 12.6, z: 35 }, { x: 23, y: 12.6, z: 38 },
      { x: 27, y: 12.6, z: 32 }, { x: 27, y: 12.6, z: 35 }, { x: 27, y: 12.6, z: 38 },
      { x: 25, y: 12.6, z: 46 }, { x: 26, y: 12.6, z: 47 },

      // Viaduct Scenic Walkway
      { x: -55, y: 29.8, z: -12 }, { x: -53.5, y: 29.8, z: -14 },
      { x: -65, y: 29.8, z: -8 }, { x: -63.5, y: 29.8, z: -10 },
      { x: -75, y: 29.8, z: -6 }, { x: -73.5, y: 29.8, z: -7.5 },

      // Quidditch Pitch Spectator Turf
      { x: 125, y: 1.2, z: -110 }, { x: 127, y: 1.2, z: -111 },
      { x: 135, y: 1.2, z: -112 }, { x: 137, y: 1.2, z: -113 }
    ];

    studentLocations.forEach((loc, idx) => {
      const house = houses[idx % houses.length];
      const studentGroup = new THREE.Group();
      studentGroup.position.set(loc.x, loc.y, loc.z);

      const quote = studentQuotes[idx % studentQuotes.length];
      studentGroup.userData = {
        name: `${house.name} Student`,
        house: house.name,
        dialog: {
          who: `${house.badge} ${house.name} Student`,
          native: `हॉगवॉर्ट्स विद्यार्थी: "${quote}"`,
          english: `"${quote}"`
        }
      };

      // Contact shadow
      const sGeo = new THREE.CircleGeometry(0.42, 10);
      sGeo.rotateX(-Math.PI / 2);
      const sMat = new THREE.MeshBasicMaterial({ color: 0x08060a, transparent: true, opacity: 0.32 });
      const shadow = new THREE.Mesh(sGeo, sMat);
      shadow.position.y = 0.02;
      studentGroup.add(shadow);

      // Student Body (Black wool robe with House crest & scarf)
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x18181c, roughness: 0.85 });
      const trimMat = new THREE.MeshStandardMaterial({ color: house.color, roughness: 0.7 });
      const goldMat = new THREE.MeshStandardMaterial({ color: house.trim, roughness: 0.7 });
      const skinMat = new THREE.MeshStandardMaterial({ color: 0xdca882, roughness: 0.65 });
      const hairMat = new THREE.MeshStandardMaterial({
        color: [0x1a1614, 0x4a2e18, 0xd4a373, 0x8b5a2b][idx % 4],
        roughness: 0.8
      });

      // Robe
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.42, 1.25, 10), bodyMat);
      body.position.y = 0.85;
      body.castShadow = true;
      studentGroup.add(body);

      // House Scarf
      const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.07, 6, 12), trimMat);
      scarf.rotateX(Math.PI / 2);
      scarf.position.y = 1.45;
      studentGroup.add(scarf);

      const scarfTail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.45, 0.06), goldMat);
      scarfTail.position.set(0.12, 1.25, 0.25);
      studentGroup.add(scarfTail);

      // Head & Hair
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 8), skinMat);
      head.position.y = 1.68;
      head.castShadow = true;
      studentGroup.add(head);

      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 6, 0, Math.PI * 2, 0, Math.PI / 1.8), hairMat);
      hair.position.set(0, 1.74, -0.03);
      studentGroup.add(hair);

      // Wand
      const wand = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.025, 0.6, 6), new THREE.MeshStandardMaterial({ color: 0x3d2716 }));
      wand.position.set(0.35, 0.9, 0.25);
      wand.rotation.x = Math.PI / 3;
      studentGroup.add(wand);

      // Random face rotation
      studentGroup.rotation.y = (idx * 1.35) % (Math.PI * 2);

      this.scene.add(studentGroup);
      this.students.push({
        group: studentGroup,
        baseY: loc.y,
        animOffset: idx * 0.4
      });
      this.npcs.push(studentGroup);
    });
  }

  update(delta, elapsed) {
    // Subtle idle breathing and swaying for students
    this.students.forEach(s => {
      s.group.position.y = s.baseY + Math.sin(elapsed * 2.2 + s.animOffset) * 0.03;
    });

    // Sorting hat wobble
    if (this.sortingHatMesh) {
      this.sortingHatMesh.rotation.z = 0.15 + Math.sin(elapsed * 3.0) * 0.08;
    }
  }

  checkProximity(playerPos, maxDistance = 4.5) {
    // Check Sorting Hat first if nearby
    for (const npc of this.npcs) {
      const dist = npc.position.distanceTo(playerPos);
      if (dist < maxDistance) {
        return npc.userData.dialog;
      }
    }
    return null;
  }
}
