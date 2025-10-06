/*
                                                                 ___                            ___                      
                                          .-.              .-.  (   )                          (   )                     
  .--.    ___  ___    .--.    ___ .-.    ( __)  ___ .-.   ( __)  | |_      ___  ___          .-.| |    .--.    ___  ___  
 /    \  (   )(   )  /    \  (   )   \   (''") (   )   \  (''") (   __)   (   )(   )        /   \ |   /    \  (   )(   ) 
|  .-. ;  | |  | |  |  .-. ;  | ' .-. ;   | |   |  .-. .   | |   | |       | |  | |        |  .-. |  |  .-. ;  | |  | |  
|  | | |   \ `' /   |  | | |  |  / (___)  | |   | |  | |   | |   | | ___   | |  | |        | |  | |  |  | | |  | |  | |  
|  |/  |   / ,. \   |  |/  |  | |         | |   | |  | |   | |   | |(   )  | '  | |        | |  | |  |  |/  |  | |  | |  
|  ' _.'  ' .  ; .  |  ' _.'  | |         | |   | |  | |   | |   | | | |   '  `-' |        | |  | |  |  ' _.'  | |  | |  
|  .'.-.  | |  | |  |  .'.-.  | |         | |   | |  | |   | |   | ' | |    `.__. |   .-.  | '  | |  |  .'.-.  ' '  ; '  
'  `-' /  | |  | |  '  `-' /  | |         | |   | |  | |   | |   ' `-' ;    ___ | |  (   ) ' `-'  /  '  `-' /   \ `' /   
 `.__.'  (___)(___)  `.__.'  (___)       (___) (___)(___) (___)   `.__.    (   )' |   `-'   `.__,'    `.__.'     '_.'    
                                                                            ; `-' '                                      
                                                                             .__.'                                       

The code here is pretty bad... good luck understanding it lol
*/

// cuz im lazy:
(() => {
  const script = document.createElement('script');
  script.src = '/i/files/js/settings.js';
  script.defer = true;
  document.head.appendChild(script);
})();

function twittermoji() {
    console.log('parsing twemoji');
    twemoji.parse(document, {
        base: 'https://twemoji.exerinity.dev/',
        size: '72x72',
        ext: '.png'
    });
}

twittermoji();

function welcome() {
    console.log('choosing welcome message');
    let welcomes = [
    { text: "welcome to exerinity.dev", lang: "English" },
    { text: "willkommen auf exerinity.dev", lang: "German" },
    { text: "bienvenue sur exerinity.dev", lang: "French" },
    { text: "ciao! benvenuto su exerinity.dev", lang: "Italian" },
    { text: "欢迎来到 exerinity.dev", lang: "Chinese (Simplified)" },
    { text: "ようこそ、exerinity.dev へ", lang: "Japanese" },
    { text: "exerinity.dev 에 오신 것을 환영합니다", lang: "Korean" },
    { text: "bienvenido a exerinity.dev", lang: "Spanish" },
    { text: "välkommen till exerinity.dev", lang: "Swedish" },
    { text: "g'day! welcome to exerinity.dev", lang: "Aussie" }, // im australian but never say 'gday' haha
    { text: "bem-vindo ao exerinity.dev", lang: "Portuguese" },
    { text: "добро пожаловать на exerinity.dev", lang: "Russian" },
    { text: "selamat datang di exerinity.dev", lang: "Indonesian" },
    { text: "welkom bij exerinity.dev", lang: "Afrikaans" },
    { text: "καλώς ήρθατε στο exerinity.dev", lang: "Greek" }
];


    let chosen = welcomes[Math.floor(Math.random() * welcomes.length)];
    let el = document.getElementById("welcome");

    el.innerText = chosen.text.toLocaleLowerCase() + " 👋";
    el.title = `this is welcome in ${chosen.lang}!`;
    twittermoji();
    console.log(`picked "${chosen.text}" in ${chosen.lang}`);
}

welcome();
document.getElementById("welcome").addEventListener("click", welcome);

let clickz = 0;
let timer;

document.getElementById("exedev").addEventListener("click", () => {
    console.log('you hear a knock...');
    clickz++;
    clearTimeout(timer);
    timer = setTimeout(() => {
        clickz = 0;
    }, 500);

    if (clickz >= 3) {
        console.log('behold!');
        clickz = 0;
        shoot(20);

        document.body.classList.add("shake");
        setTimeout(() => {
            document.body.classList.remove("shake");
        }, 500);
    }
});

// settings-related code moved to settings.js