class SkillTree {
    constructor(player) {
        this.player = player;
        this.skillPoints = 0;
        this.skills = this.initializeSkills();
        this.unlockedSkills = new Set();
    }
    
    initializeSkills() {
        return {
            // Combat Branch
            'power_attack': {
                name: 'Power Attack',
                description: '+20% attack damage',
                tier: 1,
                branch: 'combat',
                cost: 1,
                requires: [],
                effect: () => {
                    this.player.damage *= 1.2;
                }
            },
            'swift_strikes': {
                name: 'Swift Strikes',
                description: '+25% attack speed',
                tier: 1,
                branch: 'combat',
                cost: 1,
                requires: [],
                effect: () => {
                    this.player.attackSpeed *= 0.75;
                }
            },
            'critical_hit': {
                name: 'Critical Hit',
                description: '15% chance for 2x damage',
                tier: 2,
                branch: 'combat',
                cost: 1,
                requires: ['power_attack'],
                effect: () => {
                    this.player.critChance = 0.15;
                    this.player.critMultiplier = 2;
                }
            },
            
            // Defense Branch
            'iron_skin': {
                name: 'Iron Skin',
                description: '+25% max health',
                tier: 1,
                branch: 'defense',
                cost: 1,
                requires: [],
                effect: () => {
                    this.player.maxHealth *= 1.25;
                    this.player.health *= 1.25;
                }
            },
            'efficient_dodge': {
                name: 'Efficient Dodge',
                description: 'Dodge costs 50% less mana',
                tier: 1,
                branch: 'defense',
                cost: 1,
                requires: [],
                effect: () => {
                    this.player.dodgeCost *= 0.5;
                }
            },
            
            // Magic Branch
            'mana_pool': {
                name: 'Expanded Mana Pool',
                description: '+25% max mana',
                tier: 1,
                branch: 'magic',
                cost: 1,
                requires: [],
                effect: () => {
                    this.player.maxMana *= 1.25;
                    this.player.mana *= 1.25;
                }
            },
            'fast_regen': {
                name: 'Rapid Regeneration',
                description: '2x mana regeneration',
                tier: 1,
                branch: 'magic',
                cost: 1,
                requires: [],
                effect: () => {
                    this.player.manaRegenRate = (this.player.manaRegenRate || 10) * 2;
                }
            },
            
            // Utility Branch
            'speed_boost': {
                name: 'Fleet Footed',
                description: '+15% movement speed',
                tier: 1,
                branch: 'utility',
                cost: 1,
                requires: [],
                effect: () => {
                    this.player.speed *= 1.15;
                }
            },
            'treasure_hunter': {
                name: 'Treasure Hunter',
                description: '+50% bit fragment drops',
                tier: 1,
                branch: 'utility',
                cost: 1,
                requires: [],
                effect: () => {
                    this.player.lootBonus = 1.5;
                }
            }
        };
    }
    
    canUnlock(skillId) {
        const skill = this.skills[skillId];
        if (!skill) return false;
        
        if (this.unlockedSkills.has(skillId)) return false;
        if (this.skillPoints < skill.cost) return false;
        
        // Check requirements
        for (const req of skill.requires) {
            if (!this.unlockedSkills.has(req)) return false;
        }
        
        return true;
    }
    
    unlockSkill(skillId) {
        if (!this.canUnlock(skillId)) return false;
        
        const skill = this.skills[skillId];
        this.skillPoints -= skill.cost;
        this.unlockedSkills.add(skillId);
        skill.effect();
        
        console.log(`Unlocked skill: ${skill.name}`);
        return true;
    }
    
    addSkillPoints(amount) {
        this.skillPoints += amount;
    }
}
