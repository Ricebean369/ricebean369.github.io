class Enemy {
    constructor(x, y, type = 'basic') {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        
        this.type = type;
        this.velocity = { x: 0, y: 0 };
        this.speed = 80;
        
        // Stats based on type
        this.setStatsForType(type);
        
        // AI
        this.aggroRange = 200;
        this.attackRange = 40;
        this.state = 'idle'; // idle, chase, attack
        this.attackCooldown = 0;
        this.attackSpeed = 1.5;
        
        // Visual
        this.color = '#ff0000';
    }
    
    setStatsForType(type) {
        switch(type) {
            case 'bit-fly':
                this.health = 10;
                this.maxHealth = 10;
                this.damage = 5;
                this.speed = 120;
                this.color = '#ff6666';
                break;
            case 'syntax-error':
                this.health = 25;
                this.maxHealth = 25;
                this.damage = 8;
                this.speed = 60;
                this.color = '#ff3333';
                break;
            default:
                this.health = 30;
                this.maxHealth = 30;
                this.damage = 10;
        }
    }
    
    update(deltaTime, player) {
        if (!player) return;
        
        // Update attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }
        
        // Calculate distance to player
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // AI State Machine
        if (distance < this.attackRange) {
            this.state = 'attack';
            this.velocity.x = 0;
            this.velocity.y = 0;
            
            if (this.attackCooldown <= 0) {
                this.attack(player);
            }
        } else if (distance < this.aggroRange) {
            this.state = 'chase';
            
            // Move towards player
            const angle = Math.atan2(dy, dx);
            this.velocity.x = Math.cos(angle) * this.speed;
            this.velocity.y = Math.sin(angle) * this.speed;
        } else {
            this.state = 'idle';
            this.velocity.x = 0;
            this.velocity.y = 0;
        }
        
        // Check if player is attacking this enemy
        if (player.attacking && player.attackHitbox) {
            if (this.checkCollision(player.attackHitbox)) {
                this.takeDamage(player.damage);
            }
        }
    }
    
    attack(player) {
        this.attackCooldown = this.attackSpeed;
        player.takeDamage(this.damage);
    }
    
    takeDamage(amount) {
        this.health -= amount;
        
        if (this.health <= 0) {
            this.die();
        }
        
        console.log(`${this.type} takes ${amount} damage!`);
    }
    
    die() {
        console.log(`${this.type} defeated!`);
        // Remove from game (we'll implement this properly later)
        this.markedForDeletion = true;
    }
    
    checkCollision(box) {
        return this.x < box.x + box.width &&
               this.x + this.width > box.x &&
               this.y < box.y + box.height &&
               this.y + this.height > box.y;
    }
    
    render(renderer) {
        renderer.drawRect(this.x, this.y, this.width, this.height, this.color);
        
        // Draw type text
        renderer.drawText(this.type, this.x, this.y - 5, '#ffffff', 10);
    }
}
