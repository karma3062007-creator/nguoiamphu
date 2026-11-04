(function (root, factory) {
  const mod = factory();
  if (typeof module === 'object' && module.exports) module.exports = mod;
  else (root.GAME_RULES = root.GAME_RULES || {})[mod.id] = mod;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const copy = s => JSON.parse(JSON.stringify(s));
  const side = seat => seat === 0 ? [1,2,3,4,5] : [7,8,9,10,11];
  const next = (i,d) => (i+d+12)%12;
  const occupied = c => c.dan+c.quan>0;
  const position = s => JSON.stringify([s.cells,s.turn,s.score,s.debt]);
  function points(s) {s.score.forEach(x=>x.points=x.dan+10*x.quan);}
  function setup(players) {
    if(players.length!==2||players[0].id===players[1].id)throw new Error('Ô ăn quan cần hai người khác nhau.');
    return {cells:Array.from({length:12},(_,i)=>({dan:i%6?5:0,quan:i%6?0:1})),seats:copy(players),turn:0,score:[{dan:0,quan:0,points:0},{dan:0,quan:0,points:0}],debt:[0,0],last:null,over:null,moveNo:0,history:[]};
  }
  function seatOf(s,id) {return id==null?-1:s.seats.findIndex(p=>p.id===id);}
  function actions(s,id) {
    if(s.over||seatOf(s,id)!==s.turn)return [];
    const out=[];side(s.turn).forEach(cell=>{if(s.cells[cell].dan>0)[1,-1].forEach(dir=>out.push({type:'sow',cell,dir,label:'Ô '+cell+' · rải '+(dir===1?'chiều tăng':'chiều giảm')}));});
    return out.concat({type:'resign',label:'Đầu hàng'});
  }
  function collect(s,seat,cell,steps) {
    s.score[seat].dan+=s.cells[cell].dan;s.score[seat].quan+=s.cells[cell].quan;
    s.cells[cell]={dan:0,quan:0};if(steps)steps.push({cell,kind:'capture'});
  }
  function finish(s,seat,steps) {
    if(s.cells[0].quan || s.cells[6].quan)return false;
    [0,1].forEach(p=>side(p).forEach(i=>collect(s,p,i,steps)));
    // Any dân dropped into an already captured quan pit belong to the final collector.
    [0,6].forEach(i=>collect(s,seat,i,steps));
    const net=s.debt[0]-s.debt[1];s.score[0].dan-=net;s.score[1].dan+=net;s.debt=[0,0];points(s);
    const a=s.score[0].points,b=s.score[1].points;
    s.over={winners:a===b?[]:[s.seats[a>b?0:1].id],draw:a===b,reason:a===b?'Hòa! Hai nhà cùng đầy túi.':'Hết quan: bên nhiều điểm hơn thắng.'};return true;
  }
  function refill(s,steps) {
    const p=s.turn, own=side(p);if(own.some(i=>s.cells[i].dan))return;
    const use=Math.min(5,Math.max(0,s.score[p].dan)),borrow=5-use;
    s.score[p].dan-=use;
    // The lender's account can temporarily be negative: an advance against its final harvest.
    // Counting the advance here conserves all 50 dân; debt is repaid once at settlement.
    s.score[1-p].dan-=borrow;s.debt[p]+=borrow;
    own.forEach(cell=>{s.cells[cell].dan=1;steps.push({cell,kind:'refill'});});points(s);
  }
  function sow(s,cell,dir) {
    const seat=s.turn,steps=[];s.last={seat,cell,dir,steps};let at=cell;
    while(true) {
      let hand=s.cells[at].dan;s.cells[at].dan=0;steps.push({cell:at,kind:'pick'});
      while(hand-->0){at=next(at,dir);s.cells[at].dan++;steps.push({cell:at,kind:'drop'});}
      let ahead=next(at,dir);
      if(occupied(s.cells[ahead])) {
        if(ahead===0||ahead===6)break;
        at=ahead;continue;
      }
      while(!occupied(s.cells[ahead])) {
        const target=next(ahead,dir);if(!occupied(s.cells[target]))break;
        collect(s,seat,target,steps);ahead=next(target,dir);
      }
      break;
    }
    s.moveNo++;points(s);
    if(!finish(s,seat,steps)){s.turn=1-seat;refill(s,steps);}s.history.push(position(s));return s;
  }
  function apply(s,id,a) {
    if(!a||s.over||seatOf(s,id)!==s.turn)return {state:s,error:'Chưa tới lượt hoặc ván đã kết thúc.'};
    if(a.type==='resign'){const n=copy(s);n.over={winners:[n.seats[1-n.turn].id],draw:false,reason:'Đối thủ đã đầu hàng.'};return {state:n};}
    if(a.type!=='sow'||!Number.isInteger(a.cell)||!side(s.turn).includes(a.cell)||s.cells[a.cell].dan<=0||(a.dir!==1&&a.dir!==-1))return {state:s,error:'Chọn ô dân bên mình và một chiều rải hợp lệ.'};
    return {state:sow(copy(s),a.cell,a.dir)};
  }
  function view(s,id) {const p=seatOf(s,id);return copy({cells:s.cells,seats:s.seats,you:p<0?null:p,turn:s.turn,score:s.score,debt:s.debt,last:s.last,over:s.over});}
  function bot(s,id) {
    const p=seatOf(s,id);if(s.over||p!==s.turn)return null;
    const list=actions(s,id).filter(a=>a.type==='sow');let best=null,val=-Infinity;
    // Rotate equal choices across turns so two deterministic bots do not repeat a fixed opening forever.
    const offset=s.moveNo%Math.max(1,list.length);
    for(let k=0;k<list.length;k++){
      const a=list[(k+offset)%list.length],n=sow(copy(s),a.cell,a.dir);
      let v=n.score[p].points-s.score[p].points;
      if(n.over)v=n.over.draw?0:n.over.winners.includes(id)?100000:-100000;
      else {let reply=0;actions(n,n.seats[n.turn].id).filter(x=>x.type==='sow').forEach(x=>{const r=sow(copy(n),x.cell,x.dir);reply=Math.max(reply,r.score[1-p].points-n.score[1-p].points);});v-=reply*0.65;}
      v-=s.history.filter(x=>x===position(n)).length*1000;
      if(v>val){val=v;best=a;}
    }
    return best;
  }
  function selfTest() {
    let passed=0;const failed=[];function test(name,fn){try{if(!fn())throw new Error('Sai kết quả');passed++;}catch(e){failed.push(name+': '+e.message);}}
    const ps=[{id:'a',n:'A'},{id:'b',n:'B'}];
    function total(s,key){return s.cells.reduce((a,c)=>a+c[key],0)+s.score.reduce((a,c)=>a+c[key],0);}
    function empty(){const s=setup(ps);s.cells.forEach(c=>c.dan=0);return s;}
    test('50 dân và 2 quan',()=>{const s=setup(ps);return total(s,'dan')===50&&total(s,'quan')===2;});
    test('Rải đúng và không sửa bản cũ',()=>{const s=setup(ps),before=JSON.stringify(s),n=apply(s,'a',{type:'sow',cell:1,dir:1}).state;return JSON.stringify(s)===before&&JSON.stringify(n.last.steps.slice(0,6))===JSON.stringify([{cell:1,kind:'pick'},...Array.from({length:5},(_,i)=>({cell:i+2,kind:'drop'}))])&&n.last.steps[6].cell===7&&n.last.steps[6].kind==='pick';});
    test('Ăn liên hoàn',()=>{const s=empty();s.cells[1].dan=1;s.cells[4].dan=3;s.cells[6].dan=2;s.cells[9].dan=1;const n=sow(s,1,1);return n.score[0].dan===5&&n.score[0].quan===1&&n.last.steps.filter(x=>x.kind==='capture').length===2;});
    test('Rải lại và vay, bảo toàn dân',()=>{const s=empty();s.score[0].dan=2;s.score[1].dan=48;const steps=[];refill(s,steps);return s.debt[0]===3&&s.score[1].dan===45&&side(0).every(i=>s.cells[i].dan===1)&&total(s,'dan')===50;});
    test('Kết thúc, trả nợ và tính điểm',()=>{const s=empty();s.cells[0].quan=0;s.cells[6].quan=0;s.score=[{dan:20,quan:1,points:30},{dan:25,quan:1,points:35}];s.cells[1].dan=5;s.debt=[3,0];finish(s,0,[]);return s.score[0].points===32&&s.score[1].points===38&&s.over.winners[0]==='b'&&total(s,'dan')===50;});
    test('Từ chối sai lượt, sai ô, sai chiều',()=>{const s=setup(ps);return [['b',{type:'sow',cell:1,dir:1}],['a',{type:'sow',cell:0,dir:1}],['a',{type:'sow',cell:1,dir:0}]].every(x=>apply(s,...x).state===s);});
    test('200 ván bot bảo toàn quân',()=>{
      for(let game=0;game<200;game++){
        let s=setup(ps);s.moveNo=game;
        // Vary the first legal move, then let both bots play the complete game.
        const first=actions(s,'a').filter(a=>a.type==='sow');s=apply(s,'a',first[game%first.length]).state;
        let count=0;
        while(!s.over&&count++<2000){const id=s.seats[s.turn].id,a=bot(s,id);if(!a)throw new Error('Bot không chọn nước ở ván '+game);const r=apply(s,id,a);if(r.error)throw new Error(r.error);s=r.state;if(total(s,'dan')!==50||total(s,'quan')!==2)throw new Error('Mất quân ở ván '+game);}
        if(!s.over)throw new Error('Ván '+game+' chưa kết thúc sau 2000 lượt');
      }return true;
    });return {ok:!failed.length,passed,failed};
  }
  return {id:'oanquan',name:'Ô ăn quan',minPlayers:2,maxPlayers:2,setup,view,actions,apply,tick:s=>s,result:s=>copy(s.over),bot,chatChannel:()=> 'all',selfTest};
});
