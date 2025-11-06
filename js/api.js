import { state } from './state.js';

function apiBase(){ return (state.config.API_BASE||'').trim(); }
function withTimeout(promise, ms){
  return Promise.race([promise, new Promise((_,rej)=>setTimeout(()=>rej(new Error('TIMEOUT')), ms))]);
}

export async function apiGet(path){
  const base = apiBase();
  if(!base) throw new Error('NO_API_BASE');
  const headers = { 'Content-Type':'application/json' };
  if(state.token) headers.Authorization = `Bearer ${state.token}`;
  const res = await withTimeout(fetch(base+path, { headers }), state.config.API_TIMEOUT_MS || 2500);
  if(!res.ok) throw new Error('API_GET_FAILED');
  return res.json();
}

export async function apiPost(path, body){
  const base = apiBase();
  if(!base) throw new Error('NO_API_BASE');
  const headers = { 'Content-Type':'application/json' };
  if(state.token) headers.Authorization = `Bearer ${state.token}`;
  const res = await withTimeout(fetch(base+path, { method:'POST', headers, body:JSON.stringify(body||{}) }), state.config.API_TIMEOUT_MS || 2500);
  if(!res.ok) throw new Error('API_POST_FAILED');
  return res.json();
}
