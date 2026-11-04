import { audio } from './sound.js';
import { Rabbit, Carrot, GoldenCarrot, ShieldCarrot, MagnetCarrot, GiantMushroom, PredatorEagle, Tree, Particle, FloatingText, WORLD_SIZE, RABBIT_COLORS } from './entities.js';

const AI_NAMES = ["OrelhaFura", "CoelhoDuro", "Dentola", "CenouraKing", "PernaLigeira", "Saltitão", "Velocidade", "FofoBrutal"];

export class GameEngine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.minimapCanvas = document.getElementById('minimap');
        this.minimapCtx = this.minimapCanvas.getContext('2d');

        this.camera = { x: 0, y: 0, w: window.innerWidth, h: window.innerHeight };
        this.input = { x: 0, y: 0, dash: false };
        this.keys = {};

        this.carrots = []; this.goldenCarrots = []; this.shields = []; this.magnets = []; this.mushrooms = [];
        this.eagles = []; this.trees = []; this.rabbits = []; this.particles = []; this.floatingTexts = [];

        this.player = null; this.isRunning = false; this.lastTime = 0; this.screenShake = 0;
        this.difficulty = 'normal'; this.isDarkMode = true;

        this.stats = { time: 0, wins: 0, goldenCollected: 0 };
        this.highScore = parseInt(localStorage.getItem('bunny_highscore') || '1');
        this.unlockedAchievements = JSON.parse(localStorage.getItem('bunny_achievements') || '{}');

        this.initEventListeners();
        this.resize();
    }

    resize() {
        this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight;
        this.camera.w = window.innerWidth; this.camera.h = window.innerHeight;
    }

    initEventListeners() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('keydown', (e) => { this.keys[e.code] = true; if (e.code === 'Space') this.input.dash = true; });
        window.addEventListener('keyup', (e) => { this.keys[e.code] = false; if (e.code === 'Space') this.input.dash = false; });

        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.diff-btn').forEach(b => b.className = "diff-btn py-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all");
                this.difficulty = e.target.getAttribute('data-diff');
                e.target.className = "diff-btn py-1.5 bg-amber-500/20 border border-amber-500 text-amber-300 rounded-xl text-xs font-bold transition-all";
            });
        });

        document.getElementById('btn-theme-toggle').addEventListener('click', () => {
            this.isDarkMode = !this.isDarkMode;
            document.getElementById('app-body').classList.toggle('dark', this.isDarkMode);
            document.getElementById('theme-icon').innerText = this.isDarkMode ? '☀️' : '🌙';
            document.getElementById('theme-text').innerText = this.isDarkMode ? 'Modo Claro' : 'Modo Escuro';
        });

        document.getElementById('btn-start').addEventListener('click', () => {
            audio.init();
            const name = document.getElementById('player-name-input').value.trim() || "SuperCoelho";
            const skinIdx = parseInt(document.getElementById('skin-color-select').value);
            const accessory = document.getElementById('skin-accessory-select').value;
            this.startGame(name, skinIdx, accessory);
        });

        document.getElementById('btn-respawn').addEventListener('click', () => {
            audio.init();
            this.respawnPlayer();
        });
    }

    updateInput() {
        let kx = 0, ky = 0;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) kx -= 1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) kx += 1;
        if (this.keys['KeyW'] || this.keys['ArrowUp']) ky -= 1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) ky += 1;
        if (kx !== 0 || ky !== 0) { this.input.x = kx; this.input.y = ky; }
    }

    startGame(name, skinIdx, accessory) {
        document.getElementById('modal-overlay').classList.add('hidden');
        this.stats = { time: 0, wins: 0, goldenCollected: 0 };

        this.trees = []; for (let i = 0; i < 80; i++) this.trees.push(new Tree());
        this.carrots = []; for (let i = 0; i < 130; i++) this.carrots.push(new Carrot());
        this.goldenCarrots = []; for (let i = 0; i < 20; i++) this.goldenCarrots.push(new GoldenCarrot());
        this.shields = []; for (let i = 0; i < 6; i++) this.shields.push(new ShieldCarrot());
        this.magnets = []; for (let i = 0; i < 6; i++) this.magnets.push(new MagnetCarrot());
        this.mushrooms = []; for (let i = 0; i < 6; i++) this.mushrooms.push(new GiantMushroom());
        this.eagles = []; for (let i = 0; i < 4; i++) this.eagles.push(new PredatorEagle());

        const colorScheme = RABBIT_COLORS[skinIdx] || RABBIT_COLORS[0];
        this.player = new Rabbit('player', name, true, colorScheme, accessory);
        this.rabbits = [this.player];

        for (let i = 0; i < 14; i++) {
            const ai = new Rabbit(`ai_${i}`, AI_NAMES[i % AI_NAMES.length], false, RABBIT_COLORS[(i + 1) % RABBIT_COLORS.length]);
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
        const name = document.getElementById('player-name-input').value.trim() || "SuperCoelho";
        const skinIdx = parseInt(document.getElementById('skin-color-select').value);
        const accessory = document.getElementById('skin-accessory-select').value;
        this.player = new Rabbit('player', name, true, RABBIT_COLORS[skinIdx], accessory);
        this.player.invulnerableTimer = 2.5;
        this.rabbits.push(this.player);
        this.stats = { time: 0, wins: 0, goldenCollected: 0 };
        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    checkAchievements(title) {
        if (!this.unlockedAchievements[title]) {
            this.unlockedAchievements[title] = true;
            localStorage.setItem('bunny_achievements', JSON.stringify(this.unlockedAchievements));
            const popup = document.getElementById('achievement-popup');
            document.getElementById('achievement-title').innerText = title;
            popup.classList.remove('opacity-0', 'pointer-events-none');
            setTimeout(() => popup.classList.add('opacity-0', 'pointer-events-none'), 4000);
        }
    }

    gameOver() {
        this.isRunning = false;
        document.getElementById('modal-overlay').classList.remove('hidden');
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('gameover-screen').classList.remove('hidden');

        if (this.player.level > this.highScore) {
            this.highScore = this.player.level;
            localStorage.setItem('bunny_highscore', this.highScore);
        }

        document.getElementById('stat-time').innerText = `${Math.floor(this.stats.time)}s`;
        document.getElementById('stat-wins').innerText = this.stats.wins;
        document.getElementById('stat-golden').innerText = this.stats.goldenCollected;
        document.getElementById('stat-highscore').innerText = `Nível ${this.highScore}`;
        audio.playHit();
    }

    addFloatingText(x, y, text, color, size = 20) {
        this.floatingTexts.push(new FloatingText(x, y, text, color, size));
    }

    logCombat(msg) {
        const log = document.getElementById('combat-log');
        if (!log) return;
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
                if (Math.hypot(c.x - r.x, c.y - r.y) < rRadius + c.radius) {
                    c.respawn(); r.addLevel(1);
                    if (r.isPlayer && r.carrotsEaten >= 50) this.checkAchievements("Comilão da Floresta (50 Cenouras)");
                }
            }

            for (let gc of this.goldenCarrots) {
                if (Math.hypot(gc.x - r.x, gc.y - r.y) < rRadius + gc.radius) {
                    gc.respawn(); r.speedBoostTimer = 6.0; r.addLevel(2);
                    if (r.isPlayer) { this.stats.goldenCollected++; this.addFloatingText(r.x, r.y - rRadius, "⚡ VELOCIDADE!", "#FACC15", 20); }
                }
            }

            for (let s of this.shields) {
                if (Math.hypot(s.x - r.x, s.y - r.y) < rRadius + s.radius) {
                    s.respawn(); r.shieldTimer = 7.0;
                    if (r.isPlayer) this.addFloatingText(r.x, r.y - rRadius, "🛡️ ESCUDO ATIVO!", "#3B82F6", 20);
                }
            }

            for (let m of this.magnets) {
                if (Math.hypot(m.x - r.x, m.y - r.y) < rRadius + m.radius) {
                    m.respawn(); r.magnetTimer = 6.0;
                    if (r.isPlayer) this.addFloatingText(r.x, r.y - rRadius, "🧲 ÍMAN!", "#A855F7", 20);
                }
            }

            for (let gm of this.mushrooms) {
                if (Math.hypot(gm.x - r.x, gm.y - r.y) < rRadius + gm.radius) {
                    gm.respawn(); r.giantTimer = 6.0; r.addLevel(3);
                    if (r.isPlayer) this.addFloatingText(r.x, r.y - rRadius, "🍄 GIGANTE!", "#EF4444", 20);
                }
            }
        }

        for (let r of this.rabbits) {
            for (let e of this.eagles) {
                if (Math.hypot(e.x - r.x, e.y - r.y) < r.getRadius() + e.radius) {
                    if (r.shieldTimer > 0) {
                        r.shieldTimer = 0;
                    } else {
                        const lost = r.resetLevel();
                        this.addFloatingText(r.x, r.y - r.getRadius(), "🦅 ATAQUE DA ÁGUIA!", "#EF4444", 20);
                        if (r.isPlayer && r.level <= 1 && lost > 0) this.gameOver();
                    }
                }
            }
        }

        for (let i = 0; i < this.rabbits.length; i++) {
            for (let j = i + 1; j < this.rabbits.length; j++) {
                const r1 = this.rabbits[i], r2 = this.rabbits[j];
                if (Math.hypot(r2.x - r1.x, r2.y - r1.y) < r1.getRadius() + r2.getRadius()) {
                    if (r1.invulnerableTimer > 0 || r2.invulnerableTimer > 0) continue;

                    let winner = r1.level > r2.level ? r1 : (r2.level > r1.level ? r2 : (Math.random() < 0.5 ? r1 : r2));
                    let loser = winner === r1 ? r2 : r1;

                    if (loser.shieldTimer > 0) { loser.shieldTimer = 0; continue; }

                    if (winner.isPlayer && loser.level >= winner.level + 5) {
                        this.checkAchievements("Caçador de Gigantes (+5 Níveis)");
                    }

                    const stolen = loser.resetLevel();
                    winner.addLevel(stolen);
                    loser.invulnerableTimer = 3.0;
                    audio.playBrawl();

                    if (winner.isPlayer) this.stats.wins++;
                    this.logCombat(`⚔️ <b>${winner.name}</b> derrotou <b>${loser.name}</b>!`);

                    if (loser.isPlayer) {
                        this.rabbits = this.rabbits.filter(r => r !== loser);
                        this.gameOver();
                    }
                }
            }
        }
    }

    update(dt) {
        this.stats.time += dt;
        this.updateInput();

        if (this.player && this.rabbits.includes(this.player)) {
            let zoom = Math.max(0.6, 1.0 - (this.player.level - 1) * 0.015);
            let tw = window.innerWidth / zoom, th = window.innerHeight / zoom;
            this.camera.w += (tw - this.camera.w) * 0.1;
            this.camera.h += (th - this.camera.h) * 0.1;
            this.camera.x += (this.player.x - tw / 2 - this.camera.x) * 0.1;
            this.camera.y += (this.player.y - th / 2 - this.camera.y) * 0.1;
        }

        this.camera.x = Math.max(0, Math.min(WORLD_SIZE - this.camera.w, this.camera.x));
        this.camera.y = Math.max(0, Math.min(WORLD_SIZE - this.camera.h, this.camera.y));

        for (let r of this.rabbits) r.update(dt, this.input, this.carrots);
        for (let e of this.eagles) e.update(dt, this.rabbits);

        this.handleCollisions();

        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            this.floatingTexts[i].update(dt);
            if (this.floatingTexts[i].life <= 0) this.floatingTexts.splice(i, 1);
        }

        this.updateHUD();
    }

    updateHUD() {
        if (this.player && this.rabbits.includes(this.player)) {
            document.getElementById('hud-level').innerText = `Nível ${this.player.level}`;
            document.getElementById('hud-carrots').innerText = `(${this.player.carrotsEaten} cenouras)`;
        }

        const sorted = [...this.rabbits].sort((a, b) => b.level - a.level).slice(0, 5);
        const lb = document.getElementById('leaderboard-list');
        if (!lb) return;
        lb.innerHTML = '';
        sorted.forEach((r, idx) => {
            const li = document.createElement('li');
            li.className = `flex justify-between items-center ${r.isPlayer ? 'text-amber-300 font-extrabold' : 'text-slate-300'}`;
            li.innerHTML = `<span>${idx + 1}. ${r.name} ${r.isPlayer ? '👑' : ''}</span><span class="text-amber-500">Nív ${r.level}</span>`;
            lb.appendChild(li);
        });

        const ctx = this.minimapCtx;
        if (ctx) {
            ctx.clearRect(0, 0, 100, 100);
            const scale = 100 / WORLD_SIZE;
            for (let r of this.rabbits) {
                ctx.fillStyle = r.isPlayer ? '#F59E0B' : '#60A5FA';
                ctx.beginPath(); ctx.arc(r.x * scale, r.y * scale, r.isPlayer ? 3.5 : 2, 0, Math.PI * 2); ctx.fill();
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.scale(this.canvas.width / this.camera.w, this.canvas.height / this.camera.h);

        const tileSize = 120;
        const startX = Math.floor(this.camera.x / tileSize) * tileSize;
        const startY = Math.floor(this.camera.y / tileSize) * tileSize;

        for (let x = startX; x < this.camera.x + this.camera.w + tileSize; x += tileSize) {
            for (let y = startY; y < this.camera.y + this.camera.h + tileSize; y += tileSize) {
                const isEven = (Math.floor(x / tileSize) + Math.floor(y / tileSize)) % 2 === 0;
                this.ctx.fillStyle = this.isDarkMode ? (isEven ? '#064E3B' : '#022C22') : (isEven ? '#86efac' : '#4ade80');
                this.ctx.fillRect(x - this.camera.x, y - this.camera.y, tileSize, tileSize);
            }
        }

        for (let c of this.carrots) c.draw(this.ctx, this.camera);
        for (let gc of this.goldenCarrots) gc.draw(this.ctx, this.camera);
        for (let s of this.shields) s.draw(this.ctx, this.camera);
        for (let m of this.magnets) m.draw(this.ctx, this.camera);
        for (let gm of this.mushrooms) gm.draw(this.ctx, this.camera);

        const renderables = [...this.rabbits, ...this.eagles, ...this.trees];
        renderables.sort((a, b) => a.y - b.y);
        for (let ent of renderables) ent.draw(this.ctx, this.camera);
        for (let ft of this.floatingTexts) ft.draw(this.ctx, this.camera);

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