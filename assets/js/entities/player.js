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
        this.attackSpeed = 0.5; // seconds between attacks
        this.invulnerable = false;
        this.invulnerableTime = 0;
        
        // Resources
        this.bitFragments = 0;
        
        // Equipment
        this.weapon = 'Quantum Saber';
        this.armor = 'HTTP Armor Set';
        this.shield = null;
        
        // State
        this.facing = 'down'; // up, down, left, right
        this.attacking = false;
        this.dodging = false;
        
        // Visual
        this.color = '#00ffff';
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
        
        // Store hitbox for collision detection
        this.attackHitbox = hitbox;
        
        // Clear hitbox after short time
        setTimeout(() => {
            this.attacking = false;
            this.attackHitbox = null;
        }, 100);
        
        console.log('Player attacks!');
    }
    
    dodge() {
        this.dodging = true;
        this.invulnerable = true;
        this.invulnerableTime = 0.3;
        
        // Boost speed temporarily
        const dodgeBoost = 2;
        const originalSpeed = this.speed;
        this.speed *= dodgeBoost;
        
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
        
        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }
        
        console.log(`Player takes ${amount} damage! Health: ${this.health}/${this.maxHealth}`);
    }
    
    heal(amount) {
        this.health += amount;
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
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
        // Draw player as rectangle for now
        let color = this.color;
        
        // Flash when invulnerable
        if (this.invulnerable && Math.floor(Date.now() / 100) % 2 === 0) {
            color = '#ffffff';
        }
        
        renderer.drawRect(this.x, this.y, this.width, this.height, color);
        
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
        
        // Draw attack hitbox when attacking
        if (this.attacking && this.attackHitbox) {
            renderer.drawRect(
                this.attackHitbox.x, 
                this.attackHitbox.y, 
                this.attackHitbox.width, 
                this.attackHitbox.height, 
                'rgba(255, 255, 0, 0.5)'
            );
        }
    }
}
