class Enemy {
    constructor(x, y, type = 'basic') {
        this.x = x;
        this.y = y;
        this.spawnX = x;
        this.spawnY = y;
        this.width = 32;
        this.height = 32;
        
        this.type = type;
        this.velocity = { x: 0, y: 0 };
        this.speed = 80;
        
        this.setStatsForType(type);
        
        // AI
        this.aggroRange = 200;
        this.attackRange = 40;
        this.leashRange = 400; // Return to spawn if too far
        this.state = 'idle';
        this.attackCooldown = 0;
        this.attackSpeed = 1.5;
        this.hitStunTime = 0;
        
        // Visual
        this.color = '#ff0000';
        this.flashTime = 0;
        
        // Experience value
        this.expValue = 10;
    }
    
    setStatsForType(type) {
        const stats = {
            'bit-fly': {
                health: 10,
                damage: 5,
                speed: 120,
                color: '#ff6666',
                aggroRange: 150,
                attackRange: 30,
                expValue: 5
            },
            'syntax-error': {
                health: 25,
                damage: 8,
                speed: 60,
                color: '#ff3333',
                aggroRange: 200,
                attackRange: 40,
                expValue: 10
            },
            'logic-bug': {
                health: 30,
                damage: 10,
                speed: 80,
                color: '#ff0000',
                aggroRange: 180,
                attackRange: 35,
                expValue: 15
            }
        };
        
        const config = stats[type] || stats['logic-bug'];
        Object.assign(this, config);
        this.maxHealth = this.health;
    }
    
    update(deltaTime, player) {
        if (!player) return;
        
        // Update timers
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }
        
        if (this.hitStunTime > 0) {
            this.hitStunTime -= deltaTime;
            this.velocity.x = 0;
            this.velocity.y = 0;
            return;
        }
        
        if (this.flashTime > 0) {
            this.flashTime -= deltaTime;
        }
        
        // Calculate distance to player and spawn
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distToPlayer = Math.sqrt(dx * dx + dy * dy);
        
        const dxSpawn = this.spawnX - this.x;
        const dySpawn = this.spawnY - this.y;
        const distToSpawn = Math.sqrt(dxSpawn * dxSpawn + dySpawn * dySpawn);
        
        // Leash - return to spawn if too far
        if (distToSpawn > this.leashRange) {
            this.state = 'returning';
            const angle = Math.atan2(dySpawn, dxSpawn);
            this.velocity.x = Math.cos(angle) * this.speed * 1.5;
            this.velocity.y = Math.sin(angle) * this.speed * 1.5;
            
            // Reset health when returning
            if (distToSpawn < 50) {
                this.health = this.maxHealth;
                this.state = 'idle';
            }
            return;
        }
        
        // AI State Machine
        if (distToPlayer < this.attackRange) {
            this.state = 'attack';
            this.velocity.x = 0;
            this.velocity.y = 0;
            
            if (this.attackCooldown <= 0) {
                this.attack(player);
            }
        } else if (distToPlayer < this.aggroRange) {
            this.state = 'chase';
            
            const angle = Math.atan2(dy, dx);
            this.velocity.x = Math.cos(angle) * this.speed;
            this.velocity.y = Math.sin(angle) * this.speed;
        } else {
            this.state = 'idle';
            
            // Wander near spawn
            if (Math.random() < 0.01) {
                const wanderAngle = Math.random() * Math.PI * 2;
                this.velocity.x = Math.cos(wanderAngle) * this.speed * 0.3;
                this.velocity.y = Math.sin(wanderAngle) * this.speed * 0.3;
            }
        }
        
        // Check if player is attacking this enemy
        if (player.attacking && player.attackHitbox) {
            if (this.checkCollision(player.attackHitbox)) {
                this.takeDamage(player.damage, player);
            }
        }
    }
    
    attack(player) {
        this.attackCooldown = this.attackSpeed;
        player.takeDamage(this.damage);
        
        // Attack particle
        if (window.particleSystem) {
            window.particleSystem.emit(
                player.x + player.width / 2,
                player.y + player.height / 2,
                {
                    count: 5,
                    color: this.color,
                    size: 3,
                    speed: 60,
                    lifetime: 0.3
                }
            );
        }
    }
    
    takeDamage(amount, attacker) {
        this.health -= amount;
        this.flashTime = 0.1;
        this.hitStunTime = 0.15;
        
        // Knockback
        if (attacker) {
            const dx = this.x - attacker.x;
            const dy = this.y - attacker.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0) {
                this.velocity.x = (dx / dist) * 200;
                this.velocity.y = (dy / dist) * 200;
            }
        }
        
        // Hit particles
        if (window.particleSystem) {
            window.particleSystem.emit(this.x + this.width / 2, this.y, {
                count: 8,
                color: '#ffffff',
                size: 3,
                speed: 100,
                lifetime: 0.4
            });
        }
        
        if (this.health <= 0) {
            this.die(attacker);
        }
    }
    
    die(killer) {
        // Grant experience
        if (killer) {
            killer.experience += this.expValue;
        }
        
        // Drop loot
        if (window.lootSystem) {
            const drops = window.lootSystem.dropLoot(
                this.type,
                this.x + this.width / 2,
                this.y + this.height / 2
            );
            
            drops.forEach(drop => {
                drop.spawnY = this.y + this.height / 2;
                const droppedItem = new DroppedItem(drop);
                if (window.gameInstance) {
                    window.gameInstance.droppedItems.push(droppedItem);
                }
            });
        }
        
        // Death particles
        if (window.particleSystem) {
            window.particleSystem.emit(
                this.x + this.width / 2,
                this.y + this.height / 2,
                {
                    count: 20,
                    color: this.color,
                    size: 4,
                    speed: 150,
                    lifetime: 1.0
                }
            );
        }
        
        this.markedForDeletion = true;
    }
    
    checkCollision(box) {
        return this.x < box.x + box.width &&
               this.x + this.width > box.x &&
               this.y < box.y + box.height &&
               this.y + this.height > box.y;
    }
    
    render(renderer) {
        let color = this.flashTime > 0 ? '#ffffff' : this.color;
        
        // Draw shadow
        renderer.ctx.globalAlpha = 0.3;
        renderer.drawCircle(
            this.x + this.width / 2,
            this.y + this.height,
            this.width / 2,
            '#000000'
        );
        renderer.ctx.globalAlpha = 1.0;
        
        // Draw enemy
        renderer.drawRect(this.x, this.y, this.width, this.height, color);
        
        // Draw state indicator
        const stateColors = {
            'idle': '#888888',
            'chase': '#ff6600',
            'attack': '#ff0000',
            'returning': '#0088ff'
        };
        
        renderer.drawCircle(
            this.x + this.width / 2,
            this.y - 10,
            4,
            stateColors[this.state] || '#ffffff'
        );
    }
}
