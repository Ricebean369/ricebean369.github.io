class CombatSystem {
    constructor() {
        this.damageNumbers = [];
    }
    
    calculateDamage(attacker, defender) {
        let baseDamage = attacker.damage;
        
        // Apply modifiers (armor, buffs, etc)
        if (defender.armor) {
            baseDamage *= 0.8; // 20% reduction
        }
        
        // Add randomness (90-110%)
        const variance = 0.9 + Math.random() * 0.2;
        baseDamage *= variance;
        
        return Math.floor(baseDamage);
    }
    
    spawnDamageNumber(x, y, amount, color = '#ff0000') {
        this.damageNumbers.push({
            x, y,
            amount,
            color,
            lifetime: 1.0,
            opacity: 1.0
        });
    }
    
    update(deltaTime) {
        this.damageNumbers.forEach(dn => {
            dn.y -= 50 * deltaTime;
            dn.lifetime -= deltaTime;
            dn.opacity = dn.lifetime;
        });
        
        this.damageNumbers = this.damageNumbers.filter(dn => dn.lifetime > 0);
    }
    
    render(renderer) {
        this.damageNumbers.forEach(dn => {
            renderer.ctx.save();
            renderer.ctx.globalAlpha = dn.opacity;
            renderer.drawText(
                `-${dn.amount}`,
                dn.x,
                dn.y,
                dn.color,
                20
            );
            renderer.ctx.restore();
        });
    }
}
