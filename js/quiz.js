import { state, setPoints, lsGet, lsSet } from './state.js';
import { apiPost } from './api.js';
import { showResultOk, showResultErr, showNextButton, setStatsUI, openRewardModal, dom } from './ui.js';
import { ping } from './sfx.js';

function apiAvailable(){ return (state.config.API_BASE||'').trim().length>0; }

export function refreshMilestone(){
  const every = state.config.X2_EVERY || 3;
  state.untilX2 = (every - (state.answered % every)) % every;
  state.mult = (state.untilX2===0) ? 2 : 1; // 表示“下一题倍率”
  setStatsUI();
}

export async function settleAnswer(isCorrect){
  // 结算本题用“之前的倍率”：如果答题前（已答数 % every === 0 且 >0）→ 本题双倍
  const every = state.config.X2_EVERY || 3;
  const prevAnswered = state.answered;
  state.answered += 1;

  const isDoubleThis = (prevAnswered % every === 0 && prevAnswered > 0);
  const multThis = isDoubleThis ? 2 : 1;

  refreshMilestone(); // 刷新的是“下一题”的倍率显示

  if(isCorrect){
    const base = state.config.POINTS_PER_CORRECT || 10;
    const delta = base * multThis;
    try{
      if(apiAvailable()){
        const r = await apiPost(state.config.ENDPOINTS.ADD_POINTS, { delta });
        setPoints(r.points ?? (state.points + delta));
      }else{
        setPoints(state.points + delta);
        lsSet('points', state.points);
      }
    }catch(e){
      setPoints(state.points + delta);
      lsSet('points', state.points);
    }
    showResultOk(`回答正确！${multThis===2?'(双倍) ':''}+${delta} 分 · ${state.current.explanation||''}`);
    ping(multThis===2 ? 1400 : 1100, .14);
    if(multThis===2){ openRewardModal(delta); }
  }else{
    showResultErr(`回答错误！正确答案：${state.current.correct} · ${state.current.explanation||''}`);
    ping(320,.12);
  }

  showNextButton();

  // 可选：记答案
  try{
    if(apiAvailable()){
      await apiPost(state.config.ENDPOINTS.RECORD_ANSWER, {
        selected: state.selected,
        correct: !!isCorrect,
        ts: Date.now(),
        mult: multThis
      });
    }
  }catch(e){}
}

export function endRound(){
  // 保持积分不变，仅结束当前回合UI
  alert(`🎯 本轮结束\n已答 ${state.answered} 题，累计积分 ${state.points} 分`);
  if(dom.questionText) dom.questionText.textContent = '你已结束本轮，随时可再来一局！';
  if(dom.options) dom.options.innerHTML = '';
  if(dom.btnSubmit) dom.btnSubmit.disabled = true;
  dom.btnNext?.classList.add('hidden');
  dom.btnEnd?.classList.add('hidden');
  dom.feedback?.classList.add('hidden');
}
