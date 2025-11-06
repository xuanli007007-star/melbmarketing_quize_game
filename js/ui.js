import { state, fmtLeftTime } from './state.js';

export function bindUI({ onSubmit, onNext, onEnd }){
  document.getElementById('btnSubmit').addEventListener('click', onSubmit);
  document.getElementById('btnNext').addEventListener('click', onNext);
  document.getElementById('btnEnd').addEventListener('click', onEnd);
  document.getElementById('leftTime').textContent = fmtLeftTime();
  setInterval(()=> document.getElementById('leftTime').textContent = fmtLeftTime(), 60000);
}

export function renderQuestion(q){
  document.getElementById('questionText').textContent = q.title;
  const box = document.getElementById('options');
  box.innerHTML = '';
  q.options.forEach(opt=>{
    const el = document.createElement('label');
    el.className = 'option';
    el.innerHTML = `<input type="radio" name="answer" value="${opt}" aria-label="${opt}"><span>${opt}</span>`;
    el.addEventListener('click',()=>{
      state.selected = opt;
      document.getElementById('btnSubmit').disabled = false;
    });
    box.appendChild(el);
  });
  document.getElementById('btnSubmit').disabled = true;
  document.getElementById('btnNext').classList.add('hidden');
  document.getElementById('feedback').classList.add('hidden');
}

export function setStatsUI(){
  document.getElementById('statAnswered').textContent = `已答：${state.answered} 题`;
  document.getElementById('statNext').textContent = `距离双倍：${state.untilX2} 题`;
  document.getElementById('statMulti').textContent = `当前倍率：x${state.mult}`;
  const pct = Math.min(99, ( (state.answered % (state.config.MAX_IN_LOOP||3)) / (state.config.MAX_IN_LOOP||3) ) * 100);
  document.getElementById('progFill').style.width = pct + '%';
  document.getElementById('x2banner').classList.toggle('show', state.untilX2===0);
}

export function showResultOk(text){
  const el = document.getElementById('feedback');
  el.className = 'toast ok';
  el.textContent = text;
  el.classList.remove('hidden');
}
export function showResultErr(text){
  const el = document.getElementById('feedback');
  el.className = 'toast err';
  el.textContent = text;
  el.classList.remove('hidden');
}
export function showNextButton(){ document.getElementById('btnNext').classList.remove('hidden'); }
export function hideEndButton(){ document.getElementById('btnEnd').classList.add('hidden'); }
export function showEndButton(){ document.getElementById('btnEnd').classList.remove('hidden'); }
export function openRewardModal(delta){
  document.getElementById('rewardDelta').textContent = `+${delta}`;
  const m = document.getElementById('rewardModal');
  m.classList.add('show'); m.setAttribute('aria-hidden','false');
}
export function closeRewardModal(){
  const m = document.getElementById('rewardModal');
  m.classList.remove('show'); m.setAttribute('aria-hidden','true');
}
