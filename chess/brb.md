
tells

"I'll be right back\nGleich wieder da%E2%9D%A4%EF%B8%8F"

and stops - for ever - when you move mouse fast

```js
// ==UserScript==
// @name     GM li brb scrreensaver
// @namespace    https://lichess.org/
// @version  1.0
// @description  show be right back. scrreensaver
// @match   https://lichess.org/*
// @grant    none
// ==/UserScript==

(function() {
  const i = 'https://sl5.de/wp-content/uploads/2025/01/SL5net_logo_white_shadow_on_blue_w990.png';

  const t = ' |Deutsch+English |Viewer games |Learn IT at SL5.de |Developer?→join SL5.de ❤️Bughouse/Tandem ❤️hand-and-brain ❤️seeh at lichess ❤️seeh74 at chess.com | Developer?→join SL5.de | Developer?→join SL5.de | Developer?→join SL5.de';
  const s = 'background-color:#C02942;color:white;text-align:center;padding:5px;font-size:14px;position:fixed;bottom:0;width:100%;z-index:9998;';

  let r = false;
  let a = null;
  let l = null;
  let o;
  let n = 1000 * 55; //55 seconds
  let c = null;
  let X = 0;
  let cachedImg = null;

  function animateTicker() {
    if (!r) return;
    X -= 10;
    if (X + document.body.clientWidth < 0) X = document.body.clientWidth;
    c.style.left = X + 'px';
    requestAnimationFrame(animateTicker);
  }

  function animate() {
    if (!r) return;

    let x = Math.random() * (window.innerWidth - 100);
    let y = Math.random() * (window.innerHeight - 100);
    let dx = Math.random() * 2 - 1;
    let dy = Math.random() * 2 - 1;

    // Reuse cached image or create it if it doesnt exist.
    const img = cachedImg || (()=>{
        const newImg = document.createElement('img');
        newImg.src = i;
        newImg.style.cssText = 'position:fixed;z-index:9999;width:100px;height:auto;pointer-events:none;';
        cachedImg = newImg;
        return newImg;
    })();
    
    const txt = document.createElement('div');
    txt.style.cssText = 'position:fixed;z-index:9999;color:white;text-align:center;font-size:16px;font-weight:bold;pointer-events:none;white-space:pre-wrap;';
    txt.textContent = "I'll be right back\nGleich wieder da%E2%9D%A4%EF%B8%8F";

    document.body.appendChild(img);
    document.body.appendChild(txt);


    function move() {
        if (!r) {
            img.remove();
            txt.remove();
            return;
        }
        x += dx;
        y += dy;
        if (x + 100 > window.innerWidth || x < 0) dx = -dx;
        if (y + 100 > window.innerHeight || y < 0) dy = -dy;

        img.style.left = x + 'px';
        img.style.top = y + 'px';
        txt.style.left = x + 'px';
        txt.style.top = (y + 100) + 'px';

        requestAnimationFrame(move);
    }

    move();
  }

  if (!c) {
    c = document.createElement('div');
    c.style.cssText = s;
    c.textContent = t;
    document.body.appendChild(c);
    animateTicker();
  }

  function resetTimer() {
    clearTimeout(o);
    r = false;
    o = setTimeout(function() {
      r = true;
      animate();
    }, n);
  }

  document.addEventListener('mousemove', e => {
    const i = e.clientX;
    const t = e.clientY;
    if (a !== null && l !== null) {
      const e = Math.abs(i - a);
      const o = Math.abs(t - l);
      if (e > 50 || o > 50) resetTimer();
    }
    a = i;
    l = t;
  });

  resetTimer();

})();
```
