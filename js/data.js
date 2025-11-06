import { shuffle } from './state.js';

// 永不失败的兜底题
const FALLBACK = [
  { title:"墨尔本哪条小巷以涂鸦闻名？", correct:"Hosier Lane", wrongs:["Hardware Lane","Degraves Street","Flinders Lane"], explanation:"Hosier Lane 在联邦广场旁。" },
  { title:"墨尔本公共交通卡叫？", correct:"Myki", wrongs:["Opal","Go Card","Octopus"], explanation:"电车/火车/公交都用 Myki。" },
  { title:"哪个区以华人美食著称？", correct:"Box Hill", wrongs:["St Kilda","Docklands","Fitzroy"], explanation:"Box Hill 是餐饮热点。" }
];

function toQ(q){
  return {
    title: q.title,
    correct: q.correct,
    explanation: q.explanation || '',
    options: shuffle([q.correct, ...(q.wrongs||[])])
  };
}

function showLoadError(msg){
  const el = document.getElementById('questionText');
  if(el) el.textContent = `题库加载失败（已切换内置题库）：${msg}`;
}

export async function loadLocalPool(){
  try {
    // 强制 cache-bust，避免 CDN/浏览器旧缓存
    const ver = Date.now(); // 也可以改成固定数字，每次改题库+1
    const url = `./data/questions.json?v=${ver}`;
    const res = await fetch(url, { cache: 'no-store' });
    console.log('[questions.json] status:', res.status, 'url:', res.url);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const text = await res.text();         // 先取文本，解析错误更好定位
    try {
      const arr = JSON.parse(text);
      if (!Array.isArray(arr) || !arr.length) throw new Error('格式错误：应为非空数组');
      // 返回“取下一题”的函数（随机抽）
      return () => toQ(arr[Math.floor(Math.random()*arr.length)]);
    } catch (e) {
      console.error('[questions.json 解析失败]', e);
      showLoadError('JSON 解析失败（检查尾逗号/中文标点/注释）');
      return () => toQ(FALLBACK[Math.floor(Math.random()*FALLBACK.length)]);
    }
  } catch (e) {
    console.error('[questions.json 加载失败]', e);
    showLoadError(e.message || '网络/路由问题');
    return () => toQ(FALLBACK[Math.floor(Math.random()*FALLBACK.length)]);
  }
}
