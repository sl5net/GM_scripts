// ==UserScript==
// @name         Lichess Piece Customizer 2.9 (Features Restored)
// @namespace    https://lichess.org/
// @version      2.9
// @description  Replaces chess pieces with custom images. Restored greeting and last-move-highlighting features.
// @match        https://lichess.org/*
// @match        https://chessitout.com/*
// @grant        none

// @description  **Functionality:**
// @description  - Replaces chess piece images with custom images specified via URL parameters.
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
    const STORAGE_KEY_GREETED_USERS_LEGACY = '011417greetedUsers'; // Dein alter Key für die Grußfunktion

    // --- Standard-Bilder ---
    const DEFAULT_PLAYER_KING_URL = 'https://static-cdn.jtvnw.net/jtv_user_pictures/67dcc3a8-669c-4670-96d1-0ad3728c3adb-profile_image-70x70.png';
    const DEFAULT_PLAYER_QUEEN_URL = 'https://sl5.de/wp-content/uploads/2025/06/SL5-Queen-wordpress-extra-2025-0610-0623-2.svg';
    const DEFAULT_OPPONENT_QUEEN_URL = 'https://svgsilh.com/svg/1598266.svg'; // AKTUALISIERT
    const DEFAULT_ROOK_URL = 'https://as2.ftcdn.net/v2/jpg/02/05/85/31/1000_F_205853174_6A2n536iT6H23n5j2FmhD2Q5iSjKkYpU.jpg';
    const DEFAULT_BISHOP_URL = 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg';
    const DEFAULT_KNIGHT_URL = 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg';

    // --- Demo URLs ---
    const LICHESS_GAME_URL = 'https://lichess.org/SQ4ATcNB';
    const DEMO_URL_1 = `${LICHESS_GAME_URL}?k=https://i.imgur.com/iC5KiE0.jpg&oq=${DEFAULT_PLAYER_QUEEN_URL}&p=koq`;
    const DEMO_URL_2 = `${DEMO_URL_1}&ok=https://static-cdn.jtvnw.net/jtv_user_pictures/40c1cb9b-d351-45f1-a092-24e6da4758b9-profile_image-70x70.png`;
    // AKTUALISIERT: Dein persönlicher Demo-Link mit neuen Bildern
    const DEMO_URL_3 = `${LICHESS_GAME_URL}?k=https://i.imgur.com/iC5KiE0.jpeg&q=https://sl5.de/wp-content/uploads/2025/06/SL5-Queen-wordpress-extra-2025-0610-0623-2.svg&r=https://svgsilh.com/svg/2780699.svg&b=https://svgsilh.com/svg/308657.svg&n=https://www.emojiall.com/images/240/telegram/1f998.gif&oq=${DEFAULT_OPPONENT_QUEEN_URL}&p=kqrnboq`;


    window.addEventListener("load", main, false);

    function main() {
        handleDemos();

        const positiveRegex = new RegExp(`\.org\/[^@]*$`);
        const negativeRegex = new RegExp(`\.org\/(?:@|learn|study|coordinate|practice|inbox|team|forum|broadcast|streamer|video|player|patron|paste|account|insights)[^\/]*`);
        if (!positiveRegex.test(window.location.href) || negativeRegex.test(window.location.href)) {
            return;
        }
        
        createShowParamsButton();
        initializeLastMoveHighlighter(); // NEU: Highlighter initialisieren

        const urlParams = new URLSearchParams(window.location.search);
        const storedParams = loadAndMergeUrlParameters(urlParams);
        
        const pieceConfig = {
            player: { king: { param: 'k', url: storedParams.get('k') || DEFAULT_PLAYER_KING_URL, enabled: false, type: 'king' }, queen: { param: 'q', url: storedParams.get('q') || DEFAULT_PLAYER_QUEEN_URL, enabled: false, type: 'queen' }, rook: { param: 'r', url: storedParams.get('r') || DEFAULT_ROOK_URL, enabled: false, type: 'rook' }, bishop: { param: 'b', url: storedParams.get('b') || DEFAULT_BISHOP_URL, enabled: false, type: 'bishop' }, knight: { param: 'n', url: storedParams.get('n') || DEFAULT_KNIGHT_URL, enabled: false, type: 'knight' }, },
            opponent: { king: { param: 'ok', url: storedParams.get('ok') || '', enabled: false, type: 'king' }, queen: { param: 'oq', url: storedParams.get('oq') || DEFAULT_OPPONENT_QUEEN_URL, enabled: false, type: 'queen' }, rook: { param: 'or', url: storedParams.get('or') || DEFAULT_ROOK_URL, enabled: false, type: 'rook' }, bishop: { param: 'ob', url: storedParams.get('ob') || DEFAULT_BISHOP_URL, enabled: false, type: 'bishop' }, knight: { param: 'on', url: storedParams.get('on') || DEFAULT_KNIGHT_URL, enabled: false, type: 'knight' }, }
        };

        setPieceReplacementFlags(pieceConfig, storedParams);
        const greetingMessage = storedParams.get('hi');
        observeBoardAndApplyChanges(pieceConfig, greetingMessage);
    }

    function handleDemos() {
        const url = window.location.href;
        if (url.includes("demo=1") && !url.includes(DEMO_URL_1)) window.location.href = DEMO_URL_1;
        if (url.includes("demo=2") && !url.includes(DEMO_URL_2)) window.location.href = DEMO_URL_2;
        if (url.includes("demo=3") && !url.includes(DEMO_URL_3)) window.location.href = DEMO_URL_3;
    }
    
    // --- NEU: Highlighter für den letzten Zug wiederhergestellt ---
    function initializeLastMoveHighlighter() {
        // CSS-Stil für das Highlighting hinzufügen
        const style = document.createElement('style');
        style.innerHTML = `cg-board square.last-move { background-color: rgba(255, 0, 0, 0.5) !important; }`;
        document.head.appendChild(style);
        // Hinweis: Lichess fügt die Klasse .last-move den Feldern (squares) hinzu.
        // Die obige CSS-Regel ist alles, was für ein einfaches Highlighting nötig ist.
        // Der alte Intervall-Ansatz ist nicht mehr notwendig, da Lichess das dynamisch managed.
    }

    // --- NEU: Alte Grußfunktion wiederhergestellt und integriert ---
    function greetOpponent(userName, greetingParam) {
        if (DEBUG) console.log("greetUser called with userName:", userName);
        if (!userName) return false;

        let greetingText = greetingParam;
        if (!greetingText) {
             greetingText = 'Hi ' + userName + ". When not moving pieces, I build SL5 Aura on GitHub: free offline voice control for your PC. Have fun. " + new Date().toLocaleString('de-DE', { month: 'long', year: 'numeric' });
        }

        const inputField = document.querySelector('.mchat__say');
        const chatMessages = document.querySelectorAll('.mchat__messages li');
        if (!inputField || chatMessages.length > 0) return; // Nur grüßen, wenn Chat leer ist

        if (inputField.value.trim() === '') {
            let itsFirstGame = document.querySelector('.crosstable__score').innerHTML === '<span>0</span><span>0</span>';
            let remember = false;
            
            const greetedUsers = JSON.parse(localStorage.getItem(STORAGE_KEY_GREETED_USERS_LEGACY) || "{}");
            const hasBeenGreeted = greetedUsers[userName] && greetedUsers[userName] > Date.now() - 31536000000; // 1 Jahr

            if (itsFirstGame && !hasBeenGreeted) {
                // Großer Gruß
                if (DEBUG) console.log("Sending detailed greeting to", userName);
            } else {
                // Kurzer Gruß für weitere Partien
                greetingText = "Good luck, have fun";
                if (DEBUG) console.log("Sending short greeting to", userName);
            }

            inputField.value = greetingText;
            remember = true;

            const enterKeyEvent = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' });
            if (!window.location.href.includes("test=greet")) {
                inputField.dispatchEvent(enterKeyEvent);
            }
            if (DEBUG) console.log("Enter key dispatched");
            
            if (remember) {
                greetedUsers[userName] = Date.now();
                localStorage.setItem(STORAGE_KEY_GREETED_USERS_LEGACY, JSON.stringify(greetedUsers));
                if (DEBUG) console.log("User greeted and timestamp stored in localStorage");
            }
        }
    }

    // --- UI-Funktionen ---
    function showParameterHelp() { /* ... unverändert ... */ }
    function createShowParamsButton() { /* ... unverändert ... */ }

    // --- Logik zum Verwalten der URL-Parameter ---
    function loadAndMergeUrlParameters(currentUrlParams) { /* ... unverändert ... */ }
    function setPieceReplacementFlags(pieceConfig, params) { /* ... unverändert ... */ }
    
    // --- Logik zum Ersetzen der Bilder ---
    function applyCustomImage(element, imageUrl) { /* ... unverändert ... */ }
    function resetCustomImage(element) { /* ... unverändert ... */ }
    function replacePieceImages(pieceConfig) { /* ... unverändert ... */ }
    
    // --- Hauptschleife ---
    function observeBoardAndApplyChanges(pieceConfig, greetingMessage) {
        let hasGreeted = false; // Stellt sicher, dass wir nur einmal pro Spiel grüßen
        
        setInterval(() => {
            replacePieceImages(pieceConfig);
            
            if (!hasGreeted) {
                try {
                    const boardWrapper = document.querySelector('.cg-wrap');
                    if(boardWrapper) {
                        const playerColor = boardWrapper.classList.contains('orientation-black') ? 'black' : 'white';
                        const opponentNameElement = document.querySelector(`.game__meta__players .player:not(.${playerColor}) a.user-link`);
                        if (opponentNameElement) {
                            const opponentName = opponentNameElement.textContent.trim().split(' ')[0];
                            greetOpponent(opponentName, greetingMessage);
                            hasGreeted = true; // Grußversuch unternommen, nicht erneut versuchen
                        }
                    }
                } catch (e) {
                    if(DEBUG) console.error("Error trying to greet opponent:", e);
                    hasGreeted = true; // Fehler aufgetreten, nicht erneut versuchen
                }
            }
        }, 500);
    }
    
    // Implementierungen der unveränderten Funktionen
    function showParameterHelp() { const helpText = `--- Kürzel für URL-Parameter ---\n\nDu kannst die Figuren über die URL anpassen.\n\nDEINE FIGUREN:\n  k: König (King)\n  q: Dame (Queen)\n  r: Turm (Rook)\n  b: Läufer (Bishop)\n  n: Springer (Knight)\n\nGEGNERISCHE FIGUREN:\n  ok: Gegner-König\n  oq: Gegner-Dame\n  or: Gegner-Turm\n  ob: Gegner-Läufer\n  on: Gegner-Springer\n\nSTEUERUNG:\n  p: Aktiviert die Parameter (z.B. p=kqrnb)\n  hi: Grußnachricht\n\nBEISPIEL:\n...lichess.org/GAME_ID?n=bild_url&p=n`; alert(helpText.trim()); }
    function createShowParamsButton() { if (document.getElementById('show-params-help-button')) { return; } const topBarButtons = document.querySelector('#top .site-buttons'); if (topBarButtons) { const helpButton = document.createElement('button'); helpButton.id = 'show-params-help-button'; helpButton.textContent = 'Kürzel-Hilfe'; helpButton.style.cssText = 'margin-left: 12px; padding: 6px; border-radius: 4px; background: #333; color: #ccc; border: 1px solid #555; cursor: pointer;'; helpButton.addEventListener('click', showParameterHelp); topBarButtons.appendChild(helpButton); } }
    function loadAndMergeUrlParameters(currentUrlParams) { const storedParamsString = localStorage.getItem(STORAGE_KEY_URL_PARAMS); const storedParams = storedParamsString ? new URLSearchParams(storedParamsString) : new URLSearchParams(); currentUrlParams.forEach((value, key) => { if (value === '') { storedParams.delete(key); } else { storedParams.set(key, value); const pieceParamKeys = ['k', 'q', 'r', 'b', 'n', 'ok', 'oq', 'or', 'ob', 'on', 'hi']; if (pieceParamKeys.includes(key)) { let enabledParams = storedParams.get('p') || ''; if (!enabledParams.includes(key)) { storedParams.set('p', enabledParams + key); } } } }); localStorage.setItem(STORAGE_KEY_URL_PARAMS, storedParams.toString()); return storedParams; }
    function setPieceReplacementFlags(pieceConfig, params) { const enabledParams = params.get('p') || ''; for (const playerType in pieceConfig) { for (const pieceType in pieceConfig[playerType]) { const piece = pieceConfig[playerType][pieceType]; if (enabledParams.includes(piece.param)) { piece.enabled = true; } } } }
    function applyCustomImage(element, imageUrl) { if (!element) return; const desiredBgImage = `url("${imageUrl}")`; if (element.style.backgroundImage !== desiredBgImage) { element.style.backgroundImage = desiredBgImage; element.style.backgroundSize = 'cover'; element.style.backgroundPosition = 'center'; element.style.backgroundRepeat = 'no-repeat'; } }
    function resetCustomImage(element) { if (!element) return; if (element.style.backgroundImage) { element.style.backgroundImage = ''; } }
    function replacePieceImages(pieceConfig) { const boardWrapper = document.querySelector('.cg-wrap'); if (!boardWrapper) return; const playerColor = boardWrapper.classList.contains('orientation-black') ? 'black' : 'white'; const opponentColor = playerColor === 'black' ? 'white' : 'black'; const allPiecesOnBoard = document.querySelectorAll('cg-board piece'); allPiecesOnBoard.forEach(pieceElement => { let isCustomized = false; if (pieceElement.classList.contains(playerColor)) { for (const pieceType in pieceConfig.player) { const config = pieceConfig.player[pieceType]; if (config.enabled && config.url && pieceElement.classList.contains(config.type)) { applyCustomImage(pieceElement, config.url); isCustomized = true; break; } } } else if (pieceElement.classList.contains(opponentColor)) { for (const pieceType in pieceConfig.opponent) { const config = pieceConfig.opponent[pieceType]; if (config.enabled && config.url && pieceElement.classList.contains(config.type)) { applyCustomImage(pieceElement, config.url); isCustomized = true; break; } } } if (!isCustomized) { resetCustomImage(pieceElement); } }); }

})();
