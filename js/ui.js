import { state, fmtLeftTime } from './state.js';

const dom = {
  btnSubmit: document.getElementById('btnSubmit'),
  btnNext: document.getElementById('btnNext'),
  btnEnd: document.getElementById('btnEnd'),
  leftTime: document.getElementById('leftTime'),
  questionText: document.getElementById('questionText'),
  options: document.getElementById('options'),
  feedback: document.getElementById('feedback'),
  statAnswered: document.getElementById('statAnswered'),
  statNext: document.getElementById('statNext'),
  statMulti: document.getElementById('statMulti'),
  progFill: document.getElementById('progFill'),
  x2banner: document.getElementById('x2banner'),
  rewardDelta: document.getElementById('rewardDelta'),
  rewardModal: document.getElementById('rewardModal')
};

export { dom };

export function bindUI({ onSubmit, onNext, onEnd }){
  dom.btnSubmit?.addEventListener('click', onSubmit);
  dom.btnNext?.addEventListener('click', onNext);
  dom.btnEnd?.addEventListener('click', onEnd);

  if(dom.leftTime){
    const updateLeftTime = () => { dom.leftTime.textContent = fmtLeftTime(); };
    updateLeftTime();
    setInterval(updateLeftTime, 60000);
  }
}

export function renderQuestion(q){
  if(dom.questionText) dom.questionText.textContent = q.title;
  const box = dom.options;
  if(!box) return;

  box.innerHTML = '';
  q.options.forEach(opt=>{
    const el = document.createElement('label');
    el.className = 'option';
    el.innerHTML = `<input type="radio" name="answer" value="${opt}" aria-label="${opt}"><span>${opt}</span>`;
    el.addEventListener('click',()=>{
      state.selected = opt;
      if(dom.btnSubmit) dom.btnSubmit.disabled = false;
    });
    box.appendChild(el);
  });

  if(dom.btnSubmit) dom.btnSubmit.disabled = true;
  dom.btnNext?.classList.add('hidden');
  dom.feedback?.classList.add('hidden');
}

export function setStatsUI(){
  if(dom.statAnswered) dom.statAnswered.textContent = `已答：${state.answered} 题`;
  if(dom.statNext) dom.statNext.textContent = `距离双倍：${state.untilX2} 题`;
  if(dom.statMulti) dom.statMulti.textContent = `当前倍率：x${state.mult}`;
  if(dom.progFill){
    const pct = Math.min(99, ( (state.answered % (state.config.MAX_IN_LOOP||3)) / (state.config.MAX_IN_LOOP||3) ) * 100);
    dom.progFill.style.width = pct + '%';
  }
  dom.x2banner?.classList.toggle('show', state.untilX2===0);
}

export function showResultOk(text){
  if(!dom.feedback) return;
  dom.feedback.className = 'toast ok';
  dom.feedback.textContent = text;
  dom.feedback.classList.remove('hidden');
}

export function showResultErr(text){
  if(!dom.feedback) return;
  dom.feedback.className = 'toast err';
  dom.feedback.textContent = text;
  dom.feedback.classList.remove('hidden');
}

export function showNextButton(){ dom.btnNext?.classList.remove('hidden'); }
export function hideEndButton(){ dom.btnEnd?.classList.add('hidden'); }
export function showEndButton(){ dom.btnEnd?.classList.remove('hidden'); }

export function openRewardModal(delta){
  if(dom.rewardDelta) dom.rewardDelta.textContent = `+${delta}`;
  if(dom.rewardModal){
    dom.rewardModal.classList.add('show');
    dom.rewardModal.setAttribute('aria-hidden','false');
  }
}

export function closeRewardModal(){
  if(dom.rewardModal){
    dom.rewardModal.classList.remove('show');
    dom.rewardModal.setAttribute('aria-hidden','true');
  }
}
