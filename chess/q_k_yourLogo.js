// ==UserScript==
// @name     GM li KYP replaced
// @namespace    https://lichess.org/
// @version  1.0
// @description  replace your king and queen. and all pons ...
// @match   https://lichess.org/*
// @grant    none
// ==/UserScript==
const url = window.location.href;

      
const regex1 = new RegExp(`^https://lichess.org/[^@/]+$`);
if (0 && regex1.test(url)) {
    alert("regex1 match");
}
    

window.addEventListener ("load", Greasemonkey_main, false);

function Greasemonkey_main () {
  
(function(){
  
const url = window.location.href;
const positiveRegex = new RegExp(`\.org\/[^@\/]*$`);
const negativeRegex = new RegExp(`\.org\/(?:@|lern|study|coordinate|practice|inbox|team|forum|broadcast|streamer|video|player|patron|paste)[^\/]*$`);
    

if (positiveRegex.test(url) && !negativeRegex.test(url)) 
{ // start of regex url
  
// new 25-0116_1639-51 was working as bookmarklet:
// let urlParams;urlParams=new URLSearchParams(window.location.search);let board=null;  const urlTrain='https://lichess.org/training';try{board=document.querySelector("cg-board")||document.getElementById('board-layout-chessboard');if(!board){const uGo=urlParams.get('u');window.location.href=uGo||urlTrain;}}catch(error){console.log("Error 1:",error);window.location.href=urlTrain;}if (document.querySelector('.board-layout-chessboard')){const s = document.createElement('style');s.innerHTML = `.last-move-piece { background-color: red !important; }`;document.head.appendChild(s);let lastMoveElements = document.querySelectorAll('.last-move-piece');let previousMove = null;function highlightLastMove() {let newMove = document.querySelector('.chess-board .last-move');if (newMove !== previousMove) {if (previousMove){previousMove.classList.remove('last-move-piece');}if(newMove){newMove.classList.add('last-move-piece');}previousMove = newMove;}}setInterval(highlightLastMove, 500);}let ls = localStorage;const KEY_URL_PARAMS = '250109070040';const storedParamsString = ls.getItem(KEY_URL_PARAMS);let storedSearchParams;if (storedParamsString) {storedSearchParams = new URLSearchParams(storedParamsString);console.log("Gespeicherte urlParams gefunden:", storedSearchParams.toString());} else {storedSearchParams = new URLSearchParams();console.log("Keine gespeicherten urlParams gefunden.");}let k1,q1,t1,paramValue;if (urlParams){urlParams.forEach((value, key) => {if (value === '') {storedSearchParams.delete(key);} else {storedSearchParams.set(key, value);if (key === 'k') {let currentP = storedSearchParams.get('p') || '';if (!currentP.includes('k')) {storedSearchParams.set('p', currentP + 'k');}}if (key === 'q') {let currentP = storedSearchParams.get('p') || '';if (!currentP.includes('q')) {storedSearchParams.set('p', currentP + 'q')}}}});storedSearchParams.forEach((value, key) => {if (!urlParams.has(key)) {urlParams.set(key, value);}});ls.setItem(KEY_URL_PARAMS, storedSearchParams.toString());const b=document.querySelector(".main-board");let backgroundInterval=setInterval(function(){if(document.querySelector('cg-board')){const b=document.querySelector(".main-board");if(b){(e=>{const t=document.createElement("div");t.style.cssText=`position:absolute;top:0;left:0;width:100%;height:100%;background-image:url('https://sl5.de/wp-content/uploads/2025/01/SL5net_logo_white_shadow_on_blue_w990.png');background-size:cover;background-position:center;opacity:0.7;z-index:-1;border-radius:inherit;`;e.insertBefore(t,e.firstChild)})(b.parentElement);clearInterval(backgroundInterval);console.log("Background code check - main board loaded and background added");}else{console.log("Background code check - waiting for main board");}}else{console.log("Background code check - not a lichess board");clearInterval(backgroundInterval);}console.log("Background code check - end");},500);try {k1 = urlParams?.get('k');q1 = urlParams?.get('q');t1 = urlParams?.get('hi');paramValue = urlParams?.get('p');} catch(error) {console.log("Error 4:", error);}}const kingUrl=(k1)?k1:'https://static-cdn.jtvnw.net/jtv_user_pictures/67dcc3a8-669c-4670-96d1-0ad3728c3adb-profile_image-70x70.png';const queenUrl=(q1)?q1:'https://i.imgur.com/FhwFGbb.jpg';let replaceKing=true,replaceQueen=true;if(!k1 && !paramValue.includes('k'))replaceKing=false;if(!q1 && !paramValue.includes('q'))replaceQueen=false;function greetUser(userName){if(!userName){console.log(':( 250114173916');return false;}let ty=(t1)?t1:'Hi '+userName+', i am IT-Nerd from Universe arrived World (DE-T%C3%BCbingen ' + new Date().toLocaleString('de-DE', { month: 'long', year: 'numeric'})  + ' ) . How to make friends/projects on earth? Have fun.';const textarea = document.querySelector('.msg-app__convo__post__text');const inputField=document.querySelector('.mchat__say'); const chatMessages = document.querySelectorAll('.mchat__messages li');if ((textarea && textarea.value.trim() === '') || (inputField && inputField.value.trim() === '')){ let itsFirstGame=false;var score=document.querySelector('.crosstable__score').innerHTML;if(score!=='<span>0</span><span>0</span>'){console.log('not fist game');let itsFirstGame=false;}let remember=false;if(itsFirstGame&&(!localStorage.getItem("011417greetedUsers")||!JSON.parse(localStorage.getItem("011417greetedUsers"))[u]||JSON.parse(localStorage.getItem("011417greetedUsers"))[u]<Date.now()-31536000000)){const doBigGreet=true;}else{ty="Good luck, have fun";} if(chatMessages.length === 0){if(textarea){textarea.value += ty;remember=true;}else{inputField.value = ty + '\n';remember=true;const enterKeyEvent = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' });inputField.dispatchEvent(enterKeyEvent);}}if(remember){const g=localStorage.getItem("011417greetedUsers")?JSON.parse(localStorage.getItem("011417greetedUsers")):{};g[userName]=Date.now();localStorage.setItem("011417greetedUsers",JSON.stringify(g));}}}if(paramValue){replaceKing=paramValue.includes('k');replaceQueen=paramValue.includes('q');}let r=true,o=true;const g=()=>{const b=document.querySelector('.board');return b?b.classList.contains('flipped')?'black':'white':null;};if(window.location.href.includes('chess.com')){const c=g();if(c){const s=document.createElement('style');let k=replaceKing?'url('+kingUrl+')':'',q=replaceQueen?'url('+queenUrl+')':'';s.innerHTML=`.highlight{background-color:red!important;opacity:1!important}${replaceKing?`.${c[0]}k.piece::after{content:'';position:absolute;top:0;left:0;width:100%;height:100%;background-image:${k};background-size:cover;background-repeat:no-repeat;background-position:center}`:''}${replaceQueen?`.${c[0]}q.piece::after{content:'';position:absolute;top:0;left:0;width:100%;height:100%;background-image:${q};background-size:cover;background-repeat:no-repeat;background-position:center}`:''}`;document.head.appendChild(s);}else{console.log("Could not determine player color. Style not applied.")}}else if(document.querySelector('cg-board')){let opponentName;const getOpponentName = m => document.querySelector(`.game__meta__players .player${m === 'black' ? ':not(.black)' : ':not(.white)'} a.user-link`).textContent.trim().split(' ')[0];function a(e,t,c){if(!e||!e.classList.contains(c)||e.classList.contains('bishop'))return;e.classList.remove('black','white',c);e.style.background=t;e.style.backgroundSize='cover';if(e.style.backgroundImage&&e.style.backgroundImage.includes('https://lichess1.org/assets/_KA7qyN/piece/')){console.log(`Piece loaded for ${e.classList.value} with ${t}`)}else{console.log(`Piece fail ${e.classList.value} with ${t}`);setTimeout(()=>a(e,t,c),100)}}function p(e,c,t){if(!e)return;e.forEach((el,i)=>{const idx=i%t.length;const u=`url(https://lichess1.org/assets/_KA7qyN/piece/${t[idx]}/${c[0]}P.svg)`;a(el,u,c)})}function f(){let m,pcs={black:{pawns:[],king:null,queen:null},white:{pawns:[],king:null,queen:null}},ki=replaceKing?'url('+kingUrl+')':'',qu=replaceQueen?'url('+queenUrl+')':'';let l=document.querySelector('.puzzle__feedback.play');if(l){let i=l.querySelector('.instruction em');if(i){if(i.textContent.includes('black'))m='black';else if(i.textContent.includes('white'))m='white'}if(m){if(replaceKing)pcs[m].king=document.querySelector(`.${m}.king`);if(replaceQueen)pcs[m].queen=document.querySelector(`.${m}.queen`)}}if(!m){let b=document.querySelector('.cg-wrap');if(b){m=b.classList.contains('orientation-black')?'black':'white';console.log("Player:",m);if(replaceKing)pcs[m].king=document.querySelector(`.${m}.king`);if(replaceQueen)pcs[m].queen=document.querySelector(`.${m}.queen`)}}if(m){const om=m==='black'?'white':'black';pcs[m].pawns = document.querySelectorAll(`.${m}.pawn`);pcs[om].pawns=document.querySelectorAll(`.${om}.pawn`);if(pcs[m].king){a(pcs[m].king,ki,m)}if(pcs[m].queen){a(pcs[m].queen,qu,m)}const stys=["cburnett","merida","alpha","chessnut","chess7","reillycraig","companion","riohacha","kosal","le Zigzag","fantasy","spatial","celtic","california","caliente","pixel","maestro","fresca","cardinal","gioco","tatiana","staunty","cooke","monarchy","governor","dubrovny","icpieces","mpchess","kiwen-suwi","horsey","anarcandy","shapes","letter","disguised"];if(r){p(Array.from(pcs[m].pawns),m,stys)}if(o){p(Array.from(pcs[om].pawns),om,stys)}try {if(!opponentName){opponentName=getOpponentName(m);if(opponentName)console.log(`Opponent's name: ${opponentName}`);greetUser(opponentName)};} catch (error) {console.warn("25-0115_1218-08:", error);}}}function b(){const p=document.querySelector('.puzzle__side__user__rating');const g=document.querySelector('.game__meta__infos');if ((p && p.querySelector('strong')) || (g && g.querySelector('.setup') && g.querySelector('.setup').textContent.includes('Rated'))) {if (p&&p.querySelector('strong')) {document.querySelector('.puzzle__side__user').style.backgroundColor='red';}else if(g){g.style.backgroundColor='red';}}}function h(){const l=document.querySelectorAll('.last-move');l.forEach(el=>{if(el&&!el.style.cssText.includes('box-shadow')){el.style.cssText+='box-shadow:0 0 15px rgba(0,0,0,0.7);outline:5px solid black;background-image:linear-gradient(to bottom,rgba(255,255,0,0.5),rgba(255,255,0,0.2))'}})}f();b();const t=setInterval(function(){h();f();b()},2000);const an=document.querySelectorAll('#puzzle-toggle-autonext,label[for="puzzle-toggle-autonext"]');an.forEach(el=>el.remove())}  

// new 25-0117_1529-06 hast newlines works not as bookmarklet anymore.
// variable and functionsnames sadly short to save space (becouse size of bookmarklets is limited):
  
let urlParams;
urlParams = new URLSearchParams(window.location.search);
let board = null;

const urlTrain = 'https://lichess.org/training';
try {
  board = document.querySelector("cg-board") || document.getElementById('board-layout-chessboard');
  if (!board) {
    const uGo = urlParams.get('u');
    window.location.href = uGo || urlTrain;
  }
} catch (error) {
  console.log("Error 1:", error);
  window.location.href = urlTrain;
}

if (document.querySelector('.board-layout-chessboard')) {
  const s = document.createElement('style');
  s.innerHTML = `.last-move-piece { background-color: red !important; }`;
  document.head.appendChild(s);

  let lastMoveElements = document.querySelectorAll('.last-move-piece');
  let previousMove = null;

  function highlightLastMove() {
    let newMove = document.querySelector('.chess-board .last-move');
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
let storedSearchParams;
if (storedParamsString) {
  storedSearchParams = new URLSearchParams(storedParamsString);
  console.log("Gespeicherte urlParams gefunden:", storedSearchParams.toString());
} else {
  storedSearchParams = new URLSearchParams();
  console.log("Keine gespeicherten urlParams gefunden.");
}

let k1, q1, t1, paramValue;
if (urlParams) {
  urlParams.forEach((value, key) => {
    if (value === '') {
      storedSearchParams.delete(key);
    } else {
      storedSearchParams.set(key, value);
      if (key === 'k') {
        let currentP = storedSearchParams.get('p') || '';
        if (!currentP.includes('k')) {
          storedSearchParams.set('p', currentP + 'k');
        }
      }
      if (key === 'q') {
        let currentP = storedSearchParams.get('p') || '';
        if (!currentP.includes('q')) {
          storedSearchParams.set('p', currentP + 'q');
        }
      }
    }
  });
  storedSearchParams.forEach((value, key) => {
    if (!urlParams.has(key)) {
      urlParams.set(key, value);
    }
  });
  ls.setItem(KEY_URL_PARAMS, storedSearchParams.toString());
}

const b = document.querySelector(".main-board");
let backgroundInterval = setInterval(function () {
  if (document.querySelector('cg-board')) {
    const b = document.querySelector(".main-board");
    if (b) {
      (e => {
        const t = document.createElement("div");
        t.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;background-image:url('https://sl5.de/wp-content/uploads/2025/01/SL5net_logo_white_shadow_on_blue_w990.png');background-size:cover;background-position:center;opacity:0.7;z-index:-1;border-radius:inherit;`;
        e.insertBefore(t, e.firstChild);
      })(b.parentElement);
      clearInterval(backgroundInterval);
      console.log("Background code check - main board loaded and background added");
    } else {
      console.log("Background code check - waiting for main board");
    }
  } else {
    console.log("Background code check - not a lichess board");
    clearInterval(backgroundInterval); // Important: Clear the interval here as well
  }
  console.log("Background code check - end");
}, 500);

try {
  k1 = urlParams?.get('k');
  q1 = urlParams?.get('q');
  t1 = urlParams?.get('hi');
  paramValue = urlParams?.get('p');
} catch (error) {
  console.log("Error 4:", error);
}

const kingUrl = (k1) ? k1 : 'https://static-cdn.jtvnw.net/jtv_user_pictures/67dcc3a8-669c-4670-96d1-0ad3728c3adb-profile_image-70x70.png';
const queenUrl = (q1) ? q1 : 'https://i.imgur.com/FhwFGbb.jpg';
let replaceKing = true,
  replaceQueen = true;
if (!k1 && !paramValue.includes('k')) replaceKing = false;
if (!q1 && !paramValue.includes('q')) replaceQueen = false;

function greetUser(userName) {
  if (!userName) {
    console.log(':( 250114173916');
    return false;
  }
  let ty = (t1) ? t1 : 'Hi ' + userName + ', i am IT-Nerd from Universe arrived World (DE-T%C3%BCbingen ' + new Date().toLocaleString('de-DE', {
    month: 'long',
    year: 'numeric'
  }) + ' ) . How to make friends/projects on earth? Have fun.';
  const textarea = document.querySelector('.msg-app__convo__post__text');
  const inputField = document.querySelector('.mchat__say');
  const chatMessages = document.querySelectorAll('.mchat__messages li');
  if ((textarea && textarea.value.trim() === '') || (inputField && inputField.value.trim() === '')) {
    let itsFirstGame = false;
    var score = document.querySelector('.crosstable__score').innerHTML;
    if (score !== '<span>0</span><span>0</span>') {
      console.log('not fist game');
      let itsFirstGame = false;
    }
    let remember = false;
    if (itsFirstGame && (!localStorage.getItem("011417greetedUsers") || !JSON.parse(localStorage.getItem("011417greetedUsers"))[u] || JSON.parse(localStorage.getItem("011417greetedUsers"))[u] < Date.now() - 31536000000)) {
      const doBigGreet = true;
    } else {
      ty = "Good luck, have fun";
    }
    if (chatMessages.length === 0) {
      if (textarea) {
        textarea.value += ty;
        remember = true;
      } else {
        inputField.value = ty + '\n';
        remember = true;
        const enterKeyEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter'
        });
        inputField.dispatchEvent(enterKeyEvent);
      }
    }
    if (remember) {
      const g = localStorage.getItem("011417greetedUsers") ? JSON.parse(localStorage.getItem("011417greetedUsers")) : {};
      g[userName] = Date.now();
      localStorage.setItem("011417greetedUsers", JSON.stringify(g));
    }
  }
}



if (paramValue) {
  replaceKing = paramValue.includes('k');
  replaceQueen = paramValue.includes('q');
}
let r = true,
  o = true;
const g = () => {
  const b = document.querySelector('.board');
  return b ? b.classList.contains('flipped') ? 'black' : 'white' : null;
};
if (window.location.href.includes('chess.com')) {
  const c = g();
  if (c) {
    const s = document.createElement('style');
    let k = replaceKing ? 'url(' + kingUrl + ')' : '',
      q = replaceQueen ? 'url(' + queenUrl + ')' : '';
    s.innerHTML = `.highlight{background-color:red!important;opacity:1!important}${replaceKing ? `.${c[0]}k.piece::after{content:'';position:absolute;top:0;left:0;width:100%;height:100%;background-image:${k};background-size:cover;background-repeat:no-repeat;background-position:center}` : ''}${replaceQueen ? `.${c[0]}q.piece::after{content:'';position:absolute;top:0;left:0;width:100%;height:100%;background-image:${q};background-size:cover;background-repeat:no-repeat;background-position:center}` : ''}`;
    document.head.appendChild(s);
  } else {
    console.log("Could not determine player color. Style not applied.");
  }
} else if (document.querySelector('cg-board')) {
  let opponentName;
  const getOpponentName = m => document.querySelector(`.game__meta__players .player${m === 'black' ? ':not(.black)' : ':not(.white)'} a.user-link`).textContent.trim().split(' ')[0];

  function a(e, t, c) {
    if (!e || !e.classList.contains(c) || e.classList.contains('bishop')) return;
    e.classList.remove('black', 'white', c);
    e.style.background = t;
    e.style.backgroundSize = 'cover';
    if (e.style.backgroundImage && e.style.backgroundImage.includes('https://lichess1.org/assets/_KA7qyN/piece/')) {
      console.log(`Piece loaded for ${e.classList.value} with ${t}`)
    } else {
      console.log(`Piece fail ${e.classList.value} with ${t}`);
      setTimeout(() => a(e, t, c), 100)
    }
  }

  function p(e, c, t) {
    if (!e) return;
    e.forEach((el, i) => {
      const idx = i % t.length;
      const u = `url(https://lichess1.org/assets/_KA7qyN/piece/${t[idx]}/${c[0]}P.svg)`;
      a(el, u, c)
    })
  }

  function f() {
    let m, pcs = {
        black: {
          pawns: [],
          king: null,
          queen: null
        },
        white: {
          pawns: [],
          king: null,
          queen: null
        }
      },
      ki = replaceKing ? 'url(' + kingUrl + ')' : '',
      qu = replaceQueen ? 'url(' + queenUrl + ')' : '';
    let l = document.querySelector('.puzzle__feedback.play');
    if (l) {
      let i = l.querySelector('.instruction em');
      if (i) {
        if (i.textContent.includes('black')) m = 'black';
        else if (i.textContent.includes('white')) m = 'white'
      }
      if (m) {
        if (replaceKing) pcs[m].king = document.querySelector(`.${m}.king`);
        if (replaceQueen) pcs[m].queen = document.querySelector(`.${m}.queen`)
      }
    }
    if (!m) {
      let b = document.querySelector('.cg-wrap');
      if (b) {
        m = b.classList.contains('orientation-black') ? 'black' : 'white';
        console.log("Player:", m);
        if (replaceKing) pcs[m].king = document.querySelector(`.${m}.king`);
        if (replaceQueen) pcs[m].queen = document.querySelector(`.${m}.queen`)
      }
    }
    if (m) {
      const om = m === 'black' ? 'white' : 'black';
      pcs[m].pawns = document.querySelectorAll(`.${m}.pawn`);
      pcs[om].pawns = document.querySelectorAll(`.${om}.pawn`);
      if (pcs[m].king) {
        a(pcs[m].king, ki, m)
      }
      if (pcs[m].queen) {
        a(pcs[m].queen, qu, m)
      }
      const stys = ["cburnett", "merida", "alpha", "chessnut", "chess7", "reillycraig", "companion", "riohacha", "kosal", "le Zigzag", "fantasy", "spatial", "celtic", "california", "caliente", "pixel", "maestro", "fresca", "cardinal", "gioco", "tatiana", "staunty", "cooke", "monarchy", "governor", "dubrovny", "icpieces", "mpchess", "kiwen-suwi", "horsey", "anarcandy", "shapes", "letter", "disguised"];
      if (r) {
        p(Array.from(pcs[m].pawns), m, stys)
      }
      if (o) {
        p(Array.from(pcs[om].pawns), om, stys)
      }
      try {
        if (!opponentName) {
          opponentName = getOpponentName(m);
          if (opponentName) console.log(`Opponent's name: ${opponentName}`);
          greetUser(opponentName)
        };
      } catch (error) {
        console.warn("25-0115_1218-08:", error);
      }
    }
  }

  function b() {
    const p = document.querySelector('.puzzle__side__user__rating');
    const g = document.querySelector('.game__meta__infos');
    if ((p && p.querySelector('strong')) || (g && g.querySelector('.setup') && g.querySelector('.setup').textContent.includes('Rated'))) {
      if (p && p.querySelector('strong')) {
        document.querySelector('.puzzle__side__user').style.backgroundColor = 'red';
      } else if (g) {
        g.style.backgroundColor = 'red';
      }
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
  const t = setInterval(function () {
    h();
    f();
    b()
  }, 2000);
  const an = document.querySelectorAll('#puzzle-toggle-autonext,label[for="puzzle-toggle-autonext"]');
  an.forEach(el => el.remove())
} 
  
  
  
} // end of regex url

})()
  
  
}
