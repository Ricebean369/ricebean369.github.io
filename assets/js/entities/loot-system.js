class LootSystem {
    constructor() {
        this.lootTables = this.initializeLootTables();
    }
    
    initializeLootTables() {
        return {
            'bit-fly': [
                { item: 'bit-fragment', chance: 1.0, min: 1, max: 3 },
                { item: 'health-potion', chance: 0.1, min: 1, max: 1 }
            ],
            'syntax-error': [
                { item: 'bit-fragment', chance: 1.0, min: 2, max: 5 },
                { item: 'logic-bloom', chance: 0.3, min: 1, max: 1 },
                { item: 'health-potion', chance: 0.15, min: 1, max: 1 }
            ],
            'logic-bug': [
                { item: 'bit-fragment', chance: 1.0, min: 3, max: 6 },
                { item: 'data-herb', chance: 0.4, min: 1, max: 2 }
            ]
        };
    }
    
    dropLoot(enemyType, x, y) {
        const table = this.lootTables[enemyType];
        if (!table) return [];
        
        const drops = [];
        
        table.forEach(entry => {
            if (Math.random() < entry.chance) {
                const amount = Math.floor(
                    Math.random() * (entry.max - entry.min + 1) + entry.min
                );
                
                drops.push({
                    item: entry.item,
                    amount,
                    x: x + (Math.random() - 0.5) * 40,
                    y: y + (Math.random() - 0.5) * 40,
                    vx: (Math.random() - 0.5) * 100,
                    vy: -100 - Math.random() * 50,
                    lifetime: 10.0, // 10 seconds to pick up
                    gravity: 200
                });
            }
        });
        
        return drops;
    }
    
    getItemData(itemId) {
        const items = {
            'bit-fragment': {
                id: 'bit-fragment',
                name: 'Bit Fragment',
                icon: '◈',
                color: '#ffaa00',
                type: 'currency'
            },
            'health-potion': {
                id: 'health-potion',
                name: 'Health Patch v1.0',
                icon: '❤️',
                type: 'consumable',
                healAmount: 25,
                maxStack: 10
            },
            'logic-bloom': {
                id: 'logic-bloom',
                name: 'Logic Bloom',
                icon: '🌸',
                type: 'material',
                maxStack: 99
            },
            'data-herb': {
                id: 'data-herb',
                name: 'Data Herb',
                icon: '🌿',
                type: 'material',
                maxStack: 99
            }
        };
        
        return items[itemId];
    }
}
