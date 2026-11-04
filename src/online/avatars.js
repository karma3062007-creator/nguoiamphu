(function (root) {
  'use strict';

  // All dimensions are in world units; faces and held objects point toward +Z.
  function kit(THREE) {
    function material(color, opacity) {
      return new THREE.MeshStandardMaterial({ color: color, flatShading: true,
        roughness: 0.85, transparent: opacity !== undefined, opacity: opacity === undefined ? 1 : opacity });
    }
    function mesh(parent, geometry, mat, x, y, z) {
      var object = new THREE.Mesh(geometry, mat);
      object.position.set(x || 0, y || 0, z || 0);
      object.castShadow = true;
      object.receiveShadow = true;
      parent.add(object);
      return object;
    }
    function box(p, m, x, y, z, w, h, d) {
      return mesh(p, new THREE.BoxGeometry(w, h, d), m, x, y, z);
    }
    function ball(p, m, x, y, z, rx, ry, rz) {
      var o = mesh(p, new THREE.SphereGeometry(1, 8, 6), m, x, y, z);
      o.scale.set(rx, ry, rz);
      return o;
    }
    function cylinder(p, m, x, y, z, top, bottom, height) {
      return mesh(p, new THREE.CylinderGeometry(top, bottom, height, 8), m, x, y, z);
    }
    function pivot(p, x, y, z) {
      var o = new THREE.Group();
      o.position.set(x, y, z);
      p.add(o);
      return o;
    }
    function face(p, dark, y, z, spacing, size) {
      ball(p, dark, -spacing, y, z, size, size * 1.3, size * 0.6);
      ball(p, dark, spacing, y, z, size, size * 1.3, size * 0.6);
      box(p, dark, 0, y - size * 3, z, size * 1.8, size * 0.45, size * 0.5);
    }
    return { material: material, box: box, ball: ball, cylinder: cylinder, pivot: pivot, face: face };
  }

  root.makeAvatar = function (THREE, opts) {
    opts = opts || {};
    var kind = opts.kind || 'tourist';
    var female = opts.gender === 'nu';
    if (['ghost', 'tourist', 'taoist', 'monk'].indexOf(kind) < 0) throw new Error('Unknown avatar kind: ' + kind);
    var k = kit(THREE), group = new THREE.Group();
    group.name = 'avatar-' + kind + '-' + (female ? 'nu' : 'nam');
    var body = k.pivot(group, 0, 0, 0);
    var skin = k.material(opts.skin || '#edbd96');
    var robe = k.material(opts.robe || (kind === 'ghost' ? '#dcefee' : '#638ab4'), kind === 'ghost' ? 0.78 : undefined);
    var hair = k.material(opts.hair || '#30272c');
    var dark = k.material('#262333'), gold = k.material('#e8ba45');
    var shoes = k.material('#463e49'), arms = [], legs = [];
    var headY = kind === 'ghost' ? 1.18 : 1.16;

    if (kind === 'ghost') {
      k.ball(body, robe, 0, headY, 0, 0.34, 0.32, 0.30);
      k.cylinder(body, robe, 0, 0.73, 0, 0.27, 0.39, 0.60);
      // An inverted cone gives the sheet a pointed floating tail.
      k.cylinder(body, robe, 0, 0.275, 0, 0.39, 0, 0.31);
      k.face(body, dark, 1.20, 0.287, 0.105, 0.036);
    } else {
      k.ball(body, skin, 0, headY, 0, 0.32, 0.32, 0.285);
      k.face(body, dark, headY + 0.025, 0.274, 0.105, 0.027);
      k.cylinder(body, robe, 0, 0.66, 0, 0.22, kind === 'tourist' ? 0.25 : 0.34, 0.56);
      if (kind !== 'monk' || female) {
        k.ball(body, hair, 0, 1.32, -0.055, 0.325, 0.18, 0.25);
        if (female) {
          k.box(body, hair, 0, 1.08, -0.21, 0.48, 0.49, 0.16);
          k.ball(body, hair, 0, 1.47, -0.18, 0.13, 0.12, 0.12);
        }
      }
      [-1, 1].forEach(function (side) {
        var leg = k.pivot(body, side * 0.115, 0.38, 0);
        k.cylinder(leg, robe, 0, -0.14, 0, 0.075, 0.065, 0.28);
        k.box(leg, shoes, 0, -0.33, 0.035, 0.15, 0.10, 0.23);
        legs.push(leg);
      });
    }
    [-1, 1].forEach(function (side) {
      var arm = k.pivot(body, side * 0.29, 0.85, 0);
      k.cylinder(arm, robe, 0, -0.14, 0, 0.095, 0.075, 0.28);
      k.ball(arm, kind === 'ghost' ? robe : skin, 0, -0.31, 0, 0.075, 0.08, 0.075);
      arm.rotation.z = side * 0.12;
      arms.push(arm);
    });
    if (kind === 'tourist') {
      k.cylinder(body, gold, 0, 1.43, 0, 0.45, 0.45, 0.045);
      k.cylinder(body, gold, 0, 1.50, 0, 0.235, 0.27, 0.14);
      k.box(body, shoes, 0, 0.69, -0.26, 0.35, 0.39, 0.18);
      [-1, 1].forEach(function (side) {
        k.box(body, shoes, side * 0.16, 0.76, 0.20, 0.035, 0.30, 0.035);
      });
    } else if (kind === 'taoist') {
      k.cylinder(body, dark, 0, 1.44, 0, 0.32, 0.34, 0.05);
      k.box(body, dark, 0, 1.52, 0, 0.30, 0.13, 0.26);
      k.box(body, gold, 0, 1.53, 0.135, 0.065, 0.07, 0.015);
      k.box(body, k.material('#bf343b'), 0, 0.76, 0.232, 0.13, 0.23, 0.025);
      k.box(body, gold, 0, 0.77, 0.249, 0.025, 0.15, 0.01);
      k.box(body, gold, 0, 0.79, 0.250, 0.085, 0.025, 0.01);
    } else if (kind === 'monk') {
      if (female) k.ball(body, robe, 0, 1.40, -0.015, 0.34, 0.19, 0.30);
      for (var i = 0; i < 9; i++) {
        var a = i / 8 * Math.PI;
        k.ball(body, gold, Math.cos(a) * 0.19, 0.85 - Math.sin(a) * 0.18, 0.23, 0.034, 0.034, 0.034);
      }
    }
    var elapsed = 0;
    return {
      group: group,
      update: function (dt, moving, time) {
        elapsed = Number.isFinite(time) ? time : elapsed + (Number.isFinite(dt) ? Math.max(0, dt) : 0);
        var swing = moving ? Math.sin(elapsed * 9) * 0.55 : Math.sin(elapsed * 2) * 0.025;
        arms.forEach(function (arm, index) { arm.rotation.x = swing * (index ? -1 : 1); });
        legs.forEach(function (leg, index) { leg.rotation.x = swing * (index ? 1 : -1); });
        body.position.y = kind === 'ghost' ? 0.055 + Math.sin(elapsed * 2.5) * 0.045 :
          (moving ? Math.abs(Math.sin(elapsed * 9)) * 0.025 : Math.sin(elapsed * 2) * 0.008);
      },
      setColors: function (colors) {
        colors = colors || {};
        if (colors.skin !== undefined) skin.color.set(colors.skin);
        if (colors.robe !== undefined) robe.color.set(colors.robe);
        if (colors.hair !== undefined) hair.color.set(colors.hair);
      }
    };
  };

  root.makeNPC = function (THREE, type) {
    if (['ox', 'horse', 'king', 'meng'].indexOf(type) < 0) throw new Error('Unknown NPC type: ' + type);
    var k = kit(THREE), group = new THREE.Group();
    group.name = 'npc-' + type;
    var body = k.pivot(group, 0, 0, 0);
    var dark = k.material('#24212b'), gold = k.material('#dfb24c');
    var red = k.material('#84333d'), white = k.material('#eee5d7');
    var animated = [], smoke = [];

    if (type === 'ox' || type === 'horse') {
      var ox = type === 'ox', armor = ox ? red : k.material('#263e4c');
      var hide = k.material(ox ? '#85604c' : '#aa795a');
      [-1, 1].forEach(function (side) {
        k.box(body, dark, side * 0.17, 0.09, 0.06, 0.24, 0.18, 0.36);
        k.cylinder(body, armor, side * 0.17, 0.43, 0, 0.12, 0.10, 0.54);
        var arm = k.pivot(body, side * 0.43, 1.36, 0);
        k.ball(arm, armor, 0, 0, 0, 0.19, 0.17, 0.18);
        k.cylinder(arm, armor, 0, -0.25, 0, 0.12, 0.09, 0.43);
        k.ball(arm, hide, 0, -0.49, 0, 0.10, 0.11, 0.10);
        animated.push(arm);
      });
      k.cylinder(body, armor, 0, 1.01, 0, 0.36, 0.30, 0.67);
      k.box(body, gold, 0, 1.04, 0.31, 0.12, 0.28, 0.035);
      k.ball(body, hide, 0, 1.75, 0, ox ? 0.35 : 0.25, 0.31, 0.26);
      k.ball(body, hide, 0, ox ? 1.64 : 1.62, 0.26, ox ? 0.29 : 0.19, ox ? 0.15 : 0.25, 0.23);
      k.face(body, dark, 1.80, 0.245, ox ? 0.14 : 0.105, 0.033);
      [-1, 1].forEach(function (side) {
        var ear = k.ball(body, hide, side * 0.27, ox ? 1.90 : 2.04, 0, 0.10, ox ? 0.08 : 0.15, 0.06);
        ear.rotation.z = side * -0.35;
        if (ox) {
          var horn = k.cylinder(body, white, side * 0.32, 2.04, 0, 0, 0.10, 0.31);
          horn.rotation.z = side * -0.55;
        }
      });
      if (!ox) {
        k.box(body, dark, 0, 1.80, -0.23, 0.14, 0.65, 0.16);
        k.box(body, dark, 0, 2.045, 0, 0.14, 0.12, 0.33);
      }
      var weapon = k.pivot(body, 0.60, 0, 0.12);
      k.cylinder(weapon, gold, 0, 1.04, 0, 0.027, 0.027, 1.96);
      k.cylinder(weapon, white, 0, 2.09, 0, 0, 0.065, 0.22);
      if (ox) {
        k.box(weapon, gold, 0, 1.94, 0, 0.36, 0.045, 0.05);
        [-1, 1].forEach(function (side) {
          k.cylinder(weapon, gold, side * 0.16, 2.025, 0, 0, 0.04, 0.21);
        });
      }
    } else if (type === 'king') {
      var throne = k.material('#522d3b');
      k.box(body, throne, 0, 0.35, 0, 3.8, 0.70, 2.8);
      k.box(body, throne, 0, 3.7, -1.0, 3.8, 6.6, 0.50);
      [-1, 1].forEach(function (side) {
        k.box(body, gold, side * 1.85, 3.7, -0.70, 0.14, 6.6, 0.15);
        k.box(body, throne, side * 1.55, 2.0, 0.15, 0.45, 0.45, 2.4);
        k.ball(body, gold, side * 1.55, 2.05, 1.32, 0.28, 0.28, 0.28);
        k.box(body, dark, side * 0.55, 0.90, 0.97, 0.65, 0.38, 0.90);
        k.box(body, red, side * 0.54, 1.45, 0.55, 0.85, 0.86, 1.50);
        k.box(body, gold, side * 0.54, 1.05, 1.32, 0.85, 0.12, 0.05);
        var sleeve = k.pivot(body, side * 1.0, 3.25, 0.0);
        k.ball(sleeve, red, side * 0.12, -0.40, 0.36, 0.40, 0.60, 0.45);
        k.ball(sleeve, red, side * 0.12, -0.65, 0.77, 0.25, 0.23, 0.24);
        animated.push(sleeve);
      });
      k.cylinder(body, red, 0, 2.68, 0, 0.86, 1.16, 2.04);
      k.box(body, gold, 0, 2.05, 0.98, 1.90, 0.16, 0.08);
      k.box(body, gold, 0, 2.93, 0.86, 0.13, 1.42, 0.06);
      k.ball(body, k.material('#ba4b43'), 0, 4.32, 0, 0.78, 0.79, 0.65);
      k.face(body, dark, 4.43, 0.62, 0.27, 0.065);
      k.cylinder(body, dark, 0, 3.63, 0.49, 0.43, 0, 0.90);
      k.box(body, dark, 0, 5.04, 0, 1.30, 0.45, 1.0);
      k.box(body, gold, 0, 5.30, 0, 2.0, 0.13, 1.5);
      for (var i = 0; i < 5; i++) {
        k.cylinder(body, gold, (i - 2) * 0.34, 4.99, 0.73, 0.014, 0.014, 0.52);
        k.ball(body, white, (i - 2) * 0.34, 4.70, 0.73, 0.055, 0.07, 0.055);
      }
      var pen = k.pivot(body, 1.15, 2.7, 1.0);
      pen.rotation.z = -0.28;
      k.cylinder(pen, gold, 0, 0.24, 0, 0.045, 0.045, 1.20);
      k.cylinder(pen, dark, 0, -0.48, 0, 0.09, 0, 0.25);
    } else {
      var purple = k.material('#80518e'), skin = k.material('#d7b99f');
      [-1, 1].forEach(function (side) {
        k.box(body, dark, side * 0.12, 0.06, 0.04, 0.18, 0.12, 0.25);
        var arm = k.pivot(body, side * 0.28, 0.82, 0);
        arm.rotation.x = -0.95;
        k.cylinder(arm, purple, 0, -0.18, 0, 0.11, 0.08, 0.36);
        k.ball(arm, skin, 0, -0.37, 0, 0.075, 0.08, 0.075);
      });
      k.cylinder(body, purple, 0, 0.49, 0, 0.20, 0.32, 0.76);
      k.ball(body, skin, 0, 1.13, 0, 0.28, 0.28, 0.25);
      k.ball(body, white, 0, 1.29, -0.06, 0.285, 0.16, 0.23);
      k.ball(body, white, 0, 1.38, -0.21, 0.12, 0.12, 0.12);
      k.face(body, dark, 1.15, 0.24, 0.095, 0.023);
      k.cylinder(body, gold, 0, 0.71, 0.44, 0.24, 0.13, 0.17);
      k.cylinder(body, k.material('#afd8be'), 0, 0.80, 0.44, 0.215, 0.215, 0.012);
      var mist = k.material('#eee8f4', 0.28);
      mist.depthWrite = false;
      for (var j = 0; j < 3; j++) {
        smoke.push(k.ball(body, mist, (j - 1) * 0.08, 0.95 + j * 0.12, 0.44, 0.045, 0.09, 0.045));
      }
    }
    var elapsed = 0;
    return { group: group, update: function (dt, time) {
      elapsed = Number.isFinite(time) ? time : elapsed + (Number.isFinite(dt) ? Math.max(0, dt) : 0);
      // Animate the model inside its root so scene placement is never overwritten.
      body.scale.y = 1 + Math.sin(elapsed * 1.8) * 0.006;
      animated.forEach(function (arm, index) { arm.rotation.x = Math.sin(elapsed * 1.6 + index) * 0.035; });
      smoke.forEach(function (puff, index) {
        var phase = ((elapsed * 0.45 + index / 3) % 1 + 1) % 1;
        puff.position.y = 0.86 + phase * 0.55;
        puff.position.x = Math.sin(elapsed * 2 + index) * 0.06;
        puff.scale.set(0.035 + phase * 0.035, 0.065 + phase * 0.06, 0.035 + phase * 0.035);
      });
    } };
  };

  root.__avatarSelfTest = function (THREE) {
    var results = [], resources = new Set();
    function assert(ok, message) { if (!ok) throw new Error('Avatar self-test: ' + message); }
    function inspect(model, label, minHeight, maxHeight, limit) {
      var meshes = 0;
      model.group.updateMatrixWorld(true);
      model.group.traverse(function (o) {
        assert(o.matrixWorld.elements.every(Number.isFinite), label + ' has a non-finite transform');
        if (!o.isMesh) return;
        meshes++;
        resources.add(o.geometry);
        resources.add(o.material);
        assert(o.material.isMeshStandardMaterial && o.material.flatShading, label + ' material');
        assert(o.geometry.attributes.position.array.every(Number.isFinite), label + ' geometry');
      });
      var bounds = new THREE.Box3().setFromObject(model.group);
      var height = bounds.max.y - bounds.min.y;
      assert(height >= minHeight && height <= maxHeight, label + ' height ' + height);
      assert(Math.abs(bounds.min.y) < 0.2, label + ' feet origin');
      if (limit) assert(meshes <= limit, label + ' mesh count ' + meshes);
      results.push({ model: label, meshes: meshes, height: Number(height.toFixed(2)) });
    }
    try {
      ['ghost', 'tourist', 'taoist', 'monk'].forEach(function (kind) {
        ['nam', 'nu'].forEach(function (gender) {
          var a = root.makeAvatar(THREE, { kind: kind, gender: gender });
          inspect(a, kind + '-' + gender, 1.3, 1.75, 40);
          a.setColors({ skin: '#123456', robe: '#abcdef', hair: '#654321' });
          var recolored = false;
          a.group.traverse(function (o) { if (o.isMesh && o.material.color.getHexString() === 'abcdef') recolored = true; });
          assert(recolored, kind + ' robe recoloring');
          a.group.position.set(3, 0, 4);
          var before = a.group.children[0].position.y;
          a.update(1 / 60, true, 0.4);
          assert(a.group.children[0].position.y !== before, kind + ' animation');
          a.update(1 / 60, false, 1.2);
          a.update(1 / 60, true);
          assert(a.group.position.x === 3 && a.group.position.z === 4, kind + ' root placement');
          inspect(a, kind + '-' + gender + '-animated', 1.3, 1.8, 40);
        });
      });
      ['ox', 'horse', 'king', 'meng'].forEach(function (type) {
        var npc = root.makeNPC(THREE, type);
        var min = type === 'king' ? 6.8 : type === 'meng' ? 1.4 : 2.05;
        var max = type === 'king' ? 7.2 : type === 'meng' ? 1.65 : 2.35;
        inspect(npc, type, min, max);
        npc.update(1 / 60, 0.5);
        npc.update(1 / 60);
        inspect(npc, type + '-animated', min, max);
      });
      return { ok: true, avatars: 8, npcs: 4, checks: results };
    } finally {
      resources.forEach(function (resource) { resource.dispose(); });
    }
  };
})(window);
