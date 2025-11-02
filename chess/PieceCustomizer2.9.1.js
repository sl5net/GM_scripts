// ==UserScript==
// @name         Lichess Piece Customizer 2.9.1 (Features Restored & Custom Pawns)
// @namespace    https://lichess.org/
// @version      2.9.1
// @description  Replaces chess pieces with custom images, including color-specific pawns for the player. Restored greeting and last-move-highlighting features.
// @match        https://lichess.org/*
// @match        https://chessitout.com/*
// @grant        none

// @description  **Functionality:**
// @description  - Replaces chess piece images with custom images specified via URL parameters.
// @description  - Adds color-specific custom pawn images for the player (white/black).
// @description  - Adds a "Kürzel-Hilfe" button to the top navigation bar to explain the parameters.
// @description  - Restored: Detailed greeting logic that messages the opponent only in the first game.
// @description  - Restored: Highlights the squares of the last move in red.
// @description  - Supports all major pieces for both player and opponent.
// @description  - Robustly handles Lichess's performance optimizations (DOM recycling).

// @description  **URL Parameters:**
// @description  - `k`, `q`, `r`, `b`, `n`: URLs for your king, queen, rook, bishop, knight.
// @description  - `ok`, `oq`, `or`, `ob`, `on`: URLs for opponent's pieces.
// @description  - `p`: A string of characters to enable parameters (e.g., `p=kqrnb`).
// @description  - `demo=1`, `demo=2`, `demo=3`: Load preset image configurations.
// ==/UserScript==


(function() {
    'use strict';

    const DEBUG = true;

    if (DEBUG) console.log("Lichess Piece Customizer script running!");

    const STORAGE_KEY_URL_PARAMS = 'lichess_piece_customizer_params';
    const STORAGE_KEY_GREETED_USERS_LEGACY = '011417greetedUsers';

    // --- Standard-Bilder ---
    const DEFAULT_PLAYER_KING_URL = 'https://static-cdn.jtvnw.net/jtv_user_pictures/67dcc3a8-669c-4670-96d1-0ad3728c3adb-profile_image-70x70.png';
    const DEFAULT_PLAYER_QUEEN_URL = 'https://sl5.de/wp-content/uploads/2025/06/SL5-Queen-wordpress-extra-2025-0610-0623-2.svg';
    const DEFAULT_OPPONENT_QUEEN_URL = 'https://svgsilh.com/svg/1598266.svg';
    const DEFAULT_ROOK_URL = 'https://as2.ftcdn.net/v2/jpg/02/05/85/31/1000_F_205853174_6A2n536iT6H23n5j2FmhD2Q5iSjKkYpU.jpg';
    const DEFAULT_BISHOP_URL = 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg';
    const DEFAULT_BISHOP_URL = 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg';
    const DEFAULT_KNIGHT_URL = 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg';

    // --- Eigene Bauern-Bilder ---
    const DEFAULT_black_pawn_URL = 'https://lichess1.org/assets/hashed/bP.ad1b22a2.svg';
    const DEFAULT_white_pawn = 'https://lichess1.org/assets/hashed/wP.57e8a40d.svg';

    // --- Demo URLs (Path is ignored, only params are used) ---
    const DEMO_BASE_URL = 'https://lichess.org/anygame';
    const DEMO_URL_1 = `${DEMO_BASE_URL}?k=https://i.imgur.com/iC5KiE0.jpg&oq=${DEFAULT_PLAYER_QUEEN_URL}&p=koq`;
    const DEMO_URL_2 = `${DEMO_BASE_URL}?k=https://i.imgur.com/iC5KiE0.jpg&oq=${DEFAULT_PLAYER_QUEEN_URL}&ok=https://static-cdn.jtvnw.net/jtv_user_pictures/40c1cb9b-d351-45f1-a092-24e6da4758b9-profile_image-70x70.png&p=koqok`;
    const DEMO_URL_3 = `${DEMO_BASE_URL}?k=https://i.imgur.com/iC5KiE0.jpeg&q=https://sl5.de/wp-content/uploads/2025/06/SL5-Queen-wordpress-extra-2025-0610-0623-2.svg&r=https://svgsilh.com/svg/2780699.svg&b=https://svgsilh.com/svg/308657.svg&n=https://www.emojiall.com/images/240/telegram/1f998.gif&oq=${DEFAULT_OPPONENT_QUEEN_URL}&p=kqrnboq`;

    // This needs to run before the main() function on page load.
    handleDemos();

    window.addEventListener("load", main, false);

    function main() {
        const positiveRegex = new RegExp(`\.org\/[^@]*$`);
        const negativeRegex = new RegExp(`\.org\/(?:@|learn|study|coordinate|practice|inbox|team|forum|broadcast|streamer|video|player|patron|paste|account|insights)[^\/]*`);
        if (!positiveRegex.test(window.location.href) || negativeRegex.test(window.location.href)) {
            return;
        }

        createShowParamsButton();
        initializeLastMoveHighlighter();

        const urlParams = new URLSearchParams(window.location.search);
        const storedParams = loadAndMergeUrlParameters(urlParams);

        const pieceConfig = {
            player: {
                king: { param: 'k', url: storedParams.get('k') || DEFAULT_PLAYER_KING_URL, enabled: false, type: 'king' },
 queen: { param: 'q', url: storedParams.get('q') || DEFAULT_PLAYER_QUEEN_URL, enabled: false, type: 'queen' },
 rook: { param: 'r', url: storedParams.get('r') || DEFAULT_ROOK_URL, enabled: false, type: 'rook' },
 bishop: { param: 'b', url: storedParams.get('b') || DEFAULT_BISHOP_URL, enabled: false, type: 'bishop' },
 knight: { param: 'n', url: storedParams.get('n') || DEFAULT_KNIGHT_URL, enabled: false, type: 'knight' },
            },
            opponent: {
                king: { param: 'ok', url: storedParams.get('ok') || '', enabled: false, type: 'king' },
 queen: { param: 'oq', url: storedParams.get('oq') || DEFAULT_OPPONENT_QUEEN_URL, enabled: false, type: 'queen' },
 rook: { param: 'or', url: storedParams.get('or') || DEFAULT_ROOK_URL, enabled: false, type: 'rook' },
 bishop: { param: 'ob', url: storedParams.get('ob') || DEFAULT_BISHOP_URL, enabled: false, type: 'bishop' },
 knight: { param: 'on', url: storedParams.get('on') || DEFAULT_KNIGHT_URL, enabled: false, type: 'knight' },
            }
        };

        setPieceReplacementFlags(pieceConfig, storedParams);
        const greetingMessage = storedParams.get('hi');
        observeBoardAndApplyChanges(pieceConfig, greetingMessage);
    }

    function handleDemos() {
        const url = new URL(window.location.href);
        const currentDemoParam = url.searchParams.get('demo');
        if (!currentDemoParam) return;

        let demoUrlToUse;
        if (currentDemoParam === '1') demoUrlToUse = DEMO_URL_1;
        else if (currentDemoParam === '2') demoUrlToUse = DEMO_URL_2;
        else if (currentDemoParam === '3') demoUrlToUse = DEMO_URL_3;
        else return;

        const demoParams = new URL(demoUrlToUse).search; // Gets the full "?k=...&p=..." string
        // If the URL already has the correct demo parameters, do nothing to prevent a reload loop.
        if (url.search === demoParams) return;

        // Build the new URL by combining the current game's path with the demo parameters.
        const newUrl = url.pathname + demoParams;
        window.location.href = newUrl; // Redirect to apply the parameters. The script will run again on the new page.
    }

    // Implementierungen der unveränderten Funktionen
    function initializeLastMoveHighlighter() { const style = document.createElement('style'); style.innerHTML = `cg-board square.last-move { background-color: rgba(255, 0, 0, 0.5) !important; }`; document.head.appendChild(style); }
    function greetOpponent(userName, greetingParam) { if (DEBUG) console.log("greetUser called with userName:", userName); if (!userName) return false; let greetingText = greetingParam; if (!greetingText) { greetingText = 'Hi ' + userName + ". When not moving pieces, I build SL5 Aura on GitHub: free offline voice control for your PC. Have fun. " + new Date().toLocaleString('de-DE', { month: 'long', year: 'numeric' }); } const inputField = document.querySelector('.mchat__say'); const chatMessages = document.querySelectorAll('.mchat__messages li'); if (!inputField || chatMessages.length > 0) return; if (inputField.value.trim() === '') { let itsFirstGame = document.querySelector('.crosstable__score').innerHTML === '<span>0</span><span>0</span>'; let remember = false; const greetedUsers = JSON.parse(localStorage.getItem(STORAGE_KEY_GREETED_USERS_LEGACY) || "{}"); const hasBeenGreeted = greetedUsers[userName] && greetedUsers[userName] > Date.now() - 31536000000; if (itsFirstGame && !hasBeenGreeted) { if (DEBUG) console.log("Sending detailed greeting to", userName); } else { greetingText = "Good luck, have fun"; if (DEBUG) console.log("Sending short greeting to", userName); } inputField.value = greetingText; remember = true; const enterKeyEvent = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' }); if (!window.location.href.includes("test=greet")) { inputField.dispatchEvent(enterKeyEvent); } if (DEBUG) console.log("Enter key dispatched"); if (remember) { greetedUsers[userName] = Date.now(); localStorage.setItem(STORAGE_KEY_GREETED_USERS_LEGACY, JSON.stringify(greetedUsers)); if (DEBUG) console.log("User greeted and timestamp stored in localStorage"); } } }
    function showParameterHelp() { const helpText = `--- Kürzel für URL-Parameter ---\n\nDu kannst die Figuren über die URL anpassen.\n\nDEINE FIGUREN:\n  k: König (King)\n  q: Dame (Queen)\n  r: Turm (Rook)\n  b: Läufer (Bishop)\n  n: Springer (Knight)\n\nGEGNERISCHE FIGUREN:\n  ok: Gegner-König\n  oq: Gegner-Dame\n  or: Gegner-Turm\n  ob: Gegner-Läufer\n  on: Gegner-Springer\n\nSTEUERUNG:\n  p: Aktiviert die Parameter (z.B. p=kqrnb)\n  hi: Grußnachricht\n\nBEISPIEL:\n...lichess.org/GAME_ID?n=bild_url&p=n`; alert(helpText.trim()); }
    function createShowParamsButton() { if (document.getElementById('show-params-help-button')) { return; } const topBarButtons = document.querySelector('#top .site-buttons'); if (topBarButtons) { const helpButton = document.createElement('button'); helpButton.id = 'show-params-help-button'; helpButton.textContent = 'Kürzel-Hilfe'; helpButton.style.cssText = 'margin-left: 12px; padding: 6px; border-radius: 4px; background: #333; color: #ccc; border: 1px solid #555; cursor: pointer;'; helpButton.addEventListener('click', showParameterHelp); topBarButtons.appendChild(helpButton); } }
    function loadAndMergeUrlParameters(currentUrlParams) { const storedParamsString = localStorage.getItem(STORAGE_KEY_URL_PARAMS); const storedParams = storedParamsString ? new URLSearchParams(storedParamsString) : new URLSearchParams(); currentUrlParams.forEach((value, key) => { if (value === '') { storedParams.delete(key); } else { storedParams.set(key, value); const pieceParamKeys = ['k', 'q', 'r', 'b', 'n', 'ok', 'oq', 'or', 'ob', 'on', 'hi']; if (pieceParamKeys.includes(key)) { let enabledParams = storedParams.get('p') || ''; if (!enabledParams.includes(key)) { storedParams.set('p', enabledParams + key); } } } }); localStorage.setItem(STORAGE_KEY_URL_PARAMS, storedParams.toString()); return storedParams; }
    function setPieceReplacementFlags(pieceConfig, params) { const enabledParams = params.get('p') || ''; for (const playerType in pieceConfig) { for (const pieceType in pieceConfig[playerType]) { const piece = pieceConfig[playerType][pieceType]; if (enabledParams.includes(piece.param)) { piece.enabled = true; } } } }
    function applyCustomImage(element, imageUrl) { if (!element) return; const desiredBgImage = `url("${imageUrl}")`; if (element.style.backgroundImage !== desiredBgImage) { element.style.backgroundImage = desiredBgImage; element.style.backgroundSize = 'contain'; element.style.backgroundPosition = 'center'; element.style.backgroundRepeat = 'no-repeat'; } }
    function resetCustomImage(element) { if (!element) return; if (element.style.backgroundImage) { element.style.backgroundImage = ''; } }
    function observeBoardAndApplyChanges(pieceConfig, greetingMessage) { let hasGreeted = false; setInterval(() => { replacePieceImages(pieceConfig); if (!hasGreeted) { try { const boardWrapper = document.querySelector('.cg-wrap'); if(boardWrapper) { const playerColor = boardWrapper.classList.contains('orientation-black') ? 'black' : 'white'; const opponentNameElement = document.querySelector(`.game__meta__players .player:not(.${playerColor}) a.user-link`); if (opponentNameElement) { const opponentName = opponentNameElement.textContent.trim().split(' ')[0]; greetOpponent(opponentName, greetingMessage); hasGreeted = true; } } } catch (e) { if(DEBUG) console.error("Error trying to greet opponent:", e); hasGreeted = true; } } }, 500); }

    function replacePieceImages(pieceConfig) {
        const boardWrapper = document.querySelector('.cg-wrap');
        if (!boardWrapper) return;
        const playerColor = boardWrapper.classList.contains('orientation-black') ? 'black' : 'white';
        const opponentColor = playerColor === 'black' ? 'white' : 'black';
        const allPiecesOnBoard = document.querySelectorAll('cg-board piece');

        allPiecesOnBoard.forEach(pieceElement => {
            let isCustomized = false;

            if (pieceElement.classList.contains(playerColor)) {
                if (pieceElement.classList.contains('pawn')) {
                    const pawnUrl = (playerColor === 'white') ? DEFAULT_white_pawn : DEFAULT_black_pawn_URL;
                    applyCustomImage(pieceElement, pawnUrl);
                    isCustomized = true;
                } else {
                    for (const pieceType in pieceConfig.player) {
                        const config = pieceConfig.player[pieceType];
                        if (config.enabled && config.url && pieceElement.classList.contains(config.type)) {
                            applyCustomImage(pieceElement, config.url);
                            isCustomized = true;
                            break;
                        }
                    }
                }
            } else if (pieceElement.classList.contains(opponentColor)) {
                for (const pieceType in pieceConfig.opponent) {
                    const config = pieceConfig.opponent[pieceType];
                    if (config.enabled && config.url && pieceElement.classList.contains(config.type)) {
                        applyCustomImage(pieceElement, config.url);
                        isCustomized = true;
                        break;
                    }
                }
            }

            if (!isCustomized) {
                resetCustomImage(pieceElement);
            }
        });
    }



})();
