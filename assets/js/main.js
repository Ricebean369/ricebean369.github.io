// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('ROOT: Reality\'s Compiler - Loading...');
    
    // Initialize audio
    await audioEngine.initialize();
    
    // Create game engine
    const game = new GameEngine();
    
    // Create player
    const player = new Player(1000, 1000); // Start position
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
    
    // Start game loop
    game.start();
    
    console.log('Game started! Use WASD/Arrow keys to move, Space/J to attack');
});
