// 背景星尘 & 爆裂FX
export function initStarfield(){
  const c = document.getElementById('bg'); const ctx = c.getContext('2d');
  let w=c.width=innerWidth, h=c.height=innerHeight;
  const stars = Array.from({length:140},()=>spawn());
  function spawn(){ return {x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.3+0.3,s:Math.random()*0.6+0.2,a:Math.random()*1,tw:Math.random()*0.02+0.005}; }
  addEventListener('resize',()=>{ w=c.width=innerWidth; h=c.height=innerHeight; });
  (function tick(){
    ctx.clearRect(0,0,w,h);
    for(const s of stars){
      s.y+=s.s; s.a+=s.tw; if(s.y>h+5){ s.x=Math.random()*w; s.y=-5; }
      const alpha=0.35+Math.sin(s.a)*0.25;
      ctx.beginPath(); ctx.fillStyle=`rgba(160,220,255,${alpha})`; ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(tick);
  })();
}

export function initBurst(){
  const c = document.getElementById('fx'); const ctx = c.getContext('2d');
  let w=c.width=innerWidth, h=c.height=innerHeight;
  addEventListener('resize',()=>{ w=c.width=innerWidth; h=c.height=innerHeight; });
  const pieces=[];
  function burst(x,y,n=120,strength=1){
    for(let i=0;i<n;i++){
      const ang=Math.random()*Math.PI*2; const spd=(Math.random()*6+2)*strength;
      const isCoin=Math.random()<0.28;
      pieces.push({ x,y, vx:Math.cos(ang)*spd, vy:Math.sin(ang)*spd-(isCoin?1.5:0), g:0.2, life:60+Math.random()*30,
        c:isCoin?'coin':(Math.random()<0.5?'#00C2A8':'#7C3AED'), r:isCoin?6:2+Math.random()*2, rot:Math.random()*Math.PI, vr:(Math.random()-.5)*0.2 });
    }
  }
  (function draw(){
    ctx.clearRect(0,0,w,h);
    for(let i=pieces.length-1;i>=0;i--){
      const p=pieces[i]; p.life--; if(p.life<=0){ pieces.splice(i,1); continue; }
      p.vy+=p.g; p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr;
      if(p.c==='coin'){ ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
        ctx.fillStyle='rgba(255,220,120,.95)'; ctx.beginPath(); ctx.arc(0,0,p.r,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle='rgba(255,255,255,.6)'; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(-p.r/3,-p.r/3,p.r/2,0,Math.PI*2); ctx.stroke(); ctx.restore();
      }else{ ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.fillStyle=p.c; ctx.fillRect(-p.r*2,-p.r/2,p.r*4,p.r); ctx.restore(); }
    }
    requestAnimationFrame(draw);
  })();
  return { burst:(x,y,n,strength)=>burst(x,y,n,strength) };
}
