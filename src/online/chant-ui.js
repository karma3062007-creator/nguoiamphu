(function (root) {
  'use strict';

  // Antigravity Chant UI (Chùa Niệm Phật)
  // Giao diện niệm Phật 108 hạt xoay & tụng Bát Nhã Ba La Mật Đa Tâm Kinh
  // Pure JavaScript, không thư viện ngoài, CSS class tiền tố cu-

  var SUTRA_TEXT = [
    {
      text: "Quán Tự Tại Bồ Tát, hành thâm Bát Nhã Ba La Mật Đa thời, chiếu kiến ngũ uẩn giai không, độ nhất thiết khổ ách.",
      words: ["Quán", "Tự", "Tại", "Bồ", "Tát,", "hành", "thâm", "Bát", "Nhã", "Ba", "La", "Mật", "Đa", "thời,", "chiếu", "kiến", "ngũ", "uẩn", "giai", "không,", "độ", "nhất", "thiết", "khổ", "ách."]
    },
    {
      text: "Xá Lợi Tử! Sắc bất dị không, không bất dị sắc, sắc tức thị không, không tức thị sắc; thọ, tưởng, hành, thức, diệc phục như thị.",
      words: ["Xá", "Lợi", "Tử!", "Sắc", "bất", "dị", "không,", "không", "bất", "dị", "sắc,", "sắc", "tức", "thị", "không,", "không", "tức", "thị", "sắc;", "thọ,", "tưởng,", "hành,", "thức,", "diệc", "phục", "như", "thị."]
    },
    {
      text: "Xá Lợi Tử! Thị chư pháp không tướng: bất sanh, bất diệt; bất cấu, bất tịnh; bất tăng, bất giảm.",
      words: ["Xá", "Lợi", "Tử!", "Thị", "chư", "pháp", "không", "tướng:", "bất", "sanh,", "bất", "diệt;", "bất", "cấu,", "bất", "tịnh;", "bất", "tăng,", "bất", "giảm."]
    },
    {
      text: "Thị cố không trung vô sắc, vô thọ, tưởng, hành, thức; vô nhãn, nhĩ, tỷ, thiệt, thân, ý; vô sắc, thanh, hương, vị, xúc, pháp; vô nhãn giới nãi chí vô ý thức giới;",
      words: ["Thị", "cố", "không", "trung", "vô", "sắc,", "vô", "thọ,", "tưởng,", "hành,", "thức;", "vô", "nhãn,", "nhĩ,", "tỷ,", "thiệt,", "thân,", "ý;", "vô", "sắc,", "thanh,", "hương,", "vị,", "xúc,", "pháp;", "vô", "nhãn", "giới", "nãi", "chí", "vô", "ý", "thức", "giới;"]
    },
    {
      text: "vô vô minh diệc, vô vô minh tận, nãi chí vô lão tử, diệc vô lão tử tận; vô khổ, tập, diệt, đạo; vô trí diệc vô đắc.",
      words: ["vô", "vô", "minh", "diệc,", "vô", "vô", "minh", "tận,", "nãi", "chí", "vô", "lão", "tử,", "diệc", "vô", "lão", "tử", "tận;", "vô", "khổ,", "tập,", "diệt,", "đạo;", "vô", "trí", "diệc", "vô", "đắc."]
    },
    {
      text: "Dĩ vô sở đắc cố, Bồ Đề tát đỏa y Bát Nhã Ba La Mật Đa cố, tâm vô quái ngại; vô quái ngại cố, vô hữu khủng bố, viễn ly điên đảo mộng tưởng, cứu cánh Niết Bàn.",
      words: ["Dĩ", "vô", "sở", "đắc", "cố,", "Bồ", "Đề", "tát", "đỏa", "y", "Bát", "Nhã", "Ba", "La", "Mật", "Đa", "cố,", "tâm", "vô", "quái", "ngại;", "vô", "quái", "ngại", "cố,", "vô", "hữu", "khủng", "bố,", "viễn", "ly", "điên", "đảo", "mộng", "tưởng,", "cứu", "cánh", "Niết", "Bàn."]
    },
    {
      text: "Tam thế chư Phật, y Bát Nhã Ba La Mật Đa cố, đắc A Nậu Đa La Tam Miệu Tam Bồ Đề.",
      words: ["Tam", "thế", "chư", "Phật,", "y", "Bát", "Nhã", "Ba", "La", "Mật", "Đa", "cố,", "đắc", "A", "Nậu", "Đa", "La", "Tam", "Miệu", "Tam", "Bồ", "Đề."]
    },
    {
      text: "Cố tri Bát Nhã Ba La Mật Đa, thị đại thần chú, thị đại minh chú, thị vô thượng chú, thị vô đẳng đẳng chú, năng trừ nhất thiết khổ, chân thật bất hư.",
      words: ["Cố", "tri", "Bát", "Nhã", "Ba", "La", "Mật", "Đa,", "thị", "đại", "thần", "chú,", "thị", "đại", "minh", "chú,", "thị", "vô", "thượng", "chú,", "thị", "vô", "đẳng", "đẳng", "chú,", "năng", "trừ", "nhất", "thiết", "khổ,", "chân", "thật", "bất", "hư."]
    },
    {
      text: "Cố thuyết Bát Nhã Ba La Mật Đa chú, tức thuyết chú viết:",
      words: ["Cố", "thuyết", "Bát", "Nhã", "Ba", "La", "Mật", "Đa", "chú,", "tức", "thuyết", "chú", "viết:"]
    },
    {
      text: "Yết đế yết đế, ba la yết đế, ba la tăng yết đế, Bồ đề tát bà ha.",
      words: ["Yết", "đế", "yết", "đế,", "ba", "la", "yết", "đế,", "ba", "la", "tăng", "yết", "đế,", "Bồ", "đề", "tát", "bà", "ha."]
    }
  ];

  // Flatten words with punctuation info
  var ALL_SUTRA_WORDS = [];
  SUTRA_TEXT.forEach(function (para, pIdx) {
    para.words.forEach(function (w, wIdx) {
      var isSentenceEnd = /[,.!;:]$/.test(w) || (wIdx === para.words.length - 1);
      ALL_SUTRA_WORDS.push({
        text: w,
        paraIndex: pIdx,
        wordIndex: wIdx,
        isSentenceEnd: isSentenceEnd
      });
    });
  });

  function ensureStyles() {
    if (document.getElementById('cu-styles')) return;
    var style = document.createElement('style');
    style.id = 'cu-styles';
    style.textContent = [
      '.cu-wrap {',
      '  position: absolute; inset: auto 0 0 0; z-index: 60;',
      '  display: flex; flex-direction: column; align-items: center;',
      '  pointer-events: none; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Be Vietnam Pro", sans-serif;',
      '  user-select: none; -webkit-user-select: none;',
      '}',
      '.cu-card {',
      '  pointer-events: auto; width: 100%; max-width: 820px;',
      '  background: linear-gradient(180deg, #fbf7ee 0%, #f4ede0 100%);',
      '  border: 2px solid #e8b765; border-bottom: none; border-radius: 20px 20px 0 0;',
      '  box-shadow: 0 -8px 32px rgba(26, 10, 8, 0.45);',
      '  padding: 12px 16px env(safe-area-inset-bottom, 12px);',
      '  box-sizing: border-box; display: flex; flex-direction: column; gap: 8px;',
      '  color: #3b2219; max-height: 42vh; overflow: hidden; position: relative;',
      '}',
      '@media (max-height: 500px) and (orientation: landscape) {',
      '  .cu-wrap { inset: 0 0 0 auto; width: 46%; }',
      '  .cu-card { max-height: 100vh; height: 100%; border-radius: 20px 0 0 20px; border-bottom: 2px solid #e8b765; border-right: none; }',
      '}',
      '.cu-header {',
      '  display: flex; align-items: center; justify-content: space-between;',
      '  gap: 8px; border-bottom: 1px solid rgba(232, 183, 101, 0.45); padding-bottom: 6px;',
      '}',
      '.cu-tabs { display: flex; gap: 6px; }',
      '.cu-tab-btn {',
      '  background: #ede2cf; border: 1px solid #d8ba82; border-radius: 8px;',
      '  padding: 5px 12px; font-size: 0.82rem; font-weight: 700; color: #5a3825;',
      '  cursor: pointer; transition: all 0.15s ease;',
      '}',
      '.cu-tab-btn:hover { background: #e5d5be; color: #3b1e10; }',
      '.cu-tab-btn.cu-active {',
      '  background: #d97706; border-color: #b45309; color: #fff; box-shadow: 0 2px 6px rgba(217,119,6,0.35);',
      '}',
      '.cu-leave-btn {',
      '  background: rgba(120, 50, 40, 0.1); border: 1px solid rgba(140, 60, 50, 0.35);',
      '  border-radius: 8px; padding: 4px 10px; font-size: 0.78rem; font-weight: 600;',
      '  color: #8b2b22; cursor: pointer;',
      '}',
      '.cu-leave-btn:hover { background: #8b2b22; color: #fff; }',
      '.cu-content {',
      '  display: flex; flex: 1; min-height: 0; gap: 14px; align-items: center; justify-content: space-between;',
      '}',
      '.cu-main-col {',
      '  display: flex; align-items: center; gap: 14px; flex: 1.1; min-width: 0;',
      '}',
      '.cu-mala-wrap {',
      '  position: relative; width: 154px; height: 154px; flex-shrink: 0;',
      '  display: flex; align-items: center; justify-content: center;',
      '}',
      '.cu-mala-svg {',
      '  position: absolute; inset: 0; width: 100%; height: 100%;',
      '  transition: transform 0.22s cubic-bezier(0.2, 0.8, 0.3, 1.2);',
      '}',
      '.cu-bead { fill: #8b5a2b; stroke: #543415; stroke-width: 0.6; transition: fill 0.15s; }',
      '.cu-bead-active { fill: #facc15; stroke: #b45309; stroke-width: 1.4; filter: drop-shadow(0 0 3px #facc15); }',
      '.cu-guru-bead { fill: #d97706; stroke: #78350f; stroke-width: 1; }',
      '.cu-chant-btn {',
      '  position: relative; z-index: 5; width: 92px; height: 92px; border-radius: 50%;',
      '  background: radial-gradient(circle at 35% 30%, #fcd34d 0%, #d97706 70%, #b45309 100%);',
      '  border: 3px solid #fff3c4; box-shadow: 0 4px 14px rgba(180, 83, 9, 0.45), inset 0 2px 4px rgba(255,255,255,0.7);',
      '  color: #522204; font-size: 0.80rem; font-weight: 800; line-height: 1.25;',
      '  text-align: center; cursor: pointer; display: flex; flex-direction: column;',
      '  align-items: center; justify-content: center; padding: 6px;',
      '  text-shadow: 0 1px 1px rgba(255,255,255,0.7);',
      '  transition: transform 0.08s ease, box-shadow 0.08s ease;',
      '}',
      '.cu-chant-btn:active {',
      '  transform: scale(0.93); box-shadow: 0 2px 6px rgba(180, 83, 9, 0.4);',
      '}',
      '.cu-chant-btn small { font-size: 0.66rem; font-weight: 600; opacity: 0.85; margin-top: 2px; }',
      '.cu-stats-col {',
      '  display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0;',
      '}',
      '.cu-stat-row { font-size: 0.84rem; line-height: 1.35; color: #42251a; }',
      '.cu-stat-row b { color: #b45309; font-weight: 700; }',
      '.cu-progress-box {',
      '  background: #ede3d1; border-radius: 8px; height: 10px; width: 100%;',
      '  overflow: hidden; border: 1px solid #d9c49d; margin: 3px 0;',
      '}',
      '.cu-progress-bar {',
      '  height: 100%; width: 0%; background: linear-gradient(90deg, #f59e0b, #d97706);',
      '  transition: width 0.2s ease;',
      '}',
      '.cu-info-card {',
      '  background: rgba(243, 233, 216, 0.85); border: 1px solid #e2cfb0;',
      '  border-radius: 10px; padding: 6px 10px; font-size: 0.76rem;',
      '  display: flex; flex-direction: column; gap: 2px; flex: 0.9; min-width: 0;',
      '}',
      '.cu-info-title { font-weight: 700; color: #824718; display: flex; justify-content: space-between; }',
      '.cu-top-list { list-style: none; margin: 3px 0 0 0; padding: 0; font-size: 0.73rem; }',
      '.cu-top-item { display: flex; justify-content: space-between; padding: 1px 0; border-bottom: 1px dashed rgba(217, 196, 157, 0.5); }',
      '.cu-top-item:last-child { border-bottom: none; }',
      '.cu-top-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 90px; }',
      '.cu-top-val { font-weight: 700; color: #b45309; }',
      '.cu-remote-toast {',
      '  position: absolute; top: -38px; left: 50%; transform: translateX(-50%);',
      '  background: rgba(45, 20, 15, 0.88); border: 1px solid #e8b765; border-radius: 20px;',
      '  padding: 4px 14px; color: #fed7aa; font-size: 0.75rem; white-space: nowrap;',
      '  box-shadow: 0 4px 12px rgba(0,0,0,0.3); pointer-events: none; opacity: 0;',
      '  transition: opacity 0.25s ease, transform 0.25s ease;',
      '}',
      '.cu-remote-toast.cu-show { opacity: 1; transform: translate(-50%, -4px); }',
      '.cu-float-text {',
      '  position: absolute; left: 50%; top: 30%; transform: translate(-50%, -50%);',
      '  color: #92400e; font-size: 0.95rem; font-weight: 800; text-shadow: 0 1px 2px #fff;',
      '  pointer-events: none; animation: cuFloatUp 1.2s ease-out forwards; white-space: nowrap;',
      '}',
      '@keyframes cuFloatUp {',
      '  0% { opacity: 1; transform: translate(-50%, 0) scale(0.9); }',
      '  50% { opacity: 0.95; transform: translate(-50%, -24px) scale(1.05); }',
      '  100% { opacity: 0; transform: translate(-50%, -48px) scale(1.1); }',
      '}',
      '.cu-sutra-panel {',
      '  display: flex; flex-direction: column; width: 100%; flex: 1; min-height: 0; gap: 6px;',
      '}',
      '.cu-sutra-ctrls {',
      '  display: flex; align-items: center; justify-content: space-between; gap: 8px;',
      '  padding: 2px 4px; font-size: 0.78rem;',
      '}',
      '.cu-sutra-ctrl-group { display: flex; align-items: center; gap: 6px; }',
      '.cu-ctrl-btn {',
      '  background: #ede0cd; border: 1px solid #cca972; border-radius: 6px;',
      '  padding: 4px 10px; font-size: 0.76rem; font-weight: 700; color: #5a3418;',
      '  cursor: pointer; transition: all 0.12s;',
      '}',
      '.cu-ctrl-btn:hover { background: #dfcdb3; }',
      '.cu-ctrl-btn.cu-active { background: #d97706; color: #fff; border-color: #b45309; }',
      '.cu-sutra-scroll {',
      '  flex: 1; min-height: 0; overflow-y: auto; background: #fffefb;',
      '  border: 1px solid #e5d3b8; border-radius: 10px; padding: 10px 14px;',
      '  font-size: 0.88rem; line-height: 1.7; color: #3b2219;',
      '  scroll-behavior: smooth;',
      '}',
      '.cu-sutra-para { margin-bottom: 8px; }',
      '.cu-sutra-word {',
      '  display: inline-block; padding: 0 1.5px; border-radius: 3px;',
      '  transition: background-color 0.15s, color 0.15s, transform 0.12s;',
      '}',
      '.cu-sutra-word.cu-word-active {',
      '  background: #fbbf24; color: #78350f; font-weight: 800; transform: scale(1.1);',
      '  box-shadow: 0 0 6px rgba(251, 191, 36, 0.8);',
      '}',
      '.cu-sutra-word.cu-word-done { color: #885236; }',
      '.cu-dedication {',
      '  margin-top: 10px; padding: 8px 12px; background: #fef3c7; border: 1px solid #fde68a;',
      '  border-radius: 8px; font-size: 0.80rem; color: #92400e; font-style: italic; text-align: center;',
      '}',
      '@media (prefers-reduced-motion: reduce) {',
      '  .cu-mala-svg { transition: none !important; }',
      '  .cu-float-text { animation: none !important; opacity: 0 !important; }',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  // Generate 108 Mala SVG string (Radius 68, center 77, 77)
  function buildMalaSVG() {
    var totalBeads = 108;
    var cx = 77, cy = 77, r = 66;
    var elements = [];

    // Thread circle
    elements.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#9a6e42" stroke-width="1.2" opacity="0.65" />');

    // 108 beads
    for (var i = 0; i < totalBeads; i++) {
      var angle = (i / totalBeads) * Math.PI * 2 - Math.PI / 2;
      var bx = cx + r * Math.cos(angle);
      var by = cy + r * Math.sin(angle);

      if (i === 0) {
        // Guru bead (hạt mẫu)
        elements.push('<circle class="cu-guru-bead" id="cu-bead-0" cx="' + bx.toFixed(2) + '" cy="' + by.toFixed(2) + '" r="4.8" />');
        // Small stupa head
        var sx = cx + (r + 4.5) * Math.cos(angle);
        var sy = cy + (r + 4.5) * Math.sin(angle);
        elements.push('<circle class="cu-guru-bead" cx="' + sx.toFixed(2) + '" cy="' + sy.toFixed(2) + '" r="2.4" />');
      } else {
        elements.push('<circle class="cu-bead" id="cu-bead-' + i + '" cx="' + bx.toFixed(2) + '" cy="' + by.toFixed(2) + '" r="2.6" />');
      }
    }
    return '<svg class="cu-mala-svg" id="cu-mala-svg" viewBox="0 0 154 154">' + elements.join('') + '</svg>';
  }

  root.ChantUI = {
    mount: function (host, opts) {
      ensureStyles();
      opts = opts || {};
      var sound = typeof opts.sound === 'function' ? opts.sound : function () {};
      var onChant = typeof opts.onChant === 'function' ? opts.onChant : function () {};
      var onLeave = typeof opts.onLeave === 'function' ? opts.onLeave : function () {};

      var currentTab = 'niem'; // 'niem' | 'tung'
      var mineCount = 0;
      var todayCount = 0;
      var roomCount = 0;
      var chantersCount = 0;
      var topChanters = [];
      var lastManualChant = 0;
      var activeBeadIndex = 0;
      var currentRotation = 0;

      // Sutra recitation state
      var sutraTimer = null;
      var sutraWordIndex = 0;
      var sutraPlaying = false;
      var sutraSpeed = 700; // ms per word (Chậm: 900, Vừa: 700, Nhanh: 500)

      // Remote notifications debounce queue
      var remoteBatch = [];
      var remoteTimer = null;

      // Build DOM
      var wrap = document.createElement('div');
      wrap.className = 'cu-wrap';

      var card = document.createElement('div');
      card.className = 'cu-card';

      // Remote toast element
      var toastEl = document.createElement('div');
      toastEl.className = 'cu-remote-toast';
      toastEl.id = 'cu-toast';
      card.appendChild(toastEl);

      // Header: Tabs & Leave button
      var header = document.createElement('div');
      header.className = 'cu-header';
      header.innerHTML = [
        '<div class="cu-tabs">',
        '  <button type="button" class="cu-tab-btn cu-active" id="cu-tab-niem">📿 Niệm Phật</button>',
        '  <button type="button" class="cu-tab-btn" id="cu-tab-tung">📜 Tụng kinh Bát Nhã</button>',
        '</div>',
        '<button type="button" class="cu-leave-btn" id="cu-btn-leave">Đứng dậy (Esc)</button>'
      ].join('');
      card.appendChild(header);

      // Content area
      var content = document.createElement('div');
      content.className = 'cu-content';
      card.appendChild(content);

      // --- PANEL NIỆM PHẬT ---
      var niemPanel = document.createElement('div');
      niemPanel.className = 'cu-main-col';
      niemPanel.id = 'cu-panel-niem';

      // Mala & Chant Button
      var malaWrap = document.createElement('div');
      malaWrap.className = 'cu-mala-wrap';
      malaWrap.innerHTML = buildMalaSVG() + [
        '<button type="button" class="cu-chant-btn" id="cu-btn-chant">',
        '  <span>Nam mô<br>A Di Đà Phật</span>',
        '  <small>Space / Chạm</small>',
        '</button>'
      ].join('');
      niemPanel.appendChild(malaWrap);

      // Stats Column
      var statsCol = document.createElement('div');
      statsCol.className = 'cu-stats-col';
      statsCol.innerHTML = [
        '<div class="cu-stat-row" id="cu-stat-me">Lượt này: <b>0</b> câu · Hôm nay: <b>0</b> câu (0 tràng)</div>',
        '<div class="cu-progress-box"><div class="cu-progress-bar" id="cu-prog-bar"></div></div>',
        '<div class="cu-stat-row" style="font-size: 0.76rem; color: #78350f;" id="cu-mala-label">Tràng hạt: 0 / 108 câu</div>',
        '<div class="cu-stat-row" style="font-size: 0.76rem; color: #5a3825; margin-top: 2px;" id="cu-stat-room">Cả chùa hôm nay: <b>0</b> câu · <b>0</b> người đang niệm</div>'
      ].join('');
      niemPanel.appendChild(statsCol);

      // Top chanters card
      var infoCard = document.createElement('div');
      infoCard.className = 'cu-info-card';
      infoCard.id = 'cu-info-card';
      infoCard.innerHTML = [
        '<div class="cu-info-title"><span>Công đức hôm nay</span><span id="cu-chanters-badge">0 người</span></div>',
        '<ul class="cu-top-list" id="cu-top-list"><li class="cu-top-item"><span class="cu-top-name">Chưa có ai</span></li></ul>'
      ].join('');

      content.appendChild(niemPanel);
      content.appendChild(infoCard);

      // --- PANEL TỤNG KINH ---
      var tungPanel = document.createElement('div');
      tungPanel.className = 'cu-sutra-panel';
      tungPanel.id = 'cu-panel-tung';
      tungPanel.style.display = 'none';

      tungPanel.innerHTML = [
        '<div class="cu-sutra-ctrls">',
        '  <div class="cu-sutra-ctrl-group">',
        '    <button type="button" class="cu-ctrl-btn cu-active" id="cu-btn-sutra-play">▶ Bắt đầu tụng</button>',
        '    <button type="button" class="cu-ctrl-btn" id="cu-btn-sutra-reset">↺ Từ đầu</button>',
        '  </div>',
        '  <div class="cu-sutra-ctrl-group">',
        '    <span style="font-size:0.75rem; color:#6b4226;">Nhịp mõ:</span>',
        '    <button type="button" class="cu-ctrl-btn" data-spd="900" id="cu-spd-slow">Chậm</button>',
        '    <button type="button" class="cu-ctrl-btn cu-active" data-spd="700" id="cu-spd-med">Vừa</button>',
        '    <button type="button" class="cu-ctrl-btn" data-spd="500" id="cu-spd-fast">Nhanh</button>',
        '  </div>',
        '</div>',
        '<div class="cu-sutra-scroll" id="cu-sutra-scroll"></div>'
      ].join('');

      // Build Sutra Paragraphs DOM
      var sutraScroll = tungPanel.querySelector('#cu-sutra-scroll');
      var wordIndexCounter = 0;
      SUTRA_TEXT.forEach(function (para) {
        var p = document.createElement('div');
        p.className = 'cu-sutra-para';
        para.words.forEach(function (w) {
          var span = document.createElement('span');
          span.className = 'cu-sutra-word';
          span.id = 'cu-w-' + wordIndexCounter++;
          span.textContent = w + ' ';
          p.appendChild(span);
        });
        sutraScroll.appendChild(p);
      });

      // Dedication footer (hidden initially)
      var dedication = document.createElement('div');
      dedication.className = 'cu-dedication';
      dedication.id = 'cu-dedication';
      dedication.style.display = 'none';
      dedication.textContent = 'Nguyện đem công đức này, hướng về khắp tất cả, đệ tử và chúng sanh, đều trọn thành Phật đạo. (A Di Đà Phật 🙏)';
      sutraScroll.appendChild(dedication);

      content.appendChild(tungPanel);
      wrap.appendChild(card);
      host.appendChild(wrap);

      // --- HELPER FUNCTIONS ---
      function switchTab(tab) {
        currentTab = tab;
        card.querySelector('#cu-tab-niem').classList.toggle('cu-active', tab === 'niem');
        card.querySelector('#cu-tab-tung').classList.toggle('cu-active', tab === 'tung');
        niemPanel.style.display = (tab === 'niem') ? 'flex' : 'none';
        infoCard.style.display = (tab === 'niem') ? 'flex' : 'none';
        tungPanel.style.display = (tab === 'tung') ? 'flex' : 'none';

        if (tab === 'niem' && sutraPlaying) {
          pauseSutra();
        }
      }

      function floatChantText(text) {
        var el = document.createElement('div');
        el.className = 'cu-float-text';
        el.textContent = text || 'Nam mô A Di Đà Phật';
        malaWrap.appendChild(el);
        setTimeout(function () {
          if (el.parentNode) el.parentNode.removeChild(el);
        }, 1200);
      }

      function updateMalaBeads(beadIndex) {
        var svg = document.getElementById('cu-mala-svg');
        if (!svg) return;

        // Remove active class from previous bead
        var prev = svg.querySelector('.cu-bead-active');
        if (prev) prev.classList.remove('cu-bead-active');

        // Add active to current bead
        var cur = document.getElementById('cu-bead-' + beadIndex);
        if (cur) cur.classList.add('cu-bead-active');

        // Rotate mala by 1 step (360 / 108 = 3.333 deg)
        currentRotation -= (360 / 108);
        svg.style.transform = 'rotate(' + currentRotation + 'deg)';
      }

      function doManualChant() {
        var now = performance.now();
        // Rate limit: max ~6 chants/second (~160ms throttle)
        if (now - lastManualChant < 160) return;
        lastManualChant = now;

        sound('mo');
        onChant('niem');

        mineCount++;
        todayCount++;

        // Update mala rotation & active bead
        activeBeadIndex = (mineCount % 108);
        updateMalaBeads(activeBeadIndex);

        // Float text
        floatChantText('Nam mô A Di Đà Phật');

        // 108 Completion check
        if (mineCount > 0 && mineCount % 108 === 0) {
          sound('chuong');
          floatChantText('✨ Viên mãn 1 tràng · +3 công đức ✨');
        }

        renderStats();
      }

      function renderStats() {
        var tràng = Math.floor(todayCount / 108);
        var inMala = mineCount % 108;
        var percent = Math.round((inMala / 108) * 100);

        var statMe = document.getElementById('cu-stat-me');
        if (statMe) {
          statMe.innerHTML = 'Lượt này: <b>' + mineCount + '</b> câu · Hôm nay: <b>' + todayCount + '</b> câu (' + tràng + ' tràng)';
        }

        var prog = document.getElementById('cu-prog-bar');
        if (prog) prog.style.width = percent + '%';

        var lbl = document.getElementById('cu-mala-label');
        if (lbl) lbl.textContent = 'Tràng hạt: ' + inMala + ' / 108 câu (' + percent + '%)';

        var statRoom = document.getElementById('cu-stat-room');
        if (statRoom) {
          statRoom.innerHTML = 'Cả chùa hôm nay: <b>' + roomCount.toLocaleString('vi-VN') + '</b> câu · <b>' + chantersCount + '</b> người đang niệm';
        }

        var badge = document.getElementById('cu-chanters-badge');
        if (badge) badge.textContent = chantersCount + ' người';
      }

      function renderTopList() {
        var list = document.getElementById('cu-top-list');
        if (!list) return;
        if (!topChanters || !topChanters.length) {
          list.innerHTML = '<li class="cu-top-item"><span class="cu-top-name" style="color:#8a6245;">Chưa có ai</span></li>';
          return;
        }
        var html = '';
        topChanters.slice(0, 5).forEach(function (p, idx) {
          var name = String(p.name || 'Vong hồn').slice(0, 16);
          var count = (p.c || 0).toLocaleString('vi-VN');
          html += '<li class="cu-top-item">' +
            '<span class="cu-top-name">' + (idx + 1) + '. ' + name + '</span>' +
            '<span class="cu-top-val">' + count + '</span>' +
            '</li>';
        });
        list.innerHTML = html;
      }

      // --- SUTRA RECITATION LOGIC ---
      function playSutra() {
        if (sutraPlaying) return;
        sutraPlaying = true;
        var btnPlay = document.getElementById('cu-btn-sutra-play');
        if (btnPlay) {
          btnPlay.textContent = '⏸ Tạm dừng';
          btnPlay.classList.add('cu-active');
        }
        var ded = document.getElementById('cu-dedication');
        if (ded) ded.style.display = 'none';

        reciteNextWord();
      }

      function pauseSutra() {
        sutraPlaying = false;
        if (sutraTimer) {
          clearTimeout(sutraTimer);
          sutraTimer = null;
        }
        var btnPlay = document.getElementById('cu-btn-sutra-play');
        if (btnPlay) {
          btnPlay.textContent = '▶ Tiếp tục';
          btnPlay.classList.remove('cu-active');
        }
      }

      function resetSutra() {
        pauseSutra();
        sutraWordIndex = 0;
        var allSpans = sutraScroll.querySelectorAll('.cu-sutra-word');
        allSpans.forEach(function (s) {
          s.classList.remove('cu-word-active', 'cu-word-done');
        });
        var btnPlay = document.getElementById('cu-btn-sutra-play');
        if (btnPlay) btnPlay.textContent = '▶ Bắt đầu tụng';
        var ded = document.getElementById('cu-dedication');
        if (ded) ded.style.display = 'none';
        sutraScroll.scrollTop = 0;
      }

      function reciteNextWord() {
        if (!sutraPlaying) return;
        if (sutraWordIndex >= ALL_SUTRA_WORDS.length) {
          // Finished entire Heart Sutra!
          sound('chuong');
          sutraPlaying = false;
          var btn = document.getElementById('cu-btn-sutra-play');
          if (btn) {
            btn.textContent = '✓ Hoàn thành';
            btn.classList.remove('cu-active');
          }
          var ded = document.getElementById('cu-dedication');
          if (ded) {
            ded.style.display = 'block';
            ded.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          return;
        }

        var wInfo = ALL_SUTRA_WORDS[sutraWordIndex];
        sound('mo');

        // Update DOM highlight
        var prevSpan = document.getElementById('cu-w-' + (sutraWordIndex - 1));
        if (prevSpan) {
          prevSpan.classList.remove('cu-word-active');
          prevSpan.classList.add('cu-word-done');
        }

        var curSpan = document.getElementById('cu-w-' + sutraWordIndex);
        if (curSpan) {
          curSpan.classList.add('cu-word-active');
          // Auto scroll word into view
          var parentTop = sutraScroll.getBoundingClientRect().top;
          var elemTop = curSpan.getBoundingClientRect().top;
          if (elemTop - parentTop > sutraScroll.clientHeight - 40 || elemTop - parentTop < 20) {
            curSpan.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }

        // Check if sentence/phrase ends
        if (wInfo.isSentenceEnd) {
          onChant('tung');
          mineCount++;
          todayCount++;
          renderStats();
        }

        sutraWordIndex++;
        sutraTimer = setTimeout(reciteNextWord, sutraSpeed);
      }

      // --- REMOTE NOTIFICATION LOGIC ---
      function triggerRemoteToast() {
        if (!remoteBatch.length) return;
        var text = '';
        if (remoteBatch.length === 1) {
          text = remoteBatch[0] + ' đang niệm 🙏';
        } else if (remoteBatch.length === 2) {
          text = remoteBatch[0] + ' và ' + remoteBatch[1] + ' đang niệm 🙏';
        } else {
          text = remoteBatch[0] + ' và ' + (remoteBatch.length - 1) + ' người khác đang niệm 🙏';
        }
        remoteBatch = [];

        var toast = document.getElementById('cu-toast');
        if (toast) {
          toast.textContent = text;
          toast.classList.add('cu-show');
          setTimeout(function () {
            if (toast) toast.classList.remove('cu-show');
          }, 2400);
        }
      }

      // --- EVENT LISTENERS ---
      var btnChant = card.querySelector('#cu-btn-chant');
      btnChant.addEventListener('click', doManualChant);

      card.querySelector('#cu-btn-leave').addEventListener('click', onLeave);
      card.querySelector('#cu-tab-niem').addEventListener('click', function () { switchTab('niem'); });
      card.querySelector('#cu-tab-tung').addEventListener('click', function () { switchTab('tung'); });

      // Sutra controls
      card.querySelector('#cu-btn-sutra-play').addEventListener('click', function () {
        if (sutraPlaying) pauseSutra();
        else playSutra();
      });
      card.querySelector('#cu-btn-sutra-reset').addEventListener('click', resetSutra);

      // Speed buttons
      [
        { id: '#cu-spd-slow', speed: 900 },
        { id: '#cu-spd-med', speed: 700 },
        { id: '#cu-spd-fast', speed: 500 }
      ].forEach(function (item) {
        var b = card.querySelector(item.id);
        if (b) {
          b.addEventListener('click', function () {
            sutraSpeed = item.speed;
            card.querySelectorAll('[data-spd]').forEach(function (x) { x.classList.remove('cu-active'); });
            b.classList.add('cu-active');
          });
        }
      });

      // Keyboard handler (Space, Enter, Escape)
      function onKeyDown(e) {
        if (e.target && /input|textarea/i.test(e.target.tagName)) return;

        if (e.code === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          onLeave();
          return;
        }

        if (e.code === 'Space' || e.code === 'Enter') {
          if (currentTab === 'niem') {
            e.preventDefault();
            e.stopPropagation();
            doManualChant();
          }
        }
      }
      window.addEventListener('keydown', onKeyDown);

      // Initial stats render
      renderStats();

      // Return public API object
      return {
        setStats: function (stats) {
          stats = stats || {};
          if (stats.mine !== undefined) {
            mineCount = stats.mine;
            activeBeadIndex = (mineCount % 108);
            updateMalaBeads(activeBeadIndex);
          }
          if (stats.today !== undefined) todayCount = stats.today;
          if (stats.room !== undefined) roomCount = stats.room;
          if (stats.chanters !== undefined) chantersCount = stats.chanters;
          renderStats();
        },
        setTop: function (top) {
          topChanters = Array.isArray(top) ? top : [];
          renderTopList();
        },
        remote: function (name) {
          if (!name) return;
          remoteBatch.push(name);
          if (!remoteTimer) {
            remoteTimer = setTimeout(function () {
              triggerRemoteToast();
              remoteTimer = null;
            }, 600);
          }
        },
        unmount: function () {
          window.removeEventListener('keydown', onKeyDown);
          if (sutraTimer) {
            clearTimeout(sutraTimer);
            sutraTimer = null;
          }
          if (remoteTimer) {
            clearTimeout(remoteTimer);
            remoteTimer = null;
          }
          if (wrap.parentNode) {
            wrap.parentNode.removeChild(wrap);
          }
        }
      };
    }
  };

})(typeof window !== 'undefined' ? window : globalThis);
