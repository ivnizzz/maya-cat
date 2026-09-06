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

function updateUI() {
    const bHunger = document.getElementById('bar-hunger');
    if (!bHunger) return;

    document.getElementById('bar-hunger').style.width = petData.hunger + '%';
    document.getElementById('val-hunger').innerText = Math.round(petData.hunger) + '%';
    document.getElementById('bar-sleep').style.width = petData.sleep + '%';
    document.getElementById('val-sleep').innerText = Math.round(petData.sleep) + '%';
    document.getElementById('bar-mood').style.width = petData.mood + '%';
    document.getElementById('val-mood').innerText = Math.round(petData.mood) + '%';

    const cat = document.getElementById('cat-main');
    if (!cat) return;

    if (petData.hunger <= 0 || petData.sleep <= 0 || petData.mood <= 0) {
        cat.src = "data:image/svg+xml;utf8,<svg xmlns='http://w3.org' viewBox='0 0 100 100'><circle cx='50' cy='55' r='30' fill='%232d3436'/><polygon points='25,35 15,10 35,25' fill='%232d3436'/><polygon points='75,35 85,10 65,25' fill='%232d3436'/><path d='M35,52 L45,60 M45,52 L35,60 M55,52 L65,60 M65,52 L55,60' stroke='%23ff7675' stroke-width='3'/><path d='M45,72 Q50,68 55,72' stroke='%23ff7675' stroke-width='2' fill='none'/></svg>";
    } else if (isSleeping) {
        cat.src = "data:image/svg+xml;utf8,<svg xmlns='http://w3.org' viewBox='0 0 100 100'><circle cx='50' cy='55' r='30' fill='%232d3436'/><polygon points='25,35 15,10 35,25' fill='%232d3436'/><polygon points='75,35 85,10 65,25' fill='%232d3436'/><path d='M32,55 Q38,60 44,55 M56,55 Q62,60 68,55' stroke='%23f1c40f' stroke-width='3' fill='none'/><path d='M46,68 Q50,71 54,68' stroke='%23ff7675' stroke-width='2' fill='none'/></svg>";
    } else if (petData.hunger < 40 || petData.mood < 40 || petData.sleep < 40) {
        cat.src = "data:image/svg+xml;utf8,<svg xmlns='http://w3.org' viewBox='0 0 100 100'><circle cx='50' cy='55' r='30' fill='%232d3436'/><polygon points='25,35 15,10 35,25' fill='%232d3436'/><polygon points='75,35 85,10 65,25' fill='%232d3436'/><circle cx='38' cy='52' r='6' fill='%23f1c40f'/><circle cx='38' cy='52' r='2' fill='%23000'/><circle cx='62' cy='52' r='6' fill='%23f1c40f'/><circle cx='62' cy='52' r='2' fill='%23000'/><path d='M44,68 Q50,62 56,68' stroke='%23ff7675' stroke-width='2.5' fill='none'/></svg>";
    } else {
        cat.src = "data:image/svg+xml;utf8,<svg xmlns='http://w3.org' viewBox='0 0 100 100'><circle cx='50' cy='55' r='30' fill='%232d3436'/><polygon points='25,35 15,10 35,25' fill='%232d3436'/><polygon points='75,35 85,10 65,25' fill='%232d3436'/><circle cx='38' cy='52' r='6' fill='%23f1c40f'/><ellipse cx='38' cy='52' rx='1.5' ry='4' fill='%232d3436'/><circle cx='36' cy='49' r='1' fill='%23fff'/><circle cx='62' cy='52' r='6' fill='%23f1c40f'/><ellipse cx='62' cy='52' rx='1.5' ry='4' fill='%232d3436'/><circle cx='62' cy='49' r='1' fill='%23fff'/><path d='M45,66 Q48,69 50,66 Q52,69 55,66' stroke='%23ff7675' stroke-width='2' fill='none'/></svg>";
    }
}

function calculateOfflineProgress() {
    const now = Date.now(); const elapsed = (now - petData.lastTime) / 1000;
    if (elapsed <= 0) return;
    if (isSleeping) {
        petData.sleep = Math.min(100, petData.sleep + (elapsed * (7 / 60)));
        petData.hunger = Math.max(0, petData.hunger - (elapsed * (0.4 / 60)));
        if (petData.sleep >= 100) isSleeping = false;
    } else {
        petData.hunger = Math.max(0, petData.hunger - (elapsed * (0.85 / 60)));
        petData.sleep = Math.max(0, petData.sleep - (elapsed * (0.65 / 60)));
        petData.mood = Math.max(0, petData.mood - (elapsed * (1.1 / 60)));
    }
    petData.lastTime = now; updateUI();
}

