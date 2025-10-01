class TitleScreen {
    constructor() {
        this.canvas = document.getElementById('title-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationComplete = false;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.initEventListeners();
        this.startSequence();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initEventListeners() {
        const startGame = async () => {
            if (!this.animationComplete) return;
            
            await audioEngine.initialize();
            audioEngine.stopAll();
            
            // Transition to game (we'll build this next)
            window.location.href = 'game.html';
        };

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                startGame();
            }
        });

        // Mouse/Touch
        document.getElementById('press-start').addEventListener('click', startGame);
        document.addEventListener('touchstart', startGame, { once: true });
    }

    async startSequence() {
        await this.waitForInteraction();
        await audioEngine.initialize();
        
        this.animateBackground();
        
        // Timing synchronized with music
        await this.delay(500);
        await this.revealText('subtitle', 'THE LEGEND OF', 100);
        
        await this.delay(300);
        await this.revealText('main-title', 'ROOT', 200);
        
        await this.delay(200);
        await this.revealText('tagline', "REALITY'S COMPILER", 50);
        
        await this.delay(500);
        this.animateEmblem();
        
        await this.delay(1000);
        document.getElementById('press-start').classList.remove('hidden');
        
        this.animationComplete = true;
        
        // Play title music
        audioEngine.playTitleTheme();
        
        // Loop music
        setInterval(() => {
            if (this.animationComplete) {
                audioEngine.playTitleTheme();
            }
        }, 8000);
    }

    async waitForInteraction() {
        return new Promise(resolve => {
            const handler = () => {
                document.removeEventListener('click', handler);
                document.removeEventListener('keydown', handler);
                document.removeEventListener('touchstart', handler);
                resolve();
            };
            
            document.addEventListener('click', handler, { once: true });
            document.addEventListener('keydown', handler, { once: true });
            document.addEventListener('touchstart', handler, { once: true });
        });
    }

    async revealText(elementId, text, delayMs) {
        const element = document.getElementById(elementId);
        element.textContent = '';
        element.classList.remove('hidden');
        
        for (let char of text) {
            const span = document.createElement('span');
            span.className = 'letter';
            span.textContent = char === ' ' ? '\u00A0' : char;
            element.appendChild(span);
            
            await this.delay(delayMs);
        }
    }

    animateEmblem() {
        const emblem = document.getElementById('source-emblem');
        emblem.classList.remove('hidden');
        
        const shapes = emblem.querySelectorAll('polygon, circle, line');
        shapes.forEach((shape, i) => {
            setTimeout(() => {
                shape.style.opacity = '1';
                shape.style.transition = 'opacity 0.5s';
            }, i * 300);
        });
        
        setTimeout(() => {
            emblem.classList.add('glowing');
        }, shapes.length * 300);
    }

    animateBackground() {
        // Create data particle effect
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
        
        this.renderLoop();
    }

    renderLoop() {
        this.ctx.fillStyle = 'rgba(10, 10, 26, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw and update particles
        this.particles.forEach(p => {
            this.ctx.fillStyle = `rgba(0, 255, 255, ${p.opacity})`;
            this.ctx.fillRect(p.x, p.y, p.size, p.size);
            
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
        });
        
        requestAnimationFrame(() => this.renderLoop());
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TitleScreen();
});
