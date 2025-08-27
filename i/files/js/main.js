function twittermoji() {
    twemoji.parse(document, {
        base: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/',
        size: '72x72',
        ext: '.png'
    });
}

twittermoji();

function welcome() {

    let welcomes = [
        { text: "Welcome", lang: "English" },
        { text: "Willkommen", lang: "German" },
        { text: "Bienvenue", lang: "French" },
        { text: "Benvenuto", lang: "Italian" },
        { text: "欢迎", lang: "Chinese" },
        { text: "ようこそ", lang: "Japanese" },
        { text: "환영합니다", lang: "Korean" },
        { text: "Hola", lang: "Spanish" },
        { text: "Hej", lang: "Swedish" },
        { text: "Ciao", lang: "Italian" },
        { text: "Hallo", lang: "German" },
        { text: "G'day", lang: "Aussie" },
        { text: "Bem-vindo", lang: "Portuguese" },
        { text: "Добро пожаловать", lang: "Russian" },
        { text: "Selamat datang", lang: "Indonesian" },
        { text: "Welkom", lang: "Afrikaans" },
        { text: "Välkommen", lang: "Swedish" },
        { text: "Καλώς ήρθατε", lang: "Greek" },
    ];

    let chosen = welcomes[Math.floor(Math.random() * welcomes.length)];
    let el = document.getElementById("welcome");

    el.innerText = chosen.text.toLocaleLowerCase() + " 👋";
    el.title = `this is welcome in ${chosen.lang}!`;
    twittermoji();
}

welcome();
document.getElementById("welcome").addEventListener("click", welcome);

let clickz = 0;
let timer;

document.getElementById("exedev").addEventListener("click", () => {
    clickz++;
    clearTimeout(timer);
    timer = setTimeout(() => {
        clickz = 0;
    }, 500);

    if (clickz >= 3) {
        clickz = 0;
        shoot(20);

        document.body.classList.add("shake");
        setTimeout(() => {
            document.body.classList.remove("shake");
        }, 500);
    }
});