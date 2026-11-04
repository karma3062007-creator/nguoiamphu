(function (root, factory) {
  const mod = factory();
  if (typeof module === 'object' && module.exports) module.exports = mod;
  else (root.GAME_RULES = root.GAME_RULES || {})[mod.id] = mod;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const copy = s => JSON.parse(JSON.stringify(s));
  const other = c => c === 'w' ? 'b' : 'w';
  const square = i => 'abcdefgh'[i % 8] + (8 - Math.floor(i / 8));
  const index = s => /^[a-h][1-8]$/.test(s) ? (8 - Number(s[1])) * 8 + s.charCodeAt(0) - 97 : -1;
  const dirs = { N: [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]], B: [[-1,-1],[-1,1],[1,-1],[1,1]], R: [[-1,0],[1,0],[0,-1],[0,1]] };
  dirs.Q = dirs.B.concat(dirs.R); dirs.K = dirs.Q;
  function setup(players, opts) {
    if (players.length !== 2 || players[0].id === players[1].id) throw new Error('Cờ vua cần hai người khác nhau.');
    const p = copy(players), odd = ((opts || {}).seed || 0) & 1;
    const board = Array(64).fill('');
    'RNBQKBNR'.split('').forEach((v,i) => { board[i] = 'b'+v; board[8+i] = 'bP'; board[48+i] = 'wP'; board[56+i] = 'w'+v; });
    return { board, turn: 'w', players: { w:p[odd], b:p[1-odd] }, castle: { wK:true,wQ:true,bK:true,bQ:true }, ep:-1, half:0, last:null, captured:{w:[],b:[]}, moves:[], over:null };
  }
  function attacked(board, at, by) {
    const row = Math.floor(at/8), col = at%8;
    for (let i=0;i<64;i++) {
      const p=board[i]; if (!p || p[0]!==by) continue;
      const dr=row-Math.floor(i/8), dc=col-i%8, t=p[1];
      if (t==='P') { if (dr===(by==='w'?-1:1) && Math.abs(dc)===1) return true; continue; }
      if (t==='N') { if (Math.abs(dr)*Math.abs(dc)===2) return true; continue; }
      if (t==='K') { if (Math.max(Math.abs(dr),Math.abs(dc))===1) return true; continue; }
      if (!((t==='B'||t==='Q') && Math.abs(dr)===Math.abs(dc) && dr!==0) && !((t==='R'||t==='Q') && ((dr===0)!==(dc===0)))) continue;
      const sr=Math.sign(dr), sc=Math.sign(dc); let r=Math.floor(i/8)+sr,c=i%8+sc, clear=true;
      while (r!==row || c!==col) { if (board[r*8+c]) {clear=false;break;} r+=sr;c+=sc; }
      if (clear) return true;
    }
    return false;
  }
  function check(s,c) { const k=s.board.indexOf(c+'K'); return k<0 || attacked(s.board,k,other(c)); }
  // Internal moves use numeric squares; external actions never expose this representation.
  function pseudo(s) {
    const out=[], b=s.board,c=s.turn;
    function add(f,t,extra) {
      if (b[t] && (b[t][0]===c || b[t][1]==='K')) return;
      if (b[f][1]==='P' && (t<8 || t>=56)) ['q','r','b','n'].forEach(p=>out.push(Object.assign({f,t,p},extra)));
      else out.push(Object.assign({f,t},extra));
    }
    for (let f=0;f<64;f++) {
      const piece=b[f]; if (!piece || piece[0]!==c) continue;
      const r=Math.floor(f/8),col=f%8,t=piece[1];
      if (t==='P') {
        const d=c==='w'?-1:1, n=f+d*8;
        if (n>=0 && n<64 && !b[n]) { add(f,n); if (r===(c==='w'?6:1) && !b[f+d*16]) add(f,f+d*16); }
        [-1,1].forEach(dx=>{ const to=n+dx; if (col+dx<0||col+dx>7||to<0||to>=64) return;
          if (b[to] && b[to][0]!==c) add(f,to);
          else if (to===s.ep && !b[to] && b[to-d*8]===other(c)+'P') add(f,to,{ep:true});
        });
      } else {
        dirs[t].forEach(d=>{ let nr=r+d[0],nc=col+d[1]; while (nr>=0&&nr<8&&nc>=0&&nc<8) { const to=nr*8+nc; add(f,to); if (b[to]||t==='N'||t==='K') break; nr+=d[0];nc+=d[1]; } });
        const home=c==='w'?60:4;
        if (t==='K' && f===home && !check(s,c)) {
          [1,-1].forEach(side=>{
            const rook=home+(side===1?3:-4), path=side===1?[1,2]:[-1,-2,-3];
            if (!s.castle[c+(side===1?'K':'Q')] || b[rook]!==c+'R' || path.some(x=>b[home+x])) return;
            // Test the transit square after removing the king from its starting square.
            const transit=b.slice();transit[home]='';transit[home+side]=c+'K';
            if (!attacked(transit,home+side,other(c))) add(f,home+2*side,{castle:side});
          });
        }
      }
    }
    return out;
  }
  function advance(s,m) {
    const b=s.board.slice(),c=s.turn,piece=b[m.f], captureAt=m.ep?m.t+(c==='w'?8:-8):m.t, taken=b[captureAt];
    b[m.f]='';b[captureAt]='';b[m.t]=m.p?c+m.p.toUpperCase():piece;
    if (m.castle) { const rf=m.f+(m.castle===1?3:-4); b[m.f+m.castle]=b[rf];b[rf]=''; }
    const rights=Object.assign({},s.castle);
    if (piece[1]==='K') {rights[c+'K']=false;rights[c+'Q']=false;}
    [[0,'bQ'],[7,'bK'],[56,'wQ'],[63,'wK']].forEach(pair=>{if(m.f===pair[0]||m.t===pair[0]) rights[pair[1]]=false;});
    return Object.assign({},s,{board:b,turn:other(c),castle:rights,ep:piece[1]==='P'&&Math.abs(m.t-m.f)===16?(m.f+m.t)/2:-1,half:piece[1]==='P'||taken?0:s.half+1});
  }
  function legal(s) { return pseudo(s).filter(m=>!check(advance(s,m),s.turn)); }
  function insufficient(b) {
    const pieces=b.map((p,i)=>({p,i})).filter(x=>x.p && x.p[1]!=='K');
    if (pieces.some(x=>'PQR'.includes(x.p[1]))) return false;
    if (pieces.length<=1) return true;
    return pieces.every(x=>x.p[1]==='B') && new Set(pieces.map(x=>(Math.floor(x.i/8)+x.i%8)%2)).size===1;
  }
  function adjudicate(s) {
    const moves=legal(s);
    if (!moves.length) return check(s,s.turn)?{winners:[s.players[other(s.turn)].id],draw:false,reason:'Chiếu hết! Vua xin nghỉ phép.'}:{winners:[],draw:true,reason:'Hòa: hết nước đi hợp lệ.'};
    if (insufficient(s.board)) return {winners:[],draw:true,reason:'Hòa: không đủ quân chiếu hết.'};
    if (s.half>=100) return {winners:[],draw:true,reason:'Hòa theo luật 50 nước.'};
    return null;
  }
  function color(s,id) { return id!=null && s.players.w.id===id?'w':id!=null && s.players.b.id===id?'b':null; }
  function external(m) { const a={type:'move',from:square(m.f),to:square(m.t),label:square(m.f)+' → '+square(m.t)+(m.p?' (phong '+({q:'hậu',r:'xe',b:'tượng',n:'mã'})[m.p]+')':'')}; if(m.p)a.promo=m.p;return a; }
  function actions(s,id) { if(s.over||!color(s,id)||color(s,id)!==s.turn)return [];return legal(s).map(external).concat({type:'resign',label:'Đầu hàng'}); }
  function san(s,m,all,next) {
    let text;
    if (m.castle) text=m.castle===1?'O-O':'O-O-O';
    else {
      const t=s.board[m.f][1],cap=!!s.board[m.t]||m.ep;
      text=t==='P'?(cap?square(m.f)[0]:''):t;
      if (t!=='P') {
        const peers=all.filter(x=>x.f!==m.f && x.t===m.t && s.board[x.f]===s.board[m.f]);
        if(peers.length) text+=peers.every(x=>x.f%8!==m.f%8)?square(m.f)[0]:peers.every(x=>Math.floor(x.f/8)!==Math.floor(m.f/8))?square(m.f)[1]:square(m.f);
      }
      text+=(cap?'x':'')+square(m.t)+(m.p?'='+m.p.toUpperCase():'');
    }
    if (check(next,next.turn)) text+=legal(next).length?'+':'#';
    return text;
  }
  function apply(s,id,a) {
    if (!a||typeof a!=='object'||s.over||!color(s,id)||color(s,id)!==s.turn) return {state:s,error:'Chưa tới lượt hoặc ván đã kết thúc.'};
    if(a.type==='resign') {const n=copy(s);n.over={winners:[s.players[other(color(s,id))].id],draw:false,reason:'Đối thủ đã đầu hàng.'};return {state:n};}
    const all=legal(s),m=all.find(m=>a.type==='move'&&square(m.f)===a.from&&square(m.t)===a.to&&m.p===a.promo);
    if(!m)return {state:s,error:'Nước đi không hợp lệ.'};
    const n=advance(s,m),taken=s.board[m.ep?m.t+(s.turn==='w'?8:-8):m.t];
    n.captured=copy(s.captured);if(taken)n.captured[s.turn].push(taken);
    n.last={from:a.from,to:a.to};n.moves=s.moves.concat(san(s,m,all,n));n.over=adjudicate(n);return {state:n};
  }
  function view(s,id) { return copy({board:s.board,turn:s.turn,you:color(s,id),players:s.players,check:check(s,s.turn),last:s.last,captured:s.captured,moves:s.moves,over:s.over}); }
  function bot(s,id) {
    if(s.over||color(s,id)!==s.turn)return null;
    const values={P:100,N:320,B:330,R:500,Q:900,K:0};let best=null,bestValue=-Infinity;
    legal(s).forEach(m=>{
      const n=advance(s,m),replies=legal(n),taken=s.board[m.ep?m.t+(s.turn==='w'?8:-8):m.t];
      let v=taken?values[taken[1]]:0; if(m.p)v+=values[m.p.toUpperCase()]-100;
      if(!replies.length)v=check(n,n.turn)?100000:0;
      else { if(check(n,n.turn))v+=30; if(attacked(n.board,m.t,n.turn))v-=values[n.board[m.t][1]]*0.8; v+=3.5-Math.abs(m.t%8-3.5); }
      if(v>bestValue){bestValue=v;best=m;}
    });return best?external(best):null;
  }
  function selfTest() {
    const failed=[];let passed=0;function test(name,fn){try{if(!fn())throw new Error('Sai kết quả');passed++;}catch(e){failed.push(name+': '+e.message);}}
    const players=[{id:'a',n:'A'},{id:'b',n:'B'}];
    function fixture(map,turn){const s=setup(players,{seed:0});s.board.fill('');Object.keys(map).forEach(k=>s.board[index(k)]=map[k]);s.turn=turn||'w';s.castle={};return s;}
    function move(s,f,t,p){const a={type:'move',from:f,to:t};if(p)a.promo=p;const r=apply(s,s.players[s.turn].id,a);if(r.error)throw new Error(r.error);return r.state;}
    function perft(s,d){if(!d)return 1;return legal(s).reduce((v,m)=>v+perft(advance(s,m),d-1),0);}
    test('20 nước đầu',()=>legal(setup(players,{})).length===20);
    test('Perft 3 = 8902',()=>perft(setup(players,{}),3)===8902);
    test('Fool mate và SAN',()=>{let s=setup(players,{});[['f2','f3'],['e7','e5'],['g2','g4'],['d8','h4']].forEach(m=>s=move(s,...m));return s.over.winners[0]==='b'&&s.moves[3]==='Qh4#';});
    test('Nhập thành hai phía',()=>{const s=fixture({e1:'wK',a1:'wR',h1:'wR',e8:'bK'});s.castle={wK:true,wQ:true};return legal(s).filter(m=>m.castle).length===2&&move(s,'e1','g1').board[index('f1')]==='wR';});
    test('Không nhập thành xuyên chiếu',()=>{const s=fixture({e1:'wK',h1:'wR',a8:'bK',f8:'bR'});s.castle={wK:true};return !legal(s).some(m=>m.castle);});
    test('Bắt tốt qua đường',()=>{let s=fixture({e1:'wK',e8:'bK',e5:'wP',d7:'bP'},'b');s=move(s,'d7','d5');s=move(s,'e5','d6');return !s.board[index('d5')]&&s.captured.w[0]==='bP';});
    test('Qua đường không được lộ vua',()=>{const s=fixture({e5:'wK',f5:'wP',g5:'bP',h5:'bR',a8:'bK'});s.ep=index('g6');return !legal(s).some(m=>m.ep);});
    test('Phong cấp bốn loại',()=>{const s=fixture({h1:'wK',h8:'bK',a7:'wP'});return legal(s).filter(m=>m.p).length===4&&move(s,'a7','a8','n').board[0]==='wN';});
    test('Hòa hết nước',()=>{const s=fixture({a8:'bK',c6:'wK',b6:'wQ'},'b');return adjudicate(s).draw;});
    test('Hòa thiếu quân và 50 nước',()=>{const s=fixture({e1:'wK',e8:'bK'});if(!adjudicate(s).draw)return false;s.board[0]='bR';s.half=100;return adjudicate(s).draw;});
    test('Bất biến và từ chối giả mạo',()=>{const s=setup(players,{}),before=JSON.stringify(s);const n=move(s,'e2','e4');const v=view(n,'a');v.board.fill('');return JSON.stringify(s)===before&&n.board[36]==='wP'&&apply(s,'b',{type:'move',from:'e2',to:'e4'}).state===s;});
    test('Seed và bot hợp lệ',()=>{const s=setup(players,{seed:1}),a=bot(s,'b');return s.players.w.id==='b'&&a&&!apply(s,'b',a).error;});
    test('Bot chọn chiếu hết ngay',()=>{const s=fixture({f6:'wK',g6:'wQ',h8:'bK'}),a=bot(s,'a');return a&&apply(s,'a',a).state.over.winners[0]==='a';});
    test('Bắt qua đường hết hạn sau một lượt',()=>{let s=fixture({e1:'wK',e8:'bK',e5:'wP',d7:'bP'},'b');s=move(s,'d7','d5');s=move(s,'e1','f1');return s.ep===-1;});
    return {ok:!failed.length,passed,failed};
  }
  return {id:'chess',name:'Cờ vua',minPlayers:2,maxPlayers:2,setup,view,actions,apply,tick:s=>s,result:s=>copy(s.over),bot,chatChannel:()=> 'all',selfTest};
});
