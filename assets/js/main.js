// Global systems
window.particleSystem = null;
window.spriteEngine = null;
window.lootSystem = null;
window.inventory = null;
window.gameInstance = null;
window.realmManager = null;

document.addEventListener('DOMContentLoaded', async () => {
    console.log('ROOT: Reality\'s Compiler - Loading...');
    
    // Initialize audio
    await audioEngine.initialize();
    
    // Initialize systems
    window.spriteEngine = new SpriteEngine();
    window.particleSystem = new ParticleSystem();
    window.lootSystem = new LootSystem();
    
    // Create game engine
    const game = new GameEngine();
    window.gameInstance = game;
    
    // Create player
    const player = new Player(1000, 1000);
    game.setPlayer(player);
    
    // Add progression system
    game.progressionSystem = new ProgressionSystem(player);
    
    // Add skill tree
    game.skillTree = new SkillTree(player);
    
    // Create inventory system
    window.inventory = new InventorySystem(player);
    
    // Add starting items
    window.inventory.addItem({
        id: 'health-potion',
        name: 'Health Patch v1.0',
        type: 'health-potion',
        icon: '❤️',
        healAmount: 25,
        maxStack: 10
    }, 3);
    
    // Create realm manager
    const realmManager = new RealmManager();
    window.realmManager = realmManager;
    realmManager.registerRealm('source-code-citadel', SourceCodeCitadel);
    realmManager.registerRealm('binary-badlands', BinaryBadlands);
    
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
    
    // Enhance game update loop to include particles and progression
    const originalUpdate = game.update.bind(game);
    game.update = function(currentTime) {
        originalUpdate(currentTime);
        
        if (!game.paused) {
            if (window.particleSystem) {
                window.particleSystem.update(game.deltaTime);
            }
            
            // Check for level ups
            if (game.progressionSystem) {
                game.progressionSystem.checkLevelUp();
            }
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
    console.log('  ROOT: REALITY\'S COMPILER v0.3');
    console.log('═══════════════════════════════════');
    console.log('Controls:');
    console.log('  WASD / Arrow Keys - Move');
    console.log('  Space / J - Attack');
    console.log('  Shift - Dodge');
    console.log('  ESC - Pause Menu');
    console.log('  I - Inventory');
    console.log('═══════════════════════════════════');
});
