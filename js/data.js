import { shuffle } from './state.js';
import { apiGet } from './api.js';
import { state } from './state.js';

export async function loadLocalPool(){
  const res = await fetch('./data/questions.json', { cache:'no-store' });
  if(!res.ok) throw new Error('Q_LOAD_FAILED');
  const arr = await res.json();
  // 这里返回一个“取下一题”的函数，支持无限刷（随机）
  return () => {
    const q = arr[Math.floor(Math.random()*arr.length)];
    return {
      title: q.title,
      correct: q.correct,
      explanation: q.explanation || '',
      options: shuffle([q.correct, ...(q.wrongs||[])])
    };
  };
}

export async function loadRemoteToday(){
  const data = await apiGet(state.config.ENDPOINTS.TODAY_QUESTION);
  return {
    title: data.title,
    correct: data.correct,
    explanation: data.explanation || '',
    options: shuffle([data.correct, ...(data.wrongs||[])])
  };
}
