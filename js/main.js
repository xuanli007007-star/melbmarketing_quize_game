import { loadConfig } from './config.js';
import { state, setPoints, lsGet, shuffle } from './state.js';
import { apiGet } from './api.js';
import { loadLocalPool, loadRemoteToday } from './data.js';
import { bindUI, renderQuestion, setStatsUI, closeRewardModal } from './ui.js';
import { initStarfield, initBurst } from './fx.js';
import { settleAnswer, refreshMilestone, endRound } from './quiz.js';

let nextLocalQuestion; // 本地题库“取下一题”的函数
let burst;

// 初始化
async function boot(){
  state.config = await loadConfig();
  try{ const u = new URL(location.href); state.token = u.searchParams.get('token') || null; }catch(e){}
  setPoints(lsGet('points',0));
  bindUI({
    onSubmit: onSubmit,
    onNext: onNext,
    onEnd: endRound
  });

  initStarfield();
  burst = initBurst();

  // 加载题目源：如有 API_BASE 你也可改用后端；默认本地随机
  nextLocalQuestion = await loadLocalPool();

  await loadQuestion();
  refreshMilestone();
}

async function loadQuestion(){
  // 这里用本地随机；若你想改为远端题，可替换调用 loadRemoteToday()
  state.current = nextLocalQuestion();
  renderQuestion(state.current);
}

async function onSubmit(){
  if(!state.selected || !state.current) return;
  // 高亮正确/错误
  [...document.querySelectorAll('.option')].forEach(el=>{
    const v = el.querySelector('input').value;
    if(v===state.current.correct) el.classList.add('correct');
    if(v===state.selected && v!==state.current.correct) el.classList.add('wrong');
  });
  document.getElementById('btnSubmit').disabled = true;

  // FX：中心爆裂
  burst.burst(innerWidth/2, innerHeight/2, 140, 1);

  const ok = (state.selected === state.current.correct);
  await settleAnswer(ok);
}

async function onNext(){
  state.selected = null;
  await loadQuestion();
}

document.getElementById('btnCloseModal')?.addEventListener('click', closeRewardModal);
boot();
