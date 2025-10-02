class GameEngine {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.renderer = new RenderEngine(this.canvas);
        this.physics = new PhysicsEngine();
        this.input = new InputHandler();
        
        this.player = null;
        this.currentRealm = null;
        this.entities = [];
        this.droppedItems = [];
        
        this.paused = false;
        this.gameState = 'playing'; // playing, paused, inventory, menu
        
        this.lastTime = performance.now();
        this.deltaTime = 0;
        
        this.setupMenuListeners();
    }
    
    setupMenuListeners() {
        // Pause menu
        this.input.keys.menu = false; // Reset
        
        document.querySelectorAll('#pause-menu button').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handleMenuAction(action);
            });
        });
    }
    
    handleMenuAction(action) {
        switch(action) {
            case 'resume':
                this.togglePause();
                break;
            case 'inventory':
                this.openInventory();
                break;
            case 'save':
                this.saveGame();
                break;
            case 'quit':
                window.location.href = 'index.html';
                break;
        }
    }
    
    togglePause() {
        this.paused = !this.paused;
        document.getElementById('pause-menu').classList.toggle('hidden');
    }
    
    openInventory() {
        this.gameState = this.gameState === 'inventory' ? 'playing' : 'inventory';
        document.getElementById('inventory-menu').classList.toggle('hidden');
        document.getElementById('pause-menu').classList.add('hidden');
        this.paused = this.gameState !== 'playing';
    }
    
    saveGame() {
        // We'll implement this in save-system.js
        console.log('Game saved!');
    }
    
    setPlayer(player) {
        this.player = player;
        this.physics.addEntity(player);
        this.entities.push(player);
    }
    
    setRealm(realm) {
        // Clean up old realm
        if (this.currentRealm) {
            this.physics.clear();
            this.entities = [];
        }
         // Update dropped items
        this.droppedItems.forEach(item => {
            item.update(this.deltaTime, this.player);
        });
        
        // Remove picked up items
        this.droppedItems = this.droppedItems.filter(item => !item.markedForDeletion);
        this.currentRealm = realm;
        
        // Re-add player
        if (this.player) {
            this.physics.addEntity(this.player);
            this.entities.push(this.player);
        }
        
        // Add realm entities and colliders
        realm.enemies.forEach(enemy => {
            this.physics.addEntity(enemy);
            this.entities.push(enemy);
        });
        
        realm.colliders.forEach(collider => {
            this.physics.addCollider(collider);
        });
    }
    
    update(currentTime) {
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Cap delta time to prevent spiral of death
        if (this.deltaTime > 0.1) this.deltaTime = 0.1;
        
        // Check for pause input
        if (this.input.isPressed('menu')) {
            this.togglePause();
            this.input.keys.menu = false; // Prevent repeat
        }
        
        if (this.paused) {
            requestAnimationFrame((time) => this.update(time));
            return;
        }
        
        // Draw dropped items
        this.droppedItems.forEach(item => {
            item.render(this.renderer);
        });
        
        // Update player
        if (this.player) {
            this.player.update(this.deltaTime, this.input);
        }
        
        // Update all entities
        this.entities.forEach(entity => {
            if (entity !== this.player && entity.update) {
                entity.update(this.deltaTime, this.player);
            }
        });
        
        // Update physics
        this.physics.update(this.deltaTime);
        
        // Update current realm
        if (this.currentRealm) {
            this.currentRealm.update(this.deltaTime);
        }
        
        // Render
        this.render();
        
        // Update HUD
        this.updateHUD();
        
        // Next frame
        requestAnimationFrame((time) => this.update(time));
    }
    
    render() {
        this.renderer.clear();
        
        // Set camera to follow player
        if (this.player) {
            this.renderer.setCameraTarget(this.player);
        }
        
        // Draw realm background/tiles
        if (this.currentRealm) {
            this.currentRealm.render(this.renderer);
        }
        
        // Draw debug grid
        // this.renderer.drawGrid();
        
        // Sort entities by y position (for proper depth)
        const sorted = [...this.entities].sort((a, b) => a.y - b.y);
        
        // Draw all entities
        sorted.forEach(entity => {
            if (entity.render) {
                entity.render(this.renderer);
            }
        });
        
        // Draw health bars
        this.entities.forEach(entity => {
            if (entity !== this.player && entity.health) {
                this.renderer.drawHealthBar(entity);
            }
        });
    }
    
    updateHUD() {
        if (!this.player) return;
        
        // Health bar
        const healthPercent = (this.player.health / this.player.maxHealth) * 100;
        document.getElementById('health-fill').style.width = healthPercent + '%';
        document.getElementById('health-text').textContent = 
            `${Math.floor(this.player.health)}/${this.player.maxHealth}`;
        
        // Mana bar
        const manaPercent = (this.player.mana / this.player.maxMana) * 100;
        document.getElementById('mana-fill').style.width = manaPercent + '%';
        document.getElementById('mana-text').textContent = 
            `${Math.floor(this.player.mana)}/${this.player.maxMana}`;
        
        // Bit fragments
        document.getElementById('bit-count').textContent = this.player.bitFragments;
    }
    
    start() {
        console.log('Game Engine Starting...');
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.update(time));
    }
}
