// Global systems
window.particleSystem = null;
window.spriteEngine = null;

document.addEventListener('DOMContentLoaded', async () => {
    console.log('ROOT: Reality\'s Compiler - Loading...');
    
    // Initialize audio
    await audioEngine.initialize();
    
    // Initialize sprite engine
    window.spriteEngine = new SpriteEngine();
    
    // Initialize particle system
    window.particleSystem = new ParticleSystem();
    
    // Create game engine
    const game = new GameEngine();
    
    // Create player
    const player = new Player(1000, 1000);
    game.setPlayer(player);
    
    // Create inventory system
    const inventory = new InventorySystem(player);
    
    // Add starting items
    inventory.addItem({
        id: 'health-potion',
        name: 'Health Patch v1.0',
        type: 'health-potion',
        icon: '❤️',
        healAmount: 25,
        maxStack: 10
    }, 3);
    
    // Create realm manager
    const realmManager = new RealmManager();
    realmManager.registerRealm('source-code-citadel', SourceCodeCitadel);
    
    // Load starting realm
    realmManager.loadRealm('source-code-citadel', game);
    
    // Create save system
    const saveSystem = new SaveSystem();
    
    // Check for existing save
    if (saveSystem.hasSave()) {
        console.log('Save file found! Loading...');
        saveSystem.load(game);
    }
    
    // Auto-save every 60 seconds
    setInterval(() => {
        saveSystem.save(game);
    }, 60000);
    
    // Enhance game update loop to include particles
    const originalUpdate = game.update.bind(game);
    game.update = function(currentTime) {
        originalUpdate(currentTime);
        
        if (!game.paused && window.particleSystem) {
            window.particleSystem.update(game.deltaTime);
        }
    };
    
    // Enhance render to include particles
    const originalRender = game.render.bind(game);
    game.render = function() {
        originalRender();
        
        if (window.particleSystem) {
            window.particleSystem.render(game.renderer);
        }
    };
    
    // Start game loop
    game.start();
    
    console.log('═══════════════════════════════════');
    console.log('  ROOT: REALITY\'S COMPILER v0.1');
    console.log('═══════════════════════════════════');
    console.log('Controls:');
    console.log('  WASD / Arrow Keys - Move');
    console.log('  Space / J - Attack');
    console.log('  Shift - Dodge');
    console.log('  ESC - Pause Menu');
    console.log('  I - Inventory');
    console.log('═══════════════════════════════════');
});
