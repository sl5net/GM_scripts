// ==UserScript==
// @name         Lichess Internal Enter for prefent Mouse slips
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This prefents Mouse slips. Simulate Enter key press on LMB click
// @description  This functionality is specifically designed to work in tandem with the "Confirm Move by Enter" setting on Lichess. By coupling the click (selecting the target square) immediately with the Enter confirmation, the user is protected from common "mouse slips" that occur when rapidly dragging and dropping pieces, thereby improving rapid play reliability.
// @description  A small delay is included between the click detection and the Enter dispatch to mimic the real-world action delay.
// @match        https://lichess.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

      // --- Exclusion Logic ---
    function shouldScriptRun() {
        const url = window.location.href;

        // 1. Check for user profiles or streams (contains @)
        if (url.includes('@')) {
            console.log('LMB to Enter Script disabled: URL contains @ (Profile/User view).');
            return false;
        }

        // 2. Check for analysis/history anchors (e.g., #0, #23, etc.)
        // This pattern matches a hash followed immediately by one or more digits.
        if (/(#\d+)/.test(url)) {
             console.log('LMB to Enter Script disabled: URL contains analysis anchor (#...).');
            return false;
        }

        return true;
    }
    // --- End Exclusion Logic ---
  
    document.addEventListener('mousedown', function(event) {
      
      if (!shouldScriptRun()) {
        return
      }
        
        console.log('LMB to Enter Script active.');
      
        // Check if it was a left click (button 0)
        if (event.button === 0) {
            console.log('Left click detected. Attempting to simulate internal Enter key press.');

            // Prevent default action if needed (optional)
            // event.preventDefault();

            // Define the delay in milliseconds
            const delay = 20; 

            setTimeout(() => {
                // Create a synthetic Enter keydown event
                const enterEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true 
                });

                // Dispatch the event to the document body (or a specific target element)
                document.body.dispatchEvent(enterEvent);
                console.log('Internal Enter event dispatched.');
            }, delay);
        }
    }, true);
})();
