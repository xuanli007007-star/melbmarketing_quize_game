import { loadConfig } from './config.js';
import { state, setPoints, lsGet } from './state.js';
import { bindUI, renderQuestion, closeRewardModal } from './ui.js';
import { initStarfield, initBurst } from './fx.js';
import { settleAnswer, refreshMilestone, endRound } from './quiz.js';
import { loadLocalPool } from './data.js';

let nextLocalQuestion; // 取题函数
let burst;

async function boot(){
  state.config = await loadConfig().catch(e=>{
    console.error('[config.json 加载失败]', e);
    // 极端情况下也给个默认配置
    return {
      POINTS_PER_CORRECT: 10, API_BASE:"", ENDPOINTS:{ME:"/me",ADD_POINTS:"/points/add",RECORD_ANSWER:"/answers/record",TODAY_QUESTION:"/questions/today"},
      CLAIM_URL:"#", X2_EVERY:3, MAX_IN_LOOP:3
    };
  });

  try{ const u = new URL(location.href); state.token = u.searchParams.get('token') || null; }catch(e){}
  setPoints(lsGet('points',0));
  bindUI({ onSubmit, onNext, onEnd: endRound });

  initStarfield();
  burst = initBurst();

  // 题库：这里即便失败也会返回可用的兜底函数
  nextLocalQuestion = await loadLocalPool();

  await loadQuestion();
  refreshMilestone();
}

async function loadQuestion(){
  state.current = nextLocalQuestion ? nextLocalQuestion() : null;
  if(!state.current){
    // 极端兜底
    state.current = { title:'题库为空（已启用兜底）', correct:'OK', explanation:'', options:['OK'] };
  }
  renderQuestion(state.current);
}

async function onSubmit(){
  if(!state.selected || !state.current) return;
  [...document.querySelectorAll('.option')].forEach(el=>{
    const v = el.querySelector('input').value;
    if(v===state.current.correct) el.classList.add('correct');
    if(v===state.selected && v!==state.current.correct) el.classList.add('wrong');
  });
  document.getElementById('btnSubmit').disabled = true;
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
