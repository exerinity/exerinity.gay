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
            speed: 0.02 + r * 0.03
        });
    }
}

initialize();
window.addEventListener('resize', initialize);

function draw() {
    for (let star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();

        star.alpha += (Math.random() - 0.5) * 0.05;
        if (star.alpha > 1) star.alpha = 1;
        if (star.alpha < 0.2) star.alpha = 0.2;

        star.x += star.speed;
        if (star.x - star.radius > canvas.width) {
            star.x = -star.radius;
        }
    }
}

const meteors = [];

function create() {
    const startX = Math.random() * canvas.width;
    const startY = Math.random() * (canvas.height / 4);
    const angle = Math.PI / 4 + (Math.random() - 0.5) * (Math.PI / 6);
    const speed = Math.random() * 3 + 3;
    const length = Math.random() * 20 + 20;
    meteors.push({ x: startX, y: startY, angle, speed, length, alpha: 1 });
}

setInterval(create, Math.random() * 7000 + 3000);

function met() {
    for (let i = 0; i < meteors.length; i++) {
        const s = meteors[i];

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        const tailX = s.x - s.length * Math.cos(s.angle);
        const tailY = s.y - s.length * Math.sin(s.angle);
        ctx.lineTo(tailX, tailY);
        let gradient = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${s.alpha})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.fill();

        s.x += s.speed * Math.cos(s.angle);
        s.y += s.speed * Math.sin(s.angle);

        s.alpha -= 0.02;
        if (s.alpha <= 0 || s.y > canvas.height || s.x > canvas.width || s.x < 0) {
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
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    met();
    rafId = requestAnimationFrame(loop);
}

loop();

document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    } else {
        if (rafId === null) {
            rafId = requestAnimationFrame(loop);
        }
    }
});