class DroppedItem {
    constructor(data) {
        this.x = data.x;
        this.y = data.y;
        this.vx = data.vx || 0;
        this.vy = data.vy || 0;
        this.gravity = data.gravity || 200;
        
        this.item = data.item;
        this.amount = data.amount;
        this.lifetime = data.lifetime;
        this.maxLifetime = data.lifetime;
        
        this.width = 16;
        this.height = 16;
        
        this.pickupRadius = 30;
        this.magnetRadius = 100;
        
        this.bounced = false;
        this.bobOffset = Math.random() * Math.PI * 2;
    }
    
    update(deltaTime, player) {
        // Physics
        this.vy += this.gravity * deltaTime;
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        
        // Bounce on ground (y > spawn y)
        if (this.y > this.spawnY && !this.bounced) {
            this.vy *= -0.5;
            this.vx *= 0.7;
            
            if (Math.abs(this.vy) < 20) {
                this.bounced = true;
                this.vy = 0;
            }
        }
        
        // Lifetime
        this.lifetime -= deltaTime;
        
        // Magnet effect - pull toward player
        if (player) {
            const dx = player.x + player.width / 2 - this.x;
            const dy = player.y + player.height / 2 - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < this.magnetRadius) {
                const magnetStrength = 300;
                this.vx += (dx / dist) * magnetStrength * deltaTime;
                this.vy += (dy / dist) * magnetStrength * deltaTime;
            }
            
            // Check pickup
            if (dist < this.pickupRadius) {
                this.pickup(player);
            }
        }
    }
    
    pickup(player) {
        const itemData = window.lootSystem.getItemData(this.item);
        
        if (itemData.type === 'currency') {
            player.addBitFragments(this.amount);
        } else {
            // Add to inventory
            if (window.inventory) {
                window.inventory.addItem(itemData, this.amount);
            }
        }
        
        // Pickup particles
        if (window.particleSystem) {
            window.particleSystem.emit(this.x, this.y, {
                count: 10,
                color: itemData.color || '#ffaa00',
                size: 3,
                speed: 80,
                lifetime: 0.5
            });
        }
        
        this.markedForDeletion = true;
    }
    
    render(renderer) {
        // Fade out when expiring
        const opacity = Math.min(1, this.lifetime / 2);
        
        // Bob up and down
        const bob = Math.sin(Date.now() / 200 + this.bobOffset) * 4;
        
        renderer.ctx.save();
        renderer.ctx.globalAlpha = opacity;
        
        const itemData = window.lootSystem.getItemData(this.item);
        
        // Draw glow
        renderer.ctx.shadowBlur = 15;
        renderer.ctx.shadowColor = itemData.color || '#ffaa00';
        
        // Draw icon
        const pos = renderer.worldToScreen(this.x, this.y + bob);
        renderer.ctx.font = '20px Arial';
        renderer.ctx.textAlign = 'center';
        renderer.ctx.textBaseline = 'middle';
        renderer.ctx.fillText(itemData.icon, pos.x, pos.y);
        
        // Draw amount if > 1
        if (this.amount > 1) {
            renderer.ctx.font = '12px Courier New';
            renderer.ctx.fillStyle = '#fff';
            renderer.ctx.fillText(`x${this.amount}`, pos.x, pos.y + 15);
        }
        
        renderer.ctx.restore();
    }
}
