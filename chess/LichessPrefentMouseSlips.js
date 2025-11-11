// ==UserScript==
// @name         Lichess 1.1 Enter for prefent Mouse slips (Toggleable)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  This prefents Mouse slips. Simulate Enter key press on LMB click. Now with a toggle button.
// @description  This functionality is specifically designed to work in tandem with the "Confirm Move by Enter" setting on Lichess.
// @match        https://lichess.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'lichessLMBEnterEnabled';
    // Lade den Zustand aus dem localStorage; Standard ist 'true' (aktiviert)
    let isEnterEnabled = localStorage.getItem(STORAGE_KEY) === 'false' ? false : true;

    // --- UI Setup (Button) ---
    const style = document.createElement('style');
    style.textContent = `
        #lmb-enter-toggle {
            position: fixed;
            top: 5px; /* Position oben rechts */
            right: 5px;
            z-index: 10000;
            padding: 5px 8px;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.4);
            transition: background-color 0.3s, opacity 0.3s;
            border: 2px solid;
            line-height: 1;
            display: flex; /* Für bessere Zentrierung des Emojis */
            align-items: center;
            justify-content: center;
            width: 35px; /* Feste Größe, falls das Emoji variiert */
            height: 35px;
        }
    `;
    document.head.appendChild(style);

    const toggleButton = document.createElement('div');
    toggleButton.id = 'lmb-enter-toggle';
    toggleButton.innerHTML = '🖱️'; // Das gewünschte Maus-Emoji

    // Funktion zur Aktualisierung des Button-Aussehens und des Tooltips
    function updateToggleButtonUI() {
        if (isEnterEnabled) {
            toggleButton.style.backgroundColor = '#4CAF50'; // Grün (Enabled)
            toggleButton.style.color = 'white';
            toggleButton.title = 'LMB-Enter ist EIN (Klicken zum Ausschalten)';
            toggleButton.style.borderColor = '#388E3C';
        } else {
            toggleButton.style.backgroundColor = '#F44336'; // Rot (Disabled)
            toggleButton.style.color = 'white';
            toggleButton.title = 'LMB-Enter ist AUS (Klicken zum Einschalten)';
            toggleButton.style.borderColor = '#D32F2F';
        }
    }

    // Button zum DOM hinzufügen und initialen Zustand setzen
    document.body.appendChild(toggleButton);
    updateToggleButtonUI();

    // Toggle-Logik
    toggleButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Verhindert, dass der Klick selbst das mousedown-Event auslöst
        isEnterEnabled = !isEnterEnabled;
        localStorage.setItem(STORAGE_KEY, isEnterEnabled);
        updateToggleButtonUI();
        console.log(`LMB-to-Enter-Funktion ist jetzt ${isEnterEnabled ? 'AKTIVIERT' : 'DEAKTIVIERT'}.`);
    });

    // --- Exclusion Logic ---
    function shouldScriptRun() {
        const url = window.location.href;

        // 1. Check for user profiles or streams (contains @)
        if (url.includes('@')) {
            // Hinweis: Dies wird nur ausgelöst, wenn die Funktion EIN ist und mousedown passiert
            // Wenn die Funktion AUS ist, gibt sie einfach 'false' zurück
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
      
        // NEU: Nur ausführen, wenn der Schalter AKTIVIERT ist
        if (!isEnterEnabled) {
            return;
        }
        
        // Exklusionsprüfung (wie gehabt)
        if (!shouldScriptRun()) {
            return;
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
