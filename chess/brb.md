
tells

"I'll be right back\nGleich wieder da%E2%9D%A4%EF%B8%8F"

and stops - for ever - when you move mouse fast

```js
// ==UserScript==
// @name     GM li brb scrreensaver7
// @namespace    https://lichess.org/
// @version  1.7
// @description  show be right back. screensaver with changing text and images
// @match   https://lichess.org/*
// @grant    none
// ==/UserScript==

(function() {
    const imageURLs = [
        'https://sl5.de/wp-content/uploads/2025/01/SL5net_logo_white_shadow_on_blue_w990.png',
        'https://seccdn.libravatar.org/avatar/098df46b093753e4a1686d74df5b876d?s=160&d=404&=1',      
        'https://i.imgur.com/iC5KiE0.jpg',
        'https://static-cdn.jtvnw.net/jtv_user_pictures/67dcc3a8-669c-4670-96d1-0ad3728c3adb-profile_image-70x70.png',
        'https://addons.mozilla.org/user-media/addon_icons/0/748-64.png?modified=1531822767'
    ];

  const t = ' |Deutsch+English |Viewer games |Learn IT at SL5.de |Developer?→join SL5.de ❤️Bughouse/Tandem ❤️hand-and-brain ❤️seeh at lichess ❤️seeh74 at chess.com | Developer?→join SL5.de | Developer?→join SL5.de | Developer?→join SL5.de';
  const s = 'background-color:#C02942;color:white;text-align:center;padding:5px;font-size:14px;position:fixed;bottom:0;width:100%;z-index:9998;transition: bottom 0.3s ease-in-out;';

  let r = false;
  let a = null;
  let l = null;
  let o;
  let n = 1000 * 55; //55 seconds default
  let c = null;
  let X = 0;
  let cachedImg = null;
  let isMouseAtBottom = false;
  let inactiveStartTime = 0;
  let timeoutButton = null;
  let messageIndex = 0;
  let messageTimer = null;
    let imageIndex = 0;
    let imageTimer = null;


    const brbMessages = [
        "I'll be right back",
        "Gleich wieder da",
        "BRB...",
        "Be right back!",
        "Away from keyboard"
    ];

    // Load timeout from storage
    const storedTimeout = localStorage.getItem('inactivityTimeout');
    if (storedTimeout) {
      n = parseInt(storedTimeout, 10);
    }

    // Add button to change timeout
    function addTimeoutButton() {
        if (timeoutButton) return;

        timeoutButton = document.createElement('button');
        timeoutButton.textContent = 'Set Timeout';
        timeoutButton.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 10000; display:none;';
        timeoutButton.onclick = function(){
            const newTimeout = parseInt(prompt("Enter new inactivity timeout in seconds", n / 1000), 10) * 1000;
            if(newTimeout > 0){
                n = newTimeout
                localStorage.setItem('inactivityTimeout', n);
                resetTimer();
            }
        }

        document.body.appendChild(timeoutButton);
    }

    addTimeoutButton()

  function animateTicker() {
    if (!r) return;
    X -= 10;
    if (X + document.body.clientWidth < 0) X = document.body.clientWidth;
    c.style.left = X + 'px';
    requestAnimationFrame(animateTicker);
  }
    function updateMessage(txt) {
        if(!r || !txt) return;
        const waitTimeSeconds = Math.round((Date.now() - inactiveStartTime) / 1000);
        txt.textContent = `${brbMessages[messageIndex % brbMessages.length]}\nWaited: ${waitTimeSeconds} seconds`;
        messageIndex++;
    }
    function updateImage(img) {
        if(!r || !img) return;
        img.src = imageURLs[imageIndex % imageURLs.length]
        imageIndex++;
    }

  function animate() {
    if (!r) return;
      if (timeoutButton) timeoutButton.style.display = 'block';

    let x = Math.random() * (window.innerWidth - 100);
    let y = Math.random() * (window.innerHeight - 100);
    let dx = Math.random() * 2 - 1;
    let dy = Math.random() * 2 - 1;


    // Reuse cached image or create it if it doesnt exist.
    const img = cachedImg || (()=>{
        const newImg = document.createElement('img');
      newImg.style.cssText = 'position:fixed;z-index:9999;width:100px;height:auto;pointer-events:none;';
      cachedImg = newImg;
      return newImg;
    })();

    const txt = document.createElement('div');
    txt.style.cssText = 'position:fixed;z-index:9999;color:white;text-align:center;font-size:16px;font-weight:bold;pointer-events:none;white-space:pre-wrap;';
      updateMessage(txt);
      updateImage(img);
    messageTimer = setInterval(() => updateMessage(txt), 5000);
      imageTimer = setInterval(() => updateImage(img), 12000);


    document.body.appendChild(img);
    document.body.appendChild(txt);


    function move() {
      if (!r) {
        img.remove();
        txt.remove();
          if (timeoutButton) timeoutButton.style.display = 'none';
        clearInterval(messageTimer);
        clearInterval(imageTimer);
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
      img.src = imageURLs[imageIndex % imageURLs.length]
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
    messageIndex = 0;
      imageIndex = 0;
    inactiveStartTime = Date.now(); // Store the start time
    o = setTimeout(function() {
      r = true;
      animate();
    }, n);
  }

  document.addEventListener('mousemove', e => {
    const i = e.clientX;
    const t = e.clientY;

    // Check if mouse is at bottom
    const distanceFromBottom = window.innerHeight - t;
    if(distanceFromBottom < 20){
      if(!isMouseAtBottom){
        isMouseAtBottom = true;
        c.style.bottom = `-${c.offsetHeight}px`;
      }
    }else{
      if(isMouseAtBottom){
        isMouseAtBottom = false;
        c.style.bottom = '0';
      }
    }

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
