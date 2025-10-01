class RenderEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.camera = {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height
        };
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.camera.width = this.canvas.width;
        this.camera.height = this.canvas.height;
    }
    
    clear() {
        this.ctx.fillStyle = '#0a0a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    setCameraTarget(target) {
        this.camera.x = target.x - this.camera.width / 2;
        this.camera.y = target.y - this.camera.height / 2;
    }
    
    worldToScreen(x, y) {
        return {
            x: x - this.camera.x,
            y: y - this.camera.y
        };
    }
    
    // Draw a rectangle (for now, before we have sprites)
    drawRect(x, y, width, height, color) {
        const pos = this.worldToScreen(x, y);
        this.ctx.fillStyle = color;
        this.ctx.fillRect(pos.x, pos.y, width, height);
    }
    
    // Draw a circle
    drawCircle(x, y, radius, color) {
        const pos = this.worldToScreen(x, y);
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    // Draw text
    drawText(text, x, y, color = '#fff', size = 16) {
        const pos = this.worldToScreen(x, y);
        this.ctx.fillStyle = color;
        this.ctx.font = `${size}px 'Courier New'`;
        this.ctx.fillText(text, pos.x, pos.y);
    }
    
    // Draw health bar above entity
    drawHealthBar(entity) {
        if (!entity.health || !entity.maxHealth) return;
        
        const pos = this.worldToScreen(entity.x, entity.y - 15);
        const width = entity.width;
        const height = 5;
        const healthPercent = entity.health / entity.maxHealth;
        
        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(pos.x, pos.y, width, height);
        
        // Health fill
        const healthColor = healthPercent > 0.5 ? '#00ff00' : 
                           healthPercent > 0.25 ? '#ffaa00' : '#ff0000';
        this.ctx.fillStyle = healthColor;
        this.ctx.fillRect(pos.x, pos.y, width * healthPercent, height);
        
        // Border
        this.ctx.strokeStyle = '#00ffff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(pos.x, pos.y, width, height);
    }
    
    // Draw grid (for debugging)
    drawGrid(gridSize = 64) {
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        const startX = Math.floor(this.camera.x / gridSize) * gridSize;
        const startY = Math.floor(this.camera.y / gridSize) * gridSize;
        
        for (let x = startX; x < this.camera.x + this.camera.width; x += gridSize) {
            const screenX = x - this.camera.x;
            this.ctx.beginPath();
            this.ctx.moveTo(screenX, 0);
            this.ctx.lineTo(screenX, this.camera.height);
            this.ctx.stroke();
        }
        
        for (let y = startY; y < this.camera.y + this.camera.height; y += gridSize) {
            const screenY = y - this.camera.y;
            this.ctx.beginPath();
            this.ctx.moveTo(0, screenY);
            this.ctx.lineTo(this.camera.width, screenY);
            this.ctx.stroke();
        }
    }
}
