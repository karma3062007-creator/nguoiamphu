(function (root) {
  'use strict';

  // Three r128, metres, +Z faces forward. Resources are shared per Three runtime.
  var caches = new WeakMap(), TAU = Math.PI * 2;
  var red = '#b52e35', gold = '#efbd59', dark = '#302937', cream = '#fff0cb';
  function kit(T) {
    if (caches.has(T)) return caches.get(T);
    var geo = {
      box: new T.BoxGeometry(1, 1, 1),
      ball: new T.SphereGeometry(1, 8, 6),
      cyl: new T.CylinderGeometry(1, 1, 1, 8),
      cone: new T.ConeGeometry(1, 1, 8),
      ring: new T.TorusGeometry(1, 0.018, 5, 64),
      plane: new T.PlaneGeometry(1, 1)
    }, mats = Object.create(null), labels = Object.create(null);
    function mat(color, glow) {
      var key = color + ':' + !!glow;
      if (!mats[key]) mats[key] = glow ? new T.MeshBasicMaterial({ color: color }) :
        new T.MeshStandardMaterial({ color: color, roughness: 0.7, metalness: color === gold ? 0.45 : 0.08, flatShading: true });
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
    function rod(p, color, x, y, z, xx, yy, zz, r) {
      var a = new T.Vector3(x, y, z), b = new T.Vector3(xx, yy, zz);
      var dir = b.sub(a), len = dir.length();
      var m = add(p, 'cyl', color, x + dir.x / 2, y + dir.y / 2, z + dir.z / 2, r, len, r);
      m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir.normalize()); return m;
    }
    function label(text) {
      if (labels[text]) return labels[text];
      var c = typeof document !== 'undefined' ? document.createElement('canvas') : null;
      var ctx = c && c.getContext ? c.getContext('2d') : null;
      if (!ctx) return mat(red);
      c.width = 1024; c.height = 192;
      ctx.fillStyle = red; ctx.fillRect(0, 0, 1024, 192);
      ctx.strokeStyle = gold; ctx.lineWidth = 10; ctx.strokeRect(8, 8, 1008, 176);
      ctx.fillStyle = cream; ctx.font = 'bold 74px Arial, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 512, 101, 956);
      var tex = new T.CanvasTexture(c); tex.encoding = T.sRGBEncoding;
      labels[text] = new T.MeshBasicMaterial({ map: tex }); return labels[text];
    }
    var k = { geo: geo, mat: mat, add: add, pivot: pivot, rod: rod, label: label };
    caches.set(T, k); return k;
  }
  function timer() {
    var t = 0;
    return function (dt, time) {
      t = Number.isFinite(time) ? time : t + (Number.isFinite(dt) ? Math.max(0, dt) : 0);
      return t;
    };
  }
  function lantern(k, p, x, y, z) {
    var g = k.pivot(p, x, y, z); g.name = 'lantern';
    k.add(g, 'ball', red, 0, -0.22, 0, 0.18, 0.25, 0.18);
    k.add(g, 'cyl', gold, 0, 0, 0, 0.09, 0.07, 0.09);
    k.add(g, 'cone', k.mat(gold, true), 0, -0.53, 0, 0.045, 0.15, 0.045);
    return g;
  }
  function skull(k, p, x, y, z, scale) {
    var g = k.pivot(p, x, y, z); g.scale.setScalar(scale);
    k.add(g, 'ball', cream, 0, 0, 0, 0.32, 0.29, 0.23);
    k.add(g, 'ball', dark, -0.11, 0.03, 0.21, 0.054, 0.075, 0.025);
    k.add(g, 'ball', dark, 0.11, 0.03, 0.21, 0.054, 0.075, 0.025);
    k.add(g, 'box', red, 0, -0.12, 0.22, 0.13, 0.035, 0.025);
    return g;
  }
  // The avatar has no seated pose: cushion top = foot anchor + 0.65 m.
  // Backrest is behind (-Z), leaving +Z clear for the face and toes.
  function chair(k, p, x, y, z, color, seats) {
    k.add(p, 'box', color, x, y - 0.07, z, 0.78, 0.14, 0.74);
    k.add(p, 'box', color, x, y + 0.34, z - 0.35, 0.78, 0.68, 0.10);
    k.add(p, 'box', gold, x, y + 0.27, z + 0.31, 0.86, 0.07, 0.07);
    var seat = k.pivot(p, x, y - 0.65, z + 0.04);
    seat.name = 'seat-' + seats.length; seats.push(seat); return seat;
  }

  function swing(T, k) {
    var g = new T.Group(), seats = [], solids = [], pivots = [], lamps = [], amps = [0.035, 0.035, 0.035], next = timer(), last;
    g.name = 'ride-swing';
    [-1, 1].forEach(function (s) {
      [-1, 1].forEach(function (f) {
        var x = s * 3.3, z = f * 1.25;
        k.rod(g, red, x, 0.12, z, x, 3.4, 0, 0.10);
        k.add(g, 'box', gold, x, 0.08, z, 0.45, 0.16, 0.45);
        solids.push({ x: x, z: z, r: 0.33 });
      });
      skull(k, g, s * 3.3, 3.64, 0, 0.85);
    });
    k.add(g, 'box', dark, 0, 3.4, 0, 7, 0.18, 0.20);
    for (var i = 0; i < 3; i++) {
      var p = k.pivot(g, (i - 1) * 1.95, 3.4, 0); pivots.push(p);
      chair(k, p, 0, -2.55, 0, i === 1 ? '#438e88' : red, seats);
      [-1, 1].forEach(function (s) { k.rod(p, gold, s * 0.4, 0, 0, s * 0.4, -2.55, 0, 0.022); });
      lamps.push(lantern(k, g, (i - 1) * 1.95, 3.34, -0.32));
    }
    return { group: g, seats: seats, solids: solids, board: [{ x: 0, z: 3.7 }], name: 'Xích đu',
      update: function (dt, time, occupied) {
        var t = next(dt, time);
        var step = Number.isFinite(dt) ? Math.max(0, Math.min(dt, 0.25)) : (last === undefined ? 0 : Math.max(0, Math.min(t - last, 0.25)));
        last = t;
        var blend = 1 - Math.exp(-step * 2.3);
        for (var j = 0; j < 3; j++) {
          amps[j] += ((occupied && occupied[j] ? 0.9 : 0.035) - amps[j]) * blend;
          pivots[j].rotation.x = Math.sin(t * TAU / 2.6 + j * 0.55) * amps[j];
          lamps[j].rotation.z = Math.sin(t * 1.6 + j) * 0.06;
        }
      }
    };
  }

  function wheel(T, k) {
    var g = new T.Group(), seats = [], solids = [], cabins = [], next = timer(); g.name = 'ride-wheel';
    [-1, 1].forEach(function (zsign) {
      [-1, 1].forEach(function (s) {
        k.rod(g, dark, s * 3.6, 0.15, zsign * 2.2, 0, 9.5, zsign * 0.85, 0.19);
        k.add(g, 'box', gold, s * 3.6, 0.12, zsign * 2.2, 0.8, 0.24, 0.8);
        solids.push({ x: s * 3.6, z: zsign * 2.2, r: 0.58 });
      });
    });
    k.rod(g, gold, 0, 9.5, -1.05, 0, 9.5, 1.05, 0.23);
    var rotor = k.pivot(g, 0, 9.5, 0); rotor.name = 'wheel-rotor';
    [-0.6, 0.6].forEach(function (z) { k.add(rotor, 'ring', gold, 0, 0, z, 8, 8, 8); });
    for (var i = 0; i < 8; i++) {
      var angle = i * TAU / 8, x = 8 * Math.sin(angle), y = -8 * Math.cos(angle);
      k.rod(rotor, red, 0, 0, -0.6, x, y, -0.6, 0.065);
      k.rod(rotor, red, 0, 0, 0.6, x, y, 0.6, 0.065);
      k.rod(rotor, gold, x, y, -0.7, x, y, 0.7, 0.06);
      var cabin = k.pivot(rotor, x, y, 0); cabin.name = 'wheel-cabin'; cabins.push(cabin);
      var color = [red, '#468d89', '#65528d', '#d67e40'][i % 4];
      k.add(cabin, 'box', gold, 0, -1.03, 0, 1.2, 0.14, 1.12);
      chair(k, cabin, 0, -0.36, 0, color, seats);
      [-1, 1].forEach(function (s) { k.add(cabin, 'box', gold, s * 0.54, -0.12, -0.40, 0.055, 1.8, 0.055); });
      k.add(cabin, 'cone', color, 0, 0.85, 0, 0.85, 0.35, 0.8);
    }
    for (var b = 0; b < 24; b++) {
      var a = b * TAU / 24;
      k.add(rotor, 'ball', k.mat(b % 2 ? '#ffbf55' : '#fff0b0', true), Math.cos(a) * 8, Math.sin(a) * 8, 0.79, 0.095, 0.095, 0.095);
    }
    skull(k, g, 0, 9.5, 1.1, 2.1);
    k.add(g, 'box', red, 0, 0.20, 1.2, 2.6, 0.4, 2.2);
    k.add(g, 'box', gold, 0, 0.10, 2.6, 2.6, 0.2, 0.6);
    return { group: g, seats: seats, solids: solids, board: [{ x: 0, z: 3.5 }], name: 'Đu quay',
      update: function (dt, time) {
        var angle = next(dt, time) * TAU / 50 % TAU;
        rotor.rotation.z = angle;
        for (var j = 0; j < cabins.length; j++) cabins[j].rotation.z = -angle;
      }
    };
  }

  function coaster(T, k) {
    var g = new T.Group(), seats = [], solids = [], cars = [], next = timer(); g.name = 'ride-coaster';
    // A straight, level station along +X precedes the lift and long plunge.
    var coords = [[-14,1.1,6],[-10,1.1,6],[-6,1.1,6],[-2,1.1,6],[5,3,6],[12,8,4],
      [16,6,0],[12,1.7,-6],[5,2,-7],[0,4.3,-6],[-5,2,-7],[-11,3.2,-5],[-16,2,-1],[-16,1.1,3]];
    var points = coords.map(function (p) { return new T.Vector3(p[0], p[1], p[2]); });
    var curve = new T.CatmullRomCurve3(points, true, 'centripetal'); curve.arcLengthDivisions = 1200;
    var length = curve.getLength(), count = 768, frames = [], durations = [], total = 0;
    var up = new T.Vector3(0,1,0), tangent = new T.Vector3(), right = new T.Vector3(), normal = new T.Vector3(), matrix = new T.Matrix4();
    for (var i = 0; i <= count; i++) {
      var u = (i % count) / count, pos = curve.getPointAt(u);
      curve.getTangentAt(u, tangent).normalize(); right.crossVectors(up, tangent).normalize();
      normal.crossVectors(tangent, right).normalize(); matrix.makeBasis(right, normal, tangent);
      var q = new T.Quaternion().setFromRotationMatrix(matrix);
      // Gentle inward banking; taper to zero through the station.
      var bank = pos.z < 4 ? Math.sin(u * TAU) * 0.20 : 0;
      q.multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(0,0,1), bank));
      frames.push({ p: pos, q: q });
      if (i < count) {
        durations.push(total);
        var station = Math.max(0, Math.min(1, (pos.x + 14) / 2, (-2 - pos.x) / 2, (pos.z - 4.7) / 0.8));
        station = station * station * (3 - 2 * station);
        var freeSpeed = Math.sqrt(6.25 + 2 * 4.2 * Math.max(0, 8 - pos.y));
        var speed = freeSpeed + (1.65 - freeSpeed) * station;
        total += length / count / speed;
      }
    }
    durations.push(total);
    // Sampled rail offsets use the same banked frames as the cars.
    var rails = [[], []], offset = new T.Vector3();
    for (i = 0; i < count; i += 3) {
      for (var side = 0; side < 2; side++) {
        offset.set(side ? 0.57 : -0.57, 0, 0).applyQuaternion(frames[i].q).add(frames[i].p);
        rails[side].push(offset.clone());
      }
    }
    for (side = 0; side < 2; side++) {
      var rail = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(rails[side], true, 'centripetal'), 384, 0.065, 5, true), k.mat(side ? gold : '#c85b55'));
      rail.castShadow = true; g.add(rail);
    }
    for (i = 0; i < count; i += 16) {
      var f = frames[i], tie = k.add(g, 'box', dark, f.p.x, f.p.y - 0.06, f.p.z, 1.45, 0.10, 0.15);
      tie.quaternion.copy(f.q);
    }
    for (i = 0; i < count; i += 48) {
      f = frames[i];
      k.rod(g, dark, f.p.x, 0.10, f.p.z, f.p.x, f.p.y - 0.12, f.p.z, 0.12);
      k.add(g, 'box', red, f.p.x, 0.08, f.p.z, 0.6, 0.16, 0.6);
      solids.push({ x: f.p.x, z: f.p.z, r: 0.42 });
    }
    for (i = 0; i < 3; i++) {
      var car = k.pivot(g, 0, 0, 0); car.name = 'coaster-car-' + i; cars.push(car);
      k.add(car, 'box', dark, 0, 0.13, 0, 1.85, 0.26, 1.9);
      k.add(car, 'box', i === 1 ? '#438e88' : red, 0, 0.48, -0.77, 1.85, 0.65, 0.16);
      chair(k, car, -0.43, 0.85, 0, red, seats); chair(k, car, 0.43, 0.85, 0, red, seats);
      [-1, 1].forEach(function (s) {
        k.add(car, 'box', gold, s * 0.91, 0.48, 0, 0.08, 0.52, 1.85);
        [-0.62, 0.62].forEach(function (z) { k.add(car, 'ball', dark, s * 0.85, 0, z, 0.16, 0.16, 0.16); });
      });
      if (!i) {
        var head = skull(k, car, 0, 0.70, 1.03, 1.65);
        [-1, 1].forEach(function (s) { k.add(head, 'cone', gold, s * 0.24, 0.34, 0, 0.09, 0.30, 0.09).rotation.z = -s * 0.4; });
      }
    }
    k.add(g, 'box', red, -8, 0.25, 7.6, 8, 0.5, 1.35);
    [-11.5, -4.5].forEach(function (x) {
      k.add(g, 'box', gold, x, 1.7, 8.15, 0.12, 3.4, 0.12);
      solids.push({ x: x, z: 8.15, r: 0.24 });
    });
    k.add(g, 'box', dark, -8, 3.45, 7.25, 8.5, 0.20, 2.9);
    k.add(g, 'plane', k.label('TÀU LƯỢN ĐỊA PHỦ'), -8, 3.16, 8.72, 6.7, 0.65, 1);
    var lamp = lantern(k, g, -4.65, 3.30, 8.3);
    // Binary search a precomputed travel-time table. Position comes from absolute
    // time, so 30/60/120 Hz give the same train; trailing cars keep fixed spacing.
    function place(t) {
      var phase = ((t % total) + total) % total, lo = 0, hi = count;
      while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (durations[mid] <= phase) lo = mid; else hi = mid; }
      var sample = lo + (phase - durations[lo]) / (durations[lo + 1] - durations[lo]);
      for (var j = 0; j < 3; j++) {
        var s = ((sample - j * 2.45 / length * count) % count + count) % count;
        var index = Math.floor(s), frac = s - index;
        cars[j].position.lerpVectors(frames[index].p, frames[index + 1].p, frac);
        cars[j].quaternion.copy(frames[index].q).slerp(frames[index + 1].q, frac);
      }
    }
    place(0);
    return { group: g, seats: seats, solids: solids, board: [{ x: -8, z: 9.35 }], name: 'Tàu lượn',
      update: function (dt, time) { var t = next(dt, time); place(t); lamp.rotation.z = Math.sin(t * 1.6) * 0.06; }
    };
  }

  root.makeRide = function (T, type) {
    var k = kit(T);
    if (type === 'swing') return swing(T, k);
    if (type === 'wheel') return wheel(T, k);
    if (type === 'coaster') return coaster(T, k);
    throw new Error('Unknown ride type: ' + type);
  };
  root.makeParkGate = function (T) {
    var k = kit(T), g = new T.Group(), next = timer(), lamps = [], bulbs = [], solids = []; g.name = 'park-gate';
    [-1, 1].forEach(function (s) {
      k.add(g, 'box', dark, s * 4, 0.14, 0, 0.95, 0.28, 0.95);
      k.add(g, 'cyl', red, s * 4, 2.65, 0, 0.32, 5.3, 0.32);
      k.add(g, 'cone', gold, s * 4, 5.58, 0, 0.58, 0.75, 0.58);
      solids.push({ x: s * 4, z: 0, r: 0.67 });
      lamps.push(lantern(k, g, s * 3.0, 4.65, 0));
    });
    k.add(g, 'box', dark, 0, 5.15, 0, 9, 1.0, 0.5);
    k.add(g, 'box', gold, 0, 5.75, 0, 9.3, 0.18, 0.7);
    [-1, 1].forEach(function (s) {
      var sign = k.add(g, 'plane', k.label('CÔNG VIÊN ÂM PHỦ'), 0, 5.15, s * 0.26, 7.6, 0.82, 1);
      if (s < 0) sign.rotation.y = Math.PI;
    });
    for (var i = 0; i < 12; i++) {
      bulbs.push(k.add(g, 'ball', k.mat(gold, true), -4.25 + i * 8.5 / 11, 5.83, 0, 0.10, 0.10, 0.10));
    }
    return { group: g, solids: solids, update: function (dt, time) {
      var t = next(dt, time), chase = Math.floor(t * 5);
      for (var j = 0; j < bulbs.length; j++) bulbs[j].scale.setScalar((j + chase) % 3 === 0 ? 0.13 : 0.085);
      for (j = 0; j < lamps.length; j++) lamps[j].rotation.z = Math.sin(t * 1.5 + j) * 0.07;
    } };
  };

  root.__ridesSelfTest = function (T) {
    var rows = [], privateGeometry = new Set(), shared = kit(T).geo;
    function assert(ok, msg) { if (!ok) throw new Error('Rides self-test: ' + msg); }
    function inspect(m, name, limit, n) {
      var meshes = 0, tris = 0, lights = 0, seats = m.seats || [];
      assert(m.group.isGroup && seats.length === n, name + ' API / seat count');
      m.group.position.set(3, 0, -7); m.group.rotation.y = 0.4;
      var occupied = seats.map(function () { return true; });
      for (var frame = 0; frame < 180; frame++) m.update(1 / 60, frame / 60, occupied);
      [0, 12.5, 50, 10000, -1].forEach(function (time) { m.update(1 / 60, time, occupied); });
      m.update(); m.update(NaN, NaN); m.group.updateMatrixWorld(true);
      assert(m.group.position.x === 3 && m.group.position.z === -7 && m.group.rotation.y === 0.4, name + ' changed root');
      m.group.traverse(function (o) {
        assert(o.matrixWorld.elements.every(Number.isFinite), name + ' nonfinite transform');
        if (o.isPointLight) lights++;
        if (!o.isMesh) return;
        meshes++; var p = o.geometry.attributes.position;
        assert(p && p.array.every(Number.isFinite), name + ' nonfinite vertices');
        tris += (o.geometry.index ? o.geometry.index.count : p.count) / 3;
        if (Object.keys(shared).every(function (key) { return shared[key] !== o.geometry; })) privateGeometry.add(o.geometry);
      });
      assert(meshes <= limit && lights <= 2, name + ' exceeds budget: ' + meshes);
      seats.forEach(function (seat) {
        assert(seat.isObject3D, name + ' invalid seat');
        var p = seat; while (p && p !== m.group) p = p.parent;
        assert(p === m.group, name + ' detached seat');
      });
      m.solids.forEach(function (s) { assert(Number.isFinite(s.x + s.z + s.r) && s.r > 0, name + ' invalid solid'); });
      if (n) m.board.forEach(function (b) {
        assert(Number.isFinite(b.x + b.z), name + ' invalid boarding point');
        m.solids.forEach(function (s) { assert(Math.hypot(b.x - s.x, b.z - s.z) > s.r + 0.3, name + ' boarding obstructed'); });
      });
      if (name === 'wheel') {
        m.group.traverse(function (o) { if (o.name === 'wheel-cabin') assert(Math.abs(o.rotation.z + o.parent.rotation.z) < 1e-8, 'cabin not upright'); });
      }
      if (n) {
        var before = seats[0].getWorldPosition(new T.Vector3());
        m.update(1 / 60, 7, occupied); m.group.updateMatrixWorld(true);
        assert(before.distanceTo(seats[0].getWorldPosition(new T.Vector3())) > 0.001, name + ' frozen');
      }
      rows.push({ name: name, meshes: meshes, tris: Math.round(tris), seats: n });
    }
    try {
      inspect(root.makeRide(T, 'swing'), 'swing', 45, 3);
      inspect(root.makeRide(T, 'wheel'), 'wheel', 150, 8);
      inspect(root.makeRide(T, 'coaster'), 'coaster', 220, 6);
      inspect(root.makeParkGate(T), 'gate', 40, 0);
      return { ok: true, rows: rows };
    } finally {
      privateGeometry.forEach(function (geo) { geo.dispose(); });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
