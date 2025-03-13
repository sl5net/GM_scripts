// ==UserScript==
// @name         GM nebenan Image Removal
// @version      2.2
// @description  removes images - not Advertisements (this cannot! remove Remove Advertisements)
// @match        https://nebenan.de/*
// @match        https://*.nebenan.de/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // CSS styles to aggressively hide images within ad structures
    const style = document.createElement('style');
    style.textContent = `
        /* General rule to hide images */
        img {
            display: none !important;
        }

        /* General rule to hide background images */
        *[style*="background-image"] {
            background-image: none !important;
        }

        /* Target images within advertisement links */
        a[href*="delivery.nebenan.de"] img {
            display: none !important;
        }

        /* Target images within elements with specific classes related to ads */
        .c-feed_item img,
        .c-feed_item *[style*="background-image"],
        .c-feed_list-item img,
        .c-feed_list-item *[style*="background-image"] {
            display: none !important;
            background-image: none !important;
        }
    `;

    // Function to remove images and inject the style tag
    function removeAdImages() {
        document.head.appendChild(style);
        console.log("Advertisement images removed from nebenan.de");
    }

    // Apply removal on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeAdImages);
    } else {
        removeAdImages();
    }

    // Observe for dynamically loaded images
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Apply aggressive rules on dynamically loaded content
                        if (node.matches('a[href*="delivery.nebenan.de"] img') || node.matches('.c-feed_item img') || node.matches('.c-feed_list-item img') || (node.hasAttribute('style') && node.getAttribute('style').includes('background-image'))) {
                            console.log("Dynamically loaded advertisement image(s) detected.  Applying removal.");
                            removeAdImages();
                        }
                    }
                });
            }
        });
    });

    // Configuration of the observer
    const config = { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'src', 'class'] };

    // Start observing the document body
    observer.observe(document.body, config);
})();
