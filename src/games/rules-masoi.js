(function (root, factory) {
  const mod = factory();
  if (typeof module === 'object' && module.exports) module.exports = mod;
  else (root.GAME_RULES = root.GAME_RULES || {})[mod.id] = mod;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const copy = s => JSON.parse(JSON.stringify(s));
  const names={wolf:'Ma Sói',seer:'Tiên Tri',guard:'Bảo Vệ',villager:'Dân Làng'};
  // Entry arrays avoid special object keys (for example a player ID named __proto__).
  const get = (entries,id) => {const x=entries.find(x=>x[0]===id);return x?x[1]:null;};
  const object = entries => Object.fromEntries(entries);
  const player = (s,id) => id==null?null:s.players.find(p=>p.id===id)||null;
  const living = s => s.players.filter(p=>p.alive);
  function setup(players,opts) {
    if(players.length<5||players.length>12||new Set(players.map(p=>p.id)).size!==players.length)throw new Error('Ma Sói cần từ 5 đến 12 người khác nhau.');
    opts=opts||{};let seed=(opts.seed||0)>>>0;
    function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
    const wolves=players.length<=7?1:players.length<=10?2:3;
    const roles=Array(wolves).fill('wolf').concat(['seer','guard'],Array(players.length-wolves-2).fill('villager'));
    for(let i=roles.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[roles[i],roles[j]]=[roles[j],roles[i]];}
    return {phase:'night',day:1,deadline:(opts.now||0)+40000,players:players.map((p,i)=>({id:p.id,n:p.n,alive:true,role:roles[i]})),roleCount:{wolf:wolves,seer:1,guard:1,villager:players.length-wolves-2},log:['Đêm 1: làng tắt đèn, mời các vai thức giấc.'],picks:[],votes:[],ready:[],seen:[],lastGuard:null,over:null};
  }
  function victory(s) {
    const alive=living(s),wolves=alive.filter(p=>p.role==='wolf').length;
    const team=wolves===0?'village':wolves>=alive.length-wolves?'wolf':null;
    if(!team)return false;
    s.over={winners:s.players.filter(p=>(p.role==='wolf')===(team==='wolf')).map(p=>p.id),reason:team==='wolf'?'Ma Sói đã chiếm đa số trong làng.':'Làng đã tìm ra hết Ma Sói!',team};
    s.phase='end';s.log.push(s.over.reason);return true;
  }
  function actions(s,id) {
    const p=player(s,id);if(!p||!p.alive||s.over)return [];
    if(s.phase==='night') {
      if(get(s.picks,id)!==null||p.role==='villager')return [];
      const type={wolf:'kill',seer:'see',guard:'guard'}[p.role];
      return living(s).filter(t=>p.role==='wolf'?t.role!=='wolf':p.role==='guard'?t.id!==s.lastGuard:t.id!==id).map(t=>({type,target:t.id,label:({kill:'Cắn ',see:'Soi ',guard:'Che '})[type]+t.n}));
    }
    if(s.phase==='day')return s.ready.includes(id)?[]:[{type:'ready',label:'Sẵn sàng bỏ phiếu'}];
    if(s.phase==='vote'&&get(s.votes,id)===null)return living(s).map(t=>({type:'vote',target:t.id,label:'Bỏ phiếu '+t.n})).concat({type:'skip',label:'Không treo ai'});
    return [];
  }
  function changePhase(s,now) {
    if(s.phase==='night') {
      const count=new Map();let target=null,best=0;
      // Map insertion order follows submission order, resolving tied wolf targets by the first pick.
      s.picks.forEach(([id,to])=>{if(player(s,id).role==='wolf')count.set(to,(count.get(to)||0)+1);});
      count.forEach((n,id)=>{if(n>best){best=n;target=id;}});
      const guard=living(s).find(p=>p.role==='guard'),covered=guard?get(s.picks,guard.id):null;
      s.lastGuard=covered;
      if(target&&target!==covered){const dead=player(s,target);dead.alive=false;s.log.push('Đêm '+s.day+': '+dead.n+' bị sói tha đi ('+names[dead.role]+').');}
      else s.log.push('Đêm '+s.day+': đêm qua bình yên, cả làng ngủ ngon.');
      if(victory(s))return;
      s.phase='day';s.deadline=now+90000;s.ready=[];
    } else if(s.phase==='day') {
      s.phase='vote';s.deadline=now+30000;s.votes=[];s.log.push('Ngày '+s.day+': mời làng bỏ phiếu.');
    } else if(s.phase==='vote') {
      const count=new Map();s.votes.forEach(([,to])=>count.set(to,(count.get(to)||0)+1));
      let top=0,winner=null,tie=false;count.forEach((n,id)=>{if(n>top){top=n;winner=id;tie=false;}else if(n===top)tie=true;});
      if(winner&&winner!=='skip'&&!tie){const dead=player(s,winner);dead.alive=false;s.log.push('Làng treo cổ '+dead.n+' ('+names[dead.role]+').');}
      else s.log.push('Làng không treo ai: phiếu hòa hoặc chọn bỏ qua.');
      if(victory(s))return;
      s.phase='night';s.day++;s.deadline=now+40000;s.picks=[];s.votes=[];s.ready=[];s.log.push('Đêm '+s.day+': làng lại tắt đèn.');
    }
  }
  function tick(s,now) {
    if(s.over||!Number.isFinite(now)||now<s.deadline)return s;
    const n=copy(s);
    // Preserve scheduled boundaries when a server tick is late, including several missed phases.
    while(!n.over&&now>=n.deadline)changePhase(n,n.deadline);
    return n;
  }
  function apply(s,id,a,now) {
    if(!Number.isFinite(now))now=s.deadline-1;
    if(now>=s.deadline&&!s.over)return {state:s,error:'Pha này đã hết giờ, hãy chờ cập nhật của quản trò.'};
    if(!a||typeof a!=='object'||!actions(s,id).some(x=>x.type===a.type&&x.target===a.target))return {state:s,error:'Bạn chưa thể làm hành động này hoặc mục tiêu không hợp lệ.'};
    const n=copy(s),p=player(n,id);
    if(n.phase==='night') {
      n.picks.push([id,a.target]);
      if(p.role==='seer') {
        const seen=n.seen.find(x=>x[0]===a.target),role=player(n,a.target).role==='wolf'?'wolf':'village';
        if(seen)seen[1]=role;else n.seen.push([a.target,role]);
      }
      const done=living(n).filter(x=>x.role!=='villager').every(x=>get(n.picks,x.id)!==null||actions(n,x.id).length===0);
      if(done)changePhase(n,now);
    } else if(n.phase==='day') {
      n.ready.push(id);if(n.ready.length>living(n).length/2)changePhase(n,now);
    } else {
      n.votes.push([id,a.type==='skip'?'skip':a.target]);
      if(n.votes.length===living(n).length)changePhase(n,now);
    }
    return {state:n};
  }
  function view(s,id) {
    const me=player(s,id),v={phase:s.phase,day:s.day,deadline:s.deadline,you:me?{id:me.id,role:me.role,alive:me.alive}:null,
      players:s.players.map(p=>{const x={id:p.id,n:p.n,alive:p.alive};if(s.over||!p.alive||(me&&(me.id===p.id||me.role==='wolf'&&p.role==='wolf')))x.role=p.role;return x;}),
      roleCount:s.roleCount,log:s.log,votes:s.phase==='vote'?object(s.votes):{},myPick:me?get(s.picks,me.id):null,over:s.over};
    if(me&&me.role==='wolf')v.wolfPicks=object(s.picks.filter(x=>player(s,x[0]).role==='wolf'));
    if(me&&me.role==='seer')v.seen=object(s.seen);
    return copy(v);
  }
  function chatChannel(s,id) {const p=player(s,id);if(!p||!p.alive||s.over)return null;if(s.phase==='night')return p.role==='wolf'?'wolves':null;return 'all';}
  function selfTest() {
    let passed=0;const failed=[];function test(name,fn){try{if(!fn())throw new Error('Sai kết quả');passed++;}catch(e){failed.push(name+': '+e.message);}}
    function fresh(n){return setup(Array.from({length:n||5},(_,i)=>({id:'p'+i,n:'Người '+i})),{seed:42,now:100});}
    function act(s,id,a){const r=apply(s,id,a,1000);if(r.error)throw new Error(r.error);return r.state;}
    test('Chia vai 5, 8, 12 và seed cố định',()=>[5,8,12].every((n,i)=>{const s=fresh(n);return s.players.filter(p=>p.role==='wolf').length===[1,2,3][i]&&s.players.filter(p=>p.role==='seer').length===1&&s.players.filter(p=>p.role==='guard').length===1&&JSON.stringify(s)===JSON.stringify(fresh(n));}));
    test('View giấu vai và dữ liệu đêm',()=>{const s=fresh(8);return s.players.every(me=>{const v=view(s,me.id);return v.players.every(p=>('role'in p)===(p.id===me.id||me.role==='wolf'&&player(s,p.id).role==='wolf'))&&('seen'in v)===(me.role==='seer')&&('wolfPicks'in v)===(me.role==='wolf');})&&view(s,null).players.every(p=>!('role'in p))&&view(s,'khách').you===null;});
    test('Bảo vệ chặn sói',()=>{let s=fresh(),w=s.players.find(p=>p.role==='wolf'),g=s.players.find(p=>p.role==='guard'),seer=s.players.find(p=>p.role==='seer'),target=s.players.find(p=>p.role==='villager');s=act(s,w.id,{type:'kill',target:target.id});s=act(s,g.id,{type:'guard',target:target.id});s=act(s,seer.id,{type:'see',target:w.id});return s.phase==='day'&&s.players.every(p=>p.alive)&&view(s,seer.id).seen[w.id]==='wolf';});
    test('Không che cùng người hai đêm',()=>{const s=fresh(),g=s.players.find(p=>p.role==='guard');s.lastGuard=g.id;return !actions(s,g.id).some(a=>a.target===g.id);});
    test('Vote treo sói, dân thắng và lộ vai',()=>{let s=fresh();s.phase='vote';const w=s.players.find(p=>p.role==='wolf');for(const p of s.players.slice())s=act(s,p.id,{type:'vote',target:w.id});return s.over.team==='village'&&!player(s,w.id).alive&&view(s,null).players.every(p=>p.role)&&s.over.winners.length===4;});
    test('Phiếu skip và hòa không treo',()=>{let s=fresh();s.phase='vote';const ps=s.players.slice();for(let i=0;i<5;i++)s=act(s,ps[i].id,i<2?{type:'vote',target:ps[0].id}:{type:'skip'});return s.phase==='night'&&s.day===2&&living(s).length===5;});
    test('Hai mục tiêu bằng phiếu không treo',()=>{let s=fresh();s.phase='vote';const ps=s.players.slice();for(let i=0;i<5;i++)s=act(s,ps[i].id,i===4?{type:'skip'}:{type:'vote',target:ps[i<2?0:1].id});return s.phase==='night'&&living(s).length===5;});
    test('Kênh chat và giấu lựa chọn đêm',()=>{let s=fresh(8);const w=s.players.find(p=>p.role==='wolf'),v=s.players.find(p=>p.role==='villager');s=act(s,w.id,{type:'kill',target:v.id});const hidden=view(s,v.id);return chatChannel(s,w.id)==='wolves'&&chatChannel(s,v.id)===null&&!('wolfPicks'in hidden)&&hidden.myPick===null&&Object.keys(hidden.votes).length===0&&view(s,null).myPick===null;});
    test('Sói thắng khi ngang dân',()=>{const s=fresh();let keep=1;s.players.forEach(p=>{if(p.role!=='wolf')p.alive=keep-->0;});return victory(s)&&s.over.team==='wolf'&&s.over.winners.length===1;});
    test('Tick ba pha và bất biến',()=>{const s=fresh(),before=JSON.stringify(s),day=tick(s,s.deadline),vote=tick(day,day.deadline),night=tick(vote,vote.deadline);return JSON.stringify(s)===before&&day.phase==='day'&&vote.phase==='vote'&&night.phase==='night'&&night.day===2&&tick(s,99)===s;});
    test('Ready quá nửa',()=>{let s=fresh();s.phase='day';s=act(s,s.players[0].id,{type:'ready'});s=act(s,s.players[1].id,{type:'ready'});if(s.phase!=='day')return false;s=act(s,s.players[2].id,{type:'ready'});return s.phase==='vote';});
    test('Người chết, khách và sai vai bị chặn',()=>{const s=fresh(),p=s.players.find(p=>p.role==='villager');p.alive=false;return actions(s,p.id).length===0&&chatChannel(s,p.id)===null&&apply(s,p.id,{type:'kill',target:s.players[0].id},1000).state===s&&actions(s,null).length===0;});
    test('Sói hòa chọn mục tiêu trước',()=>{let s=fresh(8);const ws=s.players.filter(p=>p.role==='wolf'),ts=s.players.filter(p=>p.role==='villager');s=act(s,ws[0].id,{type:'kill',target:ts[1].id});s=act(s,ws[1].id,{type:'kill',target:ts[0].id});s=tick(s,s.deadline);return !player(s,ts[1].id).alive&&player(s,ts[0].id).alive;});
    test('Apply không sửa state, view không trỏ state',()=>{const s=fresh(),w=s.players.find(p=>p.role==='wolf'),a=actions(s,w.id)[0],before=JSON.stringify(s),r=apply(s,w.id,a,1000),v=view(s,w.id);v.log.push('giả');return !r.error&&JSON.stringify(s)===before&&r.state!==s&&apply(s,w.id,a,s.deadline).state===s;});
    return {ok:!failed.length,passed,failed};
  }
  return {id:'masoi',name:'Ma Sói',minPlayers:5,maxPlayers:12,setup,view,actions,apply,tick,result:s=>copy(s.over),bot:()=>null,chatChannel,selfTest};
});
