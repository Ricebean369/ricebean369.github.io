// Global systems
window.particleSystem = null;
window.spriteEngine = null;
window.lootSystem = null;
window.inventory = null;
window.gameInstance = null;

document.addEventListener('DOMContentLoaded', async () => {
    console.log('ROOT: Reality\'s Compiler - Loading...');
    
    await audioEngine.initialize();
    
    window.spriteEngine = new SpriteEngine();
    window.particleSystem = new ParticleSystem();
    window.lootSystem = new LootSystem();
    
    const game = new GameEngine();
    window.gameInstance = game;
    
    const player = new Player(1000, 1000);
    game.setPlayer(player);
    
    window.inventory = new InventorySystem(player);
    
    window.inventory.addItem({
        id: 'health-potion',
        name: 'Health Patch v1.0',
        type: 'health-potion',
        icon: '❤️',
        healAmount: 25,
        maxStack: 10
    }, 3);
    
    const realmManager = new RealmManager();
    realmManager.registerRealm('source-code-citadel', SourceCodeCitadel);
    realmManager.loadRealm('source-code-citadel', game);
    
    const saveSystem = new SaveSystem();
    
    if (saveSystem.hasSave()) {
        console.log('Save file found! Loading...');
        saveSystem.load(game);
    }
    
    setInterval(() => {
        saveSystem.save(game);
    }, 60000);
    
    const originalUpdate = game.update.bind(game);
    game.update = function(currentTime) {
        originalUpdate(currentTime);
        
        if (!game.paused && window.particleSystem) {
            window.particleSystem.update(game.deltaTime);
        }
    };
    
    const originalRender = game.render.bind(game);
    game.render = function() {
        originalRender();
        
        if (window.particleSystem) {
            window.particleSystem.render(game.renderer);
        }
    };
    
    game.start();
    
    console.log('═══════════════════════════════════');
    console.log('  ROOT: REALITY\'S COMPILER v0.2');
    console.log('═══════════════════════════════════');
    console.log('Controls:');
    console.log('  WASD / Arrow Keys - Move');
    console.log('  Space / J - Attack');
    console.log('  Shift - Dodge');
    console.log('  ESC - Pause Menu');
    console.log('  I - Inventory');
    console.log('═══════════════════════════════════');
});
