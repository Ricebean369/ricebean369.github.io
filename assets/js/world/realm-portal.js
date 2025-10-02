class RealmPortal {
    constructor(x, y, targetRealm, label) {
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 80;
        this.targetRealm = targetRealm;
        this.label = label;
        
        this.activationRadius = 50;
        this.glowPhase = 0;
        this.particles = [];
        this.showPrompt = false;
    }
    
    update(deltaTime, player) {
        this.glowPhase += deltaTime * 2;
        
        // Check if player is near
        const dx = player.x + player.width / 2 - (this.x + this.width / 2);
        const dy = player.y + player.height / 2 - (this.y + this.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.activationRadius) {
            this.showPrompt = true;
            
            // Activate on interaction
            if (window.gameInstance.input.isPressed('attack')) {
                this.activate(player);
            }
        } else {
            this.showPrompt = false;
        }
        
        // Portal particles
        if (Math.random() < 0.3) {
            this.particles.push({
                x: this.x + Math.random() * this.width,
                y: this.y + this.height,
                vy: -50 - Math.random() * 50,
                lifetime: 2.0,
                size: 2 + Math.random() * 3
            });
        }
        
        this.particles.forEach(p => {
            p.y += p.vy * deltaTime;
            p.lifetime -= deltaTime;
        });
        
        this.particles = this.particles.filter(p => p.lifetime > 0);
    }
    
    activate(player) {
        console.log(`Transitioning to: ${this.targetRealm}`);
        
        // Fade out effect
        const fadeDiv = document.createElement('div');
        fadeDiv.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            background: black;
            z-index: 9999;
            animation: fadeIn 1s forwards;
        `;
        document.body.appendChild(fadeDiv);
        
        setTimeout(() => {
            // Switch realm
            if (window.realmManager) {
                window.realmManager.loadRealm(this.targetRealm, window.gameInstance);
                
                // Reset player position to realm entrance
                player.x = 1000;
                player.y = 1000;
            }
            
            // Fade back in
            fadeDiv.style.animation = 'fadeOut 1s forwards';
            setTimeout(() => fadeDiv.remove(), 1000);
        }, 1000);
    }
    
    render(renderer) {
        const glow = Math.sin(this.glowPhase) * 0.3 + 0.7;
        
        // Portal glow
        renderer.ctx.save();
        renderer.ctx.shadowBlur = 30 * glow;
        renderer.ctx.shadowColor = '#00ffff';
        renderer.drawRect(this.x, this.y, this.width, this.height, '#00ffff');
        renderer.ctx.restore();
        
        // Portal particles
        this.particles.forEach(p => {
            renderer.ctx.globalAlpha = p.lifetime / 2.0;
            renderer.drawCircle(p.x, p.y, p.size, '#00ffff');
            renderer.ctx.globalAlpha = 1.0;
        });
        
        // Label
        renderer.drawText(
            this.label,
            this.x + this.width / 2 - 50,
            this.y - 20,
            '#00ffff',
            16
        );
        
        // Interaction prompt
        if (this.showPrompt) {
            renderer.drawText(
                'Press Space to Enter',
                this.x + this.width / 2 - 70,
                this.y + this.height + 20,
                '#ffff00',
                14
            );
        }
    }
}
