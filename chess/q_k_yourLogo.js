// ==UserScript==
// @name         GM li KYP replaced
// @namespace    https://lichess.org/
// @version      1.8
// @description  Replace your king and queen, opponent's queen/king, and all pawns with custom images. Also provides a greeting feature.
// @match        https://lichess.org/*
// @grant        none

// @description  **Functionality:**
// @description  - Replaces chess piece images with custom images specified via URL parameters.
// @description  - Persists these image settings across page loads using localStorage.
// @description  - Greets opponents (only once per browsing session) with a customizable message.

// @description  **Commands (URL Parameters):**
// @description  - `k`: URL of the image to replace your king.
// @description  - `q`: URL of the image to replace your queen.
// @description  - `oq`: URL of the image to replace the opponent's queen.
// @description  - `ok`: URL of the image to replace the opponent's king.
// @description  - `hi`: Customizable greeting message.
// @description  - `p`: A string of character to enable all parameters like okq. The paramente is not enabled when the own url is used
// @description  - `showGreet`: Displays the stored greeting message in an alert box.
// @description  **Demos:** Use `demo=1` or `demo=2` to load preset image configurations.

// @description  **How to use:**
// @description  1. Install a userscript manager (e.g., Tampermonkey, i use Greasmonkey).
// @description  2. Install this script.
// @description  3. Customize the piece images and greeting by adding URL parameters to the Lichess page URL.  For example:
// @description  `https://lichess.org/?k=king_image_url&q=queen_image_url&hi=Hello`
// @description  4. The settings will be saved and applied automatically on subsequent page loads.
// ==/UserScript==
var DEBUG = false;

if (DEBUG) console.log("GM li KYP replaced script running!");

window.addEventListener("load", Greasemonkey_main, false);

function Greasemonkey_main() {

    (function() {

        const url = window.location.href;
        if (DEBUG) console.log("Current URL:", url);
      
      
      	const SQ4ATcNB = 'https://lichess.org/SQ4ATcNB';
      
        const demoUrl1 = SQ4ATcNB + '?k=https://i.imgur.com/iC5KiE0.jpg&oq=https://players.chessbase.com/picture/rei00027&p=koq';
        
        const demoUrl2 = demoUrl1 + 'ok&ok=' + 'https://static-cdn.jtvnw.net/jtv_user_pictures/40c1cb9b-d351-45f1-a092-24e6da4758b9-profile_image-70x70.png';
      
        const demoUrl3 = SQ4ATcNB +  '?k=' 
        + 'https://static-cdn.jtvnw.net/jtv_user_pictures/3a67aaa5-a1eb-4375-b2b4-332a7a6b4b05-profile_image-70x70.png&q=https://duckduckgo.com/i/7c7aeb6b.jpg';
           

        if(url.includes("demo=1") && !url.includes(demoUrl1))
                window.location.href=demoUrl1;
        if(url.includes("demo=2") && !url.includes(demoUrl2))
                window.location.href=demoUrl2;
        if(url.includes("demo=3") && !url.includes(demoUrl3))
                window.location.href=demoUrl3;

        const positiveRegex = new RegExp(`\.org\/[^@]*$`);
        const negativeRegex = new RegExp(`\.org\/(?:@|lern|study|coordinate|practice|inbox|team|forum|broadcast|streamer|video|player|patron|paste|account|insights)[^\/]*`);

        if (DEBUG) console.log("positiveRegex.test(url):", positiveRegex.test(url));
        if (DEBUG) console.log("!negativeRegex.test(url):", !negativeRegex.test(url));

        if (positiveRegex.test(url) && !negativeRegex.test(url)) {
            if (DEBUG) console.log("URL matches positive regex and doesn't match negative regex.");


            const url = window.location.href;
            const urlTestGreet = 'https://lichess.org/CsBBHNdb?test=greet';
            if(url.includes("test=greet"))
                if(!url.includes(urlTestGreet))
                    window.location.href = urlTestGreet;


          
          
          
          
            let urlParams;
            urlParams = new URLSearchParams(window.location.search);
            if (DEBUG) console.log("urlParams:", urlParams);
          
          
          
if (urlParams.has('showGreet')) {
  const storedParamsString = localStorage.getItem('250109070040');
   if (storedParamsString) {
    const storedSearchParams = new URLSearchParams(storedParamsString);
        const storedGreeting = storedSearchParams.get('hi');
          if (storedGreeting) {
            alert("Stored greeting message: " + storedGreeting);
          } else {
            alert("No greeting message stored in '250109070040' localStorage.");
          }
       } else {
           alert("No greeting message stored in '250109070040' localStorage.");
       }


  // You can optionally redirect to remove the showGreet parameter
  // to prevent the alert from appearing repeatedly:
  window.location.href = window.location.href.replace(/[?&]showGreet/, '');
  return; // Stop script execution after showing the alert
}
          
          
          

            let board = null;

            const urlTrain = 'https://lichess.org/training';
            try {
                board = document.querySelector("cg-board") || document.getElementById('board-layout-chessboard');
                if (DEBUG) console.log("board (querySelector):", board);

                if (!board) {
                    const uGo = urlParams.get('u');
                    if (DEBUG) console.log("uGo (urlParams.get('u')):", uGo);
                    if (DEBUG) console.log("Redirecting to:", uGo || urlTrain);
                    window.location.href = uGo || urlTrain;
                }
            } catch (error) {
                console.log("Error 1:", error);
                if (DEBUG) console.log("Redirecting to:", urlTrain);
                window.location.href = urlTrain;
            }

            if (document.querySelector('.board-layout-chessboard')) {
                if (DEBUG) console.log("Found .board-layout-chessboard");

                const s = document.createElement('style');
                s.innerHTML = `.last-move-piece { background-color: red !important; }`;
                document.head.appendChild(s);

                let lastMoveElements = document.querySelectorAll('.last-move-piece');
                if (DEBUG) console.log("lastMoveElements:", lastMoveElements);

                let previousMove = null;

                function highlightLastMove() {
                    let newMove = document.querySelector('.chess-board .last-move');
                    if (DEBUG) console.log("newMove:", newMove);

                    if (newMove !== previousMove) {
                        if (previousMove) {
                            previousMove.classList.remove('last-move-piece');
                        }
                        if (newMove) {
                            newMove.classList.add('last-move-piece');
                        }
                        previousMove = newMove;
                    }
                }

                setInterval(highlightLastMove, 500);
            }

            let ls = localStorage;
            const KEY_URL_PARAMS = '250109070040';
            const storedParamsString = ls.getItem(KEY_URL_PARAMS);
            if (DEBUG) console.log("storedParamsString:", storedParamsString);

            let storedSearchParams;
            if (storedParamsString) {
                storedSearchParams = new URLSearchParams(storedParamsString);
                if (DEBUG) console.log("Gespeicherte urlParams gefunden:", storedSearchParams.toString());
            } else {
                storedSearchParams = new URLSearchParams();
                if (DEBUG) console.log("Keine gespeicherten urlParams gefunden.");
            }




            let k1, q1, oq1, ok1, t1, paramValue;
            if (urlParams) {
                if (DEBUG) console.log("Processing urlParams...");
                urlParams.forEach((value, key) => {
                    if (DEBUG) console.log("  Key:", key, "Value:", value);

                    if (value === '') {
                        storedSearchParams.delete(key);
                        if (DEBUG) console.log("    Deleting key from storedSearchParams:", key);
                    } else {
                        storedSearchParams.set(key, value);
                        if (DEBUG) console.log("    Setting key in storedSearchParams:", key, "Value:", value);

                        if (['k', 'hi', 'q', 'oq', 'ok'].includes(key)) { // Check if the key is one we want to process
                            let currentP = storedSearchParams.get('p') || '';
                            if (!currentP.includes(key)) {
                                storedSearchParams.set('p', currentP + key);
                                if (DEBUG) console.log("    Adding '" + key + "' to 'p' in storedSearchParams:", storedSearchParams.get('p'));
                            }
                        }
                    }
                });


                storedSearchParams.forEach((value, key) => {
                    if (!urlParams.has(key)) {
                        urlParams.set(key, value);
                        if (DEBUG) console.log("    Setting key in urlParams:", key, "Value:", value);
                    }
                });

                ls.setItem(KEY_URL_PARAMS, storedSearchParams.toString());
                if (DEBUG) console.log("    StoredSearchParams saved to localStorage:", storedSearchParams.toString());
            }


            const b = document.querySelector(".main-board");
            if (DEBUG) console.log("main-board:", b);

            let backgroundInterval;

            if (b) {
                backgroundInterval = setInterval(function() {

                    if (document.querySelector('cg-board')) {
                        const b = document.querySelector(".main-board");
                        if (b) {
                            (e => {
                                const t = document.createElement("div");
                                t.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;background-image:url('https://sl5.de/wp-content/uploads/2025/01/SL5net_logo_white_shadow_on_blue_w990.png');background-size:cover;background-position:center;opacity:0.7;z-index:-1;border-radius:inherit;`;
                                e.insertBefore(t, e.firstChild);
                            })(b.parentElement);
                            clearInterval(backgroundInterval);
                            if (DEBUG) console.log("Background code check - main board loaded and background added");
                        } else {
                            if (DEBUG) console.log("Background code check - waiting for main board");
                        }
                    } else {
                        if (DEBUG) console.log("Background code check - not a lichess board");
                        clearInterval(backgroundInterval);
                    }
                    if (DEBUG) console.log("Background code check - end");
                }, 500);

            } else {
                if (DEBUG) console.log("main-board not found, skipping background interval.");
            }

            try {
                k1 = urlParams?.get('k');
                q1 = urlParams?.get('q');
                oq1 = urlParams?.get('oq');
                ok1 = urlParams?.get('ok');
                t1 = urlParams?.get('hi');
                paramValue = urlParams?.get('p');
            } catch (error) {
                console.log("Error 4:", error);
            }

            const kingUrl = (k1) ? k1 : 'https://static-cdn.jtvnw.net/jtv_user_pictures/67dcc3a8-669c-4670-96d1-0ad3728c3adb-profile_image-70x70.png';
            const queenUrl = (q1) ? q1 : 'https://i.imgur.com/FhwFGbb.jpg';
            const opponentQueenUrl = (oq1) ? oq1 : 'https://i.imgur.com/zFHs0of.jpg';

            const opponentKingUrl = (ok1) ? ok1 : '';

            let replaceKing = true,
                replaceQueen = true,
                replaceOpponentQueen = false,
                replaceOpponentKing = false;
            if (!k1 && !paramValue.includes('k')) replaceKing = false;
            if (!q1 && !paramValue.includes('q')) replaceQueen = false;
            if (!oq1 && !paramValue.includes('oq')) replaceOpponentQueen = true;
            if (!ok1 && !paramValue.includes('ok')) replaceOpponentKing = true;

            if (DEBUG) console.log("replaceKing (initial):", replaceKing);
            if (DEBUG) console.log("replaceQueen (initial):", replaceQueen);
            if (DEBUG) console.log("replaceOpponentQueen (initial):", replaceOpponentQueen); // Log the new variable

            function greetUser(userName) {
                if (DEBUG){
                 console.log("greetUser called with userName:", userName);
                }
                if (!userName) {
                    console.log(':( !userName ');
                    console.log(':( !userName ');
                    console.log(':( !userName ');
                    console.log(':( !userName ');
                    console.log(':( !userName ');
                    console.log(':( !userName ');
                    console.log(':( !userName ');
                    console.log(':( !userName ');
                    return false;
                }
                
                let u = userName;
                
                let ty = (t1) ? t1 : 'Hi ' + userName + ', i am IT-Nerd from Universe arrived World (DE-T%C3%BCbingen ' + new Date().toLocaleString('de-DE', {
                    month: 'long',
                    year: 'numeric'
                }) + ' ) . How to make friends/projects on earth? Have fun.';

                if (DEBUG) console.log("Greeting message (ty):", ty);

                const textarea = document.querySelector('.msg-app__convo__post__text');
                const inputField = document.querySelector('.mchat__say');
                const chatMessages = document.querySelectorAll('.mchat__messages li');

                if (DEBUG) console.log("textarea:", textarea);
                if (DEBUG) console.log("inputField:", inputField);
                if (DEBUG) console.log("chatMessages:", chatMessages);


                if ((textarea && textarea.value.trim() === '') || (inputField && inputField.value.trim() === '')) {
                    let itsFirstGame = true; // Initially assume it's the first game
                    var score = document.querySelector('.crosstable__score').innerHTML;
                    if (score !== '<span>0</span><span>0</span>') {
                        if (DEBUG) console.log('not fist game');
                        let itsFirstGame = false;
                    }
                    let remember = false;
                    let doBigGreet = false;
                    
                    if (itsFirstGame && (!localStorage.getItem("011417greetedUsers") || !JSON.parse(localStorage.getItem("011417greetedUsers"))[u] || JSON.parse(localStorage.getItem("011417greetedUsers"))[u] < Date.now() - 31536000000)) {
                        doBigGreet = true;
                    } else {
                        ty = "Good luck, have fun";
                        if (DEBUG) console.log("Simplified greeting message (ty):", ty);
                    }                    
                    if(doBigGreet)
                    {
                      let storedHi = localStorage.getItem('hi'); 
                      if(storedHi)
                        ty = storedHi;
            
                    }
                    
                    
                    if (chatMessages.length === 0) {
                        if (textarea) {
                            textarea.value += ty;
                            remember = true;
                            if (DEBUG) console.log("Greeting added to textarea");
                        } else {
                            inputField.value = ty + '\n';
                            remember = true;
                            if (DEBUG) console.log("Greeting added to inputField");

                            const enterKeyEvent = new KeyboardEvent('keydown', {
                                key: 'Enter',
                                code: 'Enter'
                            });

                            // https://lichess.org/CsBBHNdb?test=greet
                            const url = window.location.href;
                            if(!url.includes("test=greet")){
                                inputField.dispatchEvent(enterKeyEvent);
                            }
                            if (DEBUG) console.log("Enter key dispatched");
                        }
                    }
                    if (remember) {
                        const g = localStorage.getItem("011417greetedUsers") ? JSON.parse(localStorage.getItem("011417greetedUsers")) : {};
                        g[userName] = Date.now();
                        localStorage.setItem("011417greetedUsers", JSON.stringify(g));
                        if (DEBUG) console.log("User greeted and timestamp stored in localStorage");
                    }
                }
            }

            if (paramValue) {
                replaceKing = paramValue.includes('k');
                replaceQueen = paramValue.includes('q');
                replaceOpponentQueen = paramValue.includes('oq');  //Check paramValue for 'o'
                replaceOpponentKing = paramValue.includes('ok');  //Check paramValue for 'o'
            }

             if (DEBUG) console.log("replaceKing (after paramValue check):", replaceKing);
             if (DEBUG) console.log("replaceQueen (after paramValue check):", replaceQueen);
             if (DEBUG) console.log("replaceOpponentQueen (after paramValue check):", replaceOpponentQueen);

            let r = true,
                o = true;
            const g = () => {
                const b = document.querySelector('.board');
                if (DEBUG) console.log(".board element:", b);
                return b ? b.classList.contains('flipped') ? 'black' : 'white' : null;
            };

            if (window.location.href.includes('chess.com')) {
                if (DEBUG) console.log("Running on chess.com");

                const c = g();
                if (DEBUG) console.log("Player color (chess.com):", c);

                if (c) {
                    const s = document.createElement('style');
                    let k = replaceKing ? 'url(' + kingUrl + ')' : '',
                        q = replaceQueen ? 'url(' + queenUrl + ')' : '';

                    if (DEBUG) console.log("King URL (chess.com):", k);
                    if (DEBUG) console.log("Queen URL (chess.com):", q);

                    s.innerHTML = `.highlight{background-color:red!important;opacity:1!important}${replaceKing ? `.${c[0]}k.piece::after{content:'';position:absolute;top:0;left:0;width:100%;height:100%;background-image:${k};background-size:cover;background-repeat:no-repeat;background-position:center}` : ''}${replaceQueen ? `.${c[0]}q.piece::after{content:'';position:absolute;top:0;left:0;width:100%;height:100%;background-image:${q};background-size:cover;background-repeat:no-repeat;background-position:center}` : ''}`;
                    document.head.appendChild(s);
                } else {
                    console.log("Could not determine player color. Style not applied.");
                }
            } else if (document.querySelector('cg-board')) {
                if (DEBUG) console.log("Running on lichess cg-board");


                function a(e, t, c) {
                    if (DEBUG) console.log("a() called with:", e, t, c);

                    if (!e || !e.classList.contains(c) || e.classList.contains('bishop')) {
                        if (DEBUG) console.log("  Element is null or doesn't have required class, returning.");
                        return;
                    }

                    e.classList.remove('black', 'white', c);
                    e.style.background = t;
                    e.style.backgroundSize = 'cover';

                    if (DEBUG) console.log("  Setting background of element:", e, "to:", t);

                    if (e.style.backgroundImage && e.style.backgroundImage.includes('https://lichess1.org/assets/_KA7qyN/piece/')) {
                        if (DEBUG) console.log(`Piece loaded for ${e.classList.value} with ${t}`);
                    } else {
                        console.log(`Piece fail ${e.classList.value} with ${t}`);
                        setTimeout(() => a(e, t, c), 100);
                    }
                }

                function p(e, c, t) {
                    if (DEBUG) console.log("p() called with:", e, c, t);

                    if (!e) {
                        if (DEBUG) console.log("  Element is null, returning.");
                        return;
                    }

                    e.forEach((el, i) => {
                        const idx = i % t.length;
                        const u = `url(https://lichess1.org/assets/_KA7qyN/piece/${t[idx]}/${c[0]}P.svg)`;
                        a(el, u, c);
                    });
                }

                function f() {
                    if (DEBUG) console.log("f() called");

                    let m, pcs = {
                        black: {
                            pawns: [],
                            king: null,
                            queen: null,
                            opponentQueen: null,
                            opponentKing: null
                        },
                        white: {
                            pawns: [],
                            king: null,
                            queen: null,
                            opponentQueen: null,
                            opponentKing: null
                        }
                    },
                        ki = replaceKing && kingUrl ? 'url(' + kingUrl + ')' : '',
                        qu = replaceQueen && queenUrl ? 'url(' + queenUrl + ')' : '',
                        oqu = replaceOpponentQueen && opponentQueenUrl ? 'url(' + opponentQueenUrl + ')' : '';
                        oku = replaceOpponentKing && opponentKingUrl ? 'url(' + opponentKingUrl + ')' : '';
                        
                    let l = document.querySelector('.puzzle__feedback.play');
                    if (l) {
                        let i = l.querySelector('.instruction em');
                        if (i) {
                            if (i.textContent.includes('black')) m = 'black';
                            else if (i.textContent.includes('white')) m = 'white'
                        }
                        if (m) {
                            if (replaceKing) pcs[m].king = document.querySelector(`.${m}.king`);
                            if (replaceQueen) pcs[m].queen = document.querySelector(`.${m}.queen`);
                            const opponentColor = m === 'black' ? 'white' : 'black';
                            if (replaceOpponentQueen) {
                                pcs[m].opponentQueen = document.querySelector(`.${opponentColor}.queen`);
                            }
                            if (replaceOpponentKing) {
                                pcs[m].opponentKing = document.querySelector(`.${opponentColor}.king`);
                            }
                        }
                    }
                    if (!m) {
                        let b = document.querySelector('.cg-wrap');
                        if (b) {
                            m = b.classList.contains('orientation-black') ? 'black' : 'white';
                            if (DEBUG) console.log("  Player color (determined from .cg-wrap):", m);
                            if (replaceKing) pcs[m].king = document.querySelector(`.${m}.king`);
                            if (replaceQueen) pcs[m].queen = document.querySelector(`.${m}.queen`);
                            const opponentColor = m === 'black' ? 'white' : 'black';
                             if (replaceOpponentQueen) {
                                 pcs[m].opponentQueen = document.querySelector(`.${opponentColor}.queen`);
                             }
                             if (replaceOpponentKing) {
                                 pcs[m].opponentKing = document.querySelector(`.${opponentColor}.king`);
                             }
                        }
                    }
                    if (m) {


                        let opponentName;
                        const getOpponentName = m => document.querySelector(`.game__meta__players .player${m === 'black' ? ':not(.black)' : ':not(.white)'} a.user-link`).textContent.trim().split(' ')[0];
                        opponentName = getOpponentName(m);
                        greetUser(opponentName);


                        const om = m === 'black' ? 'white' : 'black';
                        pcs[m].pawns = document.querySelectorAll(`.${m}.pawn`);
                        pcs[om].pawns = document.querySelectorAll(`.${om}.pawn`);

                        if (DEBUG) console.log("  Calling p() for player color", m, "pawns", pcs[m].pawns);
                        const stys = ["cburnett", "merida", "alpha", "chessnut", "chess7", "reillycraig", "companion", "riohacha", "kosal", "le Zigzag", "fantasy", "spatial", "celtic", "california", "caliente", "pixel", "maestro", "fresca", "cardinal", "gioco", "tatiana", "staunty", "cooke", "monarchy", "governor", "dubrovny", "icpieces", "mpchess", "kiwen-suwi", "horsey", "anarcandy", "shapes", "letter", "disguised"];
                        if (r) {
                            p(Array.from(pcs[m].pawns), m, stys);
                        }
                        if (o) {
                            p(Array.from(pcs[om].pawns), om, stys);
                        }

                        if (pcs[m].king) {
                            if (DEBUG) console.log("  Replacing king for color:", m, "with URL:", ki);
                            a(pcs[m].king, ki, m)
                        }
                        if (pcs[m].queen) {
                            if (DEBUG) console.log("  Replacing queen for color:", m, "with URL:", qu);
                            a(pcs[m].queen, qu, m)
                        }
                        if (pcs[m].opponentQueen) {
                            if (DEBUG) console.log("Replacing opponent queen for color", om, "with URL:", oqu);
                            a(pcs[m].opponentQueen, oqu, om);
                        }
                        if (oku && pcs[m].opponentKing) {
                            a(pcs[m].opponentKing, oku, om);
                        }
                    }
                }

                function b() {
                  const g = document.querySelector('.game__meta__infos');
                  const p = document.querySelector('.puzzle__side__user__rating');
                  if ((p?.querySelector('strong')) || (g?.textContent.includes('Rated') || g?.textContent.includes('Gewertet'))) {
                    (p ? document.querySelector('.puzzle__side__user') : g).style.backgroundColor = 'red';
                  }
                }

                function h() {
                    const l = document.querySelectorAll('.last-move');
                    l.forEach(el => {
                        if (el && !el.style.cssText.includes('box-shadow')) {
                            el.style.cssText += 'box-shadow:0 0 15px rgba(0,0,0,0.7);outline:5px solid black;background-image:linear-gradient(to bottom,rgba(255,255,0,0.5),rgba(255,255,0,0.2))'
                        }
                    })
                }

                f();
                b();
                const t = setInterval(function() {
                    h();
                    f();
                    b()
                }, 2000);
                const an = document.querySelectorAll('#puzzle-toggle-autonext,label[for="puzzle-toggle-autonext"]');
                an.forEach(el => el.remove())
            }
        }
    })()
}
