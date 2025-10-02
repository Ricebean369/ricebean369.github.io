class Player {
    constructor(x, y) {
        // Position
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        
        // Physics
        this.velocity = { x: 0, y: 0 };
        this.speed = 200;
        
        // Stats
        this.health = 100;
        this.maxHealth = 100;
        this.mana = 100;
        this.maxMana = 100;
        this.level = 1;
        this.experience = 0;
        
        // Combat
        this.damage = 15;
        this.attackCooldown = 0;
        this.attackSpeed = 0.5;
        this.invulnerable = false;
        this.invulnerableTime = 0;
        
        // Resources
        this.bitFragments = 0;
        
        // Equipment
        this.weapon = 'Quantum Saber';
        this.armor = 'HTTP Armor Set';
        this.shield = null;
        
        // State
        this.facing = 'down';
        this.attacking = false;
        this.dodging = false;
        
        // Animation
        this.animFrame = 0;
        this.animTime = 0;
        this.animSpeed = 0.15;
        
        // Visual
        this.color = '#00ffff';
        this.glowIntensity = 0;
        
        // Sprite
        this.sprite = null;
    }
    
    update(deltaTime, input) {
        // Update timers
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }
        
        if (this.invulnerableTime > 0) {
            this.invulnerableTime -= deltaTime;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
            }
        }
        
        // Animation
        this.animTime += deltaTime;
        if (this.animTime >= this.animSpeed) {
            this.animTime = 0;
            this.animFrame = (this.animFrame + 1) % 4;
        }
        
        // Glow effect
        this.glowIntensity = Math.sin(Date.now() / 200) * 0.3 + 0.7;
        
        // Movement
        const movement = input.getMovementVector();
        this.velocity.x = movement.x * this.speed;
        this.velocity.y = movement.y * this.speed;
        
        // Update facing direction
        if (movement.x < 0) this.facing = 'left';
        else if (movement.x > 0) this.facing = 'right';
        else if (movement.y < 0) this.facing = 'up';
        else if (movement.y > 0) this.facing = 'down';
        
        // Attack
        if (input.isPressed('attack') && this.attackCooldown <= 0) {
            this.attack();
        }
        
        // Dodge
        if (input.isPressed('dodge') && !this.dodging) {
            this.dodge();
        }
        
        // Passive mana regeneration
        if (this.mana < this.maxMana) {
            this.mana += 10 * deltaTime;
            if (this.mana > this.maxMana) this.mana = this.maxMana;
        }
    }
    
    attack() {
        this.attacking = true;
        this.attackCooldown = this.attackSpeed;
        
        // Create attack hitbox based on facing direction
        const attackRange = 40;
        const attackWidth = 30;
        let hitbox = { x: this.x, y: this.y, width: attackWidth, height: attackWidth };
        
        switch(this.facing) {
            case 'up':
                hitbox.y -= attackRange;
                break;
            case 'down':
                hitbox.y += this.height;
                break;
            case 'left':
                hitbox.x -= attackRange;
                break;
            case 'right':
                hitbox.x += this.width;
                break;
        }
        
        this.attackHitbox = hitbox;
        
        // Attack particles
        if (window.particleSystem) {
            window.particleSystem.emit(
                hitbox.x + hitbox.width / 2,
                hitbox.y + hitbox.height / 2,
                {
                    count: 15,
                    color: '#ffff00',
                    size: 3,
                    speed: 150,
                    lifetime: 0.3,
                    spread: Math.PI / 3
                }
            );
        }
        
        // Clear hitbox after short time
        setTimeout(() => {
            this.attacking = false;
            this.attackHitbox = null;
        }, 100);
    }
    
    dodge() {
        this.dodging = true;
        this.invulnerable = true;
        this.invulnerableTime = 0.3;
        
        const dodgeBoost = 2;
        const originalSpeed = this.speed;
        this.speed *= dodgeBoost;
        
        // Dodge particles
        if (window.particleSystem) {
            window.particleSystem.emit(
                this.x + this.width / 2,
                this.y + this.height / 2,
                {
                    count: 20,
                    color: '#00ffff',
                    size: 2,
                    speed: 80,
                    lifetime: 0.5
                }
            );
        }
        
        setTimeout(() => {
            this.dodging = false;
            this.speed = originalSpeed;
        }, 200);
    }
    
    takeDamage(amount) {
        if (this.invulnerable) return;
        
        this.health -= amount;
        this.invulnerable = true;
        this.invulnerableTime = 1.0;
        
        // Damage particles
        if (window.particleSystem) {
            window.particleSystem.emit(
                this.x + this.width / 2,
                this.y + this.height / 2,
                {
                    count: 10,
                    color: '#ff0000',
                    size: 4,
                    speed: 100,
                    lifetime: 0.5
                }
            );
        }
        
        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }
    }
    
    heal(amount) {
        this.health += amount;
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }
        
        // Heal particles
        if (window.particleSystem) {
            window.particleSystem.emit(
                this.x + this.width / 2,
                this.y + this.height / 2,
                {
                    count: 15,
                    color: '#00ff00',
                    size: 3,
                    speed: 60,
                    lifetime: 1.0,
                    gravity: -50
                }
            );
        }
    }
    
    addBitFragments(amount) {
        this.bitFragments += amount;
    }
    
    die() {
        console.log('Player died!');
        // TODO: Death screen, respawn logic
    }
    
    render(renderer) {
        // Offset for walking animation
        const bobOffset = Math.sin(this.animFrame * Math.PI / 2) * 2;
        
        // Draw glow
        if (!this.invulnerable || Math.floor(Date.now() / 100) % 2 === 0) {
            renderer.ctx.save();
            renderer.ctx.shadowBlur = 15 * this.glowIntensity;
            renderer.ctx.shadowColor = this.color;
            renderer.drawRect(
                this.x, 
                this.y + bobOffset, 
                this.width, 
                this.height, 
                this.color
            );
            renderer.ctx.restore();
        }
        
        // Draw direction indicator
        const indicatorSize = 8;
        let indX = this.x + this.width / 2 - indicatorSize / 2;
        let indY = this.y + this.height / 2 - indicatorSize / 2;
        
        switch(this.facing) {
            case 'up': indY -= 12; break;
            case 'down': indY += 12; break;
            case 'left': indX -= 12; break;
            case 'right': indX += 12; break;
        }
        
        renderer.drawRect(indX, indY, indicatorSize, indicatorSize, '#ffff00');
        
        // Draw attack slash effect
        if (this.attacking && this.attackHitbox) {
            renderer.ctx.save();
            renderer.ctx.globalAlpha = 0.6;
            renderer.ctx.shadowBlur = 20;
            renderer.ctx.shadowColor = '#ffff00';
            renderer.drawRect(
                this.attackHitbox.x, 
                this.attackHitbox.y, 
                this.attackHitbox.width, 
                this.attackHitbox.height, 
                '#ffff00'
            );
            renderer.ctx.restore();
        }
        
        // Draw dodge trail
        if (this.dodging) {
            renderer.ctx.save();
            renderer.ctx.globalAlpha = 0.3;
            renderer.drawRect(
                this.x - this.velocity.x * 0.05,
                this.y - this.velocity.y * 0.05,
                this.width,
                this.height,
                this.color
            );
            renderer.ctx.restore();
        }
    }
}
