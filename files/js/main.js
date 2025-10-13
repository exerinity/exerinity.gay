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
  script.src = '/files/js/settings.js';
  script.defer = true;
  document.head.appendChild(script);
})();

function twittermoji() {
    twemoji.parse(document, {
        base: 'https://twemoji.exerinity.dev/',
        size: '72x72',
        ext: '.png'
    });
}

twittermoji();

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

// settings-related code moved to settings.js