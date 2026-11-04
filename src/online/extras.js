/* Cảnh trang trí dùng three.js r128; không tải tài nguyên bên ngoài. */
window.buildExtras = function (THREE, scene, h) {
  'use strict';

  const root = new THREE.Group();
  root.name = 'Canh trang tri am phu';
  scene.add(root);
  const swaying = [];
  const black = h.M(0x201e28);
  const red = h.M(0x781f29);
  const gold = h.M(0xc59a51, { metalness: 0.55, roughness: 0.4 });
  const stone = h.M(0x575567);
  const iron = h.M(0x343943, { metalness: 0.7, roughness: 0.45 });
  const steel = h.M(0xb0bdc6, { metalness: 0.8, roughness: 0.3 });
  const glow = h.M(0xc72d39, { emissive: 0x9e1823, emissiveIntensity: 0.65 });
  const cube = new THREE.BoxGeometry(1, 1, 1);
  const pole = new THREE.CylinderGeometry(0.34, 0.42, 1, 8);
  const lampBody = new THREE.SphereGeometry(0.36, 8, 6);
  const lampCap = new THREE.CylinderGeometry(0.25, 0.25, 0.1, 8);
  const link = new THREE.TorusGeometry(0.12, 0.027, 4, 8);
  const twig = new THREE.CylinderGeometry(0.08, 0.15, 1, 5);
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0, 0);
  bladeShape.lineTo(0.19, 0.2);
  bladeShape.lineTo(0.16, 0.85);
  bladeShape.lineTo(-0.09, 1.2);
  bladeShape.lineTo(-0.12, 0.24);
  bladeShape.closePath();
  const blade = new THREE.ExtrudeGeometry(bladeShape, {
    depth: 0.045, bevelEnabled: false, steps: 1
  });

  // Scale a shared unit box rather than allocate a geometry per block.
  function block(w, height, d, mat, x, y, z, parent) {
    const m = h.mesh(cube, mat, x, y, z, parent || root);
    m.scale.set(w, height, d);
    return m;
  }
  function solid(x, z, r) { h.solids.push({ x: x, z: z, r: r }); }
  function sign(text, width, height, x, y, z, facing) {
    const mat = h.M(0xffffff, { map: h.labelTex(text), roughness: 0.8 });
    const panel = block(width, height, 0.12, mat, x, y, z);
    panel.rotation.y = facing || 0;
    return panel;
  }
  function roof(x, y, z, width, depth) {
    for (const side of [-1, 1]) {
      const tile = block(width, 0.2, depth * 0.56, black,
        x, y - 0.25, z + side * depth * 0.24);
      tile.rotation.x = side * 0.25;
    }
    block(width + 0.2, 0.16, 0.18, gold, x, y, z);
  }
  function lantern(x, y, z, phase) {
    const pivot = new THREE.Group();
    pivot.position.set(x, y, z);
    root.add(pivot);
    block(0.035, 0.35, 0.035, iron, 0, -0.175, 0, pivot);
    const body = h.mesh(lampBody, glow, 0, -0.78, 0, pivot);
    body.scale.y = 1.2;
    h.mesh(lampCap, gold, 0, -0.38, 0, pivot);
    h.mesh(lampCap, gold, 0, -1.18, 0, pivot);
    block(0.045, 0.27, 0.045, gold, 0, -1.36, 0, pivot);
    swaying.push({ pivot: pivot, phase: phase });
  }

  // Tam quan: the clear central opening between bases is 5.55 units wide.
  for (const x of [-7, -3.3, 3.3, 7]) {
    const height = Math.abs(x) < 4 ? 6.4 : 5.2;
    block(1.05, 0.35, 1.05, stone, x, 0.175, 20);
    const column = h.mesh(pole, red, x, height / 2, 20, root);
    column.scale.y = height;
    block(0.85, 0.2, 0.85, gold, x, height - 0.25, 20);
    solid(x, 20, 0.75);
  }
  for (const x of [-5.15, 0, 5.15]) {
    const central = x === 0;
    const y = central ? 6.5 : 5.25;
    const width = central ? 7.6 : 4.2;
    block(width, 0.45, 0.65, red, x, y - 0.45, 20);
    roof(x, y + 0.4, 20, width, 2.7);
  }
  // Both approaches can read the gate's name.
  sign('QUỶ MÔN QUAN', 5.2, 1, 0, 5.55, 19.6, Math.PI);
  sign('QUỶ MÔN QUAN', 5.2, 1, 0, 5.55, 20.4, 0);
  lantern(-5.15, 4.8, 19.5, 0);
  lantern(5.15, 4.8, 19.5, 1.7);

  // Scenic raised pavilion. The game has no stair climbing for extras,
  // so the platform and each stair footprint are registered as solids.
  block(4.4, 0.5, 4.4, black, -18, 0.25, -4);
  block(3.8, 2.1, 3.8, stone, -18, 1.55, -4);
  block(4.6, 0.3, 4.6, gold, -18, 2.75, -4);
  for (const dx of [-1.6, 0, 1.6]) {
    for (const dz of [-1.6, 0, 1.6]) solid(-18 + dx, -4 + dz, 1);
  }
  for (let i = 0; i < 6; i++) {
    const height = 0.45 * (6 - i);
    const z = -1.4 + i * 0.52;
    block(2.4, height, 0.55, stone, -18, height / 2, z);
    for (const dx of [-0.8, 0, 0.8]) solid(-18 + dx, z, 0.48);
  }
  for (const x of [-19.6, -16.4]) {
    for (const z of [-5.6, -2.4]) {
      const column = h.mesh(pole, red, x, 4.15, z, root);
      column.scale.set(0.45, 2.6, 0.45);
    }
  }
  roof(-18, 5.75, -4, 5.3, 5.2);
  sign('VỌNG HƯƠNG ĐÀI', 3.8, 0.7, -18, 5.05, -1.95, 0);
  lantern(-18, 5.3, -4, 2.8);

  // Ten blade trees sit beyond radius 32 about (0, 2). Their crowns
  // stay outside the walking boundary, away from the river and hall.
  for (let i = 0; i < 10; i++) {
    const angle = 0.12 + i * (Math.PI - 0.24) / 9;
    const radius = 35 + (i % 3) * 0.7;
    const tree = new THREE.Group();
    tree.position.set(Math.cos(angle) * radius, 0, 2 + Math.sin(angle) * radius);
    tree.rotation.y = i * 1.3;
    root.add(tree);
    const height = 4.5 + (i % 3) * 0.6;
    const trunk = h.mesh(pole, black, 0, height / 2, 0, tree);
    trunk.scale.set(0.7, height, 0.7);
    for (let j = 0; j < 4; j++) {
      const branch = new THREE.Group();
      branch.position.y = height * 0.42 + j * 0.65;
      branch.rotation.y = j * 2.4;
      branch.rotation.z = -0.85;
      tree.add(branch);
      const wood = h.mesh(twig, black, 0, 0.55, 0, branch);
      wood.scale.y = 1.1;
      h.mesh(blade, steel, 0, 0.95, 0, branch);
    }
  }

  // Hanging links follow a sag between the existing hall columns.
  // Chain bottom remains above the player's head; no ground blockers.
  function chain(ax, az, bx, bz, phase) {
    const dx = bx - ax, dz = bz - az;
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      const y = 5.2 - 0.7 * Math.sin(Math.PI * t);
      const ring = h.mesh(link, iron, ax + dx * t, y, az + dz * t, root);
      const tangent = new THREE.Vector3(dx, -0.7 * Math.PI * Math.cos(Math.PI * t), dz).normalize();
      ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
      ring.rotateY((i % 2) * Math.PI / 2);
      ring.scale.y = Math.hypot(dx, dz) / 2.4;
    }
    lantern((ax + bx) / 2, 4.5, (az + bz) / 2, phase);
  }
  for (const z of [-19, -31]) {
    chain(-11, z, -6, z, 0.3 + z);
    chain(6, z, 11, z, 1.2 + z);
  }
  chain(-11, -19, -11, -31, 2.2);
  chain(11, -19, 11, -31, 3.5);

  // Absolute time avoids accumulated drift, including after a paused tab.
  return function update(dt, time) {
    const t = Number.isFinite(time) ? time : 0;
    for (const lamp of swaying) {
      lamp.pivot.rotation.z = Math.sin(t * 1.35 + lamp.phase) * 0.09;
      lamp.pivot.rotation.x = Math.sin(t * 0.95 + lamp.phase) * 0.045;
    }
  };
};
