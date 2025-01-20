// ==UserScript==
// @name         Focus Hour Input (Fritz.box Alarm)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Focuses on the input element with ID "uiHour-input" on Fritz.box alarm page after a delay. Includes an on/off switch for alerts.
// @author       You
// @match        *://*.fritz.box/* 
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const alertsEnabled = false; // Set to true to enable alerts

    if (alertsEnabled) {
        alert('Script started. Waiting for page load...'); 
    }

    function checkForInput() {
        const inputElement = document.getElementById('uiHour-input');

        if (inputElement) {
            if (alertsEnabled) {
                alert('Hour input focused!'); 
            }
            inputElement.focus();
          inputElement.select(); // Select the existing content
            return true; // Stop checking
        } else {
            return false; // Continue checking
        }
    }

    function checkAndFocus() {
        if (checkForInput()) {
            if (alertsEnabled) {
                alert('Element found and focused.'); 
            }
        } else {
            setTimeout(checkAndFocus, 500); // Check again after 500ms
        }
    }

    window.addEventListener('load', () => {
        if (alertsEnabled) {
            alert('Page loaded. Checking for input element...');
        }
        checkAndFocus(); 
    });

    if (alertsEnabled) {
        alert('Script finished execution.'); 
    }

})();
