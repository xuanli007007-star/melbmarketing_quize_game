// js/config.js
export async function loadConfig(){
  const res = await fetch('./config.json', { cache: 'no-store' });
  if(!res.ok) throw new Error('CONFIG_LOAD_FAILED');
  return await res.json();
}
