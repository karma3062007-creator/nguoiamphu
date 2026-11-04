(function (root) {
  'use strict';

  // Three r128. Metres, front = +Z; resources are shared per Three runtime.
  var caches = new WeakMap(), TAU = Math.PI * 2;
  var red = '#b52e35', gold = '#efbd59', dark = '#302937', cream = '#fff0cb';
  function kit(T) {
    if (caches.has(T)) return caches.get(T);
    var triangle = new T.BufferGeometry();
    triangle.setAttribute('position', new T.Float32BufferAttribute([-0.5, 0, 0, 0, -1, 0, 0.5, 0, 0], 3));
    triangle.computeVertexNormals();
    var geo = {
      box: new T.BoxGeometry(1, 1, 1), ball: new T.SphereGeometry(1, 8, 6),
      cyl: new T.CylinderGeometry(1, 1, 1, 8), cone: new T.ConeGeometry(1, 1, 8),
      disc: new T.CircleGeometry(1, 32), plane: new T.PlaneGeometry(1, 1), triangle: triangle
    }, mats = Object.create(null);
    function mat(color, glow) {
      var key = color + ':' + !!glow;
      if (!mats[key]) mats[key] = glow ? new T.MeshBasicMaterial({ color: color }) :
        new T.MeshStandardMaterial({ color: color, roughness: 0.7,
          metalness: color === gold ? 0.45 : 0.08, flatShading: true });
      return mats[key];
    }
    function add(p, shape, color, x, y, z, w, h, d) {
      var m = new T.Mesh(geo[shape], typeof color === 'string' ? mat(color) : color);
      m.position.set(x, y, z); m.scale.set(w, h, d);
      m.castShadow = !m.material.isMeshBasicMaterial; m.receiveShadow = m.castShadow;
      p.add(m); return m;
    }
    function pivot(p, x, y, z) {
      var g = new T.Group(); g.position.set(x, y, z); p.add(g); return g;
    }
    function paint(kind) {
      if (mats[kind]) return mats[kind];
      var c = typeof document !== 'undefined' ? document.createElement('canvas') : null;
      var ctx = c && c.getContext ? c.getContext('2d') : null;
      if (!ctx) return mat(kind === 'rings' ? cream : red);
      c.width = kind === 'sign' ? 1024 : 512;
      c.height = kind === 'sign' ? 192 : 512;
      if (kind === 'rings') {
        [cream, red, cream, red, gold].forEach(function (color, i) {
          ctx.fillStyle = color; ctx.beginPath();
          ctx.arc(256, 256, 256 - i * 50, 0, TAU); ctx.fill();
        });
        ctx.strokeStyle = dark; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(256, 10); ctx.lineTo(256, 54); ctx.stroke();
      } else if (kind === 'sign') {
        ctx.fillStyle = red; ctx.fillRect(0, 0, 1024, 192);
        ctx.strokeStyle = gold; ctx.lineWidth = 10; ctx.strokeRect(8, 8, 1008, 176);
        ctx.fillStyle = cream; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = 'bold 64px Arial, sans-serif'; ctx.fillText('BẮN SÚNG TRÚNG TÂM', 512, 72, 960);
        ctx.fillStyle = gold; ctx.font = '30px Arial, sans-serif';
        ctx.fillText('Trúng hồng tâm, tích công đức', 512, 139, 960);
      } else {
        ctx.fillStyle = dark; ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = '#58404a'; ctx.lineWidth = 3;
        for (var y = 0; y < 576; y += 64) {
          for (var x = 0; x < 576; x += 64) {
            ctx.beginPath(); ctx.moveTo(x, y - 22); ctx.lineTo(x + 22, y);
            ctx.lineTo(x, y + 22); ctx.lineTo(x - 22, y); ctx.closePath(); ctx.stroke();
          }
        }
      }
      var tex = new T.CanvasTexture(c); tex.encoding = T.sRGBEncoding;
      mats[kind] = new T.MeshBasicMaterial({ map: tex }); return mats[kind];
    }
    var k = { geo: geo, mat: mat, add: add, pivot: pivot, paint: paint };
    caches.set(T, k); return k;
  }

  root.makeShootingBooth = function (T) {
    var k = kit(T), g = new T.Group(), targets = [], states = [], bulbs = [], solids = [];
    var clock = 0, travel = 0, flashLeft = 0, recoilLeft = 0;
    g.name = 'shooting-booth';
    k.add(g, 'box', dark, 0, 0.06, -0.25, 7, 0.12, 4.5);
    k.add(g, 'box', red, 0, 0.51, 1.5, 6.8, 1.02, 0.7);
    k.add(g, 'box', '#794439', 0, 1.08, 1.5, 7, 0.16, 0.95);
    k.add(g, 'box', gold, 0, 0.85, 1.86, 6.8, 0.07, 0.035);
    // Overlapping collision circles cover the counter and the back wall.
    for (var i = 0; i < 9; i++) {
      solids.push({ x: -3.1 + i * 0.775, z: 1.5, r: 0.57 });
      solids.push({ x: -3.1 + i * 0.775, z: -2.27, r: 0.5 });
    }
    [-1, 1].forEach(function (s) {
      [-2.2, 1.65].forEach(function (z) {
        k.add(g, 'box', red, s * 3.3, 1.9, z, 0.16, 3.8, 0.16);
        solids.push({ x: s * 3.3, z: z, r: 0.26 });
      });
      // Gold bottle and red lantern prizes, outside the target lanes.
      k.add(g, 'ball', gold, s * 2.96, 1.8, -1.95, 0.18, 0.27, 0.17);
      k.add(g, 'cyl', gold, s * 2.96, 2.1, -1.95, 0.08, 0.18, 0.08);
      k.add(g, 'ball', red, s * 2.98, 2.85, -1.95, 0.21, 0.29, 0.18);
      k.add(g, 'cone', gold, s * 2.98, 2.47, -1.95, 0.05, 0.22, 0.05);
    });
    k.add(g, 'plane', k.paint('wall'), 0, 1.94, -2.34, 6.55, 3.62, 1);
    for (i = 0; i < 3; i++) {
      k.add(g, 'box', gold, 0, 0.77 + i * 0.93, -1.91, 5.55, 0.06, 0.19);
    }
    for (i = 0; i < 10; i++) {
      var color = i % 2 ? gold : red, x = -3.24 + i * 0.72;
      k.add(g, 'box', color, x, 3.83, -0.25, 0.72, 0.15, 4.5);
      k.add(g, 'triangle', color, x, 3.76, 2.01, 0.72, 0.25, 1);
    }
    k.add(g, 'plane', k.paint('sign'), 0, 4.12, 1.99, 5.7, 0.88, 1);
    for (i = 0; i < 16; i++) {
      // String of bulbs continues around both side edges of the canopy.
      var bx = i < 10 ? -3.24 + i * 0.72 : (i < 13 ? -3.5 : 3.5);
      var bz = i < 10 ? 2.04 : 0.9 - (i % 3) * 1.35;
      bulbs.push(k.add(g, 'ball', k.mat(i % 2 ? cream : gold, true), bx, 3.73, bz, 0.06, 0.06, 0.06));
    }
    function target(kind, x, y, r, points) {
      var obj = k.pivot(g, x, y, -1.72);
      obj.name = 'booth-' + kind + '-' + targets.length;
      targets.push({ obj: obj, kind: kind, points: points, r: r });
      states.push({ x: x, y: y, cooldown: 0, up: true });
      return obj;
    }
    for (i = 0; i < 5; i++) {
      var ring = target('ring', (i - 2) * 1.08, 3.02, 0.37, 30);
      k.add(ring, 'disc', k.paint('rings'), 0, 0, 0, 0.37, 0.37, 1);
    }
    for (i = 0; i < 5; i++) {
      var duck = target('duck', (i - 2) * 0.97, 2.07, 0.29, 20);
      k.add(duck, 'ball', i % 2 ? cream : gold, 0, -0.035, 0, 0.28, 0.19, 0.10);
      k.add(duck, 'ball', gold, 0.12, 0.17, 0.015, 0.14, 0.14, 0.10);
      k.add(duck, 'cone', red, 0.29, 0.14, 0.02, 0.08, 0.18, 0.07).rotation.z = -Math.PI / 2;
      k.add(duck, 'ball', dark, 0.14, 0.19, 0.11, 0.025, 0.032, 0.015);
    }
    for (i = 0; i < 4; i++) {
      var skull = target('skull', (i - 1.5) * 1.3, 1.2, 0.27, 50);
      k.add(skull, 'ball', cream, 0, 0.02, 0, 0.27, 0.25, 0.13);
      k.add(skull, 'ball', dark, -0.095, 0.045, 0.12, 0.055, 0.065, 0.025);
      k.add(skull, 'ball', dark, 0.095, 0.045, 0.12, 0.055, 0.065, 0.025);
      k.add(skull, 'box', red, 0, -0.11, 0.13, 0.12, 0.035, 0.025);
    }
    // Gun's local forward axis is -Z. Recoil lives below the aiming pivot.
    var gun = k.pivot(g, 0, 1.37, 1.65), body = k.pivot(gun, 0, 0, 0);
    gun.name = 'booth-rifle';
    k.add(body, 'box', '#794439', 0, -0.045, 0.19, 0.15, 0.18, 0.64);
    k.add(body, 'box', '#794439', 0, -0.07, -0.26, 0.12, 0.13, 0.48);
    k.add(body, 'cyl', dark, 0, 0, -0.42, 0.045, 0.92, 0.045).rotation.x = Math.PI / 2;
    k.add(body, 'box', gold, 0, 0.07, -0.78, 0.035, 0.08, 0.035);
    k.add(body, 'box', dark, 0, -0.16, 0, 0.055, 0.15, 0.10);
    var flash = k.add(body, 'cone', k.mat('#ffe59a', true), 0, 0, -0.99, 0.12, 0.25, 0.12);
    flash.rotation.x = -Math.PI / 2; flash.visible = false;
    var aimPoint = new T.Vector3(), forward = new T.Vector3(0, 0, -1);
    function isUp(i) { return !!(states[i] && states[i].up); }
    function hit(i, local) {
      if (!isUp(i)) return;
      states[i].cooldown = 1.2; states[i].up = false;
    }
    function update(dt, time, active) {
      var step = Number.isFinite(dt) ? Math.max(0, dt) : 0;
      clock = Number.isFinite(time) ? time : clock + step;
      travel = (travel + step * (active ? 1.25 : 0.85)) % (TAU * 10);
      flashLeft = Math.max(0, flashLeft - step); recoilLeft = Math.max(0, recoilLeft - step);
      flash.visible = flashLeft > 0;
      body.position.z = 0.11 * recoilLeft / 0.16;
      for (var j = 0; j < targets.length; j++) {
        var t = targets[j], s = states[j], tilt = 0;
        if (s.cooldown > 0) {
          s.cooldown = Math.max(0, s.cooldown - step);
          tilt = Math.min(1, (1.2 - s.cooldown) / 0.14, s.cooldown / 0.2) * Math.PI * 0.55;
        }
        t.obj.rotation.x = -tilt; t.obj.rotation.z = 0;
        t.obj.position.y = s.y; t.obj.visible = true;
        if (t.kind === 'ring') {
          t.obj.rotation.z = j % 2 ? Math.sin(clock * 0.7 + j) * 0.18 : clock * 0.18;
        } else if (t.kind === 'duck') {
          // A whole row shuttles along the rail without crossing or teleporting.
          t.obj.position.x = s.x + Math.sin(travel) * 0.48;
        } else {
          var lift = Math.max(0, Math.min(1, (Math.sin(travel * 0.9 + j * 1.7) + 0.15) * 3));
          t.obj.position.y = s.y - (1 - lift) * 0.51;
          t.obj.visible = lift > 0.01;
          s.up = s.cooldown === 0 && lift > 0.95;
        }
        if (t.kind !== 'skull') s.up = s.cooldown === 0;
      }
      for (j = 0; j < bulbs.length; j++) {
        bulbs[j].scale.setScalar(active && (j + Math.floor(clock * 7)) % 3 === 0 ? 0.085 : 0.06);
      }
    }
    update(0, 0, false);
    return {
      group: g, name: 'Bắn súng hội chợ', board: [{ x: 0, z: 2.8 }], solids: solids,
      view: { pos: { x: 0, y: 1.65, z: 3.45 }, look: { x: 0, y: 2.12, z: -1.72 } },
      gun: gun, targets: targets,
      aim: function (x, y, z) {
        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) return;
        // Updating ancestors is necessary when the caller moved/rotated the booth.
        g.updateWorldMatrix(true, false);
        aimPoint.set(x, y, z); g.worldToLocal(aimPoint); aimPoint.sub(gun.position);
        if (aimPoint.lengthSq() > 1e-12) gun.quaternion.setFromUnitVectors(forward, aimPoint.normalize());
      },
      shoot: function () { flashLeft = 0.08; recoilLeft = 0.16; flash.visible = true; body.position.z = 0.11; },
      hit: hit, isUp: isUp, update: update
    };
  };

  root.__boothSelfTest = function (T) {
    var booth = root.makeShootingBooth(T), meshes = 0, tris = 0, lights = 0;
    function assert(ok, msg) { if (!ok) throw new Error('Booth self-test: ' + msg); }
    assert(booth.group.isGroup && booth.gun.isObject3D && booth.targets.length >= 12, 'API');
    assert(booth.isUp(0), 'ring initially down');
    booth.hit(0); assert(!booth.isUp(0), 'hit did not disable target');
    booth.update(0.1, 0.1, true); assert(!booth.isUp(0), 'target recovered early');
    booth.update(1.9, 2, true); assert(booth.isUp(0), 'target did not recover');
    booth.group.position.set(3, 0, -7); booth.group.rotation.y = 0.4;
    var point = new T.Vector3(0, 2.1, -1.72);
    booth.group.updateWorldMatrix(true, false); booth.group.localToWorld(point);
    booth.aim(point.x, point.y, point.z); booth.shoot();
    for (var frame = 0; frame < 240; frame++) {
      booth.update(1 / 60, 2 + frame / 60, true);
      booth.targets.forEach(function (t, i) {
        assert(t.obj.isObject3D && t.obj.parent === booth.group && t.r > 0 && Number.isFinite(t.points), 'target ' + i);
        assert(typeof booth.isUp(i) === 'boolean', 'isUp ' + i);
      });
    }
    booth.hit(-1); booth.hit(999); booth.update(); booth.update(NaN, NaN); booth.aim(NaN, 0, 0);
    booth.group.updateMatrixWorld(true);
    booth.group.traverse(function (o) {
      assert(o.matrixWorld.elements.every(Number.isFinite), 'nonfinite transform');
      if (o.isPointLight) lights++;
      if (!o.isMesh) return;
      meshes++; var p = o.geometry.attributes.position;
      assert(p && p.array.every(Number.isFinite), 'nonfinite vertices');
      tris += (o.geometry.index ? o.geometry.index.count : p.count) / 3;
    });
    booth.board.forEach(function (b) {
      booth.solids.forEach(function (s) {
        assert(Number.isFinite(s.x + s.z + s.r) && s.r > 0, 'invalid solid');
        assert(Math.hypot(b.x - s.x, b.z - s.z) > s.r + 0.3, 'boarding obstructed');
      });
    });
    assert(meshes <= 110 && lights <= 2, 'budget exceeded: ' + meshes);
    return { ok: true, meshes: meshes, tris: Math.round(tris), targets: booth.targets.length };
  };
})(typeof window !== 'undefined' ? window : globalThis);
