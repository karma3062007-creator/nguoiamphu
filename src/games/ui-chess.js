(function () {
  'use strict';
  const glyph = {wK:'♔',wQ:'♕',wR:'♖',wB:'♗',wN:'♘',wP:'♙',bK:'♚',bQ:'♛',bR:'♜',bB:'♝',bN:'♞',bP:'♟'};
  const names = {K:'vua',Q:'hậu',R:'xe',B:'tượng',N:'mã',P:'tốt'};
  const sq = i => 'abcdefgh'[i % 8] + (8 - Math.floor(i / 8));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  const css = `.gui-chess{font:700 15px/1.4 "Baloo 2",system-ui,sans-serif;color:#6a1414;max-width:640px;margin:auto;min-width:0}.gui-chess *{box-sizing:border-box}.gui-chess button{font:inherit;touch-action:manipulation;cursor:pointer}.gui-chess button:focus-visible{outline:3px solid #d63a1f;outline-offset:-3px;z-index:3}.gui-chess .gc-status{background:#6a1414;color:#fdebc8;padding:10px 12px;border-radius:14px;margin-bottom:10px;overflow-wrap:anywhere}.gui-chess .gc-status small{display:block;color:#ffdf7e;font-size:12px}.gui-chess .gc-player{display:flex;gap:8px;align-items:center;min-height:43px;padding:5px 2px}.gui-chess .gc-name{flex:1;min-width:0;overflow-wrap:anywhere}.gui-chess .gc-badge{font-size:12px;border:1px solid #e8b765;border-radius:20px;padding:2px 8px;background:#fff5df}.gui-chess .gc-taken{font:22px/1.1 "Segoe UI Symbol","Arial Unicode MS",serif;letter-spacing:-3px;min-height:24px;overflow-wrap:anywhere;color:#35191b}.gui-chess .gc-board{container-type:inline-size;display:grid;grid-template-columns:repeat(8,minmax(0,1fr));border:4px solid #6a1414;border-radius:8px;overflow:hidden;box-shadow:0 5px 0 #b06a2a;margin-bottom:7px}.gui-chess .gc-square{position:relative;aspect-ratio:1;min-width:0;border:0;border-radius:0;padding:0;display:grid;place-items:center;background:#f6d49a;color:#6a1414;isolation:isolate}.gui-chess .gc-dark{background:#b5653a}.gui-chess .gc-last{box-shadow:inset 0 0 0 999px #f7c24a66}.gui-chess .gc-selected{box-shadow:inset 0 0 0 4px #8b221a;background:#f7c24a}.gui-chess .gc-check{background:#ef654e;box-shadow:inset 0 0 0 3px #9a1414}.gui-chess .gc-piece{font:clamp(26px,7.7vw,57px)/1 "Segoe UI Symbol","Arial Unicode MS",serif;font-size:clamp(20px,11cqw,57px);z-index:1;filter:drop-shadow(0 2px 1px #59271855);color:#251c25;-webkit-text-stroke:.6px #fff0ce}.gui-chess .gc-piece{font-variant-emoji:text}.gui-chess .gc-white{color:#fff8e7;-webkit-text-stroke:1.2px #442029;paint-order:stroke fill}.gui-chess .gc-black{color:#2a1416;-webkit-text-stroke:.8px #fff0ce;paint-order:stroke fill}.gui-chess .gc-dot{position:absolute;width:24%;height:24%;border-radius:50%;background:#54261b77}.gui-chess .gc-capture{width:88%;height:88%;background:transparent;border:4px solid #6a1414aa}.gui-chess .gc-coordinate{position:absolute;bottom:1px;right:3px;font:700 9px/1 system-ui;color:#502116}.gui-chess .gc-dark .gc-coordinate{color:#fff2d5}.gui-chess .gc-promotion{background:#fff7e6;border:2px solid #e8b765;border-radius:14px;padding:10px;margin-top:10px}.gui-chess .gc-choices{display:flex;gap:6px;flex-wrap:wrap;margin-top:7px}.gui-chess .gc-choices button{flex:1;min-height:50px;background:#f6d49a;border:2px solid #e8b765;border-radius:10px;color:#6a1414}.gui-chess .gc-choices span{font:32px/1 "Segoe UI Symbol",serif;display:block}.gui-chess .gc-help{font-size:12px;margin:8px 0}.gui-chess details{background:#fff5df;border:1px solid #e8b765;border-radius:12px;padding:8px 10px;margin-top:10px}.gui-chess summary{cursor:pointer}.gui-chess .gc-moves{max-height:140px;overflow:auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:3px 8px;font:13px/1.7 ui-monospace,monospace;margin-top:6px}.gui-chess .gc-moves span{overflow-wrap:anywhere}.gui-chess .gc-moves i{color:#9b6852;font-style:normal;margin-right:5px}`;
  (window.GAME_UI = window.GAME_UI || {}).chess = {
    mount(el, api) {
      if (!document.getElementById('gui-chess-style')) { const s=document.createElement('style');s.id='gui-chess-style';s.textContent=css;document.head.appendChild(s); }
      const root=document.createElement('section');root.className='gui-chess';el.appendChild(root);
      let view=null, acts=[], selected=null, promotion=null, pending=false, dead=false, historyOpen=false;
      function sound(n) { if(api.sfx)api.sfx(n); }
      function send(a) { if(pending||!a)return;pending=true;selected=null;promotion=null;render();api.act(a); }
      function player(c) {
        return `<div class="gc-player"><span aria-hidden="true">${c==='w'?'♔':'♚'}</span><span class="gc-name">${esc(view.players[c].n)}</span><span class="gc-badge">${view.you===c?'Bạn · ':''}${c==='w'?'Trắng':'Đen'}</span></div><div class="gc-taken" aria-label="Quân đã ăn">${view.captured[c].map(p=>glyph[p]||'').join('') || '<span style="font:12px system-ui;letter-spacing:0">Chưa ăn quân</span>'}</div>`;
      }
      function render() {
        if(!view||dead)return;
        const v=view, bottom=v.you==='b'?'b':'w', top=bottom==='w'?'b':'w', moves=acts.filter(a=>a.type==='move'), targets=moves.filter(a=>a.from===selected);
        let status=v.over?(v.over.draw?'Ván cờ hòa':v.over.winners.includes(api.me)?'Bạn thắng rồi!':'Ván cờ kết thúc'):pending?'Đang gửi nước đi…':v.you===null?'Bạn đang xem bàn cờ':v.turn===v.you?'Lượt của bạn':'Đối thủ đang nghĩ…';
        if(v.check&&!v.over)status+=' · Chiếu!';
        let board='';
        for(let j=0;j<64;j++) {
          const i=bottom==='b'?63-j:j, square=sq(i), p=v.board[i], target=targets.some(a=>a.to===square), usable=!pending&&!promotion&&moves.some(a=>a.from===square);
          board+=`<button type="button" class="gc-square ${((Math.floor(i/8)+i%8)%2)?'gc-dark':''} ${v.last&&(v.last.from===square||v.last.to===square)?'gc-last':''} ${selected===square?'gc-selected':''} ${v.check&&p===v.turn+'K'?'gc-check':''}" data-square="${square}" aria-label="${square}${p?' · '+(p[0]==='w'?'Trắng ':'Đen ')+names[p[1]]:' · trống'}${target?' · có thể đi tới':''}" aria-pressed="${selected===square}" aria-disabled="${!(usable||target)&&!selected}">${p?`<span aria-hidden="true" class="gc-piece ${p[0]==='w'?'gc-white':'gc-black'}">${glyph['b'+p[1]]}︎</span>`:''}${target?`<span class="gc-dot ${p?'gc-capture':''}" aria-hidden="true"></span>`:''}<span class="gc-coordinate" aria-hidden="true">${square}</span></button>`;
        }
        const promo=promotion?`<div class="gc-promotion" role="group" aria-label="Chọn quân phong cấp"><b>Tốt lên chức! Chọn quân:</b><div class="gc-choices">${promotion.map((a,i)=>`<button type="button" data-promo="${i}"><span aria-hidden="true">${glyph[v.turn+a.promo.toUpperCase()]}</span>${names[a.promo.toUpperCase()]}</button>`).join('')}<button type="button" data-cancel>Hủy</button></div></div>`:'';
        root.innerHTML=`<div class="gc-status" role="status">${esc(status)}<small>${esc(v.over?v.over.reason:'Bàn cờ âm phủ · nghĩ kỹ, đi vui')}</small></div>${player(top)}<div class="gc-board" role="group" aria-label="Bàn cờ vua">${board}</div>${player(bottom)}${promo}<p class="gc-help">${selected?'Chọn ô có dấu tròn để đi. Bấm lại quân để bỏ chọn.':'Bấm quân của bạn để xem các nước đi hợp lệ.'}</p><details ${historyOpen?'open':''}><summary>Biên bản · ${v.moves.length} lượt đi</summary><div class="gc-moves">${v.moves.length?v.moves.map((m,i)=>`<span><i>${Math.floor(i/2)+1}${i%2?'…':'.'}</i>${esc(m)}</span>`).join(''):'Chưa có nước đi.'}</div></details>`;
        if(promotion)root.querySelector('[data-promo]')?.focus();
      }
      function click(e) {
        const b=e.target.closest('button');if(!b||!root.contains(b)||!view||pending)return;
        if(b.hasAttribute('data-cancel')){promotion=null;render();return;}
        if(b.hasAttribute('data-promo')){send(promotion&&promotion[Number(b.dataset.promo)]);return;}
        if(promotion)return;
        const square=b.dataset.square;if(!square)return;
        const choices=acts.filter(a=>a.type==='move'&&a.from===selected&&a.to===square);
        if(choices.length){if(choices.some(a=>a.promo)){promotion=choices;render();}else send(choices[0]);return;}
        selected=selected===square?null:acts.some(a=>a.type==='move'&&a.from===square)?square:null;render();
        root.querySelector(`[data-square="${square}"]`)?.focus({preventScroll:true});
      }
      function toggle(e){if(e.target.tagName==='DETAILS')historyOpen=e.target.open;}
      root.addEventListener('click',click);root.addEventListener('toggle',toggle,true);
      return {
        update(v,a) {
          if(dead)return;
          if(view&&JSON.stringify(v.moves)!==JSON.stringify(view.moves)&&v.moves.length>view.moves.length) sound(v.captured.w.length+v.captured.b.length>view.captured.w.length+view.captured.b.length?'capture':'move');
          view=v;acts=a||[];pending=false;
          if(!acts.some(x=>x.type==='move'&&x.from===selected)){selected=null;promotion=null;}
          if(promotion){promotion=acts.filter(x=>x.type==='move'&&x.from===promotion[0].from&&x.to===promotion[0].to);if(!promotion.length)promotion=null;}
          render();
        },
        destroy(){dead=true;root.removeEventListener('click',click);root.removeEventListener('toggle',toggle,true);root.remove();view=null;acts=[];}
      };
    }
  };
})();
