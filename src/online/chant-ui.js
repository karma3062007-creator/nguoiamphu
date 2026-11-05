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
      text: "vô vô minh, diệc vô vô minh tận, nãi chí vô lão tử, diệc vô lão tử tận; vô khổ, tập, diệt, đạo; vô trí diệc vô đắc.",
      words: ["vô", "vô", "minh,", "diệc", "vô", "vô", "minh", "tận,", "nãi", "chí", "vô", "lão", "tử,", "diệc", "vô", "lão", "tử", "tận;", "vô", "khổ,", "tập,", "diệt,", "đạo;", "vô", "trí", "diệc", "vô", "đắc."]
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

  // Keep the original paper palette, mala SVG and word-by-word sutra.
  function extraStyles() {
    var style = document.createElement('style');
    style.className = 'cu-instance-style';
    style.textContent = [
      '.cu-card{height:45vh;max-height:45vh;padding:8px 12px max(8px,env(safe-area-inset-bottom));gap:6px;border-radius:16px 16px 0 0;color-scheme:light}',
      '.cu-card *{box-sizing:border-box}.cu-card [hidden]{display:none!important}',
      '.cu-header{flex-shrink:0;min-width:0}.cu-tabs{overflow-x:auto;min-width:0;flex:1;flex-wrap:nowrap}.cu-tab-btn{white-space:nowrap;flex-shrink:0}.cu-leave-btn{flex-shrink:0}',
      '.cu-content{overflow:auto;align-items:stretch;display:block;min-height:0}.cu-panel{min-width:0;width:100%}',
      '.cu-main-col{justify-content:center;gap:10px}.cu-stats-col{max-width:400px}.cu-controls{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:12px}',
      '.cu-note{font-size:11px;color:#795536;margin:4px 0}.cu-footer{flex-shrink:0;font-size:11px;border-top:1px solid #e8b765;padding-top:4px}',
      '.cu-footer details{position:relative}.cu-top-list{position:absolute;bottom:100%;right:0;width:min(260px,75vw);background:#fbf7ee;border:1px solid #e8b765;border-radius:10px;padding:8px;box-shadow:0 -3px 12px #0003;z-index:8}',
      '.cu-top-name{max-width:75%}.cu-footer summary{cursor:pointer}.cu-message{min-height:15px;overflow-wrap:anywhere}.cu-remote-line{color:#795536;min-height:14px}',
      '.cu-sutra-scroll{height:100px;min-height:72px;flex:auto}.cu-sutra-ctrls{flex-wrap:wrap;padding:0}.cu-sutra-panel{gap:4px}',
      '.cu-auto{animation:cuPulse 3s ease-in-out infinite}.cu-halo{box-shadow:0 0 22px #f7c24a}.cu-mala-wrap{touch-action:none}',
      '.cu-offers{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.cu-offer{min-height:64px;border-radius:16px;font-size:13px}',
      '.cu-card button:disabled{opacity:.5;cursor:default}.cu-card button:focus-visible,.cu-card textarea:focus-visible{outline:3px solid #b45309;outline-offset:2px}',
      '.cu-wish-input{width:100%;resize:vertical;min-height:45px;max-height:80px;border:1px solid #cca972;border-radius:8px;padding:6px;font:inherit;user-select:text}',
      '.cu-wish-list{list-style:none;padding:0;margin:6px 0;font-size:12px}.cu-wish-item{border-bottom:1px dashed #d8ba82;padding:6px;overflow-wrap:anywhere}.cu-wish-item time{color:#795536}',
      '.cu-meditation{display:flex;gap:18px;align-items:center;justify-content:center;min-height:140px}.cu-breath{width:90px;height:90px;border-radius:50%;background:radial-gradient(circle,#fcd34d,#d9770633);display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}',
      '.cu-breathing{animation:cuBreath 10s linear infinite}.cu-clock{font-size:24px;font-variant-numeric:tabular-nums}',
      '@keyframes cuBreath{0%,100%{transform:scale(.8)}40%{transform:scale(1.15)}}@keyframes cuPulse{50%{filter:brightness(1.12)}}',
      '@media(max-width:420px){.cu-card{padding:6px 8px;gap:4px}.cu-tab-btn{padding:5px 8px}.cu-leave-btn{font-size:11px;padding:5px}.cu-mala-wrap{width:138px;height:138px}.cu-stat-row{font-size:12px}.cu-main-col{gap:6px}.cu-offers{gap:5px}.cu-controls{gap:4px}}',
      '@media(max-height:500px) and (orientation:landscape){.cu-card{height:100vh;max-height:100vh}.cu-main-col{flex-wrap:wrap}.cu-wrap{width:46%}}',
      '@media(prefers-reduced-motion:reduce){.cu-wrap *{animation:none!important;transition:none!important;scroll-behavior:auto!important}}'
    ].join('\n');
    return style;
  }

  root.ChantUI = {
    mount: function (host, opts) {
      ensureStyles();
      opts = opts || {};
      var sound = typeof opts.sound === 'function' ? opts.sound : function () {};
      var alive = true, listeners = [], timers = new Set();
      var currentTab = 'niem', autoMode = '', autoTimer = null;
      var mine = 0, today = 0, room = 0, chanters = 0, malaCount = 0;
      var lastManual = -Infinity, wordIndex = 0, sentenceManual = true, sutraManual = true;
      var meditationStart = null, meditationLimit = 0, cooldowns = [];
      var remoteNames = new Set(), remoteTimer = null, voice = null;
      var speech = root.speechSynthesis;

      var wrap = document.createElement('div');
      wrap.className = 'cu-wrap';
      wrap.appendChild(extraStyles());
      var card = document.createElement('div');
      card.className = 'cu-card';
      wrap.appendChild(card);

      // Only trusted, static markup is inserted as HTML. All external text uses textContent.
      card.innerHTML = '<div class="cu-header"><div class="cu-tabs" role="tablist" aria-label="Thực hành trong chùa"></div><button type="button" class="cu-leave-btn">Đứng dậy (Esc)</button></div>' +
        '<div class="cu-content"></div><div class="cu-footer"><div class="cu-stat-room"></div><details><summary>Top 5 hôm nay</summary><ol class="cu-top-list"></ol></details>' +
        '<div class="cu-message" role="status" aria-live="polite"></div><div class="cu-remote-line"></div></div>';
      var content = card.querySelector('.cu-content');
      var tabs = {}, panels = {};
      function el(tag, cls, text, parent) {
        var node = document.createElement(tag);
        if (cls) node.className = cls;
        if (text !== undefined) node.textContent = text;
        if (parent) parent.appendChild(node);
        return node;
      }
      function listen(node, type, fn, options) {
        node.addEventListener(type, fn, options);
        listeners.push(function () { node.removeEventListener(type, fn, options); });
      }
      function later(fn, ms) {
        var id = setTimeout(function () { timers.delete(id); if (alive) fn(); }, ms);
        timers.add(id);
        return id;
      }
      function cancel(id) { clearTimeout(id); timers.delete(id); }
      function call(name, a, b) {
        if (alive && typeof opts[name] === 'function') return opts[name](a, b);
      }
      function toast(text) { if (alive) message.textContent = String(text || ''); }
      function button(parent, text, fn, cls) {
        var b = el('button', cls || 'cu-ctrl-btn', text, parent);
        b.type = 'button';
        listen(b, 'click', fn);
        return b;
      }
      function switchTab(id) {
        currentTab = id;
        Object.keys(tabs).forEach(function (key) {
          var selected = key === id;
          tabs[key].classList.toggle('cu-active', selected);
          tabs[key].setAttribute('aria-selected', String(selected));
          panels[key].hidden = !selected;
        });
      }
      [['niem', '📿 Niệm Phật'], ['tung', '📜 Tụng kinh'], ['thien', 'Thiền'], ['le', 'Dâng lễ'], ['nguyen', 'Đèn nguyện']].forEach(function (row) {
        var b = button(card.querySelector('.cu-tabs'), row[1], function () { switchTab(row[0]); }, 'cu-tab-btn');
        b.setAttribute('role', 'tab');
        tabs[row[0]] = b;
        panels[row[0]] = el('div', 'cu-panel', undefined, content);
        panels[row[0]].setAttribute('role', 'tabpanel');
        panels[row[0]].setAttribute('aria-label', row[1]);
      });
      var message = card.querySelector('.cu-message');
      var roomStat = card.querySelector('.cu-stat-room');
      var topList = card.querySelector('.cu-top-list');
      var remoteLine = card.querySelector('.cu-remote-line');
      function leave() { stopAuto(); finishMeditation(false); call('onLeave'); }
      listen(card.querySelector('.cu-leave-btn'), 'click', leave);

      var niem = el('div', 'cu-main-col', undefined, panels.niem);
      var mala = el('div', 'cu-mala-wrap', undefined, niem);
      mala.innerHTML = buildMalaSVG();
      var svg = mala.querySelector('svg');
      var chantButton = button(mala, 'Nam mô A Di Đà Phật', function () {
        if (autoMode === 'niem') stopAuto(); else chant(true);
      }, 'cu-chant-btn');
      var stats = el('div', 'cu-stats-col', undefined, niem);
      var myStat = el('div', 'cu-stat-row', '', stats);
      var progress = el('div', 'cu-progress-box', undefined, stats);
      var progressBar = el('div', 'cu-progress-bar', undefined, progress);
      var malaLabel = el('div', 'cu-stat-row', '', stats);
      var niemControls = el('div', 'cu-controls', undefined, stats);
      function toggle(parent, text, fn) {
        var label = el('label', 'cu-controls', undefined, parent);
        var input = el('input', '', undefined, label);
        input.type = 'checkbox';
        label.appendChild(document.createTextNode(text));
        listen(input, 'change', fn);
        return input;
      }
      var niemAuto = toggle(niemControls, 'Tự niệm', function () { if (niemAuto.checked) startAuto('niem'); else stopAuto(); });
      function speedSelect(parent, values, mode) {
        var label = el('label', 'cu-controls', 'Nhịp ', parent);
        var select = el('select', 'cu-ctrl-btn', undefined, label);
        ['Chậm', 'Vừa', 'Nhanh'].forEach(function (text, i) {
          var option = el('option', '', text, select);
          option.value = values[i];
          option.selected = i === 1;
        });
        listen(select, 'change', function () { if (autoMode === mode) scheduleAuto(); });
        return select;
      }
      var niemSpeed = speedSelect(niemControls, [1600, 1100, 750], 'niem');
      el('p', 'cu-note', 'Tự tay niệm mới được nhiều công đức', stats);

      function renderStats() {
        myStat.textContent = 'Lượt này: ' + mine + ' câu · Hôm nay: ' + today + ' câu';
        var round = Math.floor(malaCount / 108) + 1;
        var ordinals = ['nhất', 'hai', 'ba', 'tư', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười'];
        malaLabel.textContent = (malaCount % 108) + ' / 108 · Vòng thứ ' + (ordinals[round - 1] || round);
        progressBar.style.width = ((malaCount % 108) / 108 * 100) + '%';
        roomStat.textContent = 'Hôm nay cả chùa: ' + room.toLocaleString('vi-VN') + ' câu · ' + chanters + ' người đang niệm';
      }
      function updateMala() {
        var old = svg.querySelector('.cu-bead-active');
        if (old) old.classList.remove('cu-bead-active');
        svg.querySelector('#cu-bead-' + (malaCount % 108)).classList.add('cu-bead-active');
        svg.style.transform = 'rotate(' + (-malaCount * 360 / 108) + 'deg)';
      }
      function chant(manual) {
        if (!alive) return;
        var now = Date.now();
        if (manual && now - lastManual < 167) return;
        if (manual) lastManual = now;
        malaCount++; mine++; today++;
        updateMala(); renderStats();
        sound('mo'); call('onChant', 'niem', manual);
        var float = el('div', 'cu-float-text', 'Nam mô A Di Đà Phật', mala);
        later(function () { float.remove(); }, 1200);
        if (malaCount % 108 === 0) {
          sound('chuong'); mala.classList.add('cu-halo');
          later(function () { mala.classList.remove('cu-halo'); }, 1400);
        }
      }
      var pointerStart = null, swipeUsed = false;
      listen(mala, 'pointerdown', function (event) {
        if (event.target.closest('button')) return;
        pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
        swipeUsed = false;
        mala.setPointerCapture(event.pointerId);
      });
      listen(mala, 'pointermove', function (event) {
        if (!pointerStart || event.pointerId !== pointerStart.id || swipeUsed) return;
        if (event.clientY - pointerStart.y >= 24 && Math.abs(event.clientX - pointerStart.x) < 65) {
          swipeUsed = true;
          if (autoMode === 'niem') stopAuto(); else chant(true);
        }
      });
      listen(mala, 'pointerup', function (event) {
        if (!pointerStart || event.pointerId !== pointerStart.id) return;
        if (!swipeUsed && Math.abs(event.clientY - pointerStart.y) < 24 && Math.abs(event.clientX - pointerStart.x) < 24) {
          if (autoMode === 'niem') stopAuto(); else chant(true);
        }
        pointerStart = null;
      });
      listen(mala, 'pointercancel', function () { pointerStart = null; });

      // Sutra callbacks retain provenance across mixed manual / automatic passages.
      var tung = panels.tung;
      tung.classList.add('cu-sutra-panel');
      el('div', 'cu-info-title', 'Bát Nhã Ba La Mật Đa Tâm Kinh', tung);
      var sutraControls = el('div', 'cu-sutra-ctrls', undefined, tung);
      button(sutraControls, 'Gõ mõ', function () { if (autoMode === 'tung') stopAuto(); stepSutra(true); });
      var tungAuto = toggle(sutraControls, 'Mõ tự động', function () { if (tungAuto.checked) startAuto('tung'); else stopAuto(); });
      var tungSpeed = speedSelect(sutraControls, [900, 700, 500], 'tung');
      button(sutraControls, 'Tạm dừng', function () { stopAuto(); cancelSpeech(); });
      button(sutraControls, '↺ Từ đầu', resetSutra);
      var voiceLabel = el('label', 'cu-controls', undefined, sutraControls);
      var voiceToggle = toggle(voiceLabel, 'Giọng đọc', function () { if (!voiceToggle.checked) cancelSpeech(); });
      voiceLabel.hidden = true;
      el('p', 'cu-note', 'Tự tay gõ mới có công đức từng tiếng', tung);
      var scroll = el('div', 'cu-sutra-scroll', undefined, tung);
      var spans = [];
      SUTRA_TEXT.forEach(function (paragraph) {
        var p = el('div', 'cu-sutra-para', undefined, scroll);
        paragraph.words.forEach(function (word) { spans.push(el('span', 'cu-sutra-word', word + ' ', p)); });
      });
      var dedication = el('div', 'cu-dedication', 'Nguyện đem công đức này, hướng về khắp tất cả, đệ tử và chúng sanh, đều trọn thành Phật đạo.', scroll);
      dedication.hidden = true;
      function cancelSpeech() { if (speech) speech.cancel(); }
      function findVoice() {
        voice = speech.getVoices().filter(function (v) { return /^vi/i.test(v.lang); })[0] || null;
        voiceLabel.hidden = !voice;
        if (!voice) { voiceToggle.checked = false; cancelSpeech(); }
      }
      if (speech) { findVoice(); listen(speech, 'voiceschanged', findVoice); }
      function speakSentence() {
        if (!voice || !voiceToggle.checked || !root.SpeechSynthesisUtterance) return;
        var end = wordIndex;
        while (end < ALL_SUTRA_WORDS.length - 1 && !ALL_SUTRA_WORDS[end].isSentenceEnd) end++;
        var text = ALL_SUTRA_WORDS.slice(wordIndex, end + 1).map(function (w) { return w.text; }).join(' ');
        cancelSpeech();
        var utterance = new root.SpeechSynthesisUtterance(text);
        utterance.voice = voice; utterance.lang = voice.lang; utterance.rate = 0.9;
        speech.speak(utterance);
      }
      function resetSutra() {
        stopAuto(); cancelSpeech();
        wordIndex = 0; sentenceManual = true; sutraManual = true;
        spans.forEach(function (s) { s.classList.remove('cu-word-active', 'cu-word-done'); });
        dedication.hidden = true; scroll.scrollTop = 0;
      }
      function stepSutra(manual) {
        if (!alive || wordIndex >= spans.length) return;
        if (wordIndex === 0 || ALL_SUTRA_WORDS[wordIndex - 1].isSentenceEnd) speakSentence();
        if (wordIndex) { spans[wordIndex - 1].classList.remove('cu-word-active'); spans[wordIndex - 1].classList.add('cu-word-done'); }
        spans[wordIndex].classList.add('cu-word-active');
        if (currentTab === 'tung') {
          var bounds = spans[wordIndex].getBoundingClientRect(), area = scroll.getBoundingClientRect();
          if (bounds.bottom > area.bottom || bounds.top < area.top) scroll.scrollTop += bounds.top - area.top - 20;
        }
        sentenceManual = sentenceManual && manual;
        sutraManual = sutraManual && manual;
        var completed = ALL_SUTRA_WORDS[wordIndex].isSentenceEnd;
        wordIndex++;
        sound('mo');
        if (completed) {
          mine++; today++; renderStats();
          var manualSentence = sentenceManual;
          sentenceManual = true;
          call('onChant', 'tung', manualSentence);
        }
        if (wordIndex === spans.length) {
          stopAuto(); sound('chuong'); dedication.hidden = false;
          if (currentTab === 'tung') scroll.scrollTop = scroll.scrollHeight;
          call('onSutraDone', sutraManual);
        }
      }
      function stopAuto() {
        cancelSpeech();
        cancel(autoTimer); autoTimer = null; autoMode = '';
        niemAuto.checked = false; tungAuto.checked = false;
        chantButton.textContent = 'Nam mô A Di Đà Phật';
        chantButton.classList.remove('cu-auto');
      }
      function scheduleAuto() {
        cancel(autoTimer);
        if (!alive || !autoMode) return;
        autoTimer = later(function () {
          if (autoMode === 'niem') chant(false); else if (autoMode === 'tung') stepSutra(false);
          if (autoMode) scheduleAuto();
        }, Number(autoMode === 'niem' ? niemSpeed.value : tungSpeed.value));
      }
      function startAuto(mode) {
        stopAuto();
        if (mode === 'tung' && wordIndex >= spans.length) resetSutra();
        autoMode = mode;
        niemAuto.checked = mode === 'niem'; tungAuto.checked = mode === 'tung';
        if (mode === 'niem') {
          chantButton.textContent = 'Đang tự niệm… (bấm để dừng)';
          chantButton.classList.add('cu-auto');
          chant(false);
        } else stepSutra(false);
        scheduleAuto();
      }

      // Meditation reports exactly once when released, timed out or leaving the cushion.
      var meditation = el('div', 'cu-meditation', undefined, panels.thien);
      var breath = el('div', 'cu-breath', 'Theo dõi hơi thở', meditation);
      var meditationControls = el('div', '', undefined, meditation);
      var durationLabel = el('label', 'cu-controls', 'Thời gian ', meditationControls);
      var duration = el('select', 'cu-ctrl-btn', undefined, durationLabel);
      [5, 10, 20, 30, 0].forEach(function (minutes) {
        var option = el('option', '', minutes ? minutes + ' phút' : 'Tự do', duration);
        option.value = minutes * 60;
      });
      var clock = el('div', 'cu-clock', '00:00', meditationControls);
      var meditationButton = button(meditationControls, 'Bắt đầu', function () {
        if (meditationStart !== null) finishMeditation(false);
        else {
          meditationStart = Date.now(); meditationLimit = Number(duration.value);
          duration.disabled = true; meditationButton.textContent = 'Xả thiền';
          breath.classList.add('cu-breathing'); sound('khanh'); tickMeditation();
        }
      });
      meditationButton.hidden = typeof opts.onMeditate !== 'function';
      el('p', 'cu-note', 'Ngồi thẳng lưng, thả lỏng vai, theo dõi hơi thở.', panels.thien);
      function finishMeditation(expired) {
        if (meditationStart === null) return;
        var seconds = Math.floor((Date.now() - meditationStart) / 1000);
        if (meditationLimit) seconds = Math.min(seconds, meditationLimit);
        meditationStart = null; duration.disabled = false;
        meditationButton.textContent = 'Bắt đầu'; breath.classList.remove('cu-breathing');
        breath.textContent = 'Theo dõi hơi thở';
        if (expired) sound('chuong');
        sound('khanh'); call('onMeditate', seconds);
      }
      function tickMeditation() {
        if (meditationStart === null) return;
        var seconds = Math.floor((Date.now() - meditationStart) / 1000);
        clock.textContent = String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0');
        breath.textContent = (Date.now() - meditationStart) % 10000 < 4000 ? 'Hít vào…' : 'Thở ra…';
        if (meditationLimit && seconds >= meditationLimit) finishMeditation(true);
      }

      var offers = el('div', 'cu-offers', undefined, panels.le);
      [['huong', '🪔 Thắp hương'], ['nen', '🕯 Thắp nến'], ['hoa', '🌸 Dâng hoa'], ['dendang', '🏮 Thả đèn hoa đăng'], ['chuong', '🔔 Thỉnh chuông'], ['bow', '🙏 Lạy Phật (3 lạy)']].forEach(function (row) {
        var callback = row[0] === 'bow' ? 'onBow' : 'onOffer';
        if (typeof opts[callback] !== 'function') return;
        var b = button(offers, row[1], function () {
          var result = call(callback, row[0] === 'bow' ? undefined : row[0]);
          if (!alive) return;
          if (result && result.ok === false) {
            var wait = Math.max(0, Number(result.wait) || 0);
            if (wait) { b.disabled = true; cooldowns.push({ button: b, label: row[1], until: Date.now() + wait * 1000 }); tickCooldowns(); }
          } else if (row[0] === 'chuong' || row[0] === 'huong') sound(row[0]);
        }, 'cu-ctrl-btn cu-offer');
      });
      function tickCooldowns() {
        cooldowns = cooldowns.filter(function (entry) {
          var wait = Math.max(0, Math.ceil((entry.until - Date.now()) / 1000));
          entry.button.textContent = entry.label + (wait ? ' · ' + wait + 's' : '');
          entry.button.disabled = wait > 0;
          return wait > 0;
        });
      }

      var wishInput = el('textarea', 'cu-wish-input', undefined, panels.nguyen);
      wishInput.maxLength = 80; wishInput.placeholder = 'Viết lời nguyện an lành…';
      wishInput.setAttribute('aria-label', 'Lời nguyện (tối đa 80 ký tự)');
      var wishControls = el('div', 'cu-controls', undefined, panels.nguyen);
      var wishCounter = el('span', 'cu-note', '0 / 80', wishControls);
      listen(wishInput, 'input', function () { wishCounter.textContent = wishInput.value.length + ' / 80'; });
      var wishButton = button(wishControls, 'Thả đèn nguyện', function () {
        var text = wishInput.value.trim().slice(0, 80);
        if (!text) { toast('Xin viết lời nguyện trước khi thả đèn.'); return; }
        var result = call('onWish', text);
        if (result && result.ok === false) toast(result.msg || 'Chưa thể thả đèn.');
        else { wishInput.value = ''; wishCounter.textContent = '0 / 80'; toast('Đã gửi lời nguyện an lành.'); }
      });
      wishInput.hidden = wishButton.hidden = wishCounter.hidden = typeof opts.onWish !== 'function';
      var wishList = el('ul', 'cu-wish-list', undefined, panels.nguyen);
      var wishes = [];
      function renderWishes() {
        wishList.textContent = '';
        wishes.forEach(function (wish) {
          var item = el('li', 'cu-wish-item', undefined, wishList);
          el('strong', '', '🏮 ' + String(wish.name || 'Vong hồn'), item);
          el('div', '', String(wish.text || ''), item);
          var minutes = Math.max(0, Math.floor((Date.now() - (Number(wish.at) || Date.now())) / 60000));
          el('time', '', minutes ? minutes + ' phút trước' : 'Vừa xong', item);
        });
      }
      listen(root, 'keydown', function (event) {
        if (event.code === 'Escape' || event.key === 'Escape') {
          event.preventDefault(); event.stopPropagation(); leave(); return;
        }
        var target = event.target;
        if (target && (target.closest('input,textarea,select,button') || target.isContentEditable)) return;
        if (currentTab === 'niem' && (event.code === 'Space' || event.code === 'Enter')) {
          event.preventDefault(); event.stopPropagation();
          if (autoMode === 'niem') stopAuto(); else chant(true);
        }
      });
      var ticker = setInterval(function () { tickMeditation(); tickCooldowns(); }, 250);
      var wishTicker = setInterval(renderWishes, 30000);
      switchTab('niem'); renderStats(); updateMala();
      host.appendChild(wrap);

      return {
        setStats: function (data) {
          if (!alive) return;
          data = data || {};
          function number(value) { return Math.max(0, Math.floor(Number(value) || 0)); }
          // Session stats include sutra phrases; mala progress counts only invocations.
          if (data.mine !== undefined) mine = number(data.mine);
          if (data.today !== undefined) today = number(data.today);
          if (data.room !== undefined) room = number(data.room);
          if (data.chanters !== undefined) chanters = number(data.chanters);
          renderStats();
        },
        setTop: function (rows) {
          if (!alive) return;
          topList.textContent = '';
          (Array.isArray(rows) ? rows : []).slice(0, 5).forEach(function (row, i) {
            var li = el('li', 'cu-top-item', undefined, topList);
            el('span', 'cu-top-name', (i + 1) + '. ' + String(row.name || 'Vong hồn'), li);
            el('span', 'cu-top-val', String(row.c || 0), li);
          });
          if (!topList.children.length) el('li', 'cu-top-item', 'Chưa có ai', topList);
        },
        setWishes: function (rows) {
          if (!alive) return;
          wishes = (Array.isArray(rows) ? rows : []).filter(Boolean).slice().sort(function (a, b) { return (Number(b.at) || 0) - (Number(a.at) || 0); }).slice(0, 30);
          renderWishes();
        },
        toast: toast,
        remote: function (name) {
          if (!alive || !name) return;
          remoteNames.add(String(name));
          if (remoteTimer !== null) return;
          remoteTimer = later(function () {
            var names = Array.from(remoteNames); remoteNames.clear(); remoteTimer = null;
            remoteLine.textContent = names[0] + (names.length > 1 ? ' và ' + (names.length - 1) + ' người khác' : '') + ' đang niệm';
            later(function () { remoteLine.textContent = ''; }, 2400);
          }, 600);
        },
        unmount: function () {
          if (!alive) return;
          stopAuto(); finishMeditation(false); cancelSpeech();
          alive = false;
          clearInterval(ticker); clearInterval(wishTicker);
          timers.forEach(function (id) { clearTimeout(id); }); timers.clear();
          listeners.forEach(function (off) { off(); }); listeners = [];
          remoteNames.clear(); cooldowns = [];
          wrap.remove();
          if (!document.querySelector('.cu-wrap')) {
            var sharedStyle = document.getElementById('cu-styles');
            if (sharedStyle) sharedStyle.remove();
          }
        }
      };
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);