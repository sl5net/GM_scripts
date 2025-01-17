// ==UserScript==
// @name     GM LocalRatings
// @description sets your name in search box. but you stell need to bress a buttion later. in this example playername is "seeh" . when sombody ask you in a TG about your rating you can easy to check it
// @version  1
// @match   https://replay-pallas.wildfiregames.ovh/LocalRatings*
// @grant none
// ==/UserScript==

setTimeout(function() { // Wrap the main script logic in setTimeout

   
function fillSearch() {
  const i = document.getElementById("search-player-input");
  if (i) {
    i.value = "seeh";
    i.focus();
    i.selectionStart = i.selectionEnd = i.value.length;
    setTimeout(() => {
      i.dispatchEvent(new Event('input', { bubbles: true }));
      i.dispatchEvent(new Event('change', { bubbles: true })); // Try also change event
    }, 100);
    return true; // Found and filled
  }
  return false; // Not found
}

function findInputInIframes() {
  const iframes = document.querySelectorAll('iframe');
  for (const iframe of iframes) {
    try {
      if (fillSearch.call(iframe.contentDocument)) return true;
    } catch (e) { /* Ignore cross-origin errors */ }
  }
  return false;
}

const observer = new MutationObserver(() => {
  if (fillSearch() || findInputInIframes()) {
    observer.disconnect();
  }
});

observer.observe(document.body, { childList: true, subtree: true });  
  
  fillSearch();
  

}, 1000); // Delay of 1000 milliseconds (1 second)
