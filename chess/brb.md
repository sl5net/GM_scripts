
tells

"I'll be right back\nGleich wieder da"

and stops - for ever - when you move mouse fast

```js
// ==UserScript==
// @name     GM li brb scrreensaver19c
// @namespace    https://lichess.org/
// @version  2.9
// @description  show be right back. screensaver with changing text and images + image titles + setup comic view + automatic switch to LichessTV
// @match   https://lichess.org/*
// @match   https://dicechess.com/*
// @match   https://www.chess.com/*
// @grant    none
// ==/UserScript==

(function() {
    let alertsEnabled = false; // Added variable for alert switch
  	const doDebug = false; // set true if we seach script errors

  const imageURLs = [

      { url: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Adelobasileus_cromptoni.jpg'
       , title: '225 Millionen years ago. Grand-Mum/Dad for Humans(also cats, mousese, ...) - Adelobasileus cromptoni - oldest konw Säugetier - smaler then a Mouse' },
    
    
  { url: 'https://qph.cf2.quoracdn.net/main-qimg-6e7144652bd277c4722f5e68c68f9356-lq', title: 'Humans 100 million years ago' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/CarpolestesCL.png/300px-CarpolestesCL.png'
   , title: 'Humans 80 Million years ago' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Aegyptopithecus_NT.jpg/300px-Aegyptopithecus_NT.jpg'
   , title: 'Humans 50 Million years ago' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Proconsul_NT.jpg/300px-Proconsul_NT.jpg'
   , title: 'Humans 30 Million years ago' },
  { url: 'https://showme.missouri.edu/wp-content/uploads/2019/09/1-Rudapithecus-reconstruction-940x686.jpg'
   , title: '10 million years ago' },
    
    
  { url: 'https://imgix.ranker.com/user_node_img/50060/1001195177/original/sahelanthropus-tchadensis-photo-u1?auto=format&q=60&fit=crop&fm=pjpg&dpr=2&w=500'
   , title: '7 million years ago. süd Afrika' },
    { url: 'https://imgix.ranker.com/user_node_img/50060/1001195179/original/orrorin-tugenensis-photo-u2?auto=format&q=60&fit=crop&fm=pjpg&dpr=2&w=500'
     , title: 'Kenya 6 million years' },
  { url: 'https://imgix.ranker.com/user_node_img/50060/1001195180/original/ardipithecus-kadabba-photo-u1?auto=format&q=60&fit=crop&fm=pjpg&dpr=2&w=500'
   , title: 'Humans 5 million years old' },
  { url: 'https://imgix.ranker.com/user_node_img/50060/1001195182/original/australopithecus-anamensis-photo-u1?auto=format&q=60&fit=crop&fm=pjpg&dpr=2&w=500'
   , title: 'Humans 4 million years old' },
  { url: 'https://imgix.ranker.com/user_node_img/50060/1001195183/original/australopithecus-afarensis-photo-u2?auto=format&q=60&fit=crop&fm=pjpg&dpr=2&w=500', title: 'Human Lucy 3 million years old' },
  { url: 'https://imgix.ranker.com/user_node_img/50060/1001195185/original/australopithecus-garhi-photo-u1?auto=format&q=60&fit=crop&fm=pjpg&dpr=2&w=500', 
   title: 'garhi 2.5-million-year-old' },
   { url: 'https://www.nhm.ac.uk/content/dam/nhmwww/discover/human-evolution/homo-habilis/stone-tool-homo-habilis-full-width.jpg.thumb.1160.1160.jpg'
    , title: '2 million years ago' },
  { url: 'https://www.nhm.ac.uk/content/dam/nhmwww/discover/human-evolution/homo-erectus/turkana-boy-full-width.jpg.thumb.1160.1160.jpg'
   , title: '1,5 million Turkana Boy' },

    { url: 'https://i.dailymail.co.uk/1s/2021/10/28/13/49745199-10140669-A_new_species_of_ancient_human_has_been_discovered_in_Africa_tha-a-37_1635424885887.jpg'
   , title: '500,000 years' },
    
    { url: 'https://agenda.ge/uploads/files/news/042/post-29-1245666800.jpg'
   , title: '500,000 years ago in Georgia' },
    
    
  { url: 'https://www.nhm.ac.uk/content/dam/nhmwww/discover/human-evolution/neanderthal/neanderthal-model-on-black-hero-desktop.jpg.thumb.1920.1920.jpg'
   , title: '400.000 Jahre' },
    
 { url: 'https://www.nhm.ac.uk/content/dam/nhmwww/discover/modern-humans-europe/modern-humans-europe-full-width.jpg.thumb.620.620.jpg'
  , title: '150.000 Mann in Europa' },

     { url: 'https://media.cnn.com/api/v1/images/stellar/prod/230605132420-05-homo-naledi-rising-star-cave-head.jpg?c=16x9&q=h_144,w_256,c_fill'
  , title: '100.000 Mann' },

    
    { url: 'https://insider.si.edu/wp-content/uploads/2011/07/homo-erectus-e1310052552113.jpg'
  , title: '40.000 Years Indonesia man' },
 
    
    { url: 'https://www.nhm.ac.uk/content/dam/nhmwww/discover/cheddar-man/cheddar-man-full-width.jpg.thumb.1920.1920.jpg'
  , title: '10.000 Jahre englischen Mann' },
 { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Homo_sapiens_-_Neolithic_-_reconstruction_-_MUSE.jpg/255px-Homo_sapiens_-_Neolithic_-_reconstruction_-_MUSE.jpg', title: '7.000 Jahre Frau' },    
    
      { url: 'https://sl5.de/wp-content/uploads/2025/01/SL5net_logo_white_shadow_on_blue_w990.png', title: 'Free Courses from sl5.de for Lichess & 0 A.D. Patrons' },
      { url: 'https://seccdn.libravatar.org/avatar/098df46b093753e4a1686d74df5b876d?s=160&d=404&=1', title: 'Send me a tip! liberapay.com/seeh/ ' },
      { url: 'https://i.imgur.com/iC5KiE0.jpg', title: 'Schachspieler seeh 🨄🨈🨙🨝🨮🨲🩃🩇🩑' },
      { url: 'https://storage.ko-fi.com/cdn/fullLogoKofi.png', title: 'Buy a Coffee ko-fi.com/plango ' },
      { url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/67dcc3a8-669c-4670-96d1-0ad3728c3adb-profile_image-70x70.png'
       , title: 'Schachspieler seeh auf Twitch' },
      { url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/14736469-dd75-4744-b685-487ab890890b-profile_image-70x70.png'
       , title: 'Schachopa auf Twitch' },
      { url: 'https://storage.ko-fi.com/cdn/useruploads/eb495aa0-ec22-4faf-b1ea-f2d3f289d0ba.png'
       , title: 'Buy a Coffee ko-fi.com/plango ' },
      { url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/c1049f40-f83b-408e-9057-76ebd57e35ff-profile_image-70x70.png'
       , title: 'Schachspieler KugelBuch auf Twitch' },
      { url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/3a67aaa5-a1eb-4375-b2b4-332a7a6b4b05-profile_image-70x70.png'
       , title: 'Großmeister JanistanTV auf Twitch' },
      { url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/40c1cb9b-d351-45f1-a092-24e6da4758b9-profile_image-70x70.png'
       , title: 'Großmeister Rasmus Svane -> gmrasmussvane auf Twitch' },
      { url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/290c1f23-c524-4f7d-ab1e-8d603f2230eb-profile_image-70x70.png'
       , title: 'WCM KatharinaReinecke auf Twitch' },

      { url: 'https://matrix.tchncs.de/_matrix/media/v3/thumbnail/tchncs.de/f02a44c27470a3747a72edaa363c020758551be0?width=160&height=160&method=crop&allow_redirect=true'
       , title: 'Schachspielerin GLaDOS_chess Twitch, Jumeko-Jabami lichess' },



      { url: 'https://xn--simonkrner-jcb.de/img/sympathischer_dude.jpg'
       , title: 'Schachspieler Luuubb lichess . Danke für die Spiele und deine OpenSource-Arbeiten 🦥 🦧 🐒' },



      { url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/f6d01e0a-4afb-4371-8dc2-56921ff70477-profile_image-70x70.png'
       , title: 'Schachspieler Ryugine Twitch. Thanks for your Suport' },

      { url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/97024734-41cf-41ab-a82d-df39331bcd31-profile_image-70x70.png'
       , title: 'Schachspielerin WIM bluhmanda Twitch, SonjaBluhm lichess' },
    
    
    
    
    
          { url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/78ce1bf1-4f92-4beb-9c1a-9c35a8469a98-profile_image-70x70.png'
       , title: 'Josefine Heinemann WGM, lichess: JosefineHeinemann , Twitch: frauenschachexperten , youtube: josefineschach' },
    
    
    
    

              { url: 'https://static.wixstatic.com/media/d2439e_1ec82775df5341e1852da904bdd0f3bf~mv2.jpg'
       , title: 'Josefine Heinemann WGM, lichess: JosefineHeinemann , Twitch: frauenschachexperten , youtube: josefineschach' },

    
    
    

          { url: 'https://hsk1830.de/wp-content/uploads/2024/01/20240120-SonjaBluhm.jpg'
       , title: 'Schachspielerin WIM, bluhmanda Twitch, SonjaBluhm lichess' },

    
    
    
    
      { url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/39cb2432-b47c-430f-aa07-439306b1449f-profile_image-70x70.png'
       , title: 'ilyes_plays_chess Twitch. ilyes_dev lichess. Thanks for your Suport' },


      { url: 'https://storage.ko-fi.com/cdn/fullLogoKofi.png'
       , title: 'Buy a Coffee ko-fi.com/plango ' },
      { url: 'https://addons.mozilla.org/user-media/addon_icons/0/748-64.png?modified=1531822767'
       , title: 'Greasemonkey userscript manager 4 Firefox' },
      { url: 'https://images.chesscomfiles.com/uploads/v1/user/25332026.f41b9fb2.50x50o.0d10e7055274.jpeg'
       , title: 'Chess.com Tandem/Bughouse World Championship 2024: prize $2,500' },
      { url: 'https://alternative.me/media/256/0-a-d-icon-yfx2dic847rkvocy-c.png'
       , title: 'play0ad.com/  0 A.D. is a free, open-source, historical Real Time Strategy (RTS)' },
      { url: 'https://yt3.ggpht.com/W6ivGrRJrNymjcuESV4S8vEqGLTl2Rpys3dBWAEQ-CA_nsn4JdIteowMqe8Vl36hEe0tOScp4A=s108-c-k-c0x00ffffff-no-rj'
       , title: 'youtube.com/@plan0go 0 A.D. YouTuber ' },
      { url: 'https://i.imgur.com/88Dtfz2.png'
       , title: 'Web-Nerd/Dipl.Informatiker(FH) Sebastian Lauffer aus SL5.de | 30Jahre+ Erfahrung | 0 A.D. member + player' },




      ];
    const t = ' |Deutsch+English |Viewer games |Learn IT at SL5.de |Developer?→join SL5.de ❤️Bughouse/Tandem ❤️hand-and-brain ❤️seeh at lichess ❤️seeh74 at chess.com | Developer?→join SL5.de | Developer?→join SL5.de | Developer?→join SL5.de';
    const s = 'background-color:#C02942;color:white;text-align:center;padding:5px;font-size:14px;position:fixed;bottom:0;width:100%;z-index:9998;transition: bottom 0.3s ease-in-out;';

    let r = false;
    let a = null;
    let l = null;
    let o;
    let moveDelay = 1000 * 5; // 5 seconds default move delay
    let tvDelay = null; // tvDelay is optional
    let c = null;
    let X = 0;
    let cachedImg = null;
    let cachedTitle = null;
    let isMouseAtBottom = false;
    let inactiveStartTime = 0;
    let mainButton = null;
    let messageIndex = 0;
    let messageTimer = null;
    let imageIndex = 0;
    let imageTimer = null;
    let comicViewActive = false;
    let comicContainer = null;
    let mouseX = -1000;
    let mouseY = -1000;
      const proximityThreshold = 200;
    const minSpeed = 0.3;
    const imageSize = 70;
    const tvPage = "https://lichess.org/tv/rapid";
    const autoSwitchTimeoutDefault = 1000 * 60 * 15; // 15 minutes


    const brbMessages = [
      "I'll be right back",
      "Gleich wieder da",
      "BRB...",
      "Be right back!",
      "Away from keyboard"
    ];

    // Load timeout from storage
  const storedMoveDelay = localStorage.getItem('moveDelay');
  const storedTvDelay = localStorage.getItem('tvDelay');

    if (storedMoveDelay) {
      moveDelay = parseInt(storedMoveDelay, 10);
    }
     if(storedTvDelay){
        tvDelay = parseInt(storedTvDelay,10);
    }

    // Add button to change timeout
      function addMainButton() {
      if (mainButton) return;

      mainButton = document.createElement('button');
      mainButton.textContent = '⚙️'; // Initial button text
      mainButton.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 10000;';
      mainButton.onclick = mainButtonAction;

      document.body.appendChild(mainButton);
    }

      addMainButton();
    
    // Add button to toggle alerts
      function addAlertsButton() {
	      if (!doDebug) return;      
          const alertsButton = document.createElement('button');
          alertsButton.textContent = '📢';
          alertsButton.style.cssText = 'position: fixed; top: 10px; right: 60px; z-index: 10000;';
          alertsButton.onclick = toggleAlerts;
          document.body.appendChild(alertsButton);
       }
    
    addAlertsButton();

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
          // txt.textContent = `${brbMessages[messageIndex % brbMessages.length]} ( ${waitTimeSeconds} sec) `;
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
      
      if (alertsEnabled) alert("animate called. r: " + r);
      if (!r) return;
    
      let x = Math.random() * (window.innerWidth - 100);
      let y = Math.random() * (window.innerHeight - 100);
        let baseDx = Math.random() * 2 - 1;
        let baseDy = Math.random() * 2 - 1;


          // Randomize the direction of initial movement
        if (Math.random() > 0.5) baseDx = -baseDx;
        if (Math.random() > 0.5) baseDy = -baseDy;

      let dx = baseDx;
      let dy = baseDy;


      // Reuse cached image or create it if it doesnt exist.
      const img = cachedImg || (()=>{
          const newImg = document.createElement('img');
        newImg.style.cssText = 'position:fixed;z-index:9999;width:70px;height:auto;pointer-events:none;';
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

      // randomize the index
        messageIndex = Math.floor(Math.random() * brbMessages.length);
      	imageIndex = Math.floor(Math.random() * imageURLs.length);
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
          clearInterval(messageTimer);
            clearInterval(imageTimer);
          return;
        }
          // Calculate distance to mouse
          const distance = Math.sqrt((x + imageSize/2 - mouseX) ** 2 + (y + imageSize/2 - mouseY) ** 2);
          // Adjust speed based on mouse proximity
          const speedMultiplier = distance < proximityThreshold ? 12 : 1;


        // Immediate boundary check and correction
          if (x < 0) {
            x = 0;
             baseDx = -baseDx;
            if(Math.abs(baseDx) < minSpeed) baseDx = baseDx > 0 ? minSpeed : -minSpeed;
          } else if (x + imageSize > window.innerWidth) {
            x = window.innerWidth - imageSize;
            baseDx = -baseDx;
             if(Math.abs(baseDx) < minSpeed) baseDx = baseDx > 0 ? minSpeed : -minSpeed;

          }

          if (y < 0) {
            y = 0;
           baseDy = -baseDy;
            if(Math.abs(baseDy) < minSpeed) baseDy = baseDy > 0 ? minSpeed : -minSpeed;
          } else if (y + imageSize > window.innerHeight) {
            y = window.innerHeight - imageSize;
              baseDy = -baseDy;
            if(Math.abs(baseDy) < minSpeed) baseDy = baseDy > 0 ? minSpeed : -minSpeed;
          }
         dx = baseDx * speedMultiplier;
          dy = baseDy * speedMultiplier;

          x += dx;
          y += dy;

        img.style.left = x + 'px';
        img.style.top = y + 'px';
          titleElement.style.left = x + 'px';
        titleElement.style.top = (y + imageSize) + 'px';
        txt.style.left = x + 'px';
        txt.style.top = (y + imageSize + 20) + 'px';


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
      //messageIndex = 0; //no need to reset this here, its reseted in the animation
      //imageIndex = 0;
       if (alertsEnabled)  alert("resetTimer called. r: " + r);
    o = setTimeout(function() {
      inactiveStartTime = Date.now();
      if (alertsEnabled) alert("resetTimer setTimeout. inactiveStartTime: " + inactiveStartTime);
      r = true;
      if (alertsEnabled)  alert("resetTimer setTimeout. r: " + r);
      animate();
    }, moveDelay);
  }

  
function checkInactivityAndSwitchPage() {
    if (alertsEnabled) alert("checkInactivityAndSwitchPage. start r: " + r);
    if (!r) {
     if (alertsEnabled) alert("checkInactivityAndSwitchPage. r is false, exiting");
     return;
    }
    if (alertsEnabled)  alert("checkInactivityAndSwitchPage. r: " + r);

    if(tvDelay == null) {
    if (alertsEnabled) alert("checkInactivityAndSwitchPage. tvDelay is null, exiting")
     return;
    }
    if (alertsEnabled) alert("checkInactivityAndSwitchPage. tvDelay: " + tvDelay);
    
    if (typeof tvDelay !== 'number') {
    if (alertsEnabled)  alert("checkInactivityAndSwitchPage. tvDelay is NOT a number! Value: " + tvDelay);
        return;
    }

    const timeSinceInactive = Date.now() - inactiveStartTime;
     if (alertsEnabled) alert("checkInactivityAndSwitchPage. timeSinceInactive: " + timeSinceInactive);
    if (tvDelay != null && timeSinceInactive > tvDelay) {
       if (alertsEnabled) alert("checkInactivityAndSwitchPage. Time condition is met: " + timeSinceInactive + ", " + tvDelay);
        if (window.location.href !== tvPage) {
           if (alertsEnabled) alert("checkInactivityAndSwitchPage. Page will redirect");
         window.location.href = tvPage;
        }
    }
}
  
    function toggleAlerts() {
       alertsEnabled = !alertsEnabled;
       alert("Alerts are now " + (alertsEnabled ? "ON" : "OFF"));
    }

  
  
  
  
  
  
  
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;

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

      function mainButtonAction() {
          if (comicViewActive) {
              hideComicView();
              mainButton.textContent = '⚙️';
          } else {
              const input = prompt(
                  "Enter delay for image movement in seconds, (optional) then delay for lichess tv page in seconds, if needed. (e.g. 5 or 5,10 or 5,60*5)",
                  `${moveDelay / 1000}${tvDelay !== null ? "," + tvDelay / 1000 : "" }`
              );
            if (input) {
              const values = input.split(/[^0-9*]+/);
                  try {
                      moveDelay = evaluateExpression(values[0]) * 1000;
                      if (values.length > 1 && values[1] != null) {
                         tvDelay = evaluateExpression(values[1]) * 1000;
                          localStorage.setItem('tvDelay', tvDelay);
                      }
                      else{
                          tvDelay = null;
                          localStorage.removeItem('tvDelay');
                      }
                    localStorage.setItem('moveDelay', moveDelay);
                  } catch (error) {
                    alert('Invalid Input');
                    return;
                  }
                  resetTimer();
            } else {
               showComicView();
              mainButton.textContent = '❌';
             }

          }
      }

     function evaluateExpression(expression) {
      try {
            return  Function(`return ${expression}`)();
      } catch (error) {
        console.error("Error evaluating expression: ", error);
        return null;
      }
    }

    function showComicView() {
      comicViewActive = true;

      comicContainer = document.createElement('div');
      comicContainer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.8);z-index:10001;overflow-y:scroll;padding:20px;display:grid;grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));grid-gap:20px;align-content: start;';
      document.body.appendChild(comicContainer);

      imageURLs.forEach(item => {
          const imageContainer = document.createElement('div');
          imageContainer.style.cssText = 'display:flex;flex-direction:column;align-items:center;';

          const img = document.createElement('img');
          img.src = item.url;
          img.style.cssText = 'width:70px;height:auto;';

          const titleElement = document.createElement('div');
          titleElement.textContent = item.title;
          titleElement.style.cssText = 'color:white;text-align:center;font-size:12px;font-weight:bold;';


          imageContainer.appendChild(img);
          imageContainer.appendChild(titleElement);
          comicContainer.appendChild(imageContainer);

      });
    }

    function hideComicView() {
      comicViewActive = false;
      if (comicContainer) {
          comicContainer.remove();
          comicContainer = null;
      }
    }

    resetTimer();
    setInterval(checkInactivityAndSwitchPage, 1000); // Check every second for inactivity and page switch

})();
