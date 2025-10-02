class SpriteEngine {
    constructor() {
        this.sprites = new Map();
    }
    
    // Generate procedural sprite (until you have real pixel art)
    generateSprite(width, height, colors, pattern = 'player') {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        switch(pattern) {
            case 'player':
                this.drawPlayerSprite(ctx, width, height, colors);
                break;
            case 'enemy':
                this.drawEnemySprite(ctx, width, height, colors);
                break;
            case 'particle':
                this.drawParticle(ctx, width, height, colors);
                break;
        }
        
        return canvas;
    }
    
    drawPlayerSprite(ctx, w, h, colors) {
        // Root character - cyan cyberpunk design
        ctx.fillStyle = colors.primary || '#00ffff';
        
        // Body
        ctx.fillRect(w*0.25, h*0.3, w*0.5, h*0.5);
        
        // Head
        ctx.fillRect(w*0.3, h*0.1, w*0.4, h*0.25);
        
        // Arms
        ctx.fillRect(w*0.1, h*0.35, w*0.15, h*0.4);
        ctx.fillRect(w*0.75, h*0.35, w*0.15, h*0.4);
        
        // Eyes (glowing)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(w*0.35, h*0.15, w*0.1, w*0.08);
        ctx.fillRect(w*0.55, h*0.15, w*0.1, w*0.08);
        
        // Circuit pattern
        ctx.strokeStyle = colors.accent || '#ffff00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w*0.5, h*0.3);
        ctx.lineTo(w*0.5, h*0.5);
        ctx.stroke();
    }
    
    drawEnemySprite(ctx, w, h, colors) {
        // Glitchy enemy design
        ctx.fillStyle = colors.primary || '#ff0000';
        
        // Random glitch effect
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const size = Math.random() * w * 0.3;
            ctx.fillRect(x, y, size, size);
        }
        
        // Core body
        ctx.fillStyle = colors.secondary || '#660000';
        ctx.fillRect(w*0.2, h*0.2, w*0.6, h*0.6);
    }
    
    drawParticle(ctx, w, h, colors) {
        ctx.fillStyle = colors.primary || '#00ffff';
        ctx.fillRect(0, 0, w, h);
    }
    
    cacheSprite(id, sprite) {
        this.sprites.set(id, sprite);
    }
    
    getSprite(id) {
        return this.sprites.get(id);
    }
}
