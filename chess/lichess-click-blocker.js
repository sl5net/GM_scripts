// ==UserScript==
// @name     GM lichess-click-blocker
// @namespace    https://lichess.org/
// @version  1.1
// @description motivation: at 2:41:21 https://www.youtube.com/watch?v=LezA67JandM&t=9681s , https://github.com/lichess-org/lila/issues/16730#issuecomment-2572642972
// @match   https://lichess.org/*
// @grant    none
// ==/UserScript==

(function() {

    const url = window.location.href;

    const positiveRegex = new RegExp(`\.org\/(training|streak|.*[A-Z])`);
    const negativeRegex = new RegExp(`\.org\/(?:@|lern|study|coordinate|practice|inbox|team|forum|broadcast|streamer|video|player|patron|paste)[^\/]*$`);

    if (positiveRegex.test(url) && !negativeRegex.test(url)) {

        let clickBlockerEnabled = localStorage.getItem('clickBlockerEnabled') === 'true' || localStorage.getItem('clickBlockerEnabled') === null;

        let setupButton = null;
         // Function to add the toggle button
        function addSetupButton() {
            if (setupButton) return;
            setupButton = document.createElement('button');
            setupButton.textContent = 'Blocker: ' + (clickBlockerEnabled ? 'On' : 'Off');
            setupButton.style.cssText = 'position: fixed; top: 30px; right: 10px; z-index: 10000;';
            setupButton.onclick = function() {
                clickBlockerEnabled = !clickBlockerEnabled;
                localStorage.setItem('clickBlockerEnabled', clickBlockerEnabled);
                setupButton.textContent = 'Blocker: ' + (clickBlockerEnabled ? 'On' : 'Off');
            };
            document.body.appendChild(setupButton);
        }

        addSetupButton();

        function playSound(t) {
            const a = new(window.AudioContext || window.webkitAudioContext);
            const o = a.createOscillator();
            const g = a.createGain();
            o.connect(g);
            g.connect(a.destination);
            o.type = 'sine';
            o.frequency.value = 440;
            g.gain.value = 0.1;
            o.start();
            setTimeout(() => o.stop(), t);
        }

        let lx = null,
            ly = null,
            px = null,
            py = null,
            tol = 14,
            ml = null,
            lct = 0,
            dct = 500,
            tid = null,
            cr = true,
            mtmid = null,
            nps = true;

        function attachEventListeners(board) {
            if(!board){
              console.error("Board not found");return;
            }
            board.addEventListener("mousedown", function(e) {
              let m = null,
                  p = document.querySelector('.puzzle__feedback.play');
              if (p) {
                  let i = p.querySelector('.instruction em');
                  if (i) {
                      if (i.textContent.includes('black')) m = 'black';
                      else if (i.textContent.includes('white')) m = 'white';
                  }
              }
              if (!m) {
                  const b = document.querySelector('.cg-wrap');
                  if (b) m = b.classList.contains('orientation-black') ? 'black' : 'white';
              }
              if (!m) {
                  console.error("not  found color.");
                  return;
              }
              let c = `.rclock-${m}`,
                  clockElement = document.querySelector(c);
              let totalSeconds = 9999;
              if (clockElement) {
                  let timeDiv = clockElement.querySelector('.time');
                  let mi = timeDiv ? parseInt(timeDiv.childNodes[0].textContent, 10) || 0 : NaN,
                      se = timeDiv ? parseInt(timeDiv.childNodes[2].textContent, 10) || 0 : NaN,
                      te = timeDiv ? clockElement.querySelector('tenths') : null,
                      ten = te ? parseInt(te.childNodes[0].textContent, 10) || 0 : NaN;
                  totalSeconds = isNaN(mi) ? 9999 : mi * 60 + se + (isNaN(ten) ? 0 : ten / 10);
              }
              if (e.button === 0) {
                  if ((Number.isInteger(totalSeconds) && totalSeconds > 1 && totalSeconds < 7 * 60) ||
                      e.ctrlKey ||
                      !clickBlockerEnabled
                  )
                      return;
                  const ct = new Date().getTime();
                  const td = ct - lct;
                  const dx = Math.abs(e.clientX - px);
                  const dy = Math.abs(e.clientY - py);
                  if (nps === null && td < dct && dx <= tol && dy <= tol && px !== null && py !== null) {
                      playSound(600);
                      console.log("Double click");
                      if (ml) board.removeEventListener("mousemove", ml, true);
                      clearTimeout(tid);
                      clearTimeout(mtmid);
                      lct = 0;
                      lx = null;
                      ly = null;
                      px = null;
                      py = null;
                      nps = true;
                      return;
                  } else {
                      lct = ct;
                  }
                  px = lx;
                  py = ly;
                  lx = e.clientX;
                  ly = e.clientY;
                  nps = null;
                  console.log("nps:", nps);
                  console.log("Left button down, activating mm listener");
                  if (ml) board.removeEventListener("mousemove", ml, true);
                  mtmid = setTimeout(function() {
                      ml = function(e) {
                          const cc = cr ? !e.ctrlKey : true,
                              dx = lx === null ? 0 : Math.abs(e.clientX - lx),
                              dy = ly === null ? 0 : Math.abs(e.clientY - ly);
                          if (nps === null && cc && (lx !== null && ly !== null && (dx > tol || dy > tol))) {
                              console.log("Mouse moved beyond tolerance" + (cr ? " without CTRL" : "") + ", simulating right click");
                              nps = true;
                              console.log("nps:", nps);
                              tid = setTimeout(function() {
                                  if (ml) {
                                      board.removeEventListener("mousemove", ml, true);
                                      ml = null;
                                      lx = null;
                                      ly = null;
                                      px = null;
                                      py = null;
                                  }
                                  const r = board.getBoundingClientRect();
                                  const x = r.left + r.width / 2;
                                  const y = r.top + r.height / 2;
                                  const mde = new MouseEvent('mousedown', {
                                      bubbles: true,
                                      cancelable: true,
                                      view: window,
                                      button: 2,
                                      clientX: x,
                                      clientY: y,
                                      screenX: x,
                                      screenY: y
                                  });
                                  board.dispatchEvent(mde);
                                  const mue = new MouseEvent('mouseup', {
                                      bubbles: true,
                                      cancelable: true,
                                      view: window,
                                      button: 2,
                                      clientX: x,
                                      clientY: y,
                                      screenX: x,
                                      screenY: y
                                  });
                                  board.dispatchEvent(mue);
                                  console.log("mouseup dispatched");
                              }, 50);
                          } else if (lx === null || ly === null || dx > tol || dy > tol) {
                              console.log("Mouse beyond tolerance, but no ctrl");
                              lx = e.clientX;
                              ly = e.clientY;
                          }
                      };
                      board.addEventListener("mousemove", ml, true);
                  }, 20);
              }
          }, true);
        }

        // Mutation observer for changes in the cg-board element
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
              if (mutation.addedNodes) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.tagName === 'CG-BOARD') {
                          attachEventListeners(node);
                        }
                    });
                }
            });
        });


        // Start observing the document body for changes
      
      setTimeout(() => {
              const initialBoard=document.querySelector("cg-board");
        if (initialBoard) {
            attachEventListeners(initialBoard);
        }
          observer.observe(document.body, { childList: true, subtree: true });
           }, 1000);
      

    }

})();
