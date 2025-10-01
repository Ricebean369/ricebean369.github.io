class RealmManager {
    constructor() {
        this.realms = new Map();
        this.currentRealm = null;
    }
    
    registerRealm(name, realmClass) {
        this.realms.set(name, realmClass);
    }
    
    loadRealm(name, gameEngine) {
        const RealmClass = this.realms.get(name);
        if (!RealmClass) {
            console.error(`Realm ${name} not found!`);
            return null;
        }
        
        this.currentRealm = new RealmClass();
        gameEngine.setRealm(this.currentRealm);
        
        console.log(`Loaded realm: ${name}`);
        return this.currentRealm;
    }
}
