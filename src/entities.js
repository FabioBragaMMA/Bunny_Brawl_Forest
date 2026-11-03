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
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.vx = vx;
        this.vy = vy;
        this.life = life;
        this.maxLife = life;
    }
    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.life -= dt;
    }
    draw(ctx, camera) {
        if (this.life <= 0) return;
        const alpha = Math.max(0, this.life / this.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x - camera.x, this.y - camera.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

export class FloatingText {
    constructor(x, y, text, color, fontSize = 20) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.color = color;
        this.fontSize = fontSize;
        this.life = 1.2;
        this.maxLife = 1.2;
    }
    update(dt) {
        this.y -= 35 * dt;
        this.life -= dt;
    }
    draw(ctx, camera) {
        if (this.life <= 0) return;
        const alpha = Math.max(0, this.life / this.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = `900 ${this.fontSize}px 'Fredoka One', cursive`;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.textAlign = 'center';
        ctx.strokeText(this.text, this.x - camera.x, this.y - camera.y);
        ctx.fillText(this.text, this.x - camera.x, this.y - camera.y);
        ctx.restore();
    }
}

export class Carrot {
    constructor() {
        this.respawn();
    }
    respawn() {
        this.x = Math.random() * (WORLD_SIZE - 200) + 100;
        this.y = Math.random() * (WORLD_SIZE - 200) + 100;
        this.radius = 10;
        this.bounceOffset = Math.random() * Math.PI * 2;
    }
    draw(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        if (screenX < -30 || screenX > camera.w + 30 || screenY < -30 || screenY > camera.h + 30) return;

        const bounce = Math.sin(Date.now() * 0.005 + this.bounceOffset) * 3;

        ctx.save();
        ctx.translate(screenX, screenY + bounce);

        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(0, 10 - bounce * 0.5, 10, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#22C55E';
        ctx.beginPath();
        ctx.arc(-2, -8, 4, 0, Math.PI * 2);
        ctx.arc(2, -8, 4, 0, Math.PI * 2);
        ctx.arc(0, -11, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#F97316';
        ctx.beginPath();
        ctx.moveTo(-7, -4);
        ctx.lineTo(7, -4);
        ctx.lineTo(0, 10);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}

// Cenoura Especial Dourada (Dá Velocidade Extra)
export class GoldenCarrot {
    constructor() {
        this.respawn();
    }
    respawn() {
        this.x = Math.random() * (WORLD_SIZE - 200) + 100;
        this.y = Math.random() * (WORLD_SIZE - 200) + 100;
        this.radius = 12;
        this.bounceOffset = Math.random() * Math.PI * 2;
    }
    draw(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        if (screenX < -30 || screenX > camera.w + 30 || screenY < -30 || screenY > camera.h + 30) return;

        const bounce = Math.sin(Date.now() * 0.008 + this.bounceOffset) * 4;

        ctx.save();
        ctx.translate(screenX, screenY + bounce);

        ctx.fillStyle = 'rgba(250, 204, 21, 0.4)';
        ctx.beginPath();
        ctx.arc(0, 2, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(-2, -8, 4, 0, Math.PI * 2);
        ctx.arc(2, -8, 4, 0, Math.PI * 2);
        ctx.arc(0, -11, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FACC15';
        ctx.beginPath();
        ctx.moveTo(-8, -4);
        ctx.lineTo(8, -4);
        ctx.lineTo(0, 12);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}

export class Tree {
    constructor() {
        this.x = Math.random() * WORLD_SIZE;
        this.y = Math.random() * WORLD_SIZE;
        this.radius = 35 + Math.random() * 25;
    }
    draw(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        if (screenX < -100 || screenX > camera.w + 100 || screenY < -100 || screenY > camera.h + 100) return;

        ctx.save();
        ctx.translate(screenX, screenY);

        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.beginPath();
        ctx.ellipse(10, 15, this.radius * 0.9, this.radius * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#064E3B';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#047857';
        ctx.beginPath();
        ctx.arc(-this.radius * 0.2, -this.radius * 0.2, this.radius * 0.75, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

export class Rabbit {
    constructor(id, name, isPlayer = false, colorScheme = RABBIT_COLORS[0]) {
        this.id = id;
        this.name = name;
        this.isPlayer = isPlayer;
        this.colors = colorScheme;

        this.level = 1;
        this.carrotsEaten = 0;

        this.x = Math.random() * (WORLD_SIZE - 400) + 200;
        this.y = Math.random() * (WORLD_SIZE - 400) + 200;
        
        this.vx = 0;
        this.vy = 0;
        this.angle = Math.random() * Math.PI * 2;
        
        this.hopTimer = Math.random() * 10;
        this.hopHeight = 0;

        this.targetCarrot = null;
        this.aiChangeTimer = 0;
        this.aiWanderAngle = Math.random() * Math.PI * 2;

        this.dashCooldown = 0;
        this.dashTimer = 0;
        this.isDashing = false;

        this.invulnerableTimer = 0;
        this.speedBoostTimer = 0; // Temporizador para o bónus de velocidade da cenoura dourada
    }

    getRadius() {
        return Math.min(BASE_RADIUS + (this.level - 1) * 2.2, 60);
    }

    getSpeed() {
        let base = BASE_SPEED + Math.min(this.level * 3, 100);
        if (this.speedBoostTimer > 0) base *= 1.6; // +60% de velocidade com a cenoura especial!
        return base;
    }

    addLevel(amount = 1) {
        this.level += amount;
        this.carrotsEaten += amount;
    }

    resetLevel() {
        const lost = this.level - 1;
        this.level = 1;
        return lost;
    }

    update(dt, inputDir, carrots, otherRabbits, addParticle, addText) {
        if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;
        if (this.dashCooldown > 0) this.dashCooldown -= dt;
        if (this.speedBoostTimer > 0) this.speedBoostTimer -= dt;

        let moveX = 0;
        let moveY = 0;

        if (this.isPlayer) {
            moveX = inputDir.x;
            moveY = inputDir.y;

            if (inputDir.dash && this.dashCooldown <= 0 && (moveX !== 0 || moveY !== 0)) {
                this.isDashing = true;
                this.dashTimer = 0.25;
                this.dashCooldown = 1.8;
                audio.playEat();
                addText(this.x, this.y - this.getRadius() - 15, "DASH!", "#FBBF24", 16);
            }
        } else {
            this.aiChangeTimer -= dt;
            if (!this.targetCarrot || this.aiChangeTimer <= 0) {
                this.aiChangeTimer = 1.5 + Math.random() * 2;
                let minDist = 450;
                this.targetCarrot = null;
                for (let c of carrots) {
                    let d = Math.hypot(c.x - this.x, c.y - this.y);
                    if (d < minDist) {
                        minDist = d;
                        this.targetCarrot = c;
                    }
                }
                if (!this.targetCarrot) {
                    this.aiWanderAngle += (Math.random() - 0.5) * 1.5;
                }
            }

            if (this.targetCarrot) {
                let dx = this.targetCarrot.x - this.x;
                let dy = this.targetCarrot.y - this.y;
                let len = Math.hypot(dx, dy);
                if (len > 0) {
                    moveX = dx / len;
                    moveY = dy / len;
                }
            } else {
                moveX = Math.cos(this.aiWanderAngle);
                moveY = Math.sin(this.aiWanderAngle);
            }
        }

        let speedMultiplier = 1;
        if (this.isDashing) {
            this.dashTimer -= dt;
            speedMultiplier = 2.2;
            if (this.dashTimer <= 0) this.isDashing = false;

            if (Math.random() < 0.6) {
                addParticle(
                    this.x + (Math.random() - 0.5) * 10,
                    this.y + (Math.random() - 0.5) * 10,
                    'rgba(255,255,255,0.4)',
                    this.getRadius() * 0.4,
                    -moveX * 50, -moveY * 50,
                    0.3
                );
            }
        }

        let mag = Math.hypot(moveX, moveY);
        if (mag > 0) {
            moveX /= mag;
            moveY /= mag;
            this.angle = Math.atan2(moveY, moveX);
        }

        const curSpeed = this.getSpeed() * speedMultiplier;
        this.vx = moveX * curSpeed;
        this.vy = moveY * curSpeed;

        this.x += this.vx * dt;
        this.y += this.vy * dt;

        const r = this.getRadius();
        this.x = Math.max(r, Math.min(WORLD_SIZE - r, this.x));
        this.y = Math.max(r, Math.min(WORLD_SIZE - r, this.y));

        if (mag > 0 || this.isDashing) {
            this.hopTimer += dt * 14;
            this.hopHeight = Math.abs(Math.sin(this.hopTimer)) * 12;
        } else {
            this.hopHeight = 0;
        }
    }

    draw(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        const r = this.getRadius();

        if (screenX < -r * 2 || screenX > camera.w + r * 2 || screenY < -r * 2 || screenY > camera.h + r * 2) return;

        ctx.save();
        ctx.translate(screenX, screenY - this.hopHeight);

        if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.globalAlpha = 0.4;
        }

        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.beginPath();
        ctx.ellipse(0, r * 0.8 + this.hopHeight, r * 0.8, r * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.rotate(this.angle + Math.PI / 2);

        ctx.fillStyle = this.colors.body;
        ctx.beginPath();
        ctx.ellipse(-r * 0.4, -r * 0.9, r * 0.28, r * 0.65, -0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = this.colors.ear;
        ctx.beginPath();
        ctx.ellipse(-r * 0.4, -r * 0.9, r * 0.16, r * 0.45, -0.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = this.colors.body;
        ctx.beginPath();
        ctx.ellipse(r * 0.4, -r * 0.9, r * 0.28, r * 0.65, 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = this.colors.ear;
        ctx.beginPath();
        ctx.ellipse(r * 0.4, -r * 0.9, r * 0.16, r * 0.45, 0.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = this.colors.body;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#111827';
        ctx.beginPath();
        ctx.arc(-r * 0.35, -r * 0.35, r * 0.14, 0, Math.PI * 2);
        ctx.arc(r * 0.35, -r * 0.35, r * 0.14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#F43F5E';
        ctx.beginPath();
        ctx.arc(0, -r * 0.2, r * 0.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        ctx.save();
        ctx.translate(screenX, screenY - r - 16 - this.hopHeight);
        
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