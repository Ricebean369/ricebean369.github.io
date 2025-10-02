class ParticleSystem {
    constructor() {
        this.particles = [];
    }
    
    emit(x, y, config = {}) {
        const defaults = {
            count: 10,
            color: '#00ffff',
            size: 4,
            speed: 100,
            lifetime: 1.0,
            gravity: 0,
            spread: Math.PI * 2
        };
        
        const settings = { ...defaults, ...config };
        
        for (let i = 0; i < settings.count; i++) {
            const angle = (settings.spread * i / settings.count) + 
                         (Math.random() - 0.5) * 0.5;
            const speed = settings.speed * (0.5 + Math.random() * 0.5);
            
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: settings.size * (0.5 + Math.random() * 0.5),
                color: settings.color,
                lifetime: settings.lifetime,
                maxLifetime: settings.lifetime,
                gravity: settings.gravity,
                opacity: 1
            });
        }
    }
    
    update(deltaTime) {
        this.particles.forEach(p => {
            p.x += p.vx * deltaTime;
            p.y += p.vy * deltaTime;
            p.vy += p.gravity * deltaTime;
            
            p.lifetime -= deltaTime;
            p.opacity = p.lifetime / p.maxLifetime;
            
            // Fade and shrink
            p.size *= 0.98;
        });
        
        this.particles = this.particles.filter(p => p.lifetime > 0);
    }
    
    render(renderer) {
        this.particles.forEach(p => {
            renderer.ctx.save();
            renderer.ctx.globalAlpha = p.opacity;
            renderer.drawCircle(p.x, p.y, p.size, p.color);
            renderer.ctx.restore();
        });
    }
    
    clear() {
        this.particles = [];
    }
}
