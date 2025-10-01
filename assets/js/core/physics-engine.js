class PhysicsEngine {
    constructor() {
        this.gravity = 0; // Top-down, no gravity
        this.entities = [];
        this.colliders = [];
    }
    
    addEntity(entity) {
        this.entities.push(entity);
    }
    
    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
        }
    }
    
    addCollider(collider) {
        this.colliders.push(collider);
    }
    
    update(deltaTime) {
        // Update all entities
        this.entities.forEach(entity => {
            if (entity.velocity) {
                entity.x += entity.velocity.x * deltaTime;
                entity.y += entity.velocity.y * deltaTime;
            }
        });
        
        // Check collisions
        this.checkCollisions();
    }
    
    checkCollisions() {
        // Entity vs Entity
        for (let i = 0; i < this.entities.length; i++) {
            for (let j = i + 1; j < this.entities.length; j++) {
                const a = this.entities[i];
                const b = this.entities[j];
                
                if (this.checkAABB(a, b)) {
                    this.resolveCollision(a, b);
                }
            }
        }
        
        // Entity vs Static Colliders
        this.entities.forEach(entity => {
            this.colliders.forEach(collider => {
                if (this.checkAABB(entity, collider)) {
                    this.resolveStaticCollision(entity, collider);
                }
            });
        });
    }
    
    checkAABB(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }
    
    resolveCollision(a, b) {
        // Simple collision response
        if (a.onCollide) a.onCollide(b);
        if (b.onCollide) b.onCollide(a);
    }
    
    resolveStaticCollision(entity, collider) {
        // Push entity out of collider
        const overlapX = Math.min(
            entity.x + entity.width - collider.x,
            collider.x + collider.width - entity.x
        );
        
        const overlapY = Math.min(
            entity.y + entity.height - collider.y,
            collider.y + collider.height - entity.y
        );
        
        if (overlapX < overlapY) {
            if (entity.x < collider.x) {
                entity.x -= overlapX;
            } else {
                entity.x += overlapX;
            }
        } else {
            if (entity.y < collider.y) {
                entity.y -= overlapY;
            } else {
                entity.y += overlapY;
            }
        }
    }
    
    clear() {
        this.entities = [];
        this.colliders = [];
    }
}
