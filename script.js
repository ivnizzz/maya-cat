let petData = { hunger: 100, sleep: 100, mood: 100, lastTime: Date.now() };
let isSleeping = false;
let currentSeason = "autumn";

const canvas = document.getElementById('effects-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() { if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; } }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() { this.reset(); this.y = Math.random() * canvas.height; }
    reset() {
        this.x = Math.random() * canvas.width; this.y = -20;
        this.size = Math.random() * 8 + 6; this.speedY = Math.random() * 1.2 + 0.6; this.speedX = Math.random() * 1 - 0.5;
        this.rotation = Math.random() * 360; this.rotationSpeed = Math.random() * 2 - 1;
        this.angle = Math.random() * 100; this.angleSpeed = Math.random() * 0.05 + 0.02;

        if (currentSeason === "winter") { this.color = "rgba(255,255,255,0.7)"; this.type = "snow"; }
        else if (currentSeason === "spring") { this.color = "rgba(255,182,193,0.8)"; this.type = "petal"; }
        else if (currentSeason === "summer") { this.type = Math.random() > 0.5 ? "🦋" : "🐝"; this.size = Math.random()*10+16; this.y = Math.random()*canvas.height; this.speedY = Math.random()*1-0.5; this.speedX = Math.random()*1.5+0.5; }
        else { const colors = ["#e17055", "#fab1a0", "#f39c12", "#f1c40f"]; this.color = colors[Math.floor(Math.random()*colors.length)]; this.type = "leaf"; }
    }
    update() {
        if (this.type === "🦋" || this.type === "🐝") {
            this.angle += this.angleSpeed; this.x += this.speedX; this.y += Math.sin(this.angle) * 1.2;
            if (this.x > canvas.width + 20) { this.x = -20; this.y = Math.random() * canvas.height; }
        } else {
            this.y += this.speedY; this.x += this.speedX; this.rotation += this.rotationSpeed;
            if (this.y > canvas.height + 20) this.reset();
        }
    }
    draw() {
        ctx.save(); ctx.translate(this.x, this.y);
        if (this.type === "🦋" || this.type === "🐝") {
            ctx.font = `${this.size}px Arial`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.rotate(Math.sin(this.angle * 3) * 0.15); ctx.fillText(this.type, 0, 0);
        } else {
            ctx.rotate((this.rotation * Math.PI) / 180); ctx.fillStyle = this.color;
            if (this.type === "snow") { ctx.beginPath(); ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2); ctx.fill(); }
            else if (this.type === "petal") { ctx.beginPath(); ctx.ellipse(0, 0, this.size, this.size / 1.5, 0, 0, Math.PI * 2); ctx.fill(); }
            else if (this.type === "leaf") { ctx.beginPath(); ctx.moveTo(0, -this.size); ctx.quadraticCurveTo(this.size, 0, 0, this.size); ctx.quadraticCurveTo(-this.size, 0, 0, -this.size); ctx.fill(); }
        }
        ctx.restore();
    }
}

function initParticles() {
    particles = []; const count = currentSeason === "summer" ? 15 : 45;
    for (let i = 0; i < count; i++) particles.push(new Particle());
}

function animateParticles() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}

function applySeasonVisuals(season) {
    const body = document.body; const title = document.getElementById('season-title');
    const sky = document.getElementById('sky-bg'); const hillB = document.getElementById('h-back');
    const hillF = document.getElementById('h-front'); const treeL = document.getElementById('t-leaves');
    const plant = document.getElementById('h-plant');

    if(!body || !title || !sky) return;
    body.className = "";

    if (season === "winter") {
        body.classList.add('season-winter'); title.innerText = "Зима за окном ❄️";
        sky.style.background = "#4b7bec"; hillB.style.background = "#d1d8e0"; hillF.style.background = "#f5f6fa";
        treeL.style.background = "#a5b1c2"; plant.innerText = "🎄";
    } else if (season === "spring") {
        body.classList.add('season-spring'); title.innerText = "Весна за окном 🌱";
        sky.style.background = "#74b9ff"; hillB.style.background = "#78e08f"; hillF.style.background = "#b8e994";
        treeL.style.background = "#ff9ff3"; plant.innerText = "🌸";
    } else if (season === "summer") {
        body.classList.add('season-summer'); title.innerText = "Лето за окном ☀️";
        sky.style.background = "#00a8ff"; hillB.style.background = "#4cd137"; hillF.style.background = "#44bd32";
        treeL.style.background = "#218c74"; plant.innerText = "🌻";
    } else {
        body.classList.add('season-autumn'); title.innerText = "Осень за окном 🍂";
        sky.style.background = "#f5cd79"; hillB.style.background = "#cf6a15"; hillF.style.background = "#e67e22";
        treeL.style.background = "#8c2500"; plant.innerText = "🌵";
    }
    initParticles();
}

function setSeasonByCalendar() {
    const month = new Date().getMonth();
    if (month === 11 || month === 0 || month === 1) currentSeason = "winter";
    else if (month >= 2 && month <= 4) currentSeason = "spring";
    else if (month >= 5 && month <= 7) currentSeason = "summer";
    else currentSeason = "autumn";
    applySeasonVisuals(currentSeason);
}

function nextSeasonTest() {
    if (currentSeason === "autumn") currentSeason = "winter";
    else if (currentSeason === "winter") currentSeason = "spring";
    else if (currentSeason === "spring") currentSeason = "summer";
    else currentSeason = "autumn";
    applySeasonVisuals(currentSeason);
}

function triggerCatJump() {
    const holder = document.getElementById('cat-holder');
    if (!holder) return;
    holder.classList.remove('jump-animation');
    void holder.offsetWidth;
    holder.classList.add('jump-animation');
}

function spawnFloatingText(text, color) {
    const wrapper = document.querySelector('.stage-wrapper');
    if (!wrapper) return;
    const el = document.createElement('div');
    el.className = 'floating-text';
    el.innerText = text; el.style.color = color;
    el.style.left = `calc(50% + ${Math.random() * 40 - 20}px)`;
    el.style.top = "80px";
    wrapper.appendChild(el);
    setTimeout(() => el.remove(), 800);
}

// 🐱 НАСТОЯЩИЙ ПОЛНОЦЕННЫЙ ВЕКТОРНЫЙ КОТИК ВНУТРИ КОДА
function updateUI() {
    document.getElementById('bar-hunger').style.width = petData.hunger + '%';
    document.getElementById('val-hunger').innerText = Math.round(petData.hunger) + '%';
    document.getElementById('bar-sleep').style.width = petData.sleep + '%';
    document.getElementById('val-sleep').innerText = Math.round(petData.sleep) + '%';
    document.getElementById('bar-mood').style.width = petData.mood + '%';
    document.getElementById('val-mood').innerText = Math.round(petData.mood) + '%';

    const mesh = document.getElementById('cat-mesh');
    if (!mesh) return;

    // Базовые части тела кошечки (ушки, голова, тело, хвостик, лапки)
    let eyesSvg = "";
    let mouthSvg = `<path d="M46,65 Q50,68 54,65" stroke="%23ff7675" stroke-width="2" fill="none" stroke-linecap="round"/>`;

    if (petData.hunger <= 0 || petData.sleep <= 0 || petData.mood <= 0) {
        // Обиделась / ушла (глаза-крестики)
        eyesSvg = `
            <path d="M32,46 L42,54 M42,46 L32,54" stroke="%23ff7675" stroke-width="3" stroke-linecap="round"/>
            <path d="M58,46 L68,54 M68,46 L58,54" stroke="%23ff7675" stroke-width="3" stroke-linecap="round"/>
        `;
        mouthSvg = `<path d="M44,68 Q50,63 56,68" stroke="%23ff7675" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    } else if (isSleeping) {
        // Спит (глазки-дуги)
        eyesSvg = `
            <path d="M30,50 Q36,56 42,50" stroke="%23f1c40f" stroke-width="3.5" fill="none" stroke-linecap="round"/>
            <path d="M58,50 Q64,56 70,50" stroke="%23f1c40f" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        `;
    } else if (petData.hunger < 40 || petData.mood < 40 || petData.sleep < 40) {
        // Грустит (круглые испуганные зрачки)
        eyesSvg = `
            <circle cx="36" cy="50" r="8" fill="%23f1c40f"/> <circle cx="36" cy="50" r="4" fill="%232d3436"/>
            <circle cx="64" cy="50" r="8" fill="%23f1c40f"/> <circle cx="64" cy="50" r="4" fill="%232d3436"/>
        `;
        mouthSvg = `<path d="M44,68 Q50,62 56,68" stroke="%23ff7675" stroke-width="2" fill="none"/>`;
    } else {
        // Идеальное счастливое состояние (милые глазки с бликами)
        eyesSvg = `
            <circle cx="36" cy="50" r="8" fill="%23f1c40f"/>
            <ellipse cx="36" cy="50" rx="2" ry="5" fill="%232d3436"/>
            <circle cx="34" cy="47" r="1.5" fill="%23fff"/>
            <circle cx="64" cy="50" r="8" fill="%23f1c40f"/>
            <ellipse cx="64" cy="50" rx="2" ry="5" fill="%232d3436"/>
            <circle cx="62" cy="47" r="1.5" fill="%23fff"/>
        `;
    }

    // Собираем весь SVG рисунок кошечки воедино
    mesh.innerHTML = `
        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://w3.org">
            <!-- Хвостик -->
            <path d="M70,75 Q85,60 80,45 Q75,35 70,45" fill="%232d3436" stroke="%232d3436" stroke-width="2" stroke-linecap="round"/>
            <!-- Задние лапки/тело -->
            <ellipse cx="50" cy="72" rx="28" ry="18" fill="%232d3436"/>
            <!-- Передние лапки -->
            <ellipse cx="40" cy="85" rx="6" ry="10" fill="%232d3436"/>
            <ellipse cx="60" cy="85" rx="6" ry="10" fill="%232d3436"/>
            <!-- Ушки -->
            <path d="M24,44 Q10,12 36,26" fill="%232d3436" stroke="%232d3436" stroke-width="2" stroke-linejoin="round"/>
            <path d="M26,40 Q16,20 33,27" fill="%23ffb8b8"/>
            <path d="M76,44 Q90,12 64,26" fill="%232d3436" stroke="#2d3436" stroke-width="2" stroke-linejoin="round"/>
            <path d="M74,40 Q84,20 67,27" fill="%23ffb8b8"/>
            <!-- Голова -->
