(function (root) {
  'use strict';

  // Rebirth mascots, Three r128. Shared resources belong to this module: do not
  // dispose their geometry/material when removing a single player from the scene.
  var caches = new WeakMap();
  var forms = ['nguoi', 'ty', 'suu', 'dan', 'mao', 'thin', 'ti', 'ngo', 'mui', 'than', 'dau', 'tuat', 'hoi', 'tien'];
  var C = { ink: '#292334', white: '#fff6e5', pink: '#f98da4', gold: '#edc568', brown: '#80513d' };

  function kit(T) {
    if (caches.has(T)) return caches.get(T);
    var g = {
      ball: new T.SphereGeometry(1, 10, 6),
      tiny: new T.SphereGeometry(1, 6, 4),
      box: new T.BoxGeometry(1, 1, 1),
      cone: new T.ConeGeometry(1, 1, 6),
      ring: new T.TorusGeometry(1, 0.13, 4, 16)
    };
    var mats = new Map(), shapes = new Map();
    function material(color) {
      var key = new T.Color(color).getHexString();
      if (!mats.has(key)) mats.set(key, new T.MeshStandardMaterial({
        color: '#' + key, roughness: 0.68, metalness: key === 'edc568' ? 0.35 : 0.02, flatShading: true
      }));
      return mats.get(key);
    }
    // Bake little ornaments into one cached geometry per material/parent.
    // Each part is [geometry, x,y,z, sx,sy,sz, rotationZ, rotationX].
    function compound(parts) {
      var key = JSON.stringify(parts);
      if (shapes.has(key)) return shapes.get(key);
      var positions = [], normals = [];
      parts.forEach(function (p) {
        var src = g[p[0]].toNonIndexed();
        var matrix = new T.Matrix4().compose(new T.Vector3(p[1], p[2], p[3]),
          new T.Quaternion().setFromEuler(new T.Euler(p[8] || 0, 0, p[7] || 0)),
          new T.Vector3(p[4], p[5], p[6]));
        src.applyMatrix4(matrix);
        Array.prototype.push.apply(positions, src.attributes.position.array);
        Array.prototype.push.apply(normals, src.attributes.normal.array);
        src.dispose();
      });
      var geo = new T.BufferGeometry();
      geo.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
      geo.setAttribute('normal', new T.Float32BufferAttribute(normals, 3));
      shapes.set(key, geo);
      return geo;
    }
    function tube(points, radius) {
      var key = JSON.stringify([points, radius]);
      if (!shapes.has(key)) {
        var curve = new T.CatmullRomCurve3(points.map(function (p) { return new T.Vector3(p[0], p[1], p[2]); }));
        shapes.set(key, new T.TubeGeometry(curve, Math.max(12, points.length * 4), radius, 5, false));
      }
      return shapes.get(key);
    }
    var result = { g: g, material: material, compound: compound, tube: tube };
    caches.set(T, result);
    return result;
  }

  root.makeRebornAvatar = function (T, opts) {
    opts = opts || {};
    var form = forms.indexOf(opts.form) < 0 ? 'nguoi' : opts.form;
    var female = opts.gender === 'nu', human = form === 'nguoi', fairy = form === 'tien';
    var k = kit(T), group = new T.Group();
    group.name = 'reborn-' + form + '-' + (female ? 'nu' : 'nam');
    group.userData.form = form;
    var colors = { skin: opts.skin || '#f4c7a8', robe: opts.robe || '#62bec0', hair: opts.hair || '#45313c' };
    var slots = { skin: [], robe: [], hair: [] }, eyes = [], arms = [], legs = [], ears = [], ribbons = [], sparks = [];
    function pivot(parent, x, y, z) {
      var p = new T.Group(); p.position.set(x || 0, y || 0, z || 0); parent.add(p); return p;
    }
    function mesh(parent, geo, color, x, y, z, sx, sy, sz, rz, rx) {
      var slot = slots[color] ? color : null;
      var m = new T.Mesh(typeof geo === 'string' ? k.g[geo] : geo, k.material(slot ? colors[slot] : color));
      m.position.set(x || 0, y || 0, z || 0);
      m.scale.set(sx === undefined ? 1 : sx, sy === undefined ? 1 : sy, sz === undefined ? 1 : sz);
      m.rotation.set(rx || 0, 0, rz || 0); m.castShadow = true; m.receiveShadow = true;
      parent.add(m); if (slot) slots[slot].push(m); return m;
    }
    function batch(parent, color, parts) { return mesh(parent, k.compound(parts), color); }
    function path(parent, color, points, radius) { return mesh(parent, k.tube(points, radius), color); }
    function part(geo, x, y, z, sx, sy, sz, rz, rx) { return [geo, x, y, z, sx, sy, sz, rz || 0, rx || 0]; }
    var body = pivot(group), head = pivot(body, 0, human || fairy ? 1.22 : 0.94, 0);
    var hide = ({ty:'#a6a7bc', suu:'#574746', dan:'#f5a044', mao:'#fff1da', thin:'#69b98b', ti:'#83bf7d', ngo:'#b67c55', mui:'#f7ecd2', than:'#a16b4c', dau:'#f5d196', tuat:'#eac078', hoi:'#f3a5b8'})[form] || 'skin';
    var tail = null, halo = null;
    mesh(head, 'ball', hide, 0, 0, 0, 0.34, 0.32, 0.285);
    // Eyes are individual pivots: blink catches both glints without squashing the cheeks.
    [-1, 1].forEach(function (s) {
      var e = pivot(head, s * 0.128, 0.035, 0.268); eyes.push(e);
      mesh(e, 'tiny', C.ink, 0, 0, 0, 0.052, 0.072, 0.029);
      batch(e, '#ffffff', [part('tiny', 0.015, 0.025, 0.023, 0.019, 0.023, 0.009), part('tiny', -0.017, -0.024, 0.024, 0.009, 0.011, 0.007)]);
    });
    batch(head, C.pink, [-1, 1].map(function (s) { return part('tiny', s * 0.226, -0.059, 0.226, 0.052, 0.028, 0.018); }));
    // A tiny curved smile, fully in front of the muzzle-free face.
    path(head, '#85434d', [[-0.035,-0.108,0.276],[0,-0.125,0.283],[0.035,-0.108,0.276]], 0.008);

    if (form === 'ti') {
      // One coiled snake body, with no hidden legs or arms.
      path(body, hide, [[0.16,0.13,0.02],[-0.29,0.13,0.12],[-0.33,0.14,-0.16],[0.18,0.16,-0.27],[0.32,0.22,0.09],[-0.16,0.28,0.22],[-0.20,0.35,-0.05],[0,0.47,-0.09],[0,0.76,0]], 0.115);
      mesh(body, 'ball', '#e8e7ae', 0, 0.58, 0.055, 0.13, 0.27, 0.09);
      mesh(head, 'box', '#de627a', 0, -0.15, 0.36, 0.023, 0.014, 0.13);
      path(head, '#de627a', [[-0.032,-0.15,0.47],[0,-0.15,0.42],[0.032,-0.15,0.47]], 0.008);
      mesh(body, 'ball', 'robe', 0, 0.75, 0.04, 0.175, 0.065, 0.13);
      mesh(body, 'cone', 'robe', 0.12, 0.64, 0.11, 0.07, 0.21, 0.04, 0.35, Math.PI);
    } else {
      mesh(body, 'ball', human ? 'robe' : fairy ? C.white : hide, 0, fairy ? 0.66 : 0.52, 0, human ? 0.23 : 0.26, fairy ? 0.39 : 0.30, 0.19);
      [-1, 1].forEach(function (s, i) {
        if (!fairy) {
          var leg = pivot(body, s * 0.135, 0.27, 0); legs.push(leg);
          mesh(leg, 'ball', human ? '#4b6c92' : hide, 0, -0.095, 0, 0.095, 0.175, 0.10);
          mesh(leg, 'ball', human ? C.white : form === 'dau' ? C.gold : hide, 0, -0.21, 0.055, 0.115, 0.06, 0.15);
        }
        var arm = pivot(body, s * 0.265, fairy ? 0.87 : 0.70, 0); arms.push(arm);
        mesh(arm, 'ball', human ? 'skin' : fairy ? C.white : hide, s * 0.025, -0.12, 0, form === 'dau' ? 0.12 : 0.085, 0.20, 0.085, s * 0.17);
      });
      if (human) {
        mesh(body, 'ball', 'skin', 0, 0.86, 0, 0.075, 0.10, 0.075);
        // T-shirt sleeves, collar, trainer soles and jean pockets.
        batch(body, 'robe', [-1,1].map(function(s) {return part('ball',s*0.27,0.70,0,0.10,0.105,0.105); }));
        batch(body, C.white, [part('box',0,0.74,0.163,0.10,0.025,0.02),part('box',-0.135,0.025,0.07,0.20,0.025,0.25),part('box',0.135,0.025,0.07,0.20,0.025,0.25)]);
      } else if (!fairy) {
        mesh(body, 'ball', 'robe', 0, 0.60, 0.177, 0.18, 0.18, 0.035);
        mesh(body, 'tiny', C.gold, 0, 0.69, 0.217, 0.032, 0.034, 0.014);
      }
    }

    function earPair(geo, x, y, sx, sy, inner, droop) {
      [-1,1].forEach(function(s) {
        var ep = pivot(head, s*x, y, -0.015); ears.push(ep);
        ep.userData.rest = s * (droop || 0);
        ep.rotation.z = ep.userData.rest;
        mesh(ep, geo, hide, 0, 0, 0, sx, sy, 0.075);
        if (inner) mesh(ep, geo, inner, 0, 0, 0.056, sx*0.60, sy*0.65, 0.018);
      });
    }
    function tailPath(color, points, radius) { tail = pivot(body); path(tail, color, points, radius); }
    function muzzle(color, sx, sy, z) { mesh(head,'ball',color,0,-0.108,z,sx,sy,0.10); }
    function nose(color, sx, y, z) { mesh(head,'tiny',color,0,y,z,sx,sx*0.72,sx*0.55); }
    if (human || fairy) {
      batch(head, 'skin', [-1,1].map(function(s) {return part('tiny',s*0.33,-0.015,0,0.055,0.075,0.055); }));
      batch(head, 'hair', [part('ball',0,0.16,-0.045,0.345,0.19,0.27),part('ball',-0.14,0.17,0.18,0.17,0.10,0.10,-0.25),part('ball',0.12,0.20,0.15,0.16,0.09,0.10,0.3)]);
      if (female) mesh(head,'ball','hair',0,-0.13,-0.19,0.30,0.38,0.13);
      if (fairy) {
        // Cloud is low enough to anchor the resting model at y=0.
        batch(body, C.white, [part('ball',0,0.09,0,0.30,0.09,0.24),part('ball',-0.22,0.12,0.02,0.17,0.10,0.17),part('ball',0.22,0.12,0.02,0.17,0.10,0.17)]);
        mesh(body,'cone',C.white,0,0.50,0,0.28,0.65,0.22);
        batch(body,C.gold,[part('box',0,0.70,0.192,0.32,0.04,0.025),part('box',0,0.90,0.18,0.035,0.24,0.025)]);
        [-1,1].forEach(function(s) {
          var ribbon = pivot(body,s*0.23,0.84,0); ribbons.push(ribbon);
          path(ribbon,'robe',[[0,0,0],[s*0.20,-0.06,-0.05],[s*0.26,0.18,-0.12],[s*0.35,0.06,-0.18],[s*0.26,-0.38,-0.15]],0.035);
        });
        halo = pivot(head,0,0.03,-0.18);
        mesh(halo,'ring',C.gold,0,0,0,0.38,0.38,0.38);
        batch(halo, C.gold, [-1,1].map(function(s) {return part('tiny',s*0.37,0.10,0,0.025,0.045,0.018,s*0.6); }));
        if (!female) {
          mesh(head,'cone',C.white,0,-0.26,0.23,0.135,0.31,0.07,Math.PI);
          mesh(head,'ball',C.white,0,0.29,-0.08,0.13,0.11,0.12);
          // The immortal's hair is silver, independent of modern human defaults.
          if (!opts.hair) slots.hair.forEach(function(m) { m.material = k.material(C.white); });
        } else mesh(head,'ball',C.gold,0,0.27,0.16,0.06,0.07,0.025);
        for (var sp=0;sp<3;sp++) {
          var start = sp * Math.PI * 2 / 3;
          sparks.push(mesh(body,'tiny',C.gold,Math.cos(start)*0.43,0.69+Math.sin(start*1.7)*0.32,Math.sin(start)*0.25,0.025,0.035,0.025));
        }
      }
    } else if (form === 'ty') {
      earPair('ball',0.29,0.23,0.17,0.18,C.pink);
      muzzle(C.white,0.16,0.09,0.25); nose(C.pink,0.045,-0.07,0.35);
      batch(head,C.white,[-1,1].map(function(s){return part('box',s*0.025,-0.20,0.325,0.043,0.075,0.025);}));
      tailPath(C.pink,[[0,0.36,-0.15],[0.25,0.26,-0.35],[0.40,0.36,-0.42],[0.37,0.53,-0.40]],0.026);
    } else if (form === 'suu') {
      earPair('ball',0.32,0.10,0.13,0.07,C.pink,-0.25);
      [-1,1].forEach(function(s){path(head,C.white,[[s*0.22,0.20,-0.04],[s*0.38,0.23,-0.04],[s*0.42,0.38,-0.03],[s*0.33,0.44,-0.02]],0.045);});
      muzzle('#ae8b79',0.23,0.12,0.25);
      batch(head,C.ink,[-1,1].map(function(s){return part('tiny',s*0.085,-0.10,0.343,0.023,0.018,0.012);}));
      mesh(head,'ring',C.gold,0,-0.19,0.36,0.065,0.065,0.065);
      tailPath(hide,[[0,0.40,-0.15],[0.20,0.30,-0.27],[0.25,0.16,-0.25]],0.035);
    } else if (form === 'dan' || form === 'mao') {
      earPair(form === 'mao' ? 'cone' : 'ball',0.25,0.25,0.115,0.15,C.pink,form === 'mao' ? -0.22 : 0);
      muzzle(C.white,0.18,0.09,0.245); nose('#9c5b61',0.035,-0.08,0.34);
      tailPath(form === 'dan' ? hide : C.white,[[0,0.36,-0.15],[0.28,0.36,-0.30],[0.39,0.60,-0.30],[0.33,0.76,-0.30]],0.055);
      if (form === 'dan') {
        var stripes = [part('box',0,0.205,0.245,0.025,0.13,0.025)];
        [0.15,0.205,0.26].forEach(function(y){stripes.push(part('box',0,y,0.245,0.17,0.018,0.025));});
        [-1,1].forEach(function(s){[0,1].forEach(function(i){stripes.push(part('box',s*0.28,-0.04-i*0.07,0.17,0.09,0.023,0.04,s*0.3));});});
        batch(head,C.ink,stripes);
        batch(tail,C.ink,[part('ball',0.37,0.58,-0.30,0.058,0.023,0.058),part('ball',0.35,0.70,-0.30,0.054,0.024,0.054)]);
      } else {
        batch(head,'#d4975b',[part('ball',-0.22,0.15,0.13,0.12,0.13,0.09)]);
        batch(head,C.ink,[part('ball',0.23,0.16,0.105,0.105,0.12,0.10)]);
        var whiskers=[];
        [-1,1].forEach(function(s){[-1,1].forEach(function(a){whiskers.push(part('box',s*0.26,-0.10+a*0.025,0.30,0.17,0.009,0.012,s*a*0.17));});});
        batch(head,C.brown,whiskers);
      }
    } else if (form === 'thin') {
      earPair('cone',0.29,0.10,0.12,0.14,'#e8cf85',-0.8);
      muzzle('#c9df9c',0.20,0.095,0.25);
      [-1,1].forEach(function(s){
        batch(head,C.gold,[part('cone',s*0.21,0.32,-0.04,0.05,0.25,0.05,-s*0.3),part('cone',s*0.28,0.34,-0.04,0.035,0.13,0.035,-s*0.9)]);
        path(head,C.white,[[s*0.10,-0.12,0.34],[s*0.27,-0.19,0.34],[s*0.41,-0.13,0.29],[s*0.43,-0.02,0.23]],0.013);
      });
      tailPath(hide,[[0,0.37,-0.15],[0.22,0.36,-0.32],[0.33,0.52,-0.38],[0.35,0.69,-0.35]],0.075);
      batch(body,C.gold,[part('cone',0,0.90,-0.27,0.10,0.17,0.05,0,-0.5),part('cone',0,0.68,-0.19,0.09,0.16,0.06,0,-0.6),part('cone',0.34,0.73,-0.36,0.12,0.18,0.05)]);
    } else if (form === 'ngo') {
      earPair('ball',0.21,0.28,0.075,0.17,C.pink,-0.16);
      muzzle('#d4a67a',0.17,0.18,0.25);
      batch(head,C.brown,[-1,1].map(function(s){return part('tiny',s*0.065,-0.17,0.35,0.023,0.018,0.012);}));
      batch(head,C.ink,[part('ball',0,0.26,0.02,0.11,0.13,0.24),part('ball',0,-0.12,-0.23,0.13,0.36,0.12)]);
      tailPath(C.ink,[[0,0.40,-0.17],[0.09,0.26,-0.30],[0.07,0.12,-0.34]],0.065);
    } else if (form === 'mui') {
      earPair('ball',0.32,0.07,0.14,0.07,C.pink,0.30);
      [-1,1].forEach(function(s){path(head,'#b69970',[[s*0.22,0.24,-0.04],[s*0.34,0.33,-0.10],[s*0.28,0.45,-0.13],[s*0.16,0.44,-0.10],[s*0.14,0.34,-0.06],[s*0.22,0.32,0]],0.045);});
      nose('#b08c7a',0.038,-0.08,0.29);
      mesh(head,'cone',C.white,0,-0.28,0.19,0.065,0.19,0.065,Math.PI);
      tailPath(hide,[[0,0.35,-0.17],[0.14,0.43,-0.26],[0.18,0.50,-0.22]],0.045);
    } else if (form === 'than') {
      // Heart-like peach face mask sits behind the eyes, across both temples.
      batch(head,'#f2c3a5',[part('ball',-0.12,0.015,0.18,0.17,0.20,0.085),part('ball',0.12,0.015,0.18,0.17,0.20,0.085)]);
      earPair('ball',0.33,0.025,0.12,0.13,C.pink);
      muzzle('#f2c3a5',0.13,0.09,0.25); nose(C.brown,0.025,-0.07,0.345);
      tailPath(hide,[[0,0.38,-0.17],[0.30,0.32,-0.33],[0.45,0.51,-0.31],[0.40,0.71,-0.29],[0.25,0.71,-0.29],[0.25,0.59,-0.29]],0.040);
      mesh(head,'cone',hide,0,0.32,-0.02,0.10,0.16,0.10,-0.3);
    } else if (form === 'dau') {
      batch(head,'#dc5261',[-1,0,1].map(function(s){return part('ball',s*0.085,0.30,0,0.075,0.12-(Math.abs(s)*0.025),0.055);}));
      mesh(head,'cone','#efb644',0,-0.095,0.32,0.10,0.18,0.07,0,Math.PI/2);
      mesh(head,'ball','#dc5261',0,-0.23,0.23,0.06,0.08,0.045);
      tail = pivot(body,0,0.30,-0.16);
      ['#439b88','#4c749d','#d87960'].forEach(function(color,i){mesh(tail,'ball',color,(i-1)*0.13,0.27,-0.10,0.075,0.32,0.07,-(i-1)*0.35,-0.5);});
    } else if (form === 'tuat') {
      earPair('ball',0.31,0.065,0.095,0.24,'#b88759',0.33);
      muzzle(C.white,0.18,0.10,0.245); nose(C.ink,0.055,-0.075,0.345);
      mesh(head,'ball',C.pink,0,-0.195,0.325,0.043,0.066,0.018);
      tailPath(hide,[[0,0.35,-0.16],[0.22,0.44,-0.30],[0.25,0.62,-0.25]],0.055);
    } else if (form === 'hoi') {
      earPair('cone',0.23,0.24,0.13,0.18,'#e883a0',-0.55);
      muzzle('#e883a0',0.18,0.12,0.26);
      batch(head,'#a95878',[-1,1].map(function(s){return part('tiny',s*0.065,-0.10,0.358,0.026,0.033,0.014);}));
      tailPath(hide,[[0,0.37,-0.17],[0.10,0.38,-0.30],[0.17,0.43,-0.33],[0.14,0.50,-0.34],[0.06,0.49,-0.34],[0.055,0.42,-0.34],[0.12,0.42,-0.34]],0.025);
    }

    var elapsed = 0;
    return {
      group: group,
      setColors: function (next) {
        next = next || {};
        Object.keys(slots).forEach(function (slot) {
          if (next[slot] === undefined) return;
          colors[slot] = next[slot];
          var mat = k.material(next[slot]);
          slots[slot].forEach(function(m) { m.material = mat; });
        });
      },
      update: function (dt, moving, time) {
        elapsed = Number.isFinite(time) ? time : elapsed + (Number.isFinite(dt) ? Math.max(0,dt) : 0);
        var swing = Math.sin(elapsed * 9) * (moving ? 0.48 : 0.025);
        arms.forEach(function(p,i){p.rotation.x = (i ? -1 : 1)*swing*(fairy ? 0.18 : 1);});
        legs.forEach(function(p,i){p.rotation.x = (i ? 1 : -1)*swing;});
        body.position.y = fairy ? 0.025 + Math.sin(elapsed*2.2)*0.025 : moving ? Math.abs(Math.sin(elapsed*9))*0.025 : Math.sin(elapsed*2.2)*0.008;
        body.rotation.z = form === 'ti' ? Math.sin(elapsed*(moving ? 6 : 2))*0.045 : 0;
        head.rotation.z = Math.sin(elapsed*1.8)*0.025;
        eyes.forEach(function(p){p.scale.y = ((elapsed%3.6+3.6)%3.6)>3.47 ? 0.08 : 1;});
        ears.forEach(function(p,i){p.rotation.z = p.userData.rest + Math.sin(elapsed*2.3+i)*0.035;});
        if (tail) tail.rotation.y = Math.sin(elapsed*(moving ? 7 : 2.6))*0.14;
        ribbons.forEach(function(p,i){p.rotation.z = Math.sin(elapsed*2+i)*0.12; p.rotation.x = Math.sin(elapsed*2.4+i)*0.08;});
        if (halo) halo.rotation.z = elapsed*0.18;
        sparks.forEach(function(p,i){var a=elapsed*0.8+i*Math.PI*2/3;p.position.set(Math.cos(a)*0.43,0.69+Math.sin(a*1.7)*0.32,Math.sin(a)*0.25);});
      }
    };
  };

  root.__rebornSelfTest = function (T) {
    var rows = [];
    function assert(ok, message) { if (!ok) throw new Error('Reborn self-test: ' + message); }
    function inspect(a, label) {
      var meshes=0, tris=0;
      a.group.updateMatrixWorld(true);
      a.group.traverse(function(o){
        assert(o.matrixWorld.elements.every(Number.isFinite),label+' transform');
        if (!o.isMesh) return;
        meshes++;
        var pos=o.geometry.attributes.position;
        assert(pos.array.every(Number.isFinite),label+' vertices');
        assert(o.material.isMeshStandardMaterial,label+' material');
        tris+=(o.geometry.index ? o.geometry.index.count : pos.count)/3;
      });
      assert(meshes<=35,label+' meshes='+meshes);
      assert(tris<=3000,label+' tris='+tris);
      return { meshes: meshes, tris: tris };
    }
    forms.forEach(function(form){['nam','nu'].forEach(function(gender){
      var a=root.makeRebornAvatar(T,{form:form,gender:gender});
      var label=form+'-'+gender, counts=inspect(a,label);
      var b=new T.Box3().setFromObject(a.group), height=b.max.y-b.min.y;
      assert(Math.abs(b.min.y)<0.06,label+' foot origin '+b.min.y);
      assert(height>=(form==='nguoi'||form==='tien'?1.45:1.2)&&height<=(form==='nguoi'||form==='tien'?1.8:1.5),label+' height='+height);
      var twin=root.makeRebornAvatar(T,{form:form,gender:gender});
      var first=[],second=[];
      a.group.traverse(function(o){if(o.isMesh)first.push(o);});
      twin.group.traverse(function(o){if(o.isMesh)second.push(o);});
      first.forEach(function(o,i){assert(o.geometry===second[i].geometry&&o.material===second[i].material,label+' shared resources');});
      var originals=second.map(function(o){return o.material.color.getHexString();});
      a.setColors({robe:'#abcdef',skin:'#123456',hair:'#654321'});
      assert(first.some(function(o){return o.material.color.getHexString()==='abcdef';}),label+' robe recoloring');
      second.forEach(function(o,i){assert(o.material.color.getHexString()===originals[i],label+' color isolation');});
      a.group.position.set(2,0,5); a.group.rotation.y=0.7; a.group.scale.setScalar(1.1);
      [0,0.4,1.8,3.52,7.1].forEach(function(time){a.update(1/60,true,time);inspect(a,label);a.update(1/60,false,time);inspect(a,label);});
      a.update(1/60,true);a.update(NaN,false);a.update(-1,false);
      assert(a.group.position.x===2&&a.group.position.y===0&&a.group.position.z===5&&a.group.rotation.y===0.7&&a.group.scale.x===1.1,label+' root preserved');
      inspect(a,label);
      rows.push({form:form,gender:gender,meshes:counts.meshes,tris:counts.tris,height:Number(height.toFixed(3))});
    });});
    [undefined,'unknown','__proto__'].forEach(function(form){assert(root.makeRebornAvatar(T,{form:form}).group.userData.form==='nguoi','fallback');});
    assert(root.makeRebornAvatar(T).group.userData.form==='nguoi','missing opts');
    // Shared caches intentionally survive: self-test must not dispose live avatars.
    return {ok:true,rows:rows};
  };
})(typeof window !== 'undefined' ? window : globalThis);
