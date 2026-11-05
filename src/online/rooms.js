(function (root) {
  'use strict';

  // Three r128, metres, front = +Z. All returned coordinates are room-local.
  var caches = new WeakMap(), TAU = Math.PI * 2;
  var red = '#b52e35', gold = '#efbd59', dark = '#272336', cream = '#fff0cb';
  function kit(T) {
    if (caches.has(T)) return caches.get(T);
    var geo = {
      box: new T.BoxGeometry(1, 1, 1), ball: new T.SphereGeometry(1, 12, 8),
      cyl: new T.CylinderGeometry(1, 1, 1, 12), cone: new T.ConeGeometry(1, 1, 12),
      ring: new T.TorusGeometry(1, 0.035, 6, 40), plane: new T.PlaneGeometry(1, 1)
    }, mats = Object.create(null), labels = Object.create(null);
    function mat(color, glow) {
      var key = color + ':' + !!glow;
      if (!mats[key]) mats[key] = glow ? new T.MeshBasicMaterial({ color: color }) :
        new T.MeshStandardMaterial({ color: color, roughness: 0.75,
          metalness: color === gold ? 0.4 : 0.05, flatShading: true });
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
    function label(text, bg, fg) {
      var key = text + ':' + bg + ':' + fg;
      if (labels[key]) return labels[key];
      var c = typeof document !== 'undefined' ? document.createElement('canvas') : null;
      var ctx = c && c.getContext ? c.getContext('2d') : null;
      if (!ctx) return mat(bg, true);
      c.width = 1024; c.height = 256;
      ctx.fillStyle = bg; ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = fg; ctx.lineWidth = 9; ctx.strokeRect(9, 9, 1006, 238);
      ctx.fillStyle = fg; ctx.font = 'bold 72px Arial, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 512, 132, 950);
      var tex = new T.CanvasTexture(c); tex.encoding = T.sRGBEncoding;
      labels[key] = new T.MeshBasicMaterial({ map: tex }); return labels[key];
    }
    var k = { geo: geo, mat: mat, add: add, pivot: pivot, label: label };
    caches.set(T, k); return k;
  }
  function timer() {
    var t = 0;
    return function (dt, time) {
      t = Number.isFinite(time) ? time : t + (Number.isFinite(dt) ? Math.max(0, dt) : 0);
      return t;
    };
  }
  function rect(a, x0, x1, z0, z1) { a.push({ x0: x0, x1: x1, z0: z0, z1: z1 }); }
  function light(T, p, color, intensity, x, y, z, distance) {
    var l = new T.PointLight(color, intensity, distance, 2);
    l.position.set(x, y, z); p.add(l); return l;
  }
  function shell(T, k, color, height, floorColor) {
    var g = new T.Group(), roof = k.pivot(g, 0, 0, 0), blocked = [];
    roof.name = 'roof-and-ceiling';
    k.add(g, 'box', floorColor, 0, -0.15, 0, 24.6, 0.3, 20.6);
    // Inner wall faces are exactly at +/-12 and +/-10. No threshold or door leaf.
    [[-12.3, -12, -10.3, 10.3], [12, 12.3, -10.3, 10.3],
      [-12, 12, -10.3, -10], [-12, -1.5, 10, 10.3], [1.5, 12, 10, 10.3]].forEach(function (b) {
      rect(blocked, b[0], b[1], b[2], b[3]);
      k.add(g, 'box', color, (b[0] + b[1]) / 2, 2.1, (b[2] + b[3]) / 2,
        b[1] - b[0], 4.2, b[3] - b[2]);
      if (height > 4.2) k.add(roof, 'box', color, (b[0] + b[1]) / 2,
        (height + 4.2) / 2, (b[2] + b[3]) / 2, b[1] - b[0], height - 4.2, b[3] - b[2]);
    });
    // Door clearance is 3 m wide and 3.35 m high.
    k.add(g, 'box', color, 0, 3.775, 10.15, 3, 0.85, 0.3);
    if (height > 4.2) k.add(roof, 'box', color, 0, (height + 4.2) / 2, 10.15, 3, height - 4.2, 0.3);
    k.add(roof, 'box', color, 0, height + 0.12, 0, 25.2, 0.24, 21.2);
    return { group: g, roof: roof, blocked: blocked };
  }
  function lantern(k, p, x, y, z) {
    var g = k.pivot(p, x, y, z);
    k.add(g, 'ball', red, 0, -0.3, 0, 0.32, 0.43, 0.32);
    k.add(g, 'cyl', gold, 0, 0.13, 0, 0.17, 0.08, 0.17);
    k.add(g, 'cone', gold, 0, -0.9, 0, 0.07, 0.3, 0.07); return g;
  }

  root.makeKaraokeRoom = function (T) {
    var k = kit(T), room = shell(T, k, '#302344', 7.3, '#542037');
    var g = room.group, roof = room.roof, blocked = room.blocked;
    var seats = [], solids = [], bulbs = [], beams = [], lamps = [], next = timer();
    g.name = 'karaoke-room';
    k.add(g, 'box', '#9d2945', 0, 0.015, 3, 3, 0.03, 14);
    k.add(g, 'box', dark, 0, 0.35, -7.2, 20, 0.7, 5.4);
    k.add(g, 'box', gold, 0, 0.68, -4.49, 20, 0.05, 0.04);
    rect(blocked, -10, 10, -9.9, -4.5);
    var stage = k.pivot(g, -2, 0.7, -5.55); stage.name = 'singer-anchor';
    // Screen bottom = stage surface + 1.6 m; aspect ratio exactly 16:9.
    k.add(g, 'box', gold, 0, 4.55, -9.61, 8.3, 4.8, 0.12);
    var screen = k.add(g, 'plane', new T.MeshBasicMaterial({ color: '#ffffff' }),
      0, 4.55, -9.53, 8, 4.5, 1); screen.name = 'video-screen';
    k.add(g, 'cyl', dark, -1.1, 0.74, -5.6, 0.26, 0.08, 0.26);
    k.add(g, 'cyl', gold, -1.1, 1.4, -5.6, 0.035, 1.3, 0.035);
    k.add(g, 'ball', '#a2a8ba', -1.1, 2.07, -5.6, 0.11, 0.17, 0.11).rotation.z = -0.4;
    [-1, 1].forEach(function (s) {
      k.add(g, 'box', dark, s * 7.6, 1.7, -8, 1.4, 2, 1);
      for (var j = 0; j < 2; j++) {
        var speaker = k.add(g, 'cyl', '#625365', s * 7.6, 1.25 + j * 0.85, -7.47, 0.43, 0.06, 0.43);
        speaker.rotation.x = Math.PI / 2;
      }
      lamps.push(lantern(k, g, s * 10.4, 3.6, -3));
      lamps.push(lantern(k, g, s * 2.6, 3.3, 10.8));
      var poster = k.add(g, 'plane', k.label('Song ca cùng Diêm Vương', '#542037', gold),
        s * 8, 2.9, 9.97, 5.6, 1.4, 1); poster.rotation.y = Math.PI;
      k.add(g, 'box', k.mat('#ff56bc', true), s * 11.97, 3.7, 0, 0.04, 0.1, 19.6);
      k.add(g, 'box', k.mat('#a773ff', true), s * 1.58, 1.65, 10.33, 0.12, 3.3, 0.1);
    });
    k.add(g, 'plane', k.label('KARAOKE ÂM PHỦ', '#302344', '#ff80cf'), 0, 3.8, 10.33, 10, 0.75, 1);
    // Five chairs per row; a 2.6 m central aisle connects directly to the door.
    var xs = [-8, -4.7, 0, 4.7, 8];
    // Move the middle chair into the left bank to keep the aisle continuous.
    xs[2] = -2.3;
    for (var row = 0; row < 4; row++) {
      for (var col = 0; col < 5; col++) {
        var x = xs[col], z = -2.5 + row * 3.1;
        k.add(g, 'box', red, x, 0.39, z, 1.55, 0.78, 1.25);
        k.add(g, 'box', '#75263f', x, 0.95, z + 0.56, 1.55, 1.15, 0.18);
        var seat = k.pivot(g, x, 0.13, z - 0.04);
        seat.rotation.y = Math.PI; seat.name = 'karaoke-seat-' + seats.length; seats.push(seat);
        rect(blocked, x - 0.775, x + 0.775, z - 0.625, z + 0.65);
      }
    }
    for (var i = 0; i < 16; i++) {
      var side = i < 8 ? -1 : 1;
      bulbs.push(k.add(g, 'ball', k.mat(i % 2 ? gold : '#ff56bc', true),
        side * 1.68, 0.24 + (i % 8) * 0.42, 10.4, 0.06, 0.06, 0.06));
    }
    var disco = k.pivot(g, 0, 6.6, -0.5);
    k.add(disco, 'cyl', gold, 0, 0.35, 0, 0.025, 0.7, 0.025);
    k.add(disco, 'ball', '#b7a8d5', 0, -0.45, 0, 0.65, 0.65, 0.65);
    for (i = 0; i < 8; i++) {
      var a = i * TAU / 8;
      k.add(disco, 'ball', k.mat(i % 2 ? '#ff80cf' : cream, true),
        Math.cos(a) * 0.61, -0.45, Math.sin(a) * 0.61, 0.08, 0.16, 0.08);
    }
    // Beams hang below the removable roof so the show remains visible indoors.
    for (i = 0; i < 2; i++) {
      var beam = k.pivot(g, i ? 6 : -6, 4.05, -7.1);
      k.add(beam, 'box', dark, 0, 0, 0, 0.45, 0.4, 0.55);
      var beamMat = new T.MeshBasicMaterial({ color: i ? '#b47cff' : '#ff58be',
        transparent: true, opacity: 0.07, depthWrite: false, side: T.DoubleSide });
      k.add(beam, 'cone', beamMat, 0, -1.6, 0, 0.85, 3.2, 0.85);
      beams.push(beam);
    }
    var wash = light(T, g, '#ff80cf', 0.8, 0, 3.9, -5, 20);
    light(T, g, '#bba0ff', 1, 0, 3.9, 5, 24);
    return { group: g, roof: roof, name: 'Phòng Karaoke Âm Phủ', seats: seats,
      stage: stage, screen: screen, solids: solids, blocked: blocked,
      update: function (dt, time, info) {
        var t = next(dt, time), playing = !!(info && info.playing);
        var level = info && Number.isFinite(info.level) ? Math.max(0, Math.min(1, info.level)) : 0;
        var beat = playing ? (Math.sin(t * (4 + level * 5)) + 1) / 2 : 0;
        disco.rotation.y = t * (playing ? 0.7 : 0.15);
        wash.intensity = 0.6 + beat * (0.5 + level);
        for (var j = 0; j < beams.length; j++) {
          beams[j].rotation.z = Math.sin(t * 0.8 + j * 2) * (playing ? 0.65 : 0.12);
          beams[j].rotation.x = 0.35 + Math.cos(t * 0.6 + j) * 0.2;
          beams[j].children[1].material.opacity = playing ? 0.05 + level * 0.06 : 0.025;
        }
        for (j = 0; j < bulbs.length; j++) bulbs[j].scale.setScalar(
          playing && (j + Math.floor(t * 6)) % 3 === 0 ? 0.09 : 0.06);
        for (j = 0; j < lamps.length; j++) lamps[j].rotation.z = Math.sin(t + j) * 0.04;
      }
    };
  };

  root.makeTempleHall = function (T) {
    var k = kit(T), room = shell(T, k, '#8a3c2c', 4.2, '#875236');
    var g = room.group, roof = room.roof, blocked = room.blocked;
    var seats = [], solids = [], flames = [], smoke = [], next = timer(), knockLeft = 0;
    g.name = 'temple-hall';
    // Two slopes, with raised outer eaves and gold finials, all removable.
    [-1, 1].forEach(function (s) {
      var slope = k.add(roof, 'box', '#79312b', s * 6.3, 5.2, 0, 13.1, 0.25, 22.6);
      slope.rotation.z = -s * 0.15;
      var eave = k.add(roof, 'box', '#79312b', s * 13.1, 4.45, 0, 1.7, 0.22, 22.9);
      eave.rotation.z = s * 0.28;
      k.add(roof, 'box', gold, s * 13.85, 4.73, 0, 0.13, 0.12, 23);
      [-11.2, 11.2].forEach(function (z) {
        k.add(roof, 'cone', gold, s * 13.8, 5.0, z, 0.16, 0.75, 0.16).rotation.z = -s * 0.45;
      });
      lantern(k, g, s * 2.9, 3.45, 10.85);
      [-6, 2, 8].forEach(function (z) {
        k.add(g, 'cyl', red, s * 10.5, 2.1, z, 0.24, 4.2, 0.24);
        k.add(g, 'cyl', gold, s * 10.5, 0.16, z, 0.34, 0.32, 0.34);
        solids.push({ x: s * 10.5, z: z, r: 0.38 });
      });
      var banner = k.add(g, 'plane', k.label('NAM MÔ A DI ĐÀ PHẬT', red, gold),
        s * 11.96, 2.8, -2, 5, 0.8, 1); banner.rotation.y = -s * Math.PI / 2;
    });
    k.add(roof, 'cyl', gold, 0, 6.2, 0, 0.15, 23, 0.15).rotation.x = Math.PI / 2;
    k.add(g, 'plane', k.label('CHÙA NIỆM PHẬT', red, gold), 0, 3.78, 10.34, 8, 0.75, 1);
    for (var i = 0; i < 12; i++) k.add(g, 'box', '#ad7750', -11 + i * 2, 0.012, 0, 0.025, 0.024, 19.9);
    k.add(g, 'box', '#693d2e', 0, 0.25, -7.45, 16, 0.5, 4.9);
    rect(blocked, -8, 8, -9.9, -5);
    // Amitabha: lotus pedestal, crossed legs, robe, calm face, meditation hands.
    k.add(g, 'cyl', gold, 0, 0.68, -8, 1.65, 0.36, 1.65);
    for (i = 0; i < 10; i++) {
      var a = i * TAU / 10;
      var petal = k.add(g, 'ball', '#e9ab6f', Math.sin(a) * 1.3, 0.94, -8 + Math.cos(a) * 1.3, 0.48, 0.3, 0.7);
      petal.rotation.y = a;
    }
    var haloMat = new T.MeshBasicMaterial({ color: '#f9d477', transparent: true, opacity: 0.55, side: T.DoubleSide });
    var halo = k.add(g, 'ring', haloMat, 0, 3.15, -8.95, 1.48, 1.48, 1);
    k.add(g, 'ball', gold, -0.65, 1.28, -7.85, 0.95, 0.32, 0.65);
    k.add(g, 'ball', gold, 0.65, 1.28, -7.85, 0.95, 0.32, 0.65);
    k.add(g, 'cone', gold, 0, 2.06, -8.05, 1.05, 1.9, 0.7);
    [-1, 1].forEach(function (s) {
      k.add(g, 'ball', gold, s * 0.72, 2.03, -7.93, 0.29, 0.75, 0.32).rotation.z = s * 0.3;
      k.add(g, 'ball', '#f5d18d', s * 0.23, 1.64, -7.28, 0.28, 0.14, 0.23);
      k.add(g, 'ball', '#f5d18d', s * 0.48, 3.47, -8, 0.12, 0.29, 0.15);
      k.add(g, 'box', '#654333', s * 0.2, 3.48, -7.52, 0.19, 0.025, 0.025);
    });
    k.add(g, 'ball', '#f5d18d', 0, 3.44, -8, 0.5, 0.64, 0.46);
    k.add(g, 'ball', '#4a3837', 0, 3.95, -8.07, 0.51, 0.29, 0.43);
    k.add(g, 'ball', '#4a3837', 0, 4.27, -8.07, 0.19, 0.23, 0.19);
    k.add(g, 'box', '#b27556', 0, 3.23, -7.55, 0.18, 0.022, 0.025);
    k.add(g, 'plane', k.label('A DI ĐÀ PHẬT', red, gold), 0, 3.65, -9.96, 7, 0.8, 1);
    [-1, 1].forEach(function (s) {
      var couplet = k.add(g, 'plane', k.label(s < 0 ? 'TỪ BI HỶ XẢ' : 'AN LẠC TỰ TÂM', red, gold),
        s * 5.3, 2.75, -9.96, 3.2, 0.65, 1); couplet.rotation.z = Math.PI / 2;
    });
    k.add(g, 'box', red, 0, 1.08, -5.85, 11, 1.16, 1.25);
    k.add(g, 'box', gold, 0, 1.7, -5.85, 11.3, 0.12, 1.45);
    k.add(g, 'ball', gold, 0, 1.98, -5.8, 0.55, 0.25, 0.4);
    for (i = 0; i < 3; i++) {
      k.add(g, 'cyl', '#ad5941', (i - 1) * 0.18, 2.42, -5.8, 0.018, 0.65, 0.018);
      k.add(g, 'ball', k.mat('#ffac56', true), (i - 1) * 0.18, 2.75, -5.8, 0.025, 0.035, 0.025);
    }
    for (i = 0; i < 5; i++) {
      var sm = new T.MeshBasicMaterial({ color: '#f2e7cf', transparent: true, opacity: 0.15,
        depthWrite: false, side: T.DoubleSide });
      smoke.push(k.add(g, 'plane', sm, 0, 2.9 + i * 0.22, -5.8, 0.2, 0.3, 1));
    }
    [-1, 1].forEach(function (s) {
      k.add(g, 'ball', '#497a67', s * 4.5, 2, -5.9, 0.28, 0.3, 0.28);
      k.add(g, 'cyl', '#5d8256', s * 4.5, 2.45, -5.9, 0.025, 0.65, 0.025);
      for (var j = 0; j < 3; j++) k.add(g, 'ball', '#e8b1a1', s * 4.5 + (j - 1) * 0.17,
        2.78, -5.9, 0.14, j === 1 ? 0.26 : 0.19, 0.16);
      k.add(g, 'cyl', gold, s * 1.4, 1.92, -5.8, 0.15, 0.3, 0.15);
      flames.push(k.add(g, 'ball', k.mat('#ffe8a0', true), s * 1.4, 2.18, -5.8, 0.09, 0.17, 0.09));
    });
    var wood = k.pivot(g, -3, 1.86, -5.8);
    k.add(wood, 'ball', '#a86931', 0, 0.18, 0, 0.48, 0.38, 0.4);
    k.add(wood, 'box', dark, 0, 0.4, 0.31, 0.3, 0.045, 0.025);
    var mallet = k.pivot(g, -2.4, 2.35, -5.8);
    k.add(mallet, 'cyl', '#693d2e', -0.18, 0.12, 0, 0.035, 0.7, 0.035).rotation.z = -0.9;
    k.add(mallet, 'ball', gold, -0.45, -0.1, 0, 0.12, 0.12, 0.12);
    k.add(g, 'ball', gold, 3, 1.95, -5.8, 0.43, 0.26, 0.43);
    k.add(g, 'cyl', dark, 3, 2.14, -5.8, 0.34, 0.02, 0.34);
    for (var row = 0; row < 4; row++) {
      for (var col = 0; col < 5; col++) {
        var x = (col - 2) * 3.6, z = -2.9 + row * 3;
        k.add(g, 'cyl', '#ad6b24', x, 0.12, z, 0.7, 0.24, 0.7);
        k.add(g, 'cyl', '#deb34e', x, 0.26, z, 0.65, 0.12, 0.65);
        var seat = k.pivot(g, x, -0.33, z); seat.rotation.y = Math.PI;
        seat.name = 'temple-seat-' + seats.length; seats.push(seat);
      }
    }
    var warm = light(T, g, '#ffdc94', 1.2, 0, 3.9, -4.8, 23);
    light(T, g, '#ffe5b3', 1, 0, 3.9, 5, 24);
    return { group: g, roof: roof, name: 'Chùa Niệm Phật', seats: seats, solids: solids, blocked: blocked,
      knock: function () { knockLeft = 0.32; },
      update: function (dt, time, info) {
        var step = Number.isFinite(dt) ? Math.max(0, dt) : 0, t = next(dt, time);
        var chanting = info && Number.isFinite(info.chanting) ? Math.max(0, info.chanting) : 0;
        var strength = Math.min(1, chanting / 10);
        knockLeft = Math.max(0, knockLeft - step);
        var strike = Math.sin((1 - knockLeft / 0.32) * Math.PI);
        wood.scale.y = 1 - strike * 0.14; wood.position.y = 1.86 - strike * 0.03;
        mallet.rotation.z = -strike * 0.65;
        halo.material.opacity = 0.45 + strength * 0.3 + Math.sin(t * 0.8) * 0.04;
        warm.intensity = 1.1 + strength * 0.4;
        for (var j = 0; j < smoke.length; j++) {
          var phase = ((t * 0.18 + j / smoke.length) % 1 + 1) % 1;
          smoke[j].position.set(Math.sin(t * 0.6 + j) * 0.16, 2.8 + phase * 1.25, -5.8);
          smoke[j].scale.set(0.14 + phase * 0.4, 0.2 + phase * 0.4, 1);
          smoke[j].material.opacity = Math.sin(phase * Math.PI) * (0.12 + strength * 0.06);
        }
        for (j = 0; j < flames.length; j++) flames[j].scale.y = 0.17 + Math.sin(t * 5 + j) * 0.02;
      }
    };
  };

  root.makeCinemaRoom = function (T) {
    var k = kit(T), room = shell(T, k, '#24202f', 9.2, '#672839');
    var g = room.group, roof = room.roof, blocked = room.blocked;
    var seats = [], solids = [], bulbs = [], next = timer(), dim = 0;
    g.name = 'cinema-room';
    k.add(g, 'box', '#a52c3c', 0, 0.012, 0, 2.6, 0.024, 19.9);
    // The screen faces +Z; its bottom is 1.4 m above the flat floor.
    var screenY = 1.4 + 13 * 9 / 16 / 2;
    var rimMat = new T.MeshBasicMaterial({ color: '#977344' });
    k.add(g, 'box', rimMat, 0, screenY, -9.84, 13.65, 7.96, 0.12);
    k.add(g, 'box', '#090912', 0, screenY, -9.75, 13.4, 7.71, 0.12);
    var screen = k.add(g, 'plane', new T.MeshBasicMaterial({ color: '#ffffff' }),
      0, screenY, -9.67, 13, 13 * 9 / 16, 1);
    screen.name = 'video-screen';
    [-1, 1].forEach(function (s) {
      // Scalloped velvet curtains and speakers stay outside the image.
      for (var j = 0; j < 3; j++) k.add(g, 'cyl', j % 2 ? '#8b2335' : red,
        s * (7.15 + j * 0.65), 4.8, -9.45, 0.4, 7.6, 0.25);
      k.add(g, 'box', '#101019', s * 10.3, 1.55, -9.3, 1.1, 2.5, 0.9);
      rect(blocked, s < 0 ? -10.9 : 9.7, s < 0 ? -9.7 : 10.9, -9.9, -8.8);
      for (j = 0; j < 3; j++) {
        k.add(g, 'box', gold, s * 11.94, 3.1, -4 + j * 5, 0.1, 0.65, 0.6);
        k.add(g, 'box', k.mat('#ffdfa0', true), s * 11.87, 3.1, -4 + j * 5, 0.06, 0.45, 0.4);
      }
      var title = s < 0 ? 'MA LÀNG CHIẾU BÓNG' : 'DIÊM VƯƠNG ĐẠI CHIẾN';
      var posterMat = k.label(title, s < 0 ? '#413451' : '#6a252c', gold);
      var inside = k.add(g, 'plane', posterMat, s * 11.96, 2.5, 4, 5.4, 1.35, 1);
      inside.rotation.y = -s * Math.PI / 2;
      k.add(g, 'plane', posterMat, s * 7.5, 2.2, 10.34, 5.4, 1.35, 1);
    });
    // Four rows of eight seats: clear centre, side aisles and 2 m row gaps.
    // No risers: every seat is reachable from the same walkable floor.
    var xs = [-8.4, -6.4, -4.4, -2.4, 2.4, 4.4, 6.4, 8.4];
    for (var row = 0; row < 4; row++) {
      for (var col = 0; col < xs.length; col++) {
        var x = xs[col], z = -4.5 + row * 3.5;
        k.add(g, 'box', red, x, 0.48, z, 1.35, 0.8, 1.25);
        k.add(g, 'box', '#882337', x, 1.04, z + 0.54, 1.4, 1.3, 0.22);
        k.add(g, 'box', '#4b2632', x - 0.77, 0.73, z, 0.19, 0.3, 1.3);
        k.add(g, 'box', '#4b2632', x + 0.77, 0.73, z, 0.19, 0.3, 1.3);
        var seat = k.pivot(g, x, 0.18, z - 0.08);
        seat.rotation.y = Math.PI; seat.name = 'cinema-seat-' + seats.length;
        seats.push(seat);
        rect(blocked, x - 0.87, x + 0.87, z - 0.65, z + 0.65);
      }
    }
    // Compact concessions beside the entrance, clear of the rear cross aisle.
    k.add(g, 'box', red, -7.3, 0.65, 8.9, 4.4, 1.3, 1.2);
    k.add(g, 'box', gold, -7.3, 1.34, 8.9, 4.6, 0.08, 1.35);
    rect(blocked, -9.6, -5, 8.22, 9.58);
    k.add(g, 'plane', k.label('BẮP RANG + NƯỚC NGỌT', red, cream), -7.3, 2.7, 9.96, 4.6, 0.9, 1).rotation.y = Math.PI;
    for (var i = 0; i < 3; i++) {
      k.add(g, 'cyl', red, -8.5 + i * 0.75, 1.6, 8.9, 0.22, 0.44, 0.22);
      k.add(g, 'ball', cream, -8.5 + i * 0.75, 1.85, 8.9, 0.25, 0.14, 0.25);
    }
    k.add(g, 'box', '#673e56', -5.9, 1.9, 8.9, 0.65, 1.05, 0.7);
    k.add(g, 'plane', k.label('NƯỚC', dark, cream), -5.9, 2, 8.54, 0.55, 0.4, 1).rotation.y = Math.PI;
    // Marquee and canopy face the park, with no obstruction in the doorway.
    k.add(roof, 'box', '#3b293c', 0, 4.5, 11.2, 15, 0.25, 2.5);
    k.add(g, 'box', gold, 0, 3.84, 10.42, 14, 1.05, 0.16);
    k.add(g, 'plane', k.label('RẠP PHIM ÂM PHỦ', '#542037', cream), 0, 3.84, 10.52, 13.4, 0.8, 1);
    for (i = 0; i < 24; i++) {
      bulbs.push(k.add(g, 'ball', k.mat(i % 2 ? cream : gold, true),
        -6.6 + (i % 12) * 1.2, i < 12 ? 3.36 : 4.32, 10.57, 0.065, 0.065, 0.065));
    }
    var aisleMat = new T.MeshBasicMaterial({ color: '#8e6336' });
    for (i = 0; i < 8; i++) k.add(g, 'box', aisleMat, i % 2 ? 1.36 : -1.36,
      0.035, -4.5 + Math.floor(i / 2) * 3.5, 0.08, 0.07, 0.6);
    var house = light(T, g, '#ffe2b0', 1.4, 0, 4.1, 3, 26);
    var front = light(T, g, '#ffdfaa', 0.9, 0, 4.1, -5, 22);
    var ceilingMat = new T.MeshBasicMaterial({ color: '#ffe2b0' });
    k.add(roof, 'box', ceilingMat, 0, 9.01, 3, 3, 0.08, 1);
    k.add(roof, 'box', ceilingMat, 0, 9.01, -5, 3, 0.08, 1);
    return { group: g, roof: roof, name: 'Rạp phim Âm Phủ', seats: seats,
      screen: screen, solids: solids, blocked: blocked,
      update: function (dt, time, info) {
        var t = next(dt, time), step = Number.isFinite(dt) ? Math.max(0, dt) : 0;
        var target = info && info.playing ? 1 : 0;
        var level = info && Number.isFinite(info.level) ? Math.max(0, Math.min(1, info.level)) : 0;
        dim += (target - dim) * (1 - Math.exp(-step * 2));
        house.intensity = 1.4 - dim * 1.25; front.intensity = 0.9 - dim * 0.82;
        ceilingMat.color.setRGB(1 - dim * 0.9, 0.78 - dim * 0.7, 0.45 - dim * 0.4);
        aisleMat.color.setRGB(0.3 + dim * 0.22, 0.16 + dim * 0.13, 0.06);
        var glow = dim * (0.12 + level * 0.04);
        rimMat.color.setRGB(0.35 + glow, 0.25 + glow, 0.15 + glow * 0.5);
        for (var j = 0; j < bulbs.length; j++) bulbs[j].scale.setScalar(
          (j + Math.floor(t * 5)) % 4 === 0 ? 0.085 : 0.065);
      }
    };
  };

  root.__roomsSelfTest = function (T) {
    var rows = [];
    function assert(ok, msg) { if (!ok) throw new Error('Rooms self-test: ' + msg); }
    function inspect(m, count, cinema) {
      var meshes = 0, tris = 0, lights = 0;
      assert(m.group.isGroup && m.roof.isObject3D && m.roof.parent === m.group, m.name + ' API');
      assert(m.seats.length === count, m.name + ' seat count');
      m.group.position.set(7, 0, -3); m.group.rotation.y = 0.4;
      for (var frame = 0; frame < 120; frame++) {
        if (m.knock && frame % 30 === 0) m.knock();
        m.update(1 / 60, frame / 60, { playing: true, level: 0.8, chanting: 8 });
      }
      m.update(); m.update(NaN, NaN); m.update(0, -1, {});
      if (m.knock) { m.knock(); m.update(0.08, 2.1, { chanting: 1 }); }
      assert(m.group.position.x === 7 && m.group.position.z === -3 && m.group.rotation.y === 0.4, 'root moved');
      m.group.updateMatrixWorld(true);
      m.seats.forEach(function (seat) {
        assert(seat.isObject3D, 'invalid seat');
        var p = seat; while (p && p !== m.group) p = p.parent;
        assert(p === m.group, 'detached seat');
        var local = m.group.worldToLocal(seat.getWorldPosition(new T.Vector3()));
        assert(Math.abs(local.x) <= 12 && Math.abs(local.z) <= 10, 'seat outside room');
        var facing = new T.Vector3(0, 0, 1).applyQuaternion(seat.quaternion);
        assert(facing.z < -0.99, 'seat faces away from stage');
      });
      m.solids.forEach(function (s) {
        assert([s.x, s.z, s.r].every(Number.isFinite) && s.r > 0, 'invalid solid');
        var dx = Math.max(-1.5 - s.x, 0, s.x - 1.5), dz = Math.max(9 - s.z, 0, s.z - 11);
        assert(dx * dx + dz * dz >= s.r * s.r, 'solid blocks door');
      });
      m.blocked.forEach(function (b) {
        assert([b.x0, b.x1, b.z0, b.z1].every(Number.isFinite) && b.x0 < b.x1 && b.z0 < b.z1, 'invalid rectangle');
        assert(b.x1 <= -1.5 || b.x0 >= 1.5 || b.z1 <= 9 || b.z0 >= 11, 'rectangle blocks door');
      });
      m.group.traverse(function (o) {
        assert(o.matrixWorld.elements.every(Number.isFinite), 'nonfinite transform');
        if (o.isPointLight) { lights++; assert(Number.isFinite(o.intensity), 'invalid light'); }
        if (!o.isMesh) return;
        meshes++; var pos = o.geometry.attributes.position;
        assert(pos && pos.array.every(Number.isFinite), 'nonfinite vertices');
        tris += (o.geometry.index ? o.geometry.index.count : pos.count) / 3;
      });
      if (m.screen) {
        assert(m.screen.isMesh && m.screen.geometry.type === 'PlaneGeometry' && m.screen.material.isMeshBasicMaterial, 'screen API');
        assert(Math.abs(m.screen.scale.x / m.screen.scale.y - 16 / 9) < 1e-8, 'screen aspect');
        if (!cinema) assert(m.stage.isObject3D && m.stage.parent === m.group && m.stage.position.y === 0.7, 'stage API');
      }
      if (cinema) {
        assert(m.screen.parent === m.group && m.screen.rotation.y === 0, 'cinema screen facing');
        assert(Math.abs(m.screen.scale.x - 13) < 1e-8 &&
          Math.abs(m.screen.position.y - m.screen.scale.y / 2 - 1.4) < 1e-8, 'cinema screen size/height');
        m.seats.forEach(function (seat) {
          assert(seat.position.z - 0.65 - m.screen.position.z >= 3, 'cinema front clearance');
          // A standing point 1.3 m in front of every seat must be reachable.
          var x = seat.position.x, z = seat.position.z - 1.3;
          m.blocked.forEach(function (b) {
            assert(x + 0.3 <= b.x0 || x - 0.3 >= b.x1 || z + 0.3 <= b.z0 || z - 0.3 >= b.z1,
              'cinema seat approach blocked');
          });
        });
        m.blocked.forEach(function (b) {
          assert(b.x1 <= -1.3 || b.x0 >= 1.3 || b.z1 <= -10 || b.z0 >= 10, 'cinema centre aisle blocked');
        });
        var house = m.group.children.filter(function (o) { return o.isPointLight; })[0];
        assert(house, 'cinema house light');
        var before = house.intensity;
        m.update(2, 3, { playing: false });
        assert(house.intensity > before, 'cinema lights restore');
        before = house.intensity;
        m.update(2, 5, { playing: true, level: 1 });
        assert(house.intensity < before, 'cinema lights dim');
      }
      assert(meshes <= 220 && lights <= 3, m.name + ' budget exceeded: ' + meshes);
      rows.push({ name: m.name, meshes: meshes, tris: Math.round(tris), lights: lights, seats: m.seats.length });
    }
    inspect(root.makeKaraokeRoom(T), 20); inspect(root.makeTempleHall(T), 20);
    inspect(root.makeCinemaRoom(T), 32, true);
    return { ok: true, rows: rows };
  };
})(typeof window !== 'undefined' ? window : globalThis);
