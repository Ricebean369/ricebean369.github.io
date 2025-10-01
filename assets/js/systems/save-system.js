class SaveSystem {
    constructor() {
        this.saveName = 'root_game_save';
    }
    
    save(gameEngine) {
        const saveData = {
            version: '1.0.0',
            timestamp: Date.now(),
            player: {
                x: gameEngine.player.x,
                y: gameEngine.player.y,
                health: gameEngine.player.health,
                maxHealth: gameEngine.player.maxHealth,
                mana: gameEngine.player.mana,
                maxMana: gameEngine.player.maxMana,
                level: gameEngine.player.level,
                experience: gameEngine.player.experience,
                bitFragments: gameEngine.player.bitFragments,
                weapon: gameEngine.player.weapon,
                armor: gameEngine.player.armor,
            },
            realm: gameEngine.currentRealm.name,
            inventory: [], // TODO: serialize inventory
            flags: {}, // Story progression flags
        };
        
        try {
            localStorage.setItem(this.saveName, JSON.stringify(saveData));
            console.log('Game saved!', saveData);
            return true;
        } catch (e) {
            console.error('Save failed:', e);
            return false;
        }
    }
    
    load(gameEngine) {
        try {
            const saveData = JSON.parse(localStorage.getItem(this.saveName));
            if (!saveData) return false;
            
            // Restore player state
            Object.assign(gameEngine.player, saveData.player);
            
            // Load realm
            // TODO: Implement realm switching
            
            console.log('Game loaded!', saveData);
            return true;
        } catch (e) {
            console.error('Load failed:', e);
            return false;
        }
    }
    
    deleteSave() {
        localStorage.removeItem(this.saveName);
    }
    
    hasSave() {
        return localStorage.getItem(this.saveName) !== null;
    }
}
