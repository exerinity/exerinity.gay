const canvas = document.getElementById('bgstars');
const ctx = canvas.getContext('2d');

const stars = [];

function initialize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars.length = 0;
    for (let i = 0; i < 300; i++) {
        const r = Math.random() * 1.5 + 0.5;
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: r,
            alpha: Math.random() * 0.5 + 0.5,
            dx: (Math.random() - 0.5) * 0.1,
            dy: (Math.random() - 0.5) * 0.05
        });
    }
}

initialize();
window.addEventListener('resize', initialize);

function draw() {
    for (let star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(128, 0, 255, ${star.alpha})`;
        ctx.fill();

        star.alpha += (Math.random() - 0.5) * 0.05;
        if (star.alpha > 1) star.alpha = 1;
        if (star.alpha < 0.2) star.alpha = 0.2;

        star.x += star.dx;
        star.y += star.dy;

        if (star.x - star.radius > canvas.width) {
            star.x = -star.radius;
        } else if (star.x + star.radius < 0) {
            star.x = canvas.width + star.radius;
        }

        if (star.y - star.radius > canvas.height) {
            star.y = -star.radius;
        } else if (star.y + star.radius < 0) {
            star.y = canvas.height + star.radius;
        }
    }
}

const meteors = [];

function create() {
    const side = Math.random();
    let startX, startY, angle;
    if (side < 0.5) {
        startX = 0;
        startY = Math.random() * canvas.height;
        angle = Math.PI / 4 + (Math.random() - 0.5) * (Math.PI / 6);
    } else {
        startX = canvas.width;
        startY = Math.random() * canvas.height;
        angle = Math.PI * 3 / 4 + (Math.random() - 0.5) * (Math.PI / 6);
    }
    const speed = Math.random() * 2 + 1;
    const length = Math.random() * 40 + 40;
    const neonPalette = [
        { r: 255, g: 255, b: 255 }, // neon white
        { r: 57,  g: 255, b: 20  }, // neon green
        { r: 0,   g: 255, b: 255 }, // neon cyan
        { r: 0,   g: 200, b: 255 }  // neon blue
    ];
    const color = neonPalette[Math.floor(Math.random() * neonPalette.length)];
    meteors.push({ x: startX, y: startY, angle, speed, length, alpha: 1, color });
}

let inter = null;
function cron() {
    const delay = Math.random() * 4000 + 1000;
    inter = setTimeout(() => {
        create();
        cron();
    }, delay);
}
function cls() {
    if (inter !== null) {
        clearTimeout(inter);
        inter = null;
    }
}

cron();

function met() {
    for (let i = 0; i < meteors.length; i++) {
        const s = meteors[i];

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        const tailX = s.x - s.length * Math.cos(s.angle);
        const tailY = s.y - s.length * Math.sin(s.angle);
        ctx.lineTo(tailX, tailY);
        const c = s.color || { r: 255, g: 255, b: 255 };
        let gradient = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, ${s.alpha})`);
        gradient.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${s.alpha})`;
        ctx.fill();

        s.x += s.speed * Math.cos(s.angle);
        s.y += s.speed * Math.sin(s.angle);

        s.alpha -= 0.01;
        if (s.alpha <= 0 || s.y > canvas.height || s.y < 0 ||
            (s.angle < Math.PI / 2 && s.x > canvas.width + s.length) ||
            (s.angle >= Math.PI / 2 && s.x < -s.length)) {
            meteors.splice(i, 1);
            i--;
        }
    }
}

function shoot(count = 10) {
    for (let i = 0; i < count; i++) {
        create();
    }
}
window.shoot = shoot;

let rafId = null;
let timeoutId = null;
let lastTimestamp = 0;
let targetFPS = 60;

function renderFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    met();
}

function stopSchedulers() {
    if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
    if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }
}

function rafLoop(ts) {
    const frameDuration = 1000 / targetFPS;
    if (!lastTimestamp) lastTimestamp = ts;
    const delta = ts - lastTimestamp;
    if (delta >= frameDuration) {
        lastTimestamp = ts - (delta % frameDuration);
        renderFrame();
    }
    rafId = requestAnimationFrame(rafLoop);
}

function timeoutLoop() {
    renderFrame();
    const frameDuration = 1000 / targetFPS;
    timeoutId = setTimeout(timeoutLoop, frameDuration);
}

function startLoopForTargetFPS() {
    stopSchedulers();
    lastTimestamp = 0;
    const useRAF = targetFPS >= 30;
    if (useRAF) {
        rafId = requestAnimationFrame(rafLoop);
    } else {
        timeoutId = setTimeout(timeoutLoop, 1000 / targetFPS);
    }
}

startLoopForTargetFPS();

function setFocused() {
    targetFPS = 60;
    startLoopForTargetFPS();
    if (inter === null) cron();
}
function setUnfocused() {
    targetFPS = 0.7;
    startLoopForTargetFPS();
    cls();
}

document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        setUnfocused();
    } else {
        setFocused();
    }
});

window.addEventListener('blur', setUnfocused);
window.addEventListener('focus', setFocused);
