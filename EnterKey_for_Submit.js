// ==UserScript==
// @name         Fritz Alarm: Enter Key to Submit (with Wait)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Submits the alarm form on Fritz.box when the Enter key is pressed. Waits for the submit button to appear. Includes an on/off switch for alerts.
// @author       You
// @match        *://*.fritz.box/* 
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const alertsEnabled = false; // Set to true to enable alerts

    window.addEventListener('load', () => {
        if (alertsEnabled) {
            alert('Page loaded. Checking for submit button...');
        }

        const checkForButton = () => {
            const submitButton = document.getElementById('uiMainApply');

            if (submitButton) {
                if (alertsEnabled) {
                    alert('Submit button found. Listening for Enter key...');
                }

                document.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        if (alertsEnabled) {
                            alert('Submitting form...');
                        }
                        submitButton.click();
                    }
                });

                if (alertsEnabled) {
                    alert('Script finished initialization.');
                }
                return true; // Button found, stop checking
            } else {
                return false; // Button not found, continue checking
            }
        };

        const checkInterval = setInterval(() => {
            if (checkForButton()) {
                clearInterval(checkInterval); // Stop checking after button is found
            }
        }, 2000); // Check every 2 seconds

    });

    if (alertsEnabled) {
        alert('Script finished execution.');
    }
})();
