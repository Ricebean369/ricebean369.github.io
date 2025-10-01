class SourceCodeCitadel {
    constructor() {
        this.name = 'Source Code Citadel';
        this.width = 2000;
        this.height = 2000;
        
        // Background color
        this.bgColor = '#1a1a2e';
        this.gridColor = 'rgba(0, 255, 255, 0.1)';
        
        // Colliders (walls, obstacles)
        this.colliders = this.createColliders();
        
        // Enemies
        this.enemies = this.createEnemies();
        
        // NPCs
        this.npcs = [];
        
        // Items
        this.items = [];
    }
    
    createColliders() {
        return [
            // Outer walls
            { x: 0, y: 0, width: this.width, height: 20 }, // Top
            { x: 0, y: this.height - 20, width: this.width, height: 20 }, // Bottom
            { x: 0, y: 0, width: 20, height: this.height }, // Left
            { x: this.width - 20, y: 0, width: 20, height: this.height }, // Right
            
            // Inner structures (cathedral pillars)
            { x: 400, y: 400, width: 80, height: 80 },
            { x: 800, y: 400, width: 80, height: 80 },
            { x: 1200, y: 400, width: 80, height: 80 },
            { x: 400, y: 800, width: 80, height: 80 },
            { x: 800, y: 800, width: 80, height: 80 },
            { x: 1200, y: 800, width: 80, height: 80 },
            
            // Compiler Cathedral entrance
            { x: 900, y: 200, width: 200, height: 40 },
        ];
    }
    
    createEnemies() {
        const enemies = [];
        
        // Spawn bit flies around the area
        for (let i = 0; i < 5; i++) {
            enemies.push(new Enemy(
                300 + Math.random() * 400,
                300 + Math.random() * 400,
                'bit-fly'
            ));
        }
        
        // Spawn syntax errors in specific areas
        for (let i = 0; i < 3; i++) {
            enemies.push(new Enemy(
                600 + Math.random() * 600,
                600 + Math.random() * 600,
                'syntax-error'
            ));
        }
        
        return enemies;
    }
    
    update(deltaTime) {
        // Remove dead enemies
        this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
        
        // Update realm-specific logic
        // (particles, animations, environmental effects)
    }
    
    render(renderer) {
        // Draw background
        renderer.ctx.fillStyle = this.bgColor;
        renderer.ctx.fillRect(0, 0, renderer.canvas.width, renderer.canvas.height);
        
        // Draw decorative grid
        this.drawGrid(renderer);
        
        // Draw colliders (walls)
        this.colliders.forEach(collider => {
            renderer.drawRect(collider.x, collider.y, collider.width, collider.height, '#003366');
        });
        
        // Draw realm-specific details
        this.drawCathedralDetails(renderer);
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
    
    drawCathedralDetails(renderer) {
        // Draw floating code fragments
        const time = Date.now() / 1000;
        
        for (let i = 0; i < 20; i++) {
            const x = 200 + (i * 100) % this.width;
            const y = 200 + Math.sin(time + i) * 50;
            
            renderer.drawText(
                ['{}', '[]', '()', '<>', '//'].at(i % 5),
                x,
                y,
                'rgba(0, 255, 255, 0.3)',
                20
            );
        }
        
        // Draw compiler cathedral marker
        renderer.drawText(
            'COMPILER CATHEDRAL',
            950,
            150,
            '#00ffff',
            24
        );
    }
}
