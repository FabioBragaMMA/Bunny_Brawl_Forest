import { audio } from './sound.js';

export const WORLD_SIZE = 2800;
export const BASE_RADIUS = 22;
export const BASE_SPEED = 210;

export const RABBIT_COLORS = [
    { body: '#F3F4F6', ear: '#EC4899' },
    { body: '#9CA3AF', ear: '#F43F5E' },
    { body: '#D97706', ear: '#FDE047' },
    { body: '#8B5CF6', ear: '#C084FC' },
    { body: '#06B6D4', ear: '#67E8F9' },
    { body: '#10B981', ear: '#6EE7B7' },
    { body: '#F43F5E', ear: '#FDA4AF' }
];

export class Particle {
    constructor(x, y, color, size, vx, vy, life) {
        this.x = x; this.y = y; this.color = color;
        this.size = size; this.vx = vx; this.vy = vy;
        this.life = life; this.maxLife = life;
    }
    update(dt) { this.x += this.vx * dt; this.y += this.vy * dt; this.life -= dt; }
    draw(ctx, camera) {
        if (this.life <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
        ctx.fillStyle = this.color;
        ctx.beginPath(); ctx.arc(this.x - camera.x, this.y - camera.y, this.size, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }
}

export class FloatingText {
    constructor(x, y, text, color, fontSize = 20) {
        this.x = x; this.y = y; this.text = text;
        this.color = color; this.fontSize = fontSize;
        this.life = 1.2; this.maxLife = 1.2;
    }
    update(dt) { this.y -= 35 * dt; this.life -= dt; }
    draw(ctx, camera) {
        if (this.life <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
        ctx.font = `900 ${this.fontSize}px 'Fredoka One', cursive`;
        ctx.fillStyle = this.color; ctx.strokeStyle = '#000000'; ctx.lineWidth = 4; ctx.textAlign = 'center';
        ctx.strokeText(this.text, this.x - camera.x, this.y - camera.y);
        ctx.fillText(this.text, this.x - camera.x, this.y - camera.y);
        ctx.restore();
    }
}

export class Carrot {
    constructor() { this.respawn(); }
    respawn() {
        this.x = Math.random() * (WORLD_SIZE - 200) + 100;
        this.y = Math.random() * (WORLD_SIZE - 200) + 100;
        this.radius = 10;
        this.bounceOffset = Math.random() * Math.PI * 2;
    }
    draw(ctx, camera) {
        const sx = this.x - camera.x, sy = this.y - camera.y;
        if (sx < -30 || sx > camera.w + 30 || sy < -30 || sy > camera.h + 30) return;
        const bounce = Math.sin(Date.now() * 0.005 + this.bounceOffset) * 3;
        ctx.save(); ctx.translate(sx, sy + bounce);
        ctx.fillStyle = '#22C55E';
        ctx.beginPath(); ctx.arc(-2, -8, 4, 0, Math.PI * 2); ctx.arc(2, -8, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#F97316';
        ctx.beginPath(); ctx.moveTo(-7, -4); ctx.lineTo(7, -4); ctx.lineTo(0, 10); ctx.closePath(); ctx.fill();
        ctx.restore();
    }
}

export class GoldenCarrot {
    constructor() { this.respawn(); }
    respawn() {
        this.x = Math.random() * (WORLD_SIZE - 200) + 100;
        this.y = Math.random() * (WORLD_SIZE - 200) + 100;
        this.radius = 12;
        this.bounceOffset = Math.random() * Math.PI * 2;
    }
    draw(ctx, camera) {
        const sx = this.x - camera.x, sy = this.y - camera.y;
        if (sx < -30 || sx > camera.w + 30 || sy < -30 || sy > camera.h + 30) return;
        const bounce = Math.sin(Date.now() * 0.008 + this.bounceOffset) * 4;
        ctx.save(); ctx.translate(sx, sy + bounce);
        ctx.fillStyle = '#FACC15';
        ctx.beginPath(); ctx.moveTo(-8, -4); ctx.lineTo(8, -4); ctx.lineTo(0, 12); ctx.closePath(); ctx.fill();
        ctx.restore();
    }
}

export class ShieldCarrot {
    constructor() { this.respawn(); }
    respawn() { this.x = Math.random() * (WORLD_SIZE - 200) + 100; this.y = Math.random() * (WORLD_SIZE - 200) + 100; this.radius = 14; }
    draw(ctx, camera) {
        const sx = this.x - camera.x, sy = this.y - camera.y;
        if (sx < -30 || sx > camera.w + 30 || sy < -30 || sy > camera.h + 30) return;
        ctx.save(); ctx.translate(sx, sy);
        ctx.fillStyle = '#3B82F6'; ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#FFFFFF'; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("🛡️", 0, 1);
        ctx.restore();
    }
}

export class MagnetCarrot {
    constructor() { this.respawn(); }
    respawn() { this.x = Math.random() * (WORLD_SIZE - 200) + 100; this.y = Math.random() * (WORLD_SIZE - 200) + 100; this.radius = 14; }
    draw(ctx, camera) {
        const sx = this.x - camera.x, sy = this.y - camera.y;
        if (sx < -30 || sx > camera.w + 30 || sy < -30 || sy > camera.h + 30) return;
        ctx.save(); ctx.translate(sx, sy);
        ctx.fillStyle = '#A855F7'; ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#FFFFFF'; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("🧲", 0, 1);
        ctx.restore();
    }
}

export class GiantMushroom {
    constructor() { this.respawn(); }
    respawn() { this.x = Math.random() * (WORLD_SIZE - 200) + 100; this.y = Math.random() * (WORLD_SIZE - 200) + 100; this.radius = 14; }
    draw(ctx, camera) {
        const sx = this.x - camera.x, sy = this.y - camera.y;
        if (sx < -30 || sx > camera.w + 30 || sy < -30 || sy > camera.h + 30) return;
        ctx.save(); ctx.translate(sx, sy);
        ctx.fillStyle = '#EF4444'; ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#FFFFFF'; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("🍄", 0, 1);
        ctx.restore();
    }
}

export class PredatorEagle {
    constructor() {
        this.x = Math.random() * WORLD_SIZE;
        this.y = Math.random() * WORLD_SIZE;
        this.radius = 55; // Raio aumentado consideravelmente para ficar bem maior que o coelho
        this.speed = 160;
        this.angle = Math.random() * Math.PI * 2;
        this.changeTimer = 0;
    }
    update(dt, rabbits) {
        this.changeTimer -= dt;
        if (this.changeTimer <= 0) {
            this.changeTimer = 2.0;
            let closest = null;
            let minDist = 700;
            for (let r of rabbits) {
                let d = Math.hypot(r.x - this.x, r.y - this.y);
                if (d < minDist) { minDist = d; closest = r; }
            }
            if (closest) {
                this.angle = Math.atan2(closest.y - this.y, closest.x - this.x);
            } else {
                this.angle += (Math.random() - 0.5) * 2;
            }
        }
        this.x += Math.cos(this.angle) * this.speed * dt;
        this.y += Math.sin(this.angle) * this.speed * dt;
        this.x = Math.max(80, Math.min(WORLD_SIZE - 80, this.x));
        this.y = Math.max(80, Math.min(WORLD_SIZE - 80, this.y));
    }
    draw(ctx, camera) {
        const sx = this.x - camera.x, sy = this.y - camera.y;
        if (sx < -120 || sx > camera.w + 120 || sy < -120 || sy > camera.h + 120) return;
        
        ctx.save(); 
        ctx.translate(sx, sy);

        // Sombra maior e proporcional no chão
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath(); 
        ctx.ellipse(0, 50, 40, 14, 0, 0, Math.PI * 2); 
        ctx.fill();

        // Águia de tamanho grande e imponente
        ctx.fillStyle = '#FFFFFF'; 
        ctx.font = "bold 56px sans-serif"; 
        ctx.textAlign = "center"; 
        ctx.textBaseline = "middle";
        ctx.fillText("🦅", 0, 0);

        ctx.restore();
    }
}

export class Tree {
    constructor() { this.x = Math.random() * WORLD_SIZE; this.y = Math.random() * WORLD_SIZE; this.radius = 35 + Math.random() * 25; }
    draw(ctx, camera) {
        const sx = this.x - camera.x, sy = this.y - camera.y;
        if (sx < -100 || sx > camera.w + 100 || sy < -100 || sy > camera.h + 100) return;
        ctx.save(); ctx.translate(sx, sy);
        ctx.fillStyle = '#064E3B'; ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }
}

export class Rabbit {
    constructor(id, name, isPlayer = false, colorScheme = RABBIT_COLORS[0], accessory = 'none') {
        this.id = id; this.name = name; this.isPlayer = isPlayer;
        this.colors = colorScheme; this.accessory = accessory;

        this.level = 1; this.carrotsEaten = 0;
        this.x = Math.random() * (WORLD_SIZE - 400) + 200;
        this.y = Math.random() * (WORLD_SIZE - 400) + 200;
        this.vx = 0; this.vy = 0; this.angle = Math.random() * Math.PI * 2;
        this.hopTimer = Math.random() * 10; this.hopHeight = 0;

        this.targetCarrot = null; this.aiChangeTimer = 0; this.aiWanderAngle = Math.random() * Math.PI * 2;
        this.dashCooldown = 0; this.dashTimer = 0; this.isDashing = false;
        this.invulnerableTimer = 0; this.speedBoostTimer = 0;
        this.shieldTimer = 0; this.magnetTimer = 0; this.giantTimer = 0;
    }

    getRadius() {
        let base = Math.min(BASE_RADIUS + (this.level - 1) * 2.2, 60);
        if (this.giantTimer > 0) base *= 1.4;
        return base;
    }

    getSpeed() {
        let base = BASE_SPEED + Math.min(this.level * 3, 100);
        if (this.speedBoostTimer > 0) base *= 1.6;
        return base;
    }

    addLevel(amount = 1) {
        this.level += amount;
        this.carrotsEaten += amount;
        if (this.isPlayer) audio.playLevelUp();
    }

    resetLevel() {
        const lost = this.level - 1;
        this.level = 1;
        return lost;
    }

    update(dt, inputDir, carrots) {
        if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;
        if (this.dashCooldown > 0) this.dashCooldown -= dt;
        if (this.speedBoostTimer > 0) this.speedBoostTimer -= dt;
        if (this.shieldTimer > 0) this.shieldTimer -= dt;
        if (this.magnetTimer > 0) this.magnetTimer -= dt;
        if (this.giantTimer > 0) this.giantTimer -= dt;

        let moveX = 0, moveY = 0;
        if (this.isPlayer) {
            moveX = inputDir.x; moveY = inputDir.y;
            if (inputDir.dash && this.dashCooldown <= 0 && (moveX !== 0 || moveY !== 0)) {
                this.isDashing = true; this.dashTimer = 0.25; this.dashCooldown = 1.8;
                audio.playEat();
            }
        } else {
            this.aiChangeTimer -= dt;
            if (!this.targetCarrot || this.aiChangeTimer <= 0) {
                this.aiChangeTimer = 1.5 + Math.random() * 2;
                let minDist = 450; this.targetCarrot = null;
                for (let c of carrots) {
                    let d = Math.hypot(c.x - this.x, c.y - this.y);
                    if (d < minDist) { minDist = d; this.targetCarrot = c; }
                }
            }
            if (this.targetCarrot) {
                let dx = this.targetCarrot.x - this.x, dy = this.targetCarrot.y - this.y;
                let len = Math.hypot(dx, dy);
                if (len > 0) { moveX = dx / len; moveY = dy / len; }
            } else {
                moveX = Math.cos(this.aiWanderAngle); moveY = Math.sin(this.aiWanderAngle);
            }
        }

        if (this.magnetTimer > 0) {
            for (let c of carrots) {
                let d = Math.hypot(this.x - c.x, this.y - c.y);
                if (d < 220) { c.x += (this.x - c.x) * 5 * dt; c.y += (this.y - c.y) * 5 * dt; }
            }
        }

        let speedMultiplier = 1;
        if (this.isDashing) {
            this.dashTimer -= dt; speedMultiplier = 2.2;
            if (this.dashTimer <= 0) this.isDashing = false;
        }

        let mag = Math.hypot(moveX, moveY);
        if (mag > 0) { moveX /= mag; moveY /= mag; this.angle = Math.atan2(moveY, moveX); }

        const curSpeed = this.getSpeed() * speedMultiplier;
        this.vx = moveX * curSpeed; this.vy = moveY * curSpeed;
        this.x += this.vx * dt; this.y += this.vy * dt;

        const r = this.getRadius();
        this.x = Math.max(r, Math.min(WORLD_SIZE - r, this.x));
        this.y = Math.max(r, Math.min(WORLD_SIZE - r, this.y));

        this.hopHeight = (mag > 0 || this.isDashing) ? Math.abs(Math.sin(Date.now() * 0.02)) * 12 : 0;
    }

    draw(ctx, camera) {
        const sx = this.x - camera.x, sy = this.y - camera.y, r = this.getRadius();
        if (sx < -r * 2 || sx > camera.w + r * 2 || sy < -r * 2 || sy > camera.h + r * 2) return;

        ctx.save(); 
        ctx.translate(sx, sy - this.hopHeight);

        if (this.shieldTimer > 0) {
            ctx.strokeStyle = '#3B82F6'; 
            ctx.lineWidth = 4;
            ctx.beginPath(); 
            ctx.arc(0, 0, r + 8, 0, Math.PI * 2); 
            ctx.stroke();
        }

        ctx.rotate(this.angle + Math.PI / 2);

        // Orelha Esquerda
        ctx.fillStyle = this.colors.body;
        ctx.beginPath();
        ctx.ellipse(-r * 0.4, -r * 0.9, r * 0.28, r * 0.65, -0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = this.colors.ear;
        ctx.beginPath();
        ctx.ellipse(-r * 0.4, -r * 0.9, r * 0.16, r * 0.45, -0.1, 0, Math.PI * 2);
        ctx.fill();

        // Orelha Direita
        ctx.fillStyle = this.colors.body;
        ctx.beginPath();
        ctx.ellipse(r * 0.4, -r * 0.9, r * 0.28, r * 0.65, 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = this.colors.ear;
        ctx.beginPath();
        ctx.ellipse(r * 0.4, -r * 0.9, r * 0.16, r * 0.45, 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Corpo
        ctx.fillStyle = this.colors.body;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        // Olhos
        ctx.fillStyle = '#111827';
        ctx.beginPath();
        ctx.arc(-r * 0.35, -r * 0.35, r * 0.14, 0, Math.PI * 2);
        ctx.arc(r * 0.35, -r * 0.35, r * 0.14, 0, Math.PI * 2);
        ctx.fill();

        // Nariz
        ctx.fillStyle = '#F43F5E';
        ctx.beginPath();
        ctx.arc(0, -r * 0.2, r * 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Acessórios
        if (this.accessory === 'glasses') {
            ctx.fillStyle = '#000000';
            ctx.fillRect(-r * 0.6, -r * 0.5, r * 1.2, r * 0.3);
        } else if (this.accessory === 'crown') {
            ctx.fillStyle = '#FACC15';
            ctx.beginPath();
            ctx.moveTo(-r * 0.5, -r * 0.8);
            ctx.lineTo(-r * 0.6, -r * 1.4);
            ctx.lineTo(0, -r * 1.0);
            ctx.lineTo(r * 0.6, -r * 1.4);
            ctx.lineTo(r * 0.5, -r * 0.8);
            ctx.closePath();
            ctx.fill();
        } else if (this.accessory === 'santa') {
            ctx.fillStyle = '#EF4444';
            ctx.beginPath();
            ctx.arc(0, -r * 0.8, r * 0.6, 0, Math.PI, true);
            ctx.fill();
        } else if (this.accessory === 'ninja') {
            ctx.fillStyle = '#1E293B';
            ctx.fillRect(-r * 0.9, -r * 0.5, r * 1.8, r * 0.35);
        }

        ctx.restore();

        // HUD do Coelho
        ctx.save(); 
        ctx.translate(sx, sy - r - 16 - this.hopHeight);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)'; 
        ctx.beginPath(); 
        ctx.roundRect(-45, -12, 90, 20, 6); 
        ctx.fill();

        ctx.fillStyle = this.isPlayer ? '#F59E0B' : '#3B82F6'; 
        ctx.beginPath(); 
        ctx.arc(-35, -2, 10, 0, Math.PI * 2); 
        ctx.fill();

        ctx.fillStyle = '#FFFFFF'; 
        ctx.font = "900 10px 'Nunito', sans-serif"; 
        ctx.textAlign = 'center'; 
        ctx.fillText(this.level, -35, 1.5);

        ctx.font = "800 11px 'Nunito', sans-serif"; 
        ctx.fillStyle = this.isPlayer ? '#FDE047' : '#FFFFFF'; 
        ctx.textAlign = 'left'; 
        ctx.fillText(this.name.slice(0, 8), -20, 1.5);
        
        ctx.restore();
    }
}