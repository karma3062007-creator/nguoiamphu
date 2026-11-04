(function (root) {
  'use strict';

  // Antigravity 3D Avatars & NPCs for "Game 18 Tầng Địa Ngục"
  // Three.js r128 compatible, pure JS, no external assets.
  // Style: Chibi, expressive sparkling eyes, rosy cheeks, smooth face, high performance.

  // Shared geometry cache to minimize GPU memory & draw calls on mobile
  var sharedGeo = null;
  function getSharedGeometries(THREE) {
    if (sharedGeo) return sharedGeo;
    sharedGeo = {
      box: new THREE.BoxGeometry(1, 1, 1),
      sphereSmooth: new THREE.SphereGeometry(1, 14, 10),
      sphereMedium: new THREE.SphereGeometry(1, 10, 8),
      sphereLow: new THREE.SphereGeometry(1, 8, 6),
      sphereTiny: new THREE.SphereGeometry(1, 6, 4),
      cylinder: new THREE.CylinderGeometry(1, 1, 1, 10),
      cylinderLow: new THREE.CylinderGeometry(1, 1, 1, 8),
      cone: new THREE.ConeGeometry(1, 1, 8),
      torus: new THREE.TorusGeometry(1, 0.22, 5, 10)
    };
    return sharedGeo;
  }

  // Common materials that can be reused across avatars
  var sharedMats = null;
  function getSharedMaterials(THREE) {
    if (sharedMats) return sharedMats;
    function mat(color, opts) {
      opts = opts || {};
      return new THREE.MeshStandardMaterial({
        color: color,
        roughness: opts.roughness !== undefined ? opts.roughness : 0.75,
        metalness: opts.metalness !== undefined ? opts.metalness : 0.05,
        flatShading: !!opts.flatShading,
        transparent: !!opts.transparent,
        opacity: opts.opacity !== undefined ? opts.opacity : 1.0,
        emissive: opts.emissive || 0x000000,
        emissiveIntensity: opts.emissiveIntensity || 0
      });
    }
    sharedMats = {
      eyeBlack: mat('#1a171e', { roughness: 0.3 }),
      eyeWhite: mat('#ffffff', { roughness: 0.2 }),
      blushPink: mat('#ff7f8d', { roughness: 0.9 }),
      mouthDark: mat('#682329', { roughness: 0.7 }),
      gold: mat('#dca842', { roughness: 0.35, metalness: 0.6 }),
      silver: mat('#c8d0d8', { roughness: 0.3, metalness: 0.7 }),
      darkWood: mat('#422d25', { roughness: 0.85 }),
      shoesDark: mat('#35313a', { roughness: 0.8 }),
      whiteCloth: mat('#f3eef0', { roughness: 0.85 }),
      talismanRed: mat('#c92a2a', { roughness: 0.6 }),
      talismanYellow: mat('#f1c40f', { roughness: 0.5 }),
      ghostFlame: mat('#7de8d2', { emissive: 0x5cd6c0, emissiveIntensity: 0.7, transparent: true, opacity: 0.75 })
    };
    return sharedMats;
  }

  function createKit(THREE) {
    var geos = getSharedGeometries(THREE);
    var mats = getSharedMaterials(THREE);

    function createMat(color, opts) {
      opts = opts || {};
      return new THREE.MeshStandardMaterial({
        color: color,
        roughness: opts.roughness !== undefined ? opts.roughness : 0.75,
        metalness: opts.metalness !== undefined ? opts.metalness : 0.05,
        flatShading: !!opts.flatShading,
        transparent: !!opts.transparent,
        opacity: opts.opacity !== undefined ? opts.opacity : 1.0
      });
    }

    function addMesh(parent, geo, material, x, y, z, sx, sy, sz, rx, ry, rz) {
      var mesh = new THREE.Mesh(geo, material);
      mesh.position.set(x || 0, y || 0, z || 0);
      mesh.scale.set(sx !== undefined ? sx : 1, sy !== undefined ? sy : 1, sz !== undefined ? sz : 1);
      if (rx) mesh.rotation.x = rx;
      if (ry) mesh.rotation.y = ry;
      if (rz) mesh.rotation.z = rz;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }

    function addPivot(parent, x, y, z) {
      var grp = new THREE.Group();
      grp.position.set(x || 0, y || 0, z || 0);
      parent.add(grp);
      return grp;
    }

    // Cute chibi eyes with large sparkling highlight + rosy cheeks
    function addChibiFace(parent, eyeY, eyeZ, spacing, eyeScale) {
      eyeY = eyeY || 1.18;
      eyeZ = eyeZ || 0.265;
      spacing = spacing || 0.105;
      eyeScale = eyeScale || 0.038;

      var eyeGroup = addPivot(parent, 0, eyeY, eyeZ);
      var eyeMeshes = [];

      [-1, 1].forEach(function (side) {
        var eyePivot = addPivot(eyeGroup, side * spacing, 0, 0);
        // Big pupil/iris
        var pupil = addMesh(eyePivot, geos.sphereSmooth, mats.eyeBlack, 0, 0, 0, eyeScale, eyeScale * 1.25, eyeScale * 0.45);
        // Big sparkling main catchlight (top right)
        addMesh(eyePivot, geos.sphereTiny, mats.eyeWhite, eyeScale * 0.32, eyeScale * 0.42, eyeScale * 0.35, eyeScale * 0.42, eyeScale * 0.42, eyeScale * 0.25);
        // Small secondary catchlight (bottom left)
        addMesh(eyePivot, geos.sphereTiny, mats.eyeWhite, -eyeScale * 0.28, -eyeScale * 0.36, eyeScale * 0.32, eyeScale * 0.22, eyeScale * 0.22, eyeScale * 0.18);
        eyeMeshes.push(eyePivot);

        // Cute pink blush on cheek
        addMesh(parent, geos.sphereLow, mats.blushPink, side * (spacing + 0.065), eyeY - 0.075, eyeZ - 0.02, eyeScale * 1.1, eyeScale * 0.65, eyeScale * 0.35);
      });

      // Cute small smile
      addMesh(parent, geos.box, mats.mouthDark, 0, eyeY - 0.095, eyeZ + 0.015, eyeScale * 1.1, eyeScale * 0.26, eyeScale * 0.2);

      return {
        group: eyeGroup,
        eyes: eyeMeshes,
        scaleY: function (sy) {
          eyeMeshes.forEach(function (e) { e.scale.y = sy; });
        }
      };
    }

    return {
      geos: geos,
      mats: mats,
      createMat: createMat,
      addMesh: addMesh,
      addPivot: addPivot,
      addChibiFace: addChibiFace
    };
  }

  // Player Avatar generator (max 35 meshes, <3000 triangles)
  root.makeAvatar = function (THREE, opts) {
    opts = opts || {};
    var kind = opts.kind || 'tourist';
    var female = opts.gender === 'nu';
    if (['ghost', 'tourist', 'taoist', 'monk'].indexOf(kind) < 0) {
      throw new Error('Unknown avatar kind: ' + kind);
    }

    var k = createKit(THREE);
    var group = new THREE.Group();
    group.name = 'avatar-' + kind + '-' + (female ? 'nu' : 'nam');

    var body = k.addPivot(group, 0, 0, 0);

    // Dynamic color materials
    var skinMat = k.createMat(opts.skin || '#fedac0', { roughness: 0.6, flatShading: false });
    var isGhost = (kind === 'ghost');
    var defaultRobe = isGhost ? '#cbeef3' : (kind === 'monk' ? '#c47838' : (kind === 'taoist' ? '#3d5272' : '#457b9d'));
    var robeMat = k.createMat(opts.robe || defaultRobe, {
      roughness: 0.8,
      transparent: isGhost,
      opacity: isGhost ? 0.82 : 1.0,
      flatShading: false
    });
    var hairMat = k.createMat(opts.hair || '#2a2228', { roughness: 0.7, flatShading: false });

    var arms = [];
    var legs = [];
    var headPivot = k.addPivot(body, 0, 1.16, 0);
    var faceCtrl = null;
    var floatWisps = [];

    if (isGhost) {
      // --- HỒN MA (GHOST) ---
      // Cute round ethereal floating spirit
      headPivot.position.y = 1.17;
      // Head
      k.addMesh(headPivot, k.geos.sphereSmooth, robeMat, 0, 0, 0, 0.33, 0.32, 0.31);
      // Ghostly cute eyes & blush
      faceCtrl = k.addChibiFace(headPivot, 0.02, 0.275, 0.105, 0.038);

      // Ghost flowing drapery body
      k.addMesh(body, k.geos.cylinder, robeMat, 0, 0.72, 0, 0.28, 0.40, 0.62);
      // Flowing tail curving slightly back
      k.addMesh(body, k.geos.cone, robeMat, 0, 0.27, -0.06, 0.38, 0.44, 0.30, -0.32, 0, 0);

      // Cute ghost floating hands
      [-1, 1].forEach(function (side) {
        var arm = k.addPivot(body, side * 0.27, 0.82, 0.06);
        k.addMesh(arm, k.geos.sphereLow, robeMat, 0, -0.08, 0.06, 0.09, 0.08, 0.14);
        arm.rotation.z = side * 0.18;
        arm.rotation.x = -0.4;
        arms.push(arm);
      });

      // Floating soul wisps (Ma trơi u linh)
      [-1, 1].forEach(function (side) {
        var wisp = k.addPivot(body, side * 0.42, 1.05, -0.15);
        k.addMesh(wisp, k.geos.sphereLow, k.mats.ghostFlame, 0, 0, 0, 0.065, 0.09, 0.065);
        floatWisps.push(wisp);
      });

      // Hair difference for female ghost
      if (female) {
        // Ethereal floating long dark hair
        k.addMesh(headPivot, k.geos.sphereLow, hairMat, 0, 0.06, -0.12, 0.34, 0.28, 0.24);
        k.addMesh(headPivot, k.geos.box, hairMat, 0, -0.22, -0.22, 0.46, 0.44, 0.12, 0.18, 0, 0);
      }
    } else {
      // --- DU KHÁCH / ĐẠO SĨ / TU SĨ ---
      // Chubby round chibi head with smooth shading
      k.addMesh(headPivot, k.geos.sphereSmooth, skinMat, 0, 0, 0, 0.32, 0.31, 0.30);
      faceCtrl = k.addChibiFace(headPivot, 0.02, 0.27, 0.10, 0.036);

      // Chibi Torso / Robe
      k.addMesh(body, k.geos.cylinder, robeMat, 0, 0.65, 0, 0.23, kind === 'tourist' ? 0.26 : 0.35, 0.54);

      // Legs & Shoes
      [-1, 1].forEach(function (side) {
        var leg = k.addPivot(body, side * 0.115, 0.38, 0);
        k.addMesh(leg, k.geos.cylinderLow, robeMat, 0, -0.13, 0, 0.08, 0.07, 0.26);
        k.addMesh(leg, k.geos.box, k.mats.shoesDark, 0, -0.31, 0.04, 0.14, 0.09, 0.24);
        legs.push(leg);
      });

      // Arms & Hands
      [-1, 1].forEach(function (side) {
        var arm = k.addPivot(body, side * 0.28, 0.84, 0);
        k.addMesh(arm, k.geos.cylinderLow, robeMat, 0, -0.14, 0, 0.09, 0.075, 0.26);
        k.addMesh(arm, k.geos.sphereLow, skinMat, 0, -0.30, 0, 0.075, 0.075, 0.075);
        arm.rotation.z = side * 0.12;
        arms.push(arm);
      });

      // Hair: male vs female
      if (kind !== 'monk' || female) {
        // Front bangs
        k.addMesh(headPivot, k.geos.sphereLow, hairMat, 0, 0.12, -0.02, 0.33, 0.20, 0.28);
        if (female) {
          // Cute twin pigtails / side buns / long flowing back hair
          if (kind === 'tourist') {
            [-1, 1].forEach(function (side) {
              k.addMesh(headPivot, k.geos.sphereLow, hairMat, side * 0.32, 0.12, -0.06, 0.12, 0.12, 0.12);
            });
          } else {
            // Elegant back hair and bun
            k.addMesh(headPivot, k.geos.box, hairMat, 0, -0.14, -0.21, 0.44, 0.46, 0.16);
            k.addMesh(headPivot, k.geos.sphereLow, hairMat, 0, 0.28, -0.16, 0.14, 0.14, 0.14);
          }
        }
      }

      // Class-specific props
      if (kind === 'tourist') {
        // --- DU KHÁCH ---
        // Straw sun hat (wide brim + crown + ribbon)
        k.addMesh(headPivot, k.geos.cylinderLow, k.mats.gold, 0, 0.28, 0, 0.45, 0.45, 0.04);
        k.addMesh(headPivot, k.geos.cylinderLow, k.mats.gold, 0, 0.36, 0, 0.24, 0.27, 0.14);
        k.addMesh(headPivot, k.geos.cylinderLow, k.mats.shoesDark, 0, 0.31, 0, 0.275, 0.275, 0.04);

        // Backpack on back
        k.addMesh(body, k.geos.box, k.mats.darkWood, 0, 0.68, -0.25, 0.34, 0.38, 0.17);
        // Camera on chest with lens
        k.addMesh(body, k.geos.box, k.mats.shoesDark, 0, 0.69, 0.22, 0.17, 0.12, 0.10);
        k.addMesh(body, k.geos.cylinderLow, k.mats.silver, 0, 0.69, 0.28, 0.05, 0.05, 0.06, 1.57, 0, 0);

      } else if (kind === 'taoist') {
        // --- ĐẠO SĨ ---
        // Taoist Guan (Mũ đạo sĩ) + Gold hairpin
        k.addMesh(headPivot, k.geos.cylinderLow, k.mats.shoesDark, 0, 0.28, 0, 0.30, 0.32, 0.05);
        k.addMesh(headPivot, k.geos.box, k.mats.shoesDark, 0, 0.37, 0, 0.26, 0.14, 0.24);
        k.addMesh(headPivot, k.geos.cylinderLow, k.mats.gold, 0, 0.37, 0, 0.02, 0.02, 0.44, 0, 0, 1.57);

        // Red Taoist talisman on chest
        k.addMesh(body, k.geos.box, k.mats.talismanRed, 0, 0.74, 0.23, 0.12, 0.20, 0.02);
        k.addMesh(body, k.geos.box, k.mats.talismanYellow, 0, 0.75, 0.242, 0.03, 0.12, 0.01);

        // Horsetail whisk (Phất trần) in right hand
        if (arms[1]) {
          var whiskPivot = k.addPivot(arms[1], 0, -0.32, 0.06);
          k.addMesh(whiskPivot, k.geos.cylinderLow, k.mats.gold, 0, 0.10, 0, 0.018, 0.018, 0.28);
          k.addMesh(whiskPivot, k.geos.cone, k.mats.whiteCloth, 0, 0.34, 0, 0.07, 0.24, 0.07, Math.PI, 0, 0);
          arms[1].rotation.x = -0.55;
        }

      } else if (kind === 'monk') {
        // --- TU SĨ (MONK) ---
        if (female) {
          // Nun cowl / cloth cap
          k.addMesh(headPivot, k.geos.sphereLow, robeMat, 0, 0.18, -0.04, 0.34, 0.20, 0.31);
        } else {
          // Clean bald head with ordination marks (chấm giới hương)
          for (var dot = 0; dot < 3; dot++) {
            k.addMesh(headPivot, k.geos.sphereTiny, k.mats.shoesDark, 0, 0.26, 0.23 - dot * 0.06, 0.015, 0.015, 0.015);
          }
        }

        // Buddhist prayer beads (Chuỗi tràng hạt) looped across chest
        for (var b = 0; b < 8; b++) {
          var ang = (b / 7) * Math.PI;
          var bx = Math.cos(ang) * 0.20;
          var by = 0.86 - Math.sin(ang) * 0.20;
          var bz = 0.235;
          k.addMesh(body, k.geos.sphereTiny, k.mats.darkWood, bx, by, bz, 0.034, 0.034, 0.034);
        }
        // Gold tassel bead
        k.addMesh(body, k.geos.sphereTiny, k.mats.gold, 0, 0.65, 0.24, 0.04, 0.04, 0.04);
      }
    }

    var elapsed = 0;
    return {
      group: group,
      update: function (dt, moving, time) {
        elapsed = Number.isFinite(time) ? time : elapsed + (Number.isFinite(dt) ? Math.max(0, dt) : 0);

        // Leg & Arm swings when moving
        var swing = moving ? Math.sin(elapsed * 9) * 0.55 : Math.sin(elapsed * 2) * 0.025;
        arms.forEach(function (arm, idx) {
          if (kind === 'taoist' && idx === 1) {
            arm.rotation.x = -0.55 + swing * 0.3;
          } else {
            arm.rotation.x = swing * (idx ? -1 : 1);
          }
        });
        legs.forEach(function (leg, idx) {
          leg.rotation.x = swing * (idx ? 1 : -1);
        });

        // Breathing & Floating
        if (isGhost) {
          body.position.y = 0.07 + Math.sin(elapsed * 2.8) * 0.055;
          headPivot.rotation.z = Math.sin(elapsed * 2.2) * 0.03;
          floatWisps.forEach(function (w, i) {
            w.position.y = 1.05 + Math.sin(elapsed * 3.5 + i * 2) * 0.06;
          });
        } else {
          // Bouncing walk vs breathing idle
          body.position.y = moving ? Math.abs(Math.sin(elapsed * 9)) * 0.03 : Math.sin(elapsed * 2.2) * 0.01;
          headPivot.rotation.z = moving ? Math.sin(elapsed * 4.5) * 0.035 : Math.sin(elapsed * 1.5) * 0.015;
          headPivot.rotation.x = moving ? 0.02 : Math.sin(elapsed * 2.2) * 0.01;
        }

        // Blinking eyes: every 3.6s, eyes blink closed for 0.12s
        if (faceCtrl) {
          var cycle = (elapsed % 3.6);
          if (cycle > 3.48) {
            // eye closing
            faceCtrl.scaleY(0.08);
          } else {
            faceCtrl.scaleY(1.0);
          }
        }
      },
      setColors: function (colors) {
        colors = colors || {};
        if (colors.skin !== undefined) skinMat.color.set(colors.skin);
        if (colors.robe !== undefined) robeMat.color.set(colors.robe);
        if (colors.hair !== undefined) hairMat.color.set(colors.hair);
      }
    };
  };

  // NPC generator (Ngưu Đầu, Mã Diện, Diêm Vương, Mạnh Bà) - max 60 meshes each
  root.makeNPC = function (THREE, type) {
    if (['ox', 'horse', 'king', 'meng'].indexOf(type) < 0) {
      throw new Error('Unknown NPC type: ' + type);
    }

    var k = createKit(THREE);
    var group = new THREE.Group();
    group.name = 'npc-' + type;

    var body = k.addPivot(group, 0, 0, 0);

    // High quality themed materials
    var darkArmor = k.createMat('#27232f', { roughness: 0.6, metalness: 0.2 });
    var redArmor = k.createMat('#8b1c24', { roughness: 0.5, metalness: 0.25 });
    var blueArmor = k.createMat('#253d54', { roughness: 0.5, metalness: 0.3 });
    var goldTrim = k.createMat('#d4af37', { roughness: 0.35, metalness: 0.7 });
    var ivoryWhite = k.createMat('#f4ede1', { roughness: 0.4 });
    var oxBrown = k.createMat('#764d39', { roughness: 0.7 });
    var horseBrown = k.createMat('#936348', { roughness: 0.7 });
    var kingRed = k.createMat('#a81d22', { roughness: 0.6 });
    var kingFace = k.createMat('#b83236', { roughness: 0.65 });
    var throneWood = k.createMat('#441f27', { roughness: 0.75 });
    var mengSkin = k.createMat('#dcbda3', { roughness: 0.65 });
    var mengPurple = k.createMat('#6e4475', { roughness: 0.75 });
    var mengGreen = k.createMat('#4a8570', { roughness: 0.5 });

    var animatedParts = [];
    var smokePuffs = [];

    if (type === 'ox' || type === 'horse') {
      // --- NGƯU ĐẦU (OX) & MÃ DIỆN (HORSE) --- (Height ~2.22)
      var isOx = (type === 'ox');
      var mainArmor = isOx ? redArmor : blueArmor;
      var hideMat = isOx ? oxBrown : horseBrown;

      // Heavy boots and legs
      [-1, 1].forEach(function (side) {
        k.addMesh(body, k.geos.box, darkArmor, side * 0.18, 0.09, 0.05, 0.23, 0.18, 0.34);
        k.addMesh(body, k.geos.cylinderLow, mainArmor, side * 0.18, 0.42, 0, 0.13, 0.11, 0.52);

        // Arm and Pauldron (giáp vai tròn)
        var arm = k.addPivot(body, side * 0.44, 1.34, 0);
        k.addMesh(arm, k.geos.sphereLow, goldTrim, 0, 0.04, 0, 0.18, 0.18, 0.18);
        k.addMesh(arm, k.geos.cylinderLow, mainArmor, 0, -0.25, 0, 0.12, 0.09, 0.42);
        k.addMesh(arm, k.geos.sphereLow, hideMat, 0, -0.49, 0, 0.10, 0.11, 0.10);
        animatedParts.push(arm);
      });

      // Armored Torso with Golden Chest Emblem
      k.addMesh(body, k.geos.cylinder, mainArmor, 0, 1.0, 0, 0.36, 0.30, 0.68);
      k.addMesh(body, k.geos.box, goldTrim, 0, 1.04, 0.31, 0.18, 0.24, 0.04);
      k.addMesh(body, k.geos.box, darkArmor, 0, 0.73, 0, 0.42, 0.12, 0.38);

      // Head structure
      var headP = k.addPivot(body, 0, 1.74, 0);
      k.addMesh(headP, k.geos.sphereSmooth, hideMat, 0, 0, 0, isOx ? 0.34 : 0.26, 0.32, 0.28);
      // Snout
      k.addMesh(headP, k.geos.sphereSmooth, hideMat, 0, isOx ? -0.09 : -0.11, 0.26, isOx ? 0.28 : 0.19, isOx ? 0.16 : 0.26, 0.24);

      // Chibi face
      k.addChibiFace(headP, 0.05, 0.25, isOx ? 0.14 : 0.105, 0.035);

      // Ears & Horns
      [-1, 1].forEach(function (side) {
        var ear = k.addMesh(headP, k.geos.sphereLow, hideMat, side * 0.28, isOx ? 0.16 : 0.30, 0, 0.11, isOx ? 0.08 : 0.16, 0.06);
        ear.rotation.z = side * -0.38;

        if (isOx) {
          // Curved ivory ox horns
          var horn = k.addMesh(headP, k.geos.cone, ivoryWhite, side * 0.33, 0.30, 0, 0.085, 0.34, 0.085);
          horn.rotation.z = side * -0.72;
          horn.rotation.x = -0.15;
        }
      });

      if (isOx) {
        // Golden septum nose ring
        k.addMesh(headP, k.geos.torus, goldTrim, 0, -0.22, 0.38, 0.06, 0.06, 0.06, 0.4, 0, 0);
      } else {
        // Horse dark flowing mane
        k.addMesh(headP, k.geos.box, darkArmor, 0, 0.05, -0.23, 0.14, 0.65, 0.18);
        k.addMesh(headP, k.geos.box, darkArmor, 0, 0.30, 0, 0.13, 0.14, 0.32);
      }

      // Halberd / Trident Weapon held by side
      var weapon = k.addPivot(body, 0.62, 0, 0.12);
      k.addMesh(weapon, k.geos.cylinderLow, goldTrim, 0, 1.05, 0, 0.028, 0.028, 2.0);
      k.addMesh(weapon, k.geos.cone, ivoryWhite, 0, 2.12, 0, 0.07, 0.26, 0.07);
      if (isOx) {
        // Ox trident side prongs
        k.addMesh(weapon, k.geos.box, goldTrim, 0, 1.95, 0, 0.36, 0.05, 0.05);
        [-1, 1].forEach(function (side) {
          k.addMesh(weapon, k.geos.cone, ivoryWhite, side * 0.16, 2.05, 0, 0.045, 0.22, 0.045);
        });
      }

    } else if (type === 'king') {
      // --- DIÊM VƯƠNG (KING) --- (Height ~7.02)
      // Grand Throne
      k.addMesh(body, k.geos.box, throneWood, 0, 0.35, 0, 3.8, 0.70, 2.8);
      k.addMesh(body, k.geos.box, throneWood, 0, 3.7, -1.0, 3.8, 6.6, 0.50);

      // Throne Golden Pillars & Armrests
      [-1, 1].forEach(function (side) {
        k.addMesh(body, k.geos.box, goldTrim, side * 1.85, 3.7, -0.70, 0.14, 6.6, 0.15);
        k.addMesh(body, k.geos.box, throneWood, side * 1.55, 2.0, 0.15, 0.45, 0.45, 2.4);
        k.addMesh(body, k.geos.sphereLow, goldTrim, side * 1.55, 2.05, 1.32, 0.28, 0.28, 0.28);

        // Kneeling / Seated Robe Folds
        k.addMesh(body, k.geos.box, darkArmor, side * 0.55, 0.90, 0.97, 0.65, 0.38, 0.90);
        k.addMesh(body, k.geos.box, kingRed, side * 0.54, 1.45, 0.55, 0.85, 0.86, 1.50);
        k.addMesh(body, k.geos.box, goldTrim, side * 0.54, 1.05, 1.32, 0.85, 0.12, 0.05);

        // Flowing Imperial Sleeves
        var sleeve = k.addPivot(body, side * 1.0, 3.25, 0.0);
        k.addMesh(sleeve, k.geos.sphereSmooth, kingRed, side * 0.12, -0.40, 0.36, 0.42, 0.62, 0.46);
        k.addMesh(sleeve, k.geos.sphereLow, kingRed, side * 0.12, -0.65, 0.77, 0.26, 0.24, 0.24);
        animatedParts.push(sleeve);
      });

      // Majestic Robed Body
      k.addMesh(body, k.geos.cylinder, kingRed, 0, 2.68, 0, 0.88, 1.18, 2.04);
      k.addMesh(body, k.geos.box, goldTrim, 0, 2.05, 0.98, 1.90, 0.16, 0.08);
      k.addMesh(body, k.geos.box, goldTrim, 0, 2.93, 0.86, 0.14, 1.42, 0.06);

      // Red Sovereign Head & Facial Features
      k.addMesh(body, k.geos.sphereSmooth, kingFace, 0, 4.32, 0, 0.78, 0.79, 0.66);
      k.addChibiFace(body, 4.44, 0.63, 0.27, 0.068);

      // Majestic Flowing Black Beard
      k.addMesh(body, k.geos.cone, darkArmor, 0, 3.63, 0.49, 0.44, 0.92, 0.30, 0.15, 0, 0);

      // Mian Guan (Mũ Bình Thiên / Hoàng Đế Diêm La)
      k.addMesh(body, k.geos.box, darkArmor, 0, 5.05, 0, 1.30, 0.45, 1.0);
      k.addMesh(body, k.geos.box, goldTrim, 0, 5.30, 0, 2.0, 0.12, 1.5);

      // Imperial Pearl Strands (Chuỗi ngọc lưu) hanging from crown
      for (var p = 0; p < 5; p++) {
        var px = (p - 2) * 0.34;
        k.addMesh(body, k.geos.cylinderLow, goldTrim, px, 4.99, 0.73, 0.014, 0.014, 0.52);
        k.addMesh(body, k.geos.sphereLow, ivoryWhite, px, 4.70, 0.73, 0.058, 0.072, 0.058);
      }

      // Giant Judge's Calligraphy Brush (Bút Phán Quan)
      var pen = k.addPivot(body, 1.15, 2.7, 1.0);
      pen.rotation.z = -0.28;
      k.addMesh(pen, k.geos.cylinderLow, goldTrim, 0, 0.24, 0, 0.046, 0.046, 1.20);
      k.addMesh(pen, k.geos.cone, darkArmor, 0, -0.48, 0, 0.092, 0.26, 0.092);

    } else {
      // --- MẠNH BÀ (MENG PO) --- (Height ~1.50)
      // Kindly elderly face & Violet-plum robes
      [-1, 1].forEach(function (side) {
        k.addMesh(body, k.geos.box, darkArmor, side * 0.12, 0.06, 0.04, 0.18, 0.12, 0.25);
        // Arms holding soup bowl forward
        var arm = k.addPivot(body, side * 0.28, 0.82, 0);
        arm.rotation.x = -0.95;
        arm.rotation.y = side * -0.20;
        k.addMesh(arm, k.geos.cylinderLow, mengPurple, 0, -0.18, 0, 0.11, 0.08, 0.36);
        k.addMesh(arm, k.geos.sphereLow, mengSkin, 0, -0.37, 0, 0.075, 0.08, 0.075);
      });

      // Flowing robe body
      k.addMesh(body, k.geos.cylinder, mengPurple, 0, 0.49, 0, 0.21, 0.33, 0.76);
      k.addMesh(body, k.geos.box, mengGreen, 0, 0.62, 0.22, 0.26, 0.30, 0.04);

      // Kindly head with silver hair bun
      var mengHead = k.addPivot(body, 0, 1.13, 0);
      k.addMesh(mengHead, k.geos.sphereSmooth, mengSkin, 0, 0, 0, 0.28, 0.28, 0.25);
      // Silver hair
      k.addMesh(mengHead, k.geos.sphereLow, ivoryWhite, 0, 0.15, -0.06, 0.285, 0.17, 0.23);
      k.addMesh(mengHead, k.geos.sphereLow, ivoryWhite, 0, 0.24, -0.21, 0.12, 0.12, 0.12);
      // Jade hairpin
      k.addMesh(mengHead, k.geos.cylinderLow, mengGreen, 0, 0.24, -0.21, 0.015, 0.015, 0.32, 0, 0, 1.57);

      // Sweet smiling chibi face
      k.addChibiFace(mengHead, 0.02, 0.24, 0.095, 0.026);

      // Meng Po's Bowl of Soup (Bát Canh Lãng Quên)
      k.addMesh(body, k.geos.cylinderLow, goldTrim, 0, 0.71, 0.44, 0.24, 0.13, 0.17);
      // Glowing emerald soup broth
      k.addMesh(body, k.geos.cylinderLow, mengGreen, 0, 0.80, 0.44, 0.215, 0.215, 0.014);

      // Rising steam / mist puffs
      var mistMat = k.createMat('#e9e1f5', {
        roughness: 0.9,
        transparent: true,
        opacity: 0.32
      });
      mistMat.depthWrite = false;

      for (var j = 0; j < 3; j++) {
        var puff = k.addMesh(body, k.geos.sphereLow, mistMat, (j - 1) * 0.08, 0.95 + j * 0.12, 0.44, 0.045, 0.09, 0.045);
        smokePuffs.push(puff);
      }
    }

    var elapsed = 0;
    return {
      group: group,
      update: function (dt, time) {
        elapsed = Number.isFinite(time) ? time : elapsed + (Number.isFinite(dt) ? Math.max(0, dt) : 0);

        // Subtle dignified breathing
        body.scale.y = 1 + Math.sin(elapsed * 1.8) * 0.006;
        animatedParts.forEach(function (part, idx) {
          part.rotation.x = Math.sin(elapsed * 1.6 + idx) * 0.035;
        });

        // Rising steam animation for Meng Po's soup
        smokePuffs.forEach(function (puff, idx) {
          var phase = ((elapsed * 0.45 + idx / 3) % 1 + 1) % 1;
          puff.position.y = 0.86 + phase * 0.55;
          puff.position.x = Math.sin(elapsed * 2 + idx) * 0.06;
          puff.scale.set(0.035 + phase * 0.035, 0.065 + phase * 0.06, 0.035 + phase * 0.035);
        });
      }
    };
  };

  // Self-test function verifying requirements:
  // - heights within target ranges
  // - mesh counts under budgets (<35 for players, <60 for NPCs)
  // - finite transforms and vertices
  // - recoloring
  // - animation updates
  root.__avatarSelfTest = function (THREE) {
    var results = [];
    var resources = new Set();

    function assert(condition, message) {
      if (!condition) throw new Error('Avatar self-test failed: ' + message);
    }

    function inspect(model, label, minH, maxH, meshLimit) {
      var meshes = 0;
      var triCount = 0;
      model.group.updateMatrixWorld(true);

      model.group.traverse(function (obj) {
        assert(obj.matrixWorld.elements.every(Number.isFinite), label + ' has invalid transform');
        if (!obj.isMesh) return;
        meshes++;
        resources.add(obj.geometry);
        resources.add(obj.material);

        assert(obj.material.isMeshStandardMaterial, label + ' material must be MeshStandardMaterial');
        assert(obj.geometry.attributes.position.array.every(Number.isFinite), label + ' vertex coordinates are finite');

        if (obj.geometry.index) {
          triCount += obj.geometry.index.count / 3;
        } else if (obj.geometry.attributes.position) {
          triCount += obj.geometry.attributes.position.count / 3;
        }
      });

      var bounds = new THREE.Box3().setFromObject(model.group);
      var height = bounds.max.y - bounds.min.y;

      assert(height >= minH && height <= maxH, label + ' height ' + height.toFixed(2) + ' outside range [' + minH + ', ' + maxH + ']');
      assert(Math.abs(bounds.min.y) < 0.2, label + ' origin at feet (y=0)');
      if (meshLimit) {
        assert(meshes <= meshLimit, label + ' mesh count ' + meshes + ' exceeds ' + meshLimit);
      }

      results.push({
        model: label,
        meshes: meshes,
        triangles: Math.round(triCount),
        height: Number(height.toFixed(2))
      });
    }

    try {
      // Test all player avatars (4 kinds x 2 genders)
      ['ghost', 'tourist', 'taoist', 'monk'].forEach(function (kind) {
        ['nam', 'nu'].forEach(function (gender) {
          var a = root.makeAvatar(THREE, { kind: kind, gender: gender });
          inspect(a, kind + '-' + gender, 1.3, 1.75, 35);

          // Test recoloring
          a.setColors({ skin: '#123456', robe: '#abcdef', hair: '#654321' });
          var recolored = false;
          a.group.traverse(function (o) {
            if (o.isMesh && o.material.color && o.material.color.getHexString() === 'abcdef') {
              recolored = true;
            }
          });
          assert(recolored, kind + ' robe recoloring failed');

          // Test animation updates
          a.group.position.set(2, 0, 5);
          var beforeY = a.group.children[0].position.y;
          a.update(1 / 60, true, 0.4);
          assert(a.group.children[0].position.y !== beforeY, kind + ' moving animation failed');
          a.update(1 / 60, false, 1.2);
          a.update(1 / 60, true);
          assert(a.group.position.x === 2 && a.group.position.z === 5, kind + ' root position preserved');

          inspect(a, kind + '-' + gender + '-animated', 1.3, 1.8, 35);
        });
      });

      // Test all NPCs
      ['ox', 'horse', 'king', 'meng'].forEach(function (type) {
        var npc = root.makeNPC(THREE, type);
        var minH = (type === 'king') ? 6.8 : ((type === 'meng') ? 1.4 : 2.05);
        var maxH = (type === 'king') ? 7.2 : ((type === 'meng') ? 1.65 : 2.35);
        inspect(npc, type, minH, maxH, 60);

        npc.update(1 / 60, 0.5);
        npc.update(1 / 60);
        inspect(npc, type + '-animated', minH, maxH, 60);
      });

      return {
        ok: true,
        avatars: 8,
        npcs: 4,
        checks: results
      };
    } finally {
      // Do not dispose shared geometries between real game frames, but clean up temporary resources in self-test
    }
  };

})(typeof window !== 'undefined' ? window : globalThis);
