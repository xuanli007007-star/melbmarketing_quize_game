import { shuffle } from './state.js';
import { state } from './state.js';

// 内置兜底题库（永不失败）
const FALLBACK_POOL = [
  { title:"墨尔本哪条小巷以涂鸦闻名？", correct:"Hosier Lane", wrongs:["Hardware Lane","Degraves Street","Flinders Lane"], explanation:"Hosier Lane 在联邦广场旁。" },
  { title:"墨尔本公共交通卡叫？", correct:"Myki", wrongs:["Opal","Go Card","Octopus"], explanation:"电车/火车/公交都用 Myki。" },
  { title:"哪个区以华人美食著称？", correct:"Box Hill", wrongs:["St Kilda","Docklands","Fitzroy"], explanation:"Box Hill 是餐饮热点。" }
];

function toQuestion(q){
  return {
    title: q.title,
    correct: q.correct,
    explanation: q.explanation || '',
    options: shuffle([q.correct, ...(q.wrongs||[])])
  };
}

// 把错误友好显示在页面
function showLoadError(msg){
  const el = document.getElementById('questionText');
  if(el) el.textContent = `题库加载失败（已用内置题）：${msg}`;
}

export async function loadLocalPool(){
  try{
    const res = await fetch('./data/questions.json', { cache:'no-store' });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const txt = await res.text();          // 先拿纯文本，避免 JSON 非法直接把错误吞掉
    try{
      const arr = JSON.parse(txt);
      if(!Array.isArray(arr) || !arr.length) throw new Error('格式错误：需要数组且非空');
      // 返回“取下一题”的函数
      return () => toQuestion(arr[Math.floor(Math.random()*arr.length)]);
    }catch(parseErr){
      console.error('[questions.json 解析失败]', parseErr);
      showLoadError('JSON 解析失败，请检查是否有尾逗号/中文逗号/注释');
      return () => toQuestion(FALLBACK_POOL[Math.floor(Math.random()*FALLBACK_POOL.length)]);
    }
  }catch(netErr){
    console.error('[questions.json 加载失败]', netErr);
    showLoadError('文件未找到或被路由重写');
    return () => toQuestion(FALLBACK_POOL[Math.floor(Math.random()*FALLBACK_POOL.length)]);
  }
}
