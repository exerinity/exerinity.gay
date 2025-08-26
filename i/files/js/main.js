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

    el.innerText = chosen.text + " 👋";
    el.title = `This is Welcome in ${chosen.lang}!`;
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

// favourite things expand
document.getElementById("favthings").addEventListener("click", () => {
    let el = document.getElementById("favthings-list");
    document.getElementById("favthings").innerHTML = `My favourite... (click to ${el ? "collapse" : "expand"})`;
    if (!el) {
        el = document.createElement("ul");
        el.id = "favthings-list";
        el.innerHTML = `
            <li>YouTuber: penguinz0</li>
            <li>Song: Animals by Martin Garrix</li>
            <li>Game: BeamNG.drive</li>
            <li>Artist: deadmau5</li>
            <li>Car: BMW E46 330i (I own it!)</li>
            <li>Colour: Purple</li>
            <li>Operating system: Windows 10</li>
            <li>Programming language: JavaScript</li>
            <li>Food: KFC Bacon Stacker burger</li>
            <li>Drink: Monster Zero Ultra or iced coffee</li>
            <li>Animal: Shark</li>
            <li>Subject: Computer Science</li>
            <li>Sport: Golf</li>
            <li>Holiday destination: Adelaide, South Australia</li>
            <li>Fictional character: your girlfriend</li>
            <li>Streaming service: TIDAL</li>
            <li>Snack: Knoppers</li>
            

        `;
        document.getElementById("favthings").appendChild(el);
        twittermoji();
    } else {
        el.classList.toggle("hidden");
    }
});