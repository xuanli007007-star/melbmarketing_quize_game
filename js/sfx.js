let ac; try{ ac = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){}
export function ping(freq=880,dur=.12){
  if(!ac) return;
  const o=ac.createOscillator(), g=ac.createGain();
  o.type='triangle'; o.frequency.value=freq;
  g.gain.setValueAtTime(0.001, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.3, ac.currentTime+0.01);
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime+dur);
  o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime+dur);
}
