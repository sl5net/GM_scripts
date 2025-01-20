
tells

"I'll be right back\nGleich wieder da%E2%9D%A4%EF%B8%8F"

and stops - for ever - when you move mouse fast

```js
// ==UserScript==
// @name     GM li brb scrreensaver9
// @namespace    https://lichess.org/
// @version  1.8
// @description  show be right back. screensaver with changing text and images + image titles
// @match   https://lichess.org/*
// @match   https://dicechess.com/*
// @match   https://www.chess.com/*
// @grant    none
// ==/UserScript==

(function() {
  const imageURLs = [
    { url: 'https://sl5.de/wp-content/uploads/2025/01/SL5net_logo_white_shadow_on_blue_w990.png', title: 'Free Courses from sl5.de for Lichess & 0 A.D. Patrons' },
    { url: 'https://seccdn.libravatar.org/avatar/098df46b093753e4a1686d74df5b876d?s=160&d=404&=1', title: 'Send me a tip! liberapay.com/seeh/ ' },
    { url: 'https://i.imgur.com/iC5KiE0.jpg', title: 'Schachspieler seeh' },
    { url: 'https://storage.ko-fi.com/cdn/fullLogoKofi.png', title: 'Buy a Coffee ko-fi.com/plango ' },
    { url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/67dcc3a8-669c-4670-96d1-0ad3728c3adb-profile_image-70x70.png', title: 'Schachspieler seeh auf Twitch' },    
    { url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/14736469-dd75-4744-b685-487ab890890b-profile_image-70x70.png', title: 'Schachopa auf Twitch' },
    { url: 'https://storage.ko-fi.com/cdn/useruploads/eb495aa0-ec22-4faf-b1ea-f2d3f289d0ba.png', title: 'Buy a Coffee ko-fi.com/plango ' },
    { url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/c1049f40-f83b-408e-9057-76ebd57e35ff-profile_image-70x70.png', title: 'Schachspieler KugelBuch auf Twitch' },
    { url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/3a67aaa5-a1eb-4375-b2b4-332a7a6b4b05-profile_image-70x70.png', title: 'Großmeister JanistanTV auf Twitch' },
    { url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/40c1cb9b-d351-45f1-a092-24e6da4758b9-profile_image-70x70.png', title: 'Großmeister Rasmus Svane -> gmrasmussvane auf Twitch' },
    { url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/290c1f23-c524-4f7d-ab1e-8d603f2230eb-profile_image-70x70.png', title: 'WCM KatharinaReinecke auf Twitch' },
    
    
    
    
    
    { url: 'https://storage.ko-fi.com/cdn/fullLogoKofi.png', title: 'Buy a Coffee ko-fi.com/plango ' },
    { url: 'https://addons.mozilla.org/user-media/addon_icons/0/748-64.png?modified=1531822767', title: 'Greasemonkey userscript manager 4 Firefox' },
    { url: 'https://addons.mozilla.org/user-media/addon_icons/0/748-64.png?modified=1531822767', title: 'Greasemonkey userscript manager 4 Firefox' },
    { url: 'https://images.chesscomfiles.com/uploads/v1/user/25332026.f41b9fb2.50x50o.0d10e7055274.jpeg', title: 'Chess.com Tandem/Bughouse World Championship 2024: prize $2,500' },
    { url: 'https://alternative.me/media/256/0-a-d-icon-yfx2dic847rkvocy-c.png', title: 'play0ad.com/  0 A.D. is a free, open-source, historical Real Time Strategy (RTS)' },
    { url: 'https://yt3.ggpht.com/W6ivGrRJrNymjcuESV4S8vEqGLTl2Rpys3dBWAEQ-CA_nsn4JdIteowMqe8Vl36hEe0tOScp4A=s108-c-k-c0x00ffffff-no-rj', title: 'youtube.com/@plan0go 0 A.D. YouTuber ' },
    { url: 'https://i.imgur.com/88Dtfz2.png', title: 'Web-Nerd/Dipl.Informatiker(FH) Sebastian Lauffer aus SL5.de | 30Jahre+ Erfahrung | 0 A.D. member + player' },
    
    
    
    
    

    ];
  const t = ' |Deutsch+English |Viewer games |Learn IT at SL5.de |Developer?→join SL5.de ❤️Bughouse/Tandem ❤️hand-and-brain ❤️seeh at lichess ❤️seeh74 at chess.com | Developer?→join SL5.de | Developer?→join SL5.de | Developer?→join SL5.de';
  const s = 'background-color:#C02942;color:white;text-align:center;padding:5px;font-size:14px;position:fixed;bottom:0;width:100%;z-index:9998;transition: bottom 0.3s ease-in-out;';

  let r = false;
  let a = null;
  let l = null;
  let o;
  let n = 1000 * 5; //55 seconds default
  let c = null;
  let X = 0;
  let cachedImg = null;
  let cachedTitle = null;
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
    function updateImage(img, titleElement) {
        if(!r || !img) return;
        const currentImage = imageURLs[imageIndex % imageURLs.length];
        img.src = currentImage.url;
        titleElement.textContent = currentImage.title;
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

      // Reuse cached title or create it if it doesnt exist.
      const titleElement = cachedTitle || (()=>{
          const newTitle = document.createElement('div');
          newTitle.style.cssText = 'position:fixed;z-index:9999;color:white;text-align:center;font-size:12px;font-weight:bold;pointer-events:none;';
          cachedTitle = newTitle;
          return newTitle;
      })();

    const txt = document.createElement('div');
    txt.style.cssText = 'position:fixed;z-index:9999;color:white;text-align:center;font-size:16px;font-weight:bold;pointer-events:none;white-space:pre-wrap;';
    updateMessage(txt);
      updateImage(img, titleElement);
    messageTimer = setInterval(() => updateMessage(txt), 5000);
    imageTimer = setInterval(() => updateImage(img, titleElement), 12000);

    document.body.appendChild(img);
    document.body.appendChild(titleElement);
    document.body.appendChild(txt);


    function move() {
      if (!r) {
        img.remove();
          titleElement.remove();
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
        titleElement.style.left = x + 'px';
      titleElement.style.top = (y + 100) + 'px';
      txt.style.left = x + 'px';
      txt.style.top = (y + 120) + 'px';


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
