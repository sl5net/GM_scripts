// ==UserScript==
// @name     GM li brb scrreensaver19c (v3.2 Larger Video + Autoplay Fix)
// @namespace    https://lichess.org/
// @version  3.2
// @description  Screensaver with changing text, images, YouTube videos + titles + setup comic view + automatic switch to LichessTV
// @match   https://lichess.org/*
// @match   https://dicechess.com/*
// @match   https://www.chess.com/*
// @grant    none
// ==/UserScript==

(function() {
    const LOG_PREFIX = "[Screensaver v3.2] ";
    console.log(LOG_PREFIX + "Script loading...");

    let alertsEnabled = false;
  	const doDebug = false;

    // --- Configuration ---
    const videoWidth = 640;  // <<< VERGRÖSSERT
    const videoHeight = 360; // <<< VERGRÖSSERT (maintains 16:9)
    const imageSize = 70;
    const moveDelayDefault = 1000 * 5;
    const tvPage = "https://lichess.org/tv/rapid";
    const autoSwitchTimeoutDefault = 1000 * 60 * 15;

    const mediaItems = [
      // --- Images ---
      // **** WICHTIG: Füge hier für JEDEN deiner alten Bild-Einträge 'type: image' hinzu ****
      { type: 'image', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Adelobasileus_cromptoni.jpg', title: '225 Millionen years ago...' },
      { type: 'image', url: 'https://qph.cf2.quoracdn.net/main-qimg-6e7144652bd277c4722f5e68c68f9356-lq', title: 'Humans 100 million years ago' },
      // ... (ALLE deine anderen Bilder hier mit type: 'image') ...
      { type: 'image', url: 'https://i.imgur.com/88Dtfz2.png', title: 'Web-Nerd Sebastian Lauffer...' },

      // --- YouTube Videos ---
      { type: 'youtube', videoId: 'F8Z7CawKXYs', title: 'SL5.de IT-Lösungen' }, 
      { type: 'youtube', videoId: 'F8Z7CawKXYs', title: 'SL5.de IT-Lösungen' },
       // { type: 'youtube', videoId: '...', title: '...' } // Füge weitere hinzu
    ];
    // console.log(LOG_PREFIX + `Loaded ${mediaItems.length} media items.`); // Weniger gesprächig

    const tickerText = ' |Deutsch+English |Viewer games |Learn IT at SL5.de |Developer?→join SL5.de ❤️Bughouse/Tandem ❤️hand-and-brain ❤️seeh at lichess ❤️seeh74 at chess.com | Developer?→join SL5.de | Developer?→join SL5.de | Developer?→join SL5.de';
    const tickerStyle = 'background-color:#C02942;color:white;text-align:center;padding:5px;font-size:14px;position:fixed;bottom:0;width:100%;z-index:9998;transition: bottom 0.3s ease-in-out;';

    // --- State Variables ---
    let screensaverActive = false;
    let lastMouseX = null;
    let lastMouseY = null;
    let inactivityTimer = null;
    let tickerElement;
    let moveDelay = moveDelayDefault;
    let tvDelay = null;
    let tickerContainer = null;
    let tickerX = 0;
    let mediaElementContainer = null; // Holds the container div for media + text
    let titleElement = null;
    let currentMediaType = null;
    let isMouseAtBottom = false;
    let inactiveStartTime = 0;
    let mainButton = null;
    let brbMessageIndex = 0;
    let brbMessageTimer = null;
    let mediaIndex = 0;
    let mediaTimer = null;
    let comicViewActive = false;
    let comicContainer = null;
    let currentMouseX = -1000;
    let currentMouseY = -1000;
    const proximityThreshold = 200;
    const minSpeed = 0.3;

    const brbMessages = [ /* ... messages ... */
          "I'll be right back",
      "Gleich wieder da",
      "BRB...",
      "Be right back!",
      "Away from keyboard"
    ];

    // --- Load settings ---
    const storedMoveDelay = localStorage.getItem('moveDelay');
    const storedTvDelay = localStorage.getItem('tvDelay');
    if (storedMoveDelay) {
      moveDelay = parseInt(storedMoveDelay, 10);
    }
    if(storedTvDelay){
        tvDelay = parseInt(storedTvDelay,10);
    }
    // console.log(LOG_PREFIX + `Initial delays: moveDelay=${moveDelay}ms, tvDelay=${tvDelay}ms`);

    // --- Initialization ---
    addMainButton();
    addAlertsButton();
    createTicker();
    resetInactivityTimer(); // Start the first timer
    setInterval(checkInactivityAndSwitchPage, 1000);
    document.addEventListener('mousemove', handleMouseMove);
    console.log(LOG_PREFIX + "Initialization complete. Waiting for inactivity...");


    // --- Functions ---

    // ... createTicker, animateTicker, addMainButton, addAlertsButton, toggleAlerts ...
    // (Diese Funktionen bleiben unverändert von v3.1)
    function createTicker() {
      if (!tickerContainer) {
        tickerContainer = document.createElement('div');
        tickerContainer.style.cssText = tickerStyle;
        tickerElement = document.createElement('div');
        tickerElement.style.position = 'absolute';
        tickerElement.style.whiteSpace = 'nowrap';
        tickerElement.textContent = tickerText;
        tickerContainer.appendChild(tickerElement);
        document.body.appendChild(tickerContainer);
        animateTicker();
      }
    }

    function animateTicker() {
      if (!screensaverActive && !isMouseAtBottom) {
        tickerX -= 1;
        const textWidth = tickerElement.offsetWidth || (tickerText.length * 7);
        if (tickerX + textWidth < 0) {
            tickerX = tickerContainer.offsetWidth;
        }
        tickerElement.style.left = tickerX + 'px';
      }
        requestAnimationFrame(animateTicker);
    }

    function addMainButton() {
      if (mainButton) return;
      mainButton = document.createElement('button');
      mainButton.textContent = '⚙️';
      mainButton.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 10000;';
      mainButton.onclick = mainButtonAction;
      document.body.appendChild(mainButton);
    }

    function addAlertsButton() {
      if (!doDebug) return;
      const alertsButton = document.createElement('button');
      alertsButton.textContent = '📢';
      alertsButton.style.cssText = 'position: fixed; top: 10px; right: 60px; z-index: 10000;';
      alertsButton.onclick = toggleAlerts;
      document.body.appendChild(alertsButton);
    }

     function toggleAlerts() {
       alertsEnabled = !alertsEnabled;
       alert("Alerts are now " + (alertsEnabled ? "ON" : "OFF"));
    }


    function updateBrbMessage(brbTextElement) {
        if(!screensaverActive || !brbTextElement) return;
        const waitTimeSeconds = Math.round((Date.now() - inactiveStartTime) / 1000);
        brbTextElement.textContent = `${brbMessages[brbMessageIndex % brbMessages.length]} (${waitTimeSeconds} sec)`;
        brbMessageIndex++;
    }

    function updateMedia() {
        if(!screensaverActive) return;
        // console.log(LOG_PREFIX + "updateMedia called."); // Weniger gesprächig

        mediaIndex++;
        const currentItem = mediaItems[mediaIndex % mediaItems.length];
        // console.log(LOG_PREFIX + `Updating media to index ${mediaIndex % mediaItems.length}: type=${currentItem.type}, title=${currentItem.title}`);

        // Update title
        if (!titleElement) {
             // console.log(LOG_PREFIX + "Creating title element.");
             titleElement = document.createElement('div');
             titleElement.style.cssText = 'position:fixed;z-index:9999;color:white;background-color:rgba(0,0,0,0.5);padding:2px 4px;text-align:center;font-size:12px;font-weight:bold;pointer-events:none; white-space: nowrap;';
             document.body.appendChild(titleElement);
        }
        titleElement.textContent = currentItem.title || '';
        // console.log(LOG_PREFIX + "Title element updated.");


        // Check if media type needs to change or element doesn't exist
        if (currentItem.type !== currentMediaType || !mediaElementContainer) {
            // console.log(LOG_PREFIX + `Media type changing (or first run). Old: ${currentMediaType}, New: ${currentItem.type}`);
            if (mediaElementContainer) {
                // console.log(LOG_PREFIX + "Removing old media element container.");
                mediaElementContainer.remove();
            }
            mediaElementContainer = createMediaElement(currentItem);
            if (mediaElementContainer) {
                 // console.log(LOG_PREFIX + "Appending new media element container to body.");
                 document.body.appendChild(mediaElementContainer);
                 currentMediaType = currentItem.type;
            } else {
                console.error(LOG_PREFIX + "Failed to create new media element container!");
                currentMediaType = null;
            }
        } else if (mediaElementContainer) {
             // Type is the same, just update the source
             // console.log(LOG_PREFIX + "Media type is the same, updating source.");
             const innerMediaElement = mediaElementContainer.firstChild;
             if (innerMediaElement) {
                 if (currentMediaType === 'image') {
                     innerMediaElement.src = currentItem.url;
                 } else if (currentMediaType === 'youtube') {
                      innerMediaElement.src = getYoutubeEmbedUrl(currentItem.videoId); // Regenerate URL (includes origin)
                 }
             } else {
                 console.error(LOG_PREFIX + "Could not find inner media element (img/iframe) to update source!");
             }
        }

         // Update BRB text within the container
         if (mediaElementContainer) {
             const brbText = mediaElementContainer.querySelector('.brb-text');
             if (brbText) {
                 updateBrbMessage(brbText);
             }
         }
         // console.log(LOG_PREFIX + "updateMedia finished.");
    }

    function createMediaElement(itemConfig) {
        // console.log(LOG_PREFIX + `createMediaElement called for type: ${itemConfig.type}`);
        let mediaContentElement = null;

        if (itemConfig.type === 'image') {
            mediaContentElement = document.createElement('img');
            // Use object-fit: contain for images if you want them to scale down within the box if needed
            mediaContentElement.style.cssText = `display: block; width:${imageSize}px;height:auto; max-height: ${imageSize}px; object-fit: contain; pointer-events:none; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);`;
            mediaContentElement.src = itemConfig.url;
            mediaContentElement.onerror = () => console.error(LOG_PREFIX + "Image failed to load:", itemConfig.url);
        } else if (itemConfig.type === 'youtube') {
            mediaContentElement = document.createElement('iframe');
            mediaContentElement.style.cssText = `display: block; width:${videoWidth}px;height:${videoHeight}px;pointer-events:none; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);`;
            mediaContentElement.src = getYoutubeEmbedUrl(itemConfig.videoId); // <<< Get URL with origin
            mediaContentElement.setAttribute('frameborder', '0');
            // Ensure allow attribute has autoplay
            mediaContentElement.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            mediaContentElement.setAttribute('allowfullscreen', '');
        } else {
            console.error(LOG_PREFIX + "Unknown media type in createMediaElement:", itemConfig.type);
            return null;
        }

        // Create BRB text element
        const brbTextElement = document.createElement('div');
        brbTextElement.classList.add('brb-text');
        brbTextElement.style.cssText = 'color:white;text-align:center;font-size:16px;font-weight:bold;pointer-events:none;white-space:pre-wrap; background-color:rgba(0,0,0,0.5); padding: 2px 4px; margin-top: 4px;';

        // Create the container
        const container = document.createElement('div');
        container.style.cssText = 'position:fixed; z-index: 9998; pointer-events:none; width: fit-content; height: fit-content;';
        container.appendChild(mediaContentElement);
        container.appendChild(brbTextElement);

        updateBrbMessage(brbTextElement);

        return container;
    }

    // --- getYoutubeEmbedUrl MODIFIED ---
    function getYoutubeEmbedUrl(videoId) {
        // Added &origin=${window.location.origin}
        const url = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&showinfo=0&modestbranding=1&origin=${window.location.origin}`;
        console.log(LOG_PREFIX + "Generated YouTube URL:", url); // Log URL to verify origin parameter
        return url;
    }


    function startScreensaver() {
        if (screensaverActive) return;
        console.log(LOG_PREFIX + "Starting screensaver...");
        inactiveStartTime = Date.now();
        screensaverActive = true;

        mediaIndex = Math.floor(Math.random() * mediaItems.length) -1;
        updateMedia();

        if (mediaElementContainer) {
            // console.log(LOG_PREFIX + "Screensaver media container exists, starting timers and movement.");
            brbMessageTimer = setInterval(() => {
                 const brbText = mediaElementContainer?.querySelector('.brb-text');
                 if (brbText) updateBrbMessage(brbText);
            }, 5000);
            mediaTimer = setInterval(updateMedia, 12000); // Change media every 12 seconds
            animateMediaMovement();
        } else {
            console.error(LOG_PREFIX + "Screensaver could not start: Initial media element container failed to create.");
            screensaverActive = false;
        }
    }

    function stopScreensaver() {
        if (!screensaverActive) return;
        // console.log(LOG_PREFIX + "Stopping screensaver..."); // Weniger gesprächig
        screensaverActive = false;
        if (mediaElementContainer) {
            mediaElementContainer.remove();
            mediaElementContainer = null;
        }
        if (titleElement) {
            titleElement.remove();
            titleElement = null;
        }
        clearInterval(brbMessageTimer);
        brbMessageTimer = null;
        clearInterval(mediaTimer);
        mediaTimer = null;
        currentMediaType = null;
    }


    function animateMediaMovement() {
        // console.log(LOG_PREFIX + "animateMediaMovement started."); // Weniger gesprächig
        let x = Math.random() * (window.innerWidth - 200);
        let y = Math.random() * (window.innerHeight - 200);
        let baseDx = (Math.random() * 2 - 1) * 0.5 + (Math.random() > 0.5 ? 0.3 : -0.3);
        let baseDy = (Math.random() * 2 - 1) * 0.5 + (Math.random() > 0.5 ? 0.3 : -0.3);

        function moveMedia() {
            if (!screensaverActive || !mediaElementContainer) {
                stopScreensaver();
                return;
            }

             const containerRect = mediaElementContainer.getBoundingClientRect();
             // Use larger video dimensions here for calculations if needed, or rely on containerRect
             const elementWidth = containerRect.width || (currentMediaType === 'youtube' ? videoWidth : imageSize);
             const elementHeight = containerRect.height || (currentMediaType === 'youtube' ? videoHeight + 30 : imageSize + 30); // Estimate includes text
             const titleHeight = titleElement?.offsetHeight || 18;

            // Mouse proximity calculation
            const distance = Math.sqrt((x + elementWidth/2 - currentMouseX) ** 2 + (y + elementHeight/2 - currentMouseY) ** 2);
            const speedMultiplier = distance < proximityThreshold ? 8 : 1;

            // Boundary checks
             if (x < 0) { x = 0; baseDx = Math.abs(baseDx) || minSpeed; }
             else if (x + elementWidth > window.innerWidth) { x = window.innerWidth - elementWidth; baseDx = -Math.abs(baseDx) || -minSpeed; }

             if (y < titleHeight + 5) { y = titleHeight + 5; baseDy = Math.abs(baseDy) || minSpeed; }
             else if (y + elementHeight > window.innerHeight) { y = window.innerHeight - elementHeight; baseDy = -Math.abs(baseDy) || -minSpeed; }

            let dx = baseDx * speedMultiplier;
            let dy = baseDy * speedMultiplier;
            dx = Math.max(-10, Math.min(10, dx));
            dy = Math.max(-10, Math.min(10, dy));

            x += dx;
            y += dy;

            mediaElementContainer.style.left = x + 'px';
            mediaElementContainer.style.top = y + 'px';

            if (titleElement) {
                 titleElement.style.left = x + 'px';
                 titleElement.style.top = (y - titleHeight - 2) + 'px';
            }

            requestAnimationFrame(moveMedia);
        }
        moveMedia();
    }


    function resetInactivityTimer() {
      // console.log(LOG_PREFIX + "resetInactivityTimer called."); // Weniger gesprächig
      stopScreensaver();
      clearTimeout(inactivityTimer);
      // console.log(LOG_PREFIX + `Setting inactivity timer for ${moveDelay}ms.`);
      inactivityTimer = setTimeout(() => {
           console.log(LOG_PREFIX + "Inactivity timer fired! Starting Screensaver.");
           startScreensaver();
        }, moveDelay);
    }

    function checkInactivityAndSwitchPage() {
        // ... (no changes here, assumed ok) ...
       if (!screensaverActive) return;
      if(tvDelay == null || typeof tvDelay !== 'number') return;
      const timeSinceInactive = Date.now() - inactiveStartTime;
      if (timeSinceInactive > tvDelay) {
         console.log(LOG_PREFIX + "TV switch condition met.");
          if (window.location.href !== tvPage) {
             console.log(LOG_PREFIX + "Redirecting to TV page:", tvPage);
             window.location.href = tvPage;
          }
      }
    }

    function handleMouseMove(e) {
        // ... (no changes here, assumed ok) ...
      currentMouseX = e.clientX;
      currentMouseY = e.clientY;
      const distanceFromBottom = window.innerHeight - currentMouseY;
      if(distanceFromBottom < 20){
        if(!isMouseAtBottom){
          isMouseAtBottom = true;
          if (tickerContainer) tickerContainer.style.bottom = `-${tickerContainer.offsetHeight}px`;
        }
      }else{
        if(isMouseAtBottom){
          isMouseAtBottom = false;
          if (tickerContainer) tickerContainer.style.bottom = '0';
        }
      }
      if (lastMouseX !== null && lastMouseY !== null) {
        const dx = Math.abs(currentMouseX - lastMouseX);
        const dy = Math.abs(currentMouseY - lastMouseY);
        if (dx > 3 || dy > 3) {
             resetInactivityTimer();
        }
      }
      lastMouseX = currentMouseX;
      lastMouseY = currentMouseY;
    }

     function mainButtonAction() {
         // ... (no changes here, assumed ok) ...
          if (comicViewActive) {
              hideComicView();
              mainButton.textContent = '⚙️';
          } else {
              const currentTvDelaySec = tvDelay !== null ? (tvDelay / 1000).toString() : "";
              const promptDefault = `${moveDelay / 1000}${currentTvDelaySec ? "," + currentTvDelaySec : "" }`;
              const input = prompt(
                    "Enter delay for screensaver (sec), (optional) comma, then delay for Lichess TV switch (sec). Use * for multiplication (e.g., 5 or 5,300 or 5,60*5). Leave TV delay empty to disable.",
                  promptDefault
              );

            if (input !== null) {
              const values = input.split(',');
                  try {
                      if (values[0]?.trim()) {
                          const newMoveDelay = evaluateExpression(values[0].trim()) * 1000;
                          if (isNaN(newMoveDelay) || newMoveDelay <=0) throw new Error("Invalid screensaver delay");
                          moveDelay = newMoveDelay;
                          localStorage.setItem('moveDelay', moveDelay);
                      } else {
                           throw new Error("Screensaver delay cannot be empty.");
                      }
                      if (values.length > 1 && values[1]?.trim()) {
                         const newTvDelay = evaluateExpression(values[1].trim()) * 1000;
                          if (isNaN(newTvDelay) || newTvDelay <=0) throw new Error("Invalid TV delay");
                          tvDelay = newTvDelay;
                          localStorage.setItem('tvDelay', tvDelay);
                      } else {
                          tvDelay = null;
                          localStorage.removeItem('tvDelay');
                      }
                      alert(`Settings updated:\nScreensaver delay: ${moveDelay/1000}s\nLichess TV switch: ${tvDelay !== null ? tvDelay/1000 + 's' : 'Disabled'}`);
                      resetInactivityTimer();

                  } catch (error) {
                    console.error(LOG_PREFIX + "Error processing prompt input:", error);
                    alert('Invalid Input: ' + error.message);
                  }
            } else {
               console.log(LOG_PREFIX + "Prompt cancelled, showing comic view.");
               showComicView();
               mainButton.textContent = '❌';
             }
          }
      }

     function evaluateExpression(expression) {
        // ... (no changes here, assumed ok) ...
        if (!expression || typeof expression !== 'string') return NaN;
        if (!/^[0-9\s*.\/+\-()]+$/.test(expression)) {
             console.warn(LOG_PREFIX + "Potentially unsafe characters in expression:", expression);
        }
        try {
            return Function(`'use strict'; return (${expression})`)();
        } catch (error) {
            console.error(LOG_PREFIX + "Error evaluating expression:", expression, error);
            return NaN;
        }
    }

    // --- Comic View Functions ---
    function showComicView() {
         // ... (no changes here, assumed ok) ...
         console.log(LOG_PREFIX + "Showing comic view.");
         comicViewActive = true;
         stopScreensaver();
         comicContainer = document.createElement('div');
         comicContainer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.9);z-index:10001;overflow-y:scroll;padding:20px;display:grid;grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));grid-gap:20px;align-content: start;';
         document.body.appendChild(comicContainer);
         mediaItems.forEach(item => {
                const itemContainer = document.createElement('div');
              itemContainer.style.cssText = 'display:flex;flex-direction:column;align-items:center; border: 1px solid #555; padding: 10px; border-radius: 5px;';
              let mediaThumbElement;
              if (item.type === 'image') {
                 mediaThumbElement = document.createElement('img');
                 mediaThumbElement.src = item.url;
                 mediaThumbElement.style.cssText = 'width:70px;height:auto; max-height: 70px; object-fit: cover; margin-bottom: 5px;';
                 mediaThumbElement.onerror = () => { mediaThumbElement.style.border='1px solid red'; console.error("Comic img fail:", item.url); };
              } else if (item.type === 'youtube') {
                   mediaThumbElement = document.createElement('img');
                   mediaThumbElement.src = `https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`;
                   mediaThumbElement.style.cssText = 'width:120px;height:auto; max-height: 90px; object-fit: cover; margin-bottom: 5px; border: 1px solid #444;';
                   mediaThumbElement.onerror = () => { mediaThumbElement.style.border='1px solid red'; console.error("Comic thumb fail:", item.videoId); };
                  const link = document.createElement('a');
                  link.href = `https://www.youtube.com/watch?v=${item.videoId}`;
                  link.target = '_blank';
                  link.appendChild(mediaThumbElement);
                  mediaThumbElement = link;
              }
              const titleElement = document.createElement('div');
              titleElement.textContent = item.title;
              titleElement.style.cssText = 'color:white;text-align:center;font-size:11px;font-weight:normal; word-break: break-word;';
              if (mediaThumbElement) itemContainer.appendChild(mediaThumbElement);
              itemContainer.appendChild(titleElement);
              comicContainer.appendChild(itemContainer);
         });
    }

    function hideComicView() {
        // ... (no changes here, assumed ok) ...
      console.log(LOG_PREFIX + "Hiding comic view.");
      comicViewActive = false;
      if (comicContainer) {
          comicContainer.remove();
          comicContainer = null;
      }
       resetInactivityTimer();
    }

    // console.log(LOG_PREFIX + "Script execution finished.");

})();
