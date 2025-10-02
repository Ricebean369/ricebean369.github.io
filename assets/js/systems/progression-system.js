class ProgressionSystem {
    constructor(player) {
        this.player = player;
        this.expCurve = 'exponential'; // exponential, linear, custom
        this.baseExpRequired = 100;
        this.expMultiplier = 1.5;
    }
    
    getExpRequiredForLevel(level) {
        switch(this.expCurve) {
            case 'exponential':
                return Math.floor(this.baseExpRequired * Math.pow(this.expMultiplier, level - 1));
            case 'linear':
                return this.baseExpRequired * level;
            default:
                return this.baseExpRequired * level;
        }
    }
    
    getCurrentLevelExp() {
        return this.getExpRequiredForLevel(this.player.level);
    }
    
    getExpProgress() {
        const required = this.getCurrentLevelExp();
        return this.player.experience / required;
    }
    
    checkLevelUp() {
        const required = this.getCurrentLevelExp();
        
        if (this.player.experience >= required) {
            this.levelUp();
            return true;
        }
        return false;
    }
    
    levelUp() {
        this.player.level++;
        this.player.experience -= this.getCurrentLevelExp();
        
        // Stat increases
        this.player.maxHealth += 10;
        this.player.health = this.player.maxHealth; // Full heal on level up
        this.player.maxMana += 10;
        this.player.mana = this.player.maxMana;
        this.player.damage += 2;
        this.player.speed += 5;
        
        // Level up effects
        if (window.particleSystem) {
            window.particleSystem.emit(
                this.player.x + this.player.width / 2,
                this.player.y + this.player.height / 2,
                {
                    count: 50,
                    color: '#ffff00',
                    size: 5,
                    speed: 200,
                    lifetime: 2.0,
                    gravity: -100
                }
            );
        }
        
        // Show level up notification
        this.showLevelUpUI();
        
        console.log(`LEVEL UP! Now level ${this.player.level}`);
        
        // Check for another level up (overflow exp)
        if (this.player.experience >= this.getCurrentLevelExp()) {
            this.levelUp();
        }
    }
    
    showLevelUpUI() {
        // Create temporary level up display
        const levelUpDiv = document.createElement('div');
        levelUpDiv.id = 'level-up-notification';
        levelUpDiv.innerHTML = `
            <div class="level-up-content">
                <h1>LEVEL UP!</h1>
                <div class="level-number">${this.player.level}</div>
                <div class="stat-increases">
                    <div>HP: ${this.player.maxHealth - 10} → ${this.player.maxHealth}</div>
                    <div>MP: ${this.player.maxMana - 10} → ${this.player.maxMana}</div>
                    <div>ATK: ${this.player.damage - 2} → ${this.player.damage}</div>
                    <div>SPD: ${this.player.speed - 5} → ${this.player.speed}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(levelUpDiv);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            levelUpDiv.classList.add('fade-out');
            setTimeout(() => levelUpDiv.remove(), 500);
        }, 3000);
    }
}
