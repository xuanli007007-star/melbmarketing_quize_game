export const state = {
  token: null,
  points: 0,
  answered: 0,
  untilX2: 3,
  mult: 1,
  current: null,
  selected: null,
  config: null
};

export function setPoints(p){
  state.points = p;
  document.getElementById('pointsChip').textContent = `当前积分：${p}`;
}

export function lsGet(k, def=null){ try{ return JSON.parse(localStorage.getItem(k)) ?? def; }catch(e){ return def; } }
export function lsSet(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
export function shuffle(arr){ return arr.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]); }
export function fmtLeftTime(){
  const end=new Date(); end.setHours(23,59,59,999);
  const ms=end-new Date();
  const h=Math.floor(ms/3600000), m=Math.floor((ms%3600000)/60000);
  return `今日剩余 ${h}h ${m}m`;
}
