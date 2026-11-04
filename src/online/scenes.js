(function (root) {
  'use strict';

  // Three r128. All dimensions are metres; fronts face +Z. No external assets.
  // Per-THREE caches also allow a preview to use a separate Three installation.
  var caches = new WeakMap();
  function kit(T) {
    if (caches.has(T)) return caches.get(T);
    var geo = {
      box: new T.BoxGeometry(1, 1, 1),
      ball: new T.SphereGeometry(1, 10, 8),
      puff: new T.SphereGeometry(1, 6, 4),
      cyl: new T.CylinderGeometry(1, 1, 1, 12),
      bowl: new T.CylinderGeometry(1, 0.62, 1, 12),
      cone: new T.ConeGeometry(1, 1, 8),
      ring: new T.TorusGeometry(1, 0.09, 4, 12),
      plane: new T.PlaneGeometry(1, 1)
    };
    var mats = Object.create(null), labels = Object.create(null);
    function mat(color, glow) {
      var key = color + ':' + (glow || 0);
      if (!mats[key]) mats[key] = new T.MeshStandardMaterial({
        color: color, roughness: 0.78, flatShading: true,
        emissive: glow ? color : 0x000000, emissiveIntensity: glow || 0
      });
      return mats[key];
    }
    function add(p, shape, color, x, y, z, w, h, d) {
      var m = new T.Mesh(geo[shape], typeof color === 'string' ? mat(color) : color);
      m.position.set(x, y, z); m.scale.set(w, h, d);
      m.castShadow = true; m.receiveShadow = true; p.add(m); return m;
    }
    function pivot(p, x, y, z) {
      var g = new T.Group(); g.position.set(x, y, z); p.add(g); return g;
    }
    function label(text, portrait) {
      var key = portrait ? 'portrait' : text;
      if (labels[key]) return labels[key];
      var canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
      var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
      if (!ctx) return mat(portrait ? '#e8cfac' : '#982f2e');
      canvas.width = portrait ? 256 : 1024; canvas.height = portrait ? 320 : 256;
      ctx.fillStyle = portrait ? '#e9dfcb' : '#982f2e'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#f5cc73'; ctx.lineWidth = 12;
      ctx.strokeRect(9, 9, canvas.width - 18, canvas.height - 18);
      if (portrait) {
        ctx.fillStyle = '#596c79'; ctx.beginPath(); ctx.ellipse(128, 295, 86, 86, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#443530'; ctx.beginPath(); ctx.ellipse(128, 123, 79, 89, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f4cba9'; ctx.beginPath(); ctx.ellipse(128, 145, 70, 75, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#443530'; ctx.beginPath(); ctx.ellipse(121, 80, 66, 25, -0.12, 0, Math.PI * 2); ctx.fill();
        [100, 156].forEach(function (x) {
          ctx.fillStyle = '#29232a'; ctx.beginPath(); ctx.ellipse(x, 143, 10, 14, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fff8ef'; ctx.beginPath(); ctx.arc(x + 3, 138, 4, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ed9c95'; ctx.beginPath(); ctx.ellipse(x, 170, 14, 7, 0, 0, Math.PI * 2); ctx.fill();
        });
        ctx.strokeStyle = '#8b5045'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(128, 175, 12, 0.15, Math.PI - 0.15); ctx.stroke();
        // Mourning ribbon, contained inside the black wooden frame.
        ctx.fillStyle = '#26232b'; ctx.beginPath(); ctx.moveTo(0, 55); ctx.lineTo(55, 0);
        ctx.lineTo(96, 0); ctx.lineTo(0, 96); ctx.fill();
      } else {
        ctx.fillStyle = '#ffe7a2'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = 'bold 76px "Arial", sans-serif'; ctx.fillText(text, 512, 132, 950);
      }
      var tex = new T.CanvasTexture(canvas); tex.encoding = T.sRGBEncoding;
      labels[key] = new T.MeshStandardMaterial({ map: tex, roughness: 0.9, emissive: '#ffffff', emissiveMap: tex, emissiveIntensity: 0.18 });
      return labels[key];
    }
    var k = { geo: geo, mat: mat, add: add, pivot: pivot, label: label };
    caches.set(T, k); return k;
  }

  function clock() {
    var elapsed = 0;
    return function (dt, time) {
      elapsed = Number.isFinite(time) ? time : elapsed + (Number.isFinite(dt) ? Math.max(0, dt) : 0);
      return elapsed;
    };
  }

  // Each puff owns its fading material; geometry remains shared. Never change
  // cached opacity, which would couple separate stalls' animation clocks.
  function steam(T, k, parent, x, y, z, count, height) {
    var parts = [];
    for (var i = 0; i < count; i++) {
      var m = new T.MeshStandardMaterial({ color: '#fff4df', transparent: true,
        opacity: 0, depthWrite: false, roughness: 1, flatShading: true });
      var p = k.add(parent, 'puff', m, x, y, z, 0.04, 0.08, 0.04);
      p.castShadow = false; p.receiveShadow = false; p.name = 'steam-' + i; parts.push(p);
    }
    return function (t) {
      parts.forEach(function (p, i) {
        var phase = ((t * 0.35 + i / count) % 1 + 1) % 1;
        p.position.set(x + Math.sin(t * 1.4 + i) * phase * 0.12, y + phase * height, z + Math.cos(t + i) * phase * 0.06);
        p.scale.set(0.035 + phase * 0.075, 0.07 + phase * 0.12, 0.035 + phase * 0.075);
        p.material.opacity = Math.sin(phase * Math.PI) * 0.28;
      });
    };
  }

  function lantern(k, p, x, y, z, color) {
    var g = k.pivot(p, x, y, z); g.name = 'lantern';
    k.add(g, 'cyl', '#9b683e', 0, -0.07, 0, 0.012, 0.14, 0.012);
    k.add(g, 'ball', k.mat(color, 0.28), 0, -0.29, 0, 0.16, 0.21, 0.16);
    k.add(g, 'cyl', '#f4ca67', 0, -0.48, 0, 0.08, 0.035, 0.08);
    k.add(g, 'cyl', '#d55b46', 0, -0.57, 0, 0.018, 0.16, 0.018);
    return g;
  }

  function kneeler(k, p, x, z, scale, robe, hair, bun) {
    var g = k.pivot(p, x, 0.035, z); g.rotation.y = Math.PI; g.scale.setScalar(scale); g.name = 'kneeling-family';
    // Folded shins stay on the floor while the upper body bows from the hips.
    [-1, 1].forEach(function (s) { k.add(g, 'ball', '#444751', s * 0.16, 0.13, -0.11, 0.15, 0.13, 0.32); });
    var torso = k.pivot(g, 0, 0.29, 0);
    k.add(torso, 'bowl', robe, 0, 0.25, 0, 0.28, 0.53, 0.22);
    k.add(torso, 'ball', '#f1c6a5', 0, 0.85, 0.015, 0.33, 0.34, 0.30);
    k.add(torso, 'ball', hair, 0, 1.01, -0.07, 0.335, 0.21, 0.27);
    if (bun) k.add(torso, 'ball', hair, 0, 1.1, -0.28, 0.13, 0.13, 0.12);
    [-1, 1].forEach(function (s) {
      k.add(torso, 'ball', '#29232b', s * 0.105, 0.86, 0.296, 0.042, 0.052, 0.018);
      k.add(torso, 'puff', '#fff8ed', s * 0.105 + 0.012, 0.88, 0.312, 0.015, 0.017, 0.008);
      k.add(torso, 'ball', '#ef9e99', s * 0.185, 0.78, 0.263, 0.052, 0.026, 0.014);
      var arm = k.add(torso, 'ball', robe, s * 0.21, 0.42, 0.18, 0.105, 0.23, 0.10);
      arm.rotation.x = -0.7; arm.rotation.z = s * 0.45;
    });
    k.add(torso, 'box', '#8c5147', 0, 0.75, 0.309, 0.048, 0.012, 0.012);
    k.add(torso, 'ball', '#f1c6a5', 0, 0.46, 0.36, 0.10, 0.11, 0.085);
    k.add(torso, 'cyl', '#be784d', 0, 0.72, 0.39, 0.012, 0.5, 0.012);
    k.add(torso, 'ball', k.mat('#ff683c', 0.7), 0, 0.97, 0.39, 0.018, 0.025, 0.018);
    return torso;
  }

  root.makeAltarRoom = function (T) {
    var k = kit(T), g = new T.Group(), next = clock(); g.name = 'altar-room';
    var a = k.add, animations = [];
    a(g, 'box', '#dfbc91', 0, -0.09, 0, 8, 0.18, 8);
    // Thin grout lines keep the tiled floor to fifteen meshes instead of 64.
    for (var i = -3; i <= 3; i++) {
      a(g, 'box', '#f4dfba', i, 0.003, 0, 0.018, 0.006, 8);
      a(g, 'box', '#f4dfba', 0, 0.003, i, 8, 0.006, 0.018);
    }
    a(g, 'box', '#f4dfb9', 0, 2, -4, 8, 4, 0.16);
    [-1, 1].forEach(function (s) {
      a(g, 'box', '#ead1a7', s * 4, 0.55, 0, 0.16, 1.1, 8);
      a(g, 'box', '#a06a46', s * 4, 1.12, 0, 0.20, 0.09, 8);
      a(g, 'box', '#ad7149', s * 3, 2.45, -3.88, 1.4, 1.8, 0.10);
      a(g, 'box', k.mat('#fff0bd', 0.85), s * 3, 2.45, -3.80, 1.22, 1.62, 0.035);
      a(g, 'box', '#ad7149', s * 3, 2.45, -3.75, 0.055, 1.65, 0.05);
      a(g, 'box', '#ad7149', s * 3, 2.45, -3.75, 1.25, 0.055, 0.05);
      a(g, 'box', '#8f302b', s * 2.05, 2.6, -3.82, 0.45, 2.05, 0.08);
      a(g, 'plane', k.label(s < 0 ? 'UỐNG NƯỚC NHỚ NGUỒN' : 'ĐỜI ĐỜI NHỚ ƠN'), s * 2.05, 2.6, -3.77, 1.88, 0.4, 1).rotation.z = -Math.PI / 2;
    });
    var hemi = new T.HemisphereLight('#fff1d3', '#95705b', 0.85); hemi.position.y = 4; g.add(hemi);
    var sun = new T.PointLight('#ffe4ad', 1.15, 15, 2); sun.position.set(2.8, 3.6, -1); g.add(sun);
    // Lacquer altar: top surface y=1.60, open space beside the incense bowl.
    a(g, 'box', '#8d302b', 0, 1.49, -2.85, 3.55, 0.22, 1.30);
    a(g, 'box', '#edbd62', 0, 1.38, -2.85, 3.62, 0.065, 1.35);
    a(g, 'box', '#a43a30', 0, 1.14, -2.32, 3.25, 0.36, 0.12);
    a(g, 'box', '#ebbd65', 0, 1.14, -2.245, 1.55, 0.06, 0.035);
    [-1, 1].forEach(function (s) { a(g, 'box', '#792d29', s * 1.48, 0.65, -2.86, 0.19, 1.3, 0.92); });
    a(g, 'box', '#29262b', 0, 2.53, -3.53, 1.10, 1.37, 0.13);
    a(g, 'plane', k.label('', true), 0, 2.53, -3.455, 0.97, 1.23, 1);
    a(g, 'bowl', '#b5c8c9', 0, 1.77, -2.51, 0.25, 0.34, 0.25);
    a(g, 'cyl', '#ac8762', 0, 1.944, -2.51, 0.22, 0.012, 0.22);
    for (i = -1; i <= 1; i++) {
      a(g, 'cyl', '#b16e40', i * 0.085, 2.19, -2.51, 0.012, 0.50, 0.012);
      a(g, 'ball', k.mat('#ff6135', 0.9), i * 0.085, 2.45, -2.51, 0.017, 0.028, 0.017);
    }
    animations.push(steam(T, k, g, 0, 2.48, -2.51, 5, 0.88));
    [-1, 1].forEach(function (s) {
      a(g, 'cyl', '#d5a251', s * 1.42, 1.68, -2.55, 0.15, 0.16, 0.15);
      a(g, 'cyl', '#fff1bd', s * 1.42, 1.95, -2.55, 0.067, 0.43, 0.067);
      var f = a(g, 'ball', k.mat('#ffb941', 0.95), s * 1.42, 2.23, -2.55, 0.055, 0.12, 0.055);
      f.name = 'candle-flame';
      var light = new T.PointLight('#ffcf77', 0.3, 2.4, 2); light.position.copy(f.position); g.add(light);
      animations.push(function (t) { f.scale.y = 0.11 + Math.sin(t * 8 + s) * 0.018; light.intensity = 0.28 + Math.sin(t * 8 + s) * 0.04; });
    });
    a(g, 'cyl', '#d9a955', -0.85, 1.64, -2.66, 0.38, 0.045, 0.30);
    ['#d9b944', '#ed9653', '#81a550', '#c65950', '#a7bc5a'].forEach(function (color, j) {
      a(g, 'ball', color, -0.85 + Math.cos(j * 1.26) * 0.19, 1.78 + (j === 4 ? 0.09 : 0), -2.66 + Math.sin(j * 1.26) * 0.13, 0.13, 0.14, 0.12);
    });
    a(g, 'bowl', '#85a9a5', 1.02, 1.85, -3.08, 0.15, 0.5, 0.15);
    for (i = 0; i < 3; i++) {
      var fx = 0.88 + i * 0.14, fy = 2.25 + (i % 2) * 0.15;
      a(g, 'cyl', '#749456', fx, 2.08, -3.08, 0.012, 0.5, 0.012);
      a(g, 'ball', '#f7c64e', fx, fy, -3.08, 0.13, 0.105, 0.08);
      a(g, 'ball', '#c88c35', fx, fy, -2.998, 0.04, 0.04, 0.012);
    }
    var family = [kneeler(k, g, -1.12, 0.15, 1.02, '#729e9b', '#393036', false),
      kneeler(k, g, 0.95, -0.1, 0.96, '#bc8194', '#3b2d2d', true),
      kneeler(k, g, 0.1, 1.25, 0.70, '#e4b55b', '#4b342d', false)];
    return {
      group: g, seat: new T.Vector3(0.62, 1.60, -2.60),
      cam: { pos: new T.Vector3(5.7, 5.1, 7.8), look: new T.Vector3(0, 1.45, -1.35) },
      update: function (dt, time) {
        var t = next(dt, time);
        animations.forEach(function (fn) { fn(t); });
        family.forEach(function (body, j) { body.rotation.x = 0.10 + (1 - Math.cos(t * 1.25 + j * 1.8)) * 0.38; });
      }
    };
  };

  var stallInfo = {
    xoi: ['XÔI CÚNG', '#cf6547'], banhbao: ['BÁNH BAO', '#729d90'],
    comchay: ['CƠM CHAY', '#89a25b'], che: ['CHÈ NGỌT', '#ba83a3'], trasua: ['TRÀ SỮA ÂM PHỦ', '#9781b2']
  };
  root.makeFoodStall = function (T, type) {
    if (!Object.prototype.hasOwnProperty.call(stallInfo, type)) type = 'xoi';
    var k = kit(T), a = k.add, g = new T.Group(), next = clock(), animations = [];
    g.name = 'food-stall-' + type;
    var info = stallInfo[type], top = 1.08;
    a(g, 'box', '#98603f', 0, 0.52, 0, 2.26, 1.04, 1.12);
    a(g, 'box', '#edc58b', 0, 1.04, 0, 2.4, 0.08, 1.32);
    a(g, 'box', '#f6dfb5', 0, 0.55, 0.57, 1.98, 0.63, 0.025);
    a(g, 'plane', k.label('ĂN NGON • TÍCH PHƯỚC'), 0, 0.55, 0.588, 1.78, 0.38, 1);
    [-1, 1].forEach(function (s) { a(g, 'box', '#815438', s * 1.04, 1.23, -0.43, 0.10, 2.46, 0.10); });
    // Broad stripes slope down toward the customer, with a scalloped valance.
    for (var i = 0; i < 6; i++) {
      var color = i % 2 ? '#fff0cc' : info[1], x = (i - 2.5) * 0.4;
      a(g, 'box', color, x, 2.43, 0, 0.4, 0.09, 1.44).rotation.x = 0.14;
      a(g, 'ball', color, x, 2.26, 0.70, 0.20, 0.13, 0.045);
    }
    a(g, 'box', '#70462f', 0, 2.06, 0.22, 1.91, 0.39, 0.10);
    a(g, 'plane', k.label(info[0]), 0, 2.06, 0.277, 1.81, 0.32, 1);
    var lamp = lantern(k, g, -0.98, 2.31, 0.55, '#ec9361');
    function plate(x, z, r) { return a(g, 'cyl', '#fff0d4', x, top + 0.025, z, r, 0.05, r); }
    function pot(x, z, color) {
      a(g, 'cyl', color, x, 1.28, z, 0.28, 0.37, 0.28);
      a(g, 'cyl', '#dbc5a1', x, 1.47, z, 0.25, 0.025, 0.25);
      [-1, 1].forEach(function (s) { a(g, 'box', '#5e514a', x + s * 0.32, 1.36, z, 0.12, 0.06, 0.12); });
    }
    if (type === 'xoi') {
      [-1, 1].forEach(function (s) {
        plate(s * 0.52, 0.06, 0.39);
        a(g, 'box', '#668947', s * 0.52, 1.12, 0.06, 0.61, 0.015, 0.48).rotation.y = s * 0.18;
        a(g, 'ball', s < 0 ? '#d85932' : '#e9bf4e', s * 0.52, 1.16, 0.06, 0.29, 0.18, 0.26);
        a(g, 'puff', '#f4da82', s * 0.52, 1.325, 0.06, 0.10, 0.025, 0.09);
      });
      animations.push(steam(T, k, g, 0, 1.36, 0.05, 3, 0.45));
    } else if (type === 'banhbao') {
      for (i = 0; i < 3; i++) {
        a(g, 'cyl', '#c3945e', -0.38, 1.18 + i * 0.16, -0.08, 0.42, 0.14, 0.42);
        a(g, 'ring', '#ebc98f', -0.38, 1.26 + i * 0.16, -0.08, 0.41, 0.41, 0.41).rotation.x = Math.PI / 2;
      }
      for (i = 0; i < 3; i++) {
        var bx = -0.56 + i * 0.18;
        a(g, 'ball', '#fff3df', bx, 1.64, -0.06 + (i % 2) * 0.19, 0.14, 0.12, 0.14);
        a(g, 'cone', '#f1dfc5', bx, 1.75, -0.06 + (i % 2) * 0.19, 0.045, 0.07, 0.045);
      }
      plate(0.57, 0.15, 0.30);
      a(g, 'ball', '#fff3df', 0.57, 1.23, 0.15, 0.19, 0.15, 0.19);
      a(g, 'cone', '#f1dfc5', 0.57, 1.37, 0.15, 0.055, 0.07, 0.055);
      animations.push(steam(T, k, g, -0.35, 1.8, -0.05, 4, 0.45));
    } else if (type === 'comchay') {
      pot(-0.64, -0.15, '#a7b5b0');
      a(g, 'ball', '#fff1d4', -0.64, 1.49, -0.15, 0.23, 0.06, 0.23);
      plate(0.12, 0.12, 0.30); plate(0.69, -0.12, 0.25);
      for (i = 0; i < 4; i++) {
        a(g, 'ball', i % 2 ? '#ec9851' : '#72a157', 0.02 + (i % 2) * 0.17, 1.17, -0.01 + Math.floor(i / 2) * 0.19, 0.11, 0.07, 0.10);
        a(g, 'box', '#f4d9a2', 0.61 + (i % 2) * 0.16, 1.17, -0.21 + Math.floor(i / 2) * 0.18, 0.13, 0.09, 0.13);
      }
      a(g, 'bowl', '#fff0d4', 0.75, 1.20, 0.39, 0.13, 0.18, 0.13);
      [-1, 1].forEach(function (s) { a(g, 'box', '#6c4935', 0.73 + s * 0.027, 1.32, 0.39, 0.016, 0.016, 0.42).rotation.y = 0.3; });
      animations.push(steam(T, k, g, -0.64, 1.57, -0.15, 3, 0.5));
    } else if (type === 'che') {
      pot(-0.65, -0.16, '#8e686e');
      for (i = 0; i < 3; i++) {
        var cx = -0.04 + i * 0.34;
        ['#c68a72', '#9cb87c', '#f7e9c8'].forEach(function (c, j) { a(g, 'cyl', c, cx, 1.16 + j * 0.10, 0.19, 0.12, 0.10, 0.12); });
        a(g, 'box', '#d7eee6', cx, 1.44, 0.19, 0.08, 0.065, 0.08).rotation.y = i * 0.5;
      }
    } else {
      for (i = 0; i < 3; i++) {
        var tx = (i - 1) * 0.57;
        // Visible pearls on the front of the creamy cup avoid transparency sorting.
        a(g, 'bowl', '#ce9e73', tx, 1.34, 0.12, 0.18, 0.47, 0.18);
        a(g, 'cyl', '#f8e6bd', tx, 1.58, 0.12, 0.19, 0.035, 0.19);
        a(g, 'cyl', info[1], tx + 0.04, 1.77, 0.12, 0.029, 0.39, 0.029).rotation.z = -0.14;
        for (var j = 0; j < 4; j++) a(g, 'puff', '#3e2c31', tx + (j % 2 ? 0.065 : -0.065), 1.17 + Math.floor(j / 2) * 0.075, 0.267, 0.034, 0.034, 0.028);
      }
    }
    return { group: g, update: function (dt, time) {
      var t = next(dt, time); lamp.rotation.z = Math.sin(t * 1.6) * 0.065;
      animations.forEach(function (fn) { fn(t); });
    } };
  };

  root.__scenesSelfTest = function (T) {
    var rows = [], ownedMaterials = new Set();
    function assert(ok, text) { if (!ok) throw new Error('Scenes self-test: ' + text); }
    function inspect(model, name, limit) {
      var meshes = 0, tris = 0;
      model.group.position.set(3, 0, -2);
      [0, 0.25, 3.7, 10000, -1].forEach(function (t) { model.update(1 / 60, t); });
      model.update(1 / 60); model.update(); model.update(NaN, NaN);
      model.group.updateMatrixWorld(true);
      assert(model.group.position.x === 3 && model.group.position.z === -2, name + ' root moved');
      model.group.traverse(function (o) {
        assert(o.matrixWorld.elements.every(Number.isFinite), name + ' invalid transform');
        if (!o.isMesh) return;
        meshes++;
        var p = o.geometry.attributes.position;
        assert(p && p.array.every(Number.isFinite), name + ' invalid vertices');
        assert(Number.isFinite(o.material.opacity), name + ' invalid opacity');
        tris += (o.geometry.index ? o.geometry.index.count : p.count) / 3;
        if (o.name.indexOf('steam-') === 0) ownedMaterials.add(o.material);
      });
      assert(meshes <= limit, name + ' mesh budget exceeded: ' + meshes);
      rows.push({ name: name, meshes: meshes, tris: Math.round(tris) });
    }
    try {
      var room = root.makeAltarRoom(T);
      assert(room.seat.isVector3 && room.cam.pos.isVector3 && room.cam.look.isVector3, 'room vectors missing');
      assert(room.seat.y === 1.60 && Math.abs(room.seat.x) < 1.7 && room.seat.z > -3.5 && room.seat.z < -2.2, 'seat must be on altar');
      var family = [], smoke, lights = 0;
      room.group.traverse(function (o) {
        if (o.name === 'kneeling-family') family.push(o);
        if (o.name === 'steam-0') smoke = o;
        if (o.isLight) lights++;
      });
      assert(family.length >= 3 && lights >= 2, 'family or room lighting missing');
      family.forEach(function (o) { assert(Math.abs(o.rotation.y - Math.PI) < 0.001, 'family must face -Z'); });
      room.update(0, 0.2); var sy = smoke.position.y, bow = family[0].children[2].rotation.x;
      room.update(0, 1.2);
      assert(smoke.position.y !== sy && family[0].children[2].rotation.x !== bow, 'room animation frozen');
      inspect(room, 'altar-room', 150);
      Object.keys(stallInfo).forEach(function (type) {
        var stall = root.makeFoodStall(T, type), lamp;
        stall.group.traverse(function (o) { if (o.name === 'lantern') lamp = o; });
        stall.update(0, 0); var old = lamp.rotation.z; stall.update(0, 1);
        assert(lamp.rotation.z !== old, type + ' lantern frozen');
        var bounds = new T.Box3().setFromObject(stall.group), size = bounds.getSize(new T.Vector3());
        assert(Math.abs(bounds.min.y) < 0.001 && size.x <= 2.5 && size.z <= 1.6 && size.y >= 2.4 && size.y <= 2.7, type + ' dimensions');
        inspect(stall, type, 60);
      });
      assert(root.makeFoodStall(T, 'unknown').group.name === 'food-stall-xoi', 'fallback');
      return { ok: true, rows: rows };
    } finally {
      // Only dispose private test smoke materials. Shared caches belong to the game.
      ownedMaterials.forEach(function (m) { m.dispose(); });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
