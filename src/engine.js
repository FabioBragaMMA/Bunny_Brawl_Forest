import { audio } from './sound.js';
import { Rabbit, Carrot, Tree, Particle, FloatingText, WORLD_SIZE, RABBIT_COLORS } from './entities.js';

const NUM_CARROTS = 140;
const NUM_AI_RABBITS = 16;

const AI_NAMES = [
    "OrelhaFura", "CoelhoDuro", "Dentola", "CenouraKing",
    "PernaLigeira", "Saltitão", "Velocidade", "FofoBrutal",
    "FuriaBranca", "NinjaBunny", "PeloDeFerro", "ReiDaCenoura",
    "BombaFofa", "MasterRabbit", "GigaBunny", "Cenourinha"
];

export class GameEngine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.minimapCanvas = document.getElementById('minimap');
        this.minimapCtx = this.minimapCanvas.getContext('2d');

        this.camera = { x: 0, y: 0, w: window.innerWidth, h: window.innerHeight };
        
        this.input = { x: 0, y: 0, dash: false };
        this.keys = {};

        this.carrots = [];
        this.trees = [];
        this.rabbits = [];
        this.particles = [];
        this.floatingTexts = [];

        this.player = null;
        this.isRunning = false;
        this.lastTime = 0;
        this.screenShake = 0;

        this.initEventListeners();
        this.resize();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.camera.w = window.innerWidth;
        this.camera.h = window.innerHeight;
    }

    initEventListeners() {
        window.addEventListener('resize', () => this.resize());

        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space') this.input.dash = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            if (e.code === 'Space') this.input.dash = false;
        });

        const joystickZone = document.getElementById('joystick-zone');
        const joystickKnob = document.getElementById('joystick-knob');
        let touchId = null;
        let center = { x: 0, y: 0 };

        joystickZone.addEventListener('touchstart', (e) => {
            audio.init();
            const touch = e.changedTouches[0];
            touchId = touch.identifier;
            const rect = joystickZone.getBoundingClientRect();
            center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        });

        joystickZone.addEventListener('touchmove', (e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                let touch = e.changedTouches[i];
                if (touch.identifier === touchId) {
                    let dx = touch.clientX - center.x;
                    let dy = touch.clientY - center.y;
                    let dist = Math.hypot(dx, dy);
                    let maxR = 40;
                    if (dist > maxR) {
                        dx = (dx / dist) * maxR;
                        dy = (dy / dist) * maxR;
                    }
                    joystickKnob.style.transform = `translate(${dx}px, ${dy}px)`;
                    this.input.x = dx / maxR;
                    this.input.y = dy / maxR;
                }
            }
        });

        const resetJoystick = (e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === touchId) {
                    touchId = null;
                    joystickKnob.style.transform = `translate(0px, 0px)`;
                    this.input.x = 0;
                    this.input.y = 0;
                }
            }
        };

        joystickZone.addEventListener('touchend', resetJoystick);
        joystickZone.addEventListener('touchcancel', resetJoystick);

        document.getElementById('btn-start').addEventListener('click', () => {
            audio.init();
            const nameInput = document.getElementById('player-name-input').value.trim();
            this.startGame(nameInput || "SuperCoelho");
        });

        document.getElementById('btn-respawn').addEventListener('click', () => {
            audio.init();
            this.respawnPlayer();
        });
    }

    updateInput() {
        let kx = 0;
        let ky = 0;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) kx -= 1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) kx += 1;
        if (this.keys['KeyW'] || this.keys['ArrowUp']) ky -= 1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) ky += 1;

        if (kx !== 0 || ky !== 0) {
            this.input.x = kx;
            this.input.y = ky;
        }
    }

    startGame(playerName) {
        document.getElementById('modal-overlay').classList.add('hidden');

        this.trees = [];
        for (let i = 0; i < 90; i++) {
            this.trees.push(new Tree());
        }

        this.carrots = [];
        for (let i = 0; i < NUM_CARROTS; i++) {
            this.carrots.push(new Carrot());
        }

        this.player = new Rabbit('player', playerName, true, RABBIT_COLORS[0]);
        this.rabbits = [this.player];

        for (let i = 0; i < NUM_AI_RABBITS; i++) {
            const color = RABBIT_COLORS[(i + 1) % RABBIT_COLORS.length];
            const aiName = AI_NAMES[i % AI_NAMES.length];
            const ai = new Rabbit(`ai_${i}`, aiName, false, color);
            ai.level = Math.floor(Math.random() * 3) + 1;
            this.rabbits.push(ai);
        }

        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    respawnPlayer() {
        document.getElementById('modal-overlay').classList.add('hidden');
        document.getElementById('gameover-screen').classList.add('hidden');

        const playerName = document.getElementById('player-name-input').value.trim() || "SuperCoelho";
        this.player = new Rabbit('player', playerName, true, RABBIT_COLORS[0]);
        this.player.invulnerableTimer = 2.5;
        this.rabbits.push(this.player);

        this.logCombat(`✨ <b>${this.player.name}</b> renasceu na floresta!`);
    }

    gameOver() {
        document.getElementById('modal-overlay').classList.remove('hidden');
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('gameover-screen').classList.remove('hidden');

        document.getElementById('summary-level').innerText = this.player.level;
        document.getElementById('summary-carrots').innerText = this.player.carrotsEaten;

        audio.playHit();
    }

    addParticle(x, y, color, size, vx, vy, life) {
        this.particles.push(new Particle(x, y, color, size, vx, vy, life));
    }

    addFloatingText(x, y, text, color, fontSize = 20) {
        this.floatingTexts.push(new FloatingText(x, y, text, color, fontSize));
    }

    logCombat(msg) {
        const log = document.getElementById('combat-log');
        const entry = document.createElement('div');
        entry.className = "py-0.5 border-b border-slate-800/50";
        entry.innerHTML = msg;
        log.prepend(entry);
        if (log.children.length > 20) log.removeChild(log.lastChild);
    }

    handleCollisions() {
        for (let r of this.rabbits) {
            const rRadius = r.getRadius();
            for (let c of this.carrots) {
                const dist = Math.hypot(c.x - r.x, c.y - r.y);
                if (dist < rRadius + c.radius) {
                    c.respawn();
                    r.addLevel(1);

                    if (r.isPlayer) audio.playEat();
                    
                    this.addFloatingText(r.x, r.y - rRadius, "+1 Nível!", "#FACC15", 18);

                    for (let i = 0; i < 6; i++) {
                        this.addParticle(
                            r.x + (Math.random() - 0.5) * 20,
                            r.y + (Math.random() - 0.5) * 20,
                            '#F97316', 4,
                            (Math.random() - 0.5) * 80,
                            (Math.random() - 0.5) * 80,
                            0.4
                        );
                    }
                }
            }
        }

        for (let i = 0; i < this.rabbits.length; i++) {
            for (let j = i + 1; j < this.rabbits.length; j++) {
                const r1 = this.rabbits[i];
                const r2 = this.rabbits[j];

                const dist = Math.hypot(r2.x - r1.x, r2.y - r1.y);
                const minDist = r1.getRadius() + r2.getRadius();

                if (dist < minDist) {
                    const overlap = (minDist - dist) + 5;
                    const angle = Math.atan2(r2.y - r1.y, r2.x - r1.x);

                    r1.x -= Math.cos(angle) * overlap * 0.5;
                    r1.y -= Math.sin(angle) * overlap * 0.5;
                    r2.x += Math.cos(angle) * overlap * 0.5;
                    r2.y += Math.sin(angle) * overlap * 0.5;

                    if (r1.invulnerableTimer > 0 || r2.invulnerableTimer > 0) continue;

                    let winner = null;
                    let loser = null;

                    if (r1.level > r2.level) {
                        winner = r1; loser = r2;
                    } else if (r2.level > r1.level) {
                        winner = r2; loser = r1;
                    } else {
                        if (Math.random() < 0.5) { winner = r1; loser = r2; }
                        else { winner = r2; loser = r1; }
                    }

                    const stolenLevels = loser.resetLevel();
                    winner.addLevel(stolenLevels);
                    loser.invulnerableTimer = 3.0;

                    this.screenShake = 12;
                    audio.playBrawl();

                    const midX = (r1.x + r2.x) / 2;
                    const midY = (r1.y + r2.y) / 2;

                    for (let k = 0; k < 20; k++) {
                        this.addParticle(
                            midX + (Math.random() - 0.5) * 30,
                            midY + (Math.random() - 0.5) * 30,
                            Math.random() < 0.5 ? '#EF4444' : '#F59E0B',
                            Math.random() * 8 + 4,
                            (Math.random() - 0.5) * 200,
                            (Math.random() - 0.5) * 200,
                            0.5
                        );
                    }

                    this.addFloatingText(winner.x, winner.y - winner.getRadius() - 10, `+${stolenLevels} NÍVEIS! 💥`, '#10B981', 24);
                    this.addFloatingText(loser.x, loser.y - loser.getRadius() - 10, `PERDEU TUDO! 😵`, '#EF4444', 20);

                    this.logCombat(`⚔️ <b>${winner.name}</b> deu uma coça a <b>${loser.name}</b> e roubou +${stolenLevels} níveis!`);

                    if (loser.isPlayer) {
                        this.rabbits = this.rabbits.filter(r => r !== loser);
                        this.gameOver();
                    }
                }
            }
        }
    }

    update(dt) {
        this.updateInput();

        // Câmara dinâmica com Zoom automático
        if (this.player && this.rabbits.includes(this.player)) {
            let zoomFactor = Math.max(0.6, 1.0 - (this.player.level - 1) * 0.015);
            let targetCamW = window.innerWidth / zoomFactor;
            let targetCamH = window.innerHeight / zoomFactor;

            let targetCamX = this.player.x - targetCamW / 2;
            let targetCamY = this.player.y - targetCamH / 2;

            this.camera.w += (targetCamW - this.camera.w) * 0.1;
            this.camera.h += (targetCamH - this.camera.h) * 0.1;
            this.camera.x += (targetCamX - this.camera.x) * 0.1;
            this.camera.y += (targetCamY - this.camera.y) * 0.1;
        }

        this.camera.x = Math.max(0, Math.min(WORLD_SIZE - this.camera.w, this.camera.x));
        this.camera.y = Math.max(0, Math.min(WORLD_SIZE - this.camera.h, this.camera.y));

        if (this.screenShake > 0) {
            this.camera.x += (Math.random() - 0.5) * this.screenShake;
            this.camera.y += (Math.random() - 0.5) * this.screenShake;
            this.screenShake -= dt * 30;
        }

        for (let r of this.rabbits) {
            r.update(dt, this.input, this.carrots, this.rabbits, (x, y, c, s, vx, vy, l) => this.addParticle(x, y, c, s, vx, vy, l), (x, y, t, c, s) => this.addFloatingText(x, y, t, c, s));
        }

        this.handleCollisions();

        if (this.rabbits.length < NUM_AI_RABBITS) {
            const idx = Math.floor(Math.random() * AI_NAMES.length);
            const newAi = new Rabbit(`ai_${Date.now()}`, AI_NAMES[idx], false, RABBIT_COLORS[idx % RABBIT_COLORS.length]);
            this.rabbits.push(newAi);
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(dt);
            if (this.particles[i].life <= 0) this.particles.splice(i, 1);
        }

        for (let i = 0; i < this.floatingTexts.length; i++) {
            this.floatingTexts[i].update(dt);
            if (this.floatingTexts[i].life <= 0) this.floatingTexts.splice(i, 1);
        }

        this.updateHUD();
    }

    updateHUD() {
        if (this.player && this.rabbits.includes(this.player)) {
            document.getElementById('hud-level').innerText = `Nível ${this.player.level}`;
            document.getElementById('hud-carrots').innerText = `(${this.player.carrotsEaten} cenouras)`;
        } else {
            document.getElementById('hud-level').innerText = `Nível 0`;
            document.getElementById('hud-carrots').innerText = `(Derrotado)`;
        }

        const sortedRabbits = [...this.rabbits].sort((a, b) => b.level - a.level).slice(0, 5);
        const lbList = document.getElementById('leaderboard-list');
        lbList.innerHTML = '';

        sortedRabbits.forEach((r, idx) => {
            const li = document.createElement('li');
            li.className = `flex justify-between items-center ${r.isPlayer ? 'text-amber-300 font-extrabold' : 'text-slate-300'}`;
            li.innerHTML = `
                <span class="truncate max-w-[130px]">${idx + 1}. ${r.name} ${r.isPlayer ? '👑' : ''}</span>
                <span class="font-game text-amber-400">Nív ${r.level}</span>
            `;
            lbList.appendChild(li);
        });

        this.renderMinimap();
    }

    renderMinimap() {
        const ctx = this.minimapCtx;
        const w = this.minimapCanvas.width;
        const h = this.minimapCanvas.height;

        ctx.clearRect(0, 0, w, h);

        const scale = w / WORLD_SIZE;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.camera.x * scale, this.camera.y * scale, this.camera.w * scale, this.camera.h * scale);

        for (let r of this.rabbits) {
            ctx.fillStyle = r.isPlayer ? '#F59E0B' : '#60A5FA';
            ctx.beginPath();
            ctx.arc(r.x * scale, r.y * scale, r.isPlayer ? 4 : 2.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        let scaleX = this.canvas.width / this.camera.w;
        let scaleY = this.canvas.height / this.camera.h;
        this.ctx.scale(scaleX, scaleY);

        const tileSize = 120;
        const startX = Math.floor(this.camera.x / tileSize) * tileSize;
        const startY = Math.floor(this.camera.y / tileSize) * tileSize;

        this.ctx.lineWidth = 1;
        for (let x = startX; x < this.camera.x + this.camera.w + tileSize; x += tileSize) {
            for (let y = startY; y < this.camera.y + this.camera.h + tileSize; y += tileSize) {
                const screenX = x - this.camera.x;
                const screenY = y - this.camera.y;

                const isEven = (Math.floor(x / tileSize) + Math.floor(y / tileSize)) % 2 === 0;
                this.ctx.fillStyle = isEven ? '#064E3B' : '#022C22';
                this.ctx.fillRect(screenX, screenY, tileSize, tileSize);
            }
        }

        this.ctx.strokeStyle = '#EF4444';
        this.ctx.lineWidth = 6;
        this.ctx.strokeRect(-this.camera.x, -this.camera.y, WORLD_SIZE, WORLD_SIZE);

        for (let c of this.carrots) {
            c.draw(this.ctx, this.camera);
        }

        const renderables = [...this.rabbits, ...this.trees];
        renderables.sort((a, b) => a.y - b.y);

        for (let entity of renderables) {
            entity.draw(this.ctx, this.camera);
        }

        for (let p of this.particles) {
            p.draw(this.ctx, this.camera);
        }

        for (let ft of this.floatingTexts) {
            ft.draw(this.ctx, this.camera);
        }

        this.ctx.restore();
    }

    gameLoop(timestamp) {
        if (!this.isRunning) return;

        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
        this.lastTime = timestamp;

        this.update(dt);
        this.draw();

        requestAnimationFrame((t) => this.gameLoop(t));
    }
}