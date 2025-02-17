// ==UserScript==
// @name     GM LL persona dont work
// @namespace    https://wildfiregames.com/forum/
// @version  1.1
// @description  Greasemonkey wildfiregames, runs on LL persona pages and redirects. Checks URL every 2 seconds.
// @match   https://www.linkedin.com/*
// @grant    none
// ==/UserScript==

// https://www.linkedin.com/verify/identity/persona/start/?entryPoint=selfview_topcard&platform=DESKTOP&referrer=verify_hub_redirect
// ich habe keinen Reisepass. Und ich brauche auch keinen. Mir reicht ein Persolanlausweis. Aber es will einen. Also für mich nutzlos. Erfüllt seinen Zweck der identitication nicht.
// I don't have a passport. And I don't need one. But it wants one. An identity card is enough for me. So it's useless for me. It doesn't fulfill its purpose of identification.

(function() {
    // Target URL
    const targetURL = 'https://social.tchncs.de/home';

    // Function to perform the redirect if the URL matches
    function checkAndRedirect() {
        const currentURL = window.location.href;

        if (currentURL.startsWith('https://www.linkedin.com/verify/identity/persona/start') ||
            currentURL.startsWith('https://www.linkedin.com/verify/identity/persona') ||
            currentURL.startsWith('https://www.linkedin.com/verify/identity')) {

            if (window.location.href !== targetURL) { // Avoid redirect loop
              window.location.href = targetURL;
              clearInterval(intervalId); // Stop checking after redirection.  Important!
            } else {
                console.log("Already at target URL, not redirecting.");
                clearInterval(intervalId);
            }


        } else {
          //  console.log("Not on a target URL, current URL: " + currentURL); // useful for debugging but spammy
        }
    }

    // Initial check in case the page is already on the target URL when the script loads.
    checkAndRedirect();

    // Set up an interval to check the URL every 2 seconds (2000 milliseconds)
    const intervalId = setInterval(checkAndRedirect, 2000); // Store the interval ID
})();
