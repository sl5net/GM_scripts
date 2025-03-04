// ==UserScript==
// @name     GM li infoBanner - Three with Links
// @namespace    https://lichess.org/
// @version  1.8
// @description  Displays three rotating infoBanners with text and image support, clickable links, sticky support - Corrected for Array Structure
// @match        https://lichess.org/*
// @grant    none
// ==/UserScript==

(function() {
  const infoBannerItems = [
    { type: 'text', content: "Spiele live mit Zuschauern", sticky: false },
    { type: 'text', content: "Programmiergutschein-Auktion: Ab 1 Euro bieten! ebay.de/itm/256841735120", sticky: true },
    { type: 'text', content: "Unterstütze den Stream: https://ko-fi.com/plango", sticky: false },
    { type: 'text', content: "Folge uns auf Twitch seeh74 twitch.tv/seeh74", sticky: false },
    { type: 'image', content: "https://static-cdn.jtvnw.net/jtv_user_pictures/5b42cd05-7628-463f-b353-88382a673eb7-profile_banner-480.png", sticky: false }
  ];

  const baseStyle = `
    position: fixed;
    background-color: #C02942;
    color: white;
    text-align: left;
    padding: 5px;
    font-size: 14px;
    z-index: 9999;
    pointer-events: auto; /* Enable clicking */
    width: 200px;
    overflow: hidden;
  `;

  const topLeftStyle = `${baseStyle}
    top: 50px;
    left: 10px;
  `;

  const bottomLeftStyle = `${baseStyle}
    bottom: 50px;
    left: 10px;
  `;

  const centerLeftStyle = `${baseStyle}
    top: 40%;
    left: 10px;
  `;

  // Create the infoBanner elements
  const topLeftDiv = document.createElement('div');
  topLeftDiv.style.cssText = topLeftStyle;

  const bottomLeftDiv = document.createElement('div');
  bottomLeftDiv.style.cssText = bottomLeftStyle;

  const centerLeftDiv = document.createElement('div');
  centerLeftDiv.style.cssText = centerLeftStyle;

  // Function to convert URLs to links
  function linkify(text) {
    const urlRegex = /(https?:\/\/|www\.)?[^\s/$.?#].[^\s]*/gi;
    return text.replace(urlRegex, function(url) {
      let fixedUrl = url;
      if (!url.startsWith('https://') && !url.startsWith('http://')) {
        fixedUrl = 'https://' + url;
      }
      return '<a href="' + fixedUrl + '" target="_blank" style="color:white;">' + url + '</a>';
    });
  }

  function updateInfoBanner(element, item) {
    // Remove existing content
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }

    if (item.type === 'text') {
      element.innerHTML = linkify(item.content); // Use innerHTML
    } else if (item.type === 'image') {
      const img = document.createElement('img');
      img.src = item.content;
      img.style.maxWidth = '100%';
      img.style.maxHeight = '75px';
      img.style.display = 'block';
      img.style.objectFit = 'contain';
      element.appendChild(img);
    }
  }

  function updateAllInfoBanners() {
    let availableItems = infoBannerItems.filter(item => !item.sticky);

    const stickyItem = infoBannerItems.find(item => item.sticky);
    updateInfoBanner(centerLeftDiv, stickyItem);

    let randomIndexTopLeft = Math.floor(Math.random() * availableItems.length);
        let topLeftItem = availableItems[randomIndexTopLeft];
        updateInfoBanner(topLeftDiv, topLeftItem);

    let randomIndexBottomLeft = Math.floor(Math.random() * availableItems.length);
        let bottomLeftItem = availableItems[randomIndexBottomLeft];
        updateInfoBanner(bottomLeftDiv, bottomLeftItem);

  }

  // Initial text
  updateAllInfoBanners();

  // Update the text every X seconds (e.g., 30 seconds)
  setInterval(updateAllInfoBanners, 30000); // 30000 milliseconds = 30 seconds

  // Append the infoBanners to the body
  document.body.appendChild(topLeftDiv);
  document.body.appendChild(bottomLeftDiv);
  document.body.appendChild(centerLeftDiv);
})();
