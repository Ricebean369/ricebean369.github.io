class BinaryBadlands {
    constructor() {
        this.name = 'Binary Badlands';
        this.width = 2500;
        this.height = 2500;
        
        this.bgColor = '#2a1810';
        this.gridColor = 'rgba(255, 170, 0, 0.1)';
        
        this.colliders = this.createColliders();
        this.enemies = this.createEnemies();
        this.npcs = [];
        this.items = [];
        
        // Environmental effects
        this.sandParticles = [];
        this.initSandStorm();
    }
    
    createColliders() {
        return [
            // Outer boundaries
            { x: 0, y: 0, width: this.width, height: 20 },
            { x: 0, y: this.height - 20, width: this.width, height: 20 },
            { x: 0, y: 0, width: 20, height: this.height },
            { x: this.width - 20, y: 0, width: 20, height: this.height },
            
            // Desert rock formations
            { x: 400, y: 300, width: 120, height: 100 },
            { x: 800, y: 500, width: 150, height: 80 },
            { x: 1200, y: 700, width: 100, height: 120 },
            { x: 600, y: 1000, width: 180, height: 90 },
            { x: 1400, y: 1200, width: 130, height: 110 },
            
            // Binary crystal formations
            { x: 300, y: 600, width: 60, height: 200 },
            { x: 900, y: 800, width: 60, height: 180 },
            { x: 1600, y: 400, width: 60, height: 220 },
            
            // Logic gate ruins
            { x: 1000, y: 1500, width: 300, height: 40 },
            { x: 1000, y: 1700, width: 300, height: 40 },
        ];
    }
    
    createEnemies() {
        const enemies = [];
        
        // Sand biters (fast, low health)
        for (let i = 0; i < 8; i++) {
            enemies.push(new Enemy(
                400 + Math.random() * 800,
                400 + Math.random() * 800,
                'sand-biter'
            ));
        }
        
        // Logic scorpions (medium, poison)
        for (let i = 0; i < 5; i++) {
            enemies.push(new Enemy(
                800 + Math.random() * 1000,
                800 + Math.random() * 1000,
                'logic-scorpion'
            ));
        }
        
        // Data whirlwinds (dangerous, AOE)
        for (let i = 0; i < 3; i++) {
            enemies.push(new Enemy(
                1000 + Math.random() * 800,
                1000 + Math.random() * 800,
                'data-whirlwind'
            ));
        }
        
        return enemies;
    }
    
    initSandStorm() {
        for (let i = 0; i < 100; i++) {
            this.sandParticles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: 50 + Math.random() * 100,
                vy: Math.random() * 20 - 10,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.3 + 0.1
            });
        }
    }
    
    update(deltaTime) {
        this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
        
        // Update sand particles
        this.sandParticles.forEach(p => {
            p.x += p.vx * deltaTime;
            p.y += p.vy * deltaTime;
            
            // Wrap around
            if (p.x > this.width) p.x = 0;
            if (p.y < 0) p.y = this.height;
            if (p.y > this.height) p.y = 0;
        });
    }
    
    render(renderer) {
        renderer.ctx.fillStyle = this.bgColor;
        renderer.ctx.fillRect(0, 0, renderer.canvas.width, renderer.canvas.height);
        
        this.drawGrid(renderer);
        this.drawSandStorm(renderer);
        
        // Draw colliders with desert texture
        this.colliders.forEach(collider => {
            const gradient = renderer.ctx.createLinearGradient(
                collider.x, collider.y,
                collider.x, collider.y + collider.height
            );
            gradient.addColorStop(0, '#8B7355');
            gradient.addColorStop(1, '#5C4033');
            
            const pos = renderer.worldToScreen(collider.x, collider.y);
            renderer.ctx.fillStyle = gradient;
            renderer.ctx.fillRect(pos.x, pos.y, collider.width, collider.height);
        });
        
        this.drawBinaryNumbers(renderer);
        this.drawRealmLabel(renderer);
    }
    
    drawGrid(renderer) {
        const gridSize = 64;
        const camera = renderer.camera;
        
        renderer.ctx.strokeStyle = this.gridColor;
        renderer.ctx.lineWidth = 1;
        
        const startX = Math.floor(camera.x / gridSize) * gridSize;
        const startY = Math.floor(camera.y / gridSize) * gridSize;
        
        for (let x = startX; x < camera.x + camera.width + gridSize; x += gridSize) {
            const screenX = x - camera.x;
            renderer.ctx.beginPath();
            renderer.ctx.moveTo(screenX, 0);
            renderer.ctx.lineTo(screenX, camera.height);
            renderer.ctx.stroke();
        }
        
        for (let y = startY; y < camera.y + camera.height + gridSize; y += gridSize) {
            const screenY = y - camera.y;
            renderer.ctx.beginPath();
            renderer.ctx.moveTo(0, screenY);
            renderer.ctx.lineTo(camera.width, screenY);
            renderer.ctx.stroke();
        }
    }
    
    drawSandStorm(renderer) {
        this.sandParticles.forEach(p => {
            if (p.x < renderer.camera.x - 100 || p.x > renderer.camera.x + renderer.camera.width + 100) return;
            if (p.y < renderer.camera.y - 100 || p.y > renderer.camera.y + renderer.camera.height + 100) return;
            
            renderer.ctx.globalAlpha = p.opacity;
            renderer.drawRect(p.x, p.y, p.size, p.size, '#D2B48C');
            renderer.ctx.globalAlpha = 1.0;
        });
    }
    
    drawBinaryNumbers(renderer) {
        const time = Date.now() / 1000;
        const camera = renderer.camera;
        
        for (let i = 0; i < 30; i++) {
            const x = (i * 150) % this.width;
            const y = 300 + Math.sin(time + i * 0.5) * 100;
            
            if (x < camera.x - 100 || x > camera.x + camera.width + 100) continue;
            if (y < camera.y - 100 || y > camera.y + camera.height + 100) continue;
            
            const binary = Math.random() > 0.5 ? '1' : '0';
            renderer.drawText(
                binary,
                x,
                y,
                'rgba(255, 170, 0, 0.3)',
                30
            );
        }
    }
    
    drawRealmLabel(renderer) {
        renderer.drawText(
            'BINARY BADLANDS',
            renderer.camera.x + renderer.camera.width / 2 - 150,
            renderer.camera.y + 50,
            '#ffaa00',
            32
        );
    }
}
