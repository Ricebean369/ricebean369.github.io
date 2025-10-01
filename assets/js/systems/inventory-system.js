class InventorySystem {
    constructor(player) {
        this.player = player;
        this.slots = 64; // 8x8 grid
        this.items = new Array(this.slots).fill(null);
        
        this.selectedSlot = 0;
    }
    
    addItem(item, quantity = 1) {
        // Check if item is stackable and already exists
        const existingSlot = this.items.findIndex(slot => 
            slot && slot.id === item.id && slot.quantity < item.maxStack
        );
        
        if (existingSlot !== -1) {
            this.items[existingSlot].quantity += quantity;
            return true;
        }
        
        // Find empty slot
        const emptySlot = this.items.findIndex(slot => slot === null);
        if (emptySlot !== -1) {
            this.items[emptySlot] = {
                ...item,
                quantity
            };
            return true;
        }
        
        return false; // Inventory full
    }
    
    removeItem(slotIndex, quantity = 1) {
        if (!this.items[slotIndex]) return false;
        
        this.items[slotIndex].quantity -= quantity;
        
        if (this.items[slotIndex].quantity <= 0) {
            this.items[slotIndex] = null;
        }
        
        return true;
    }
    
    useItem(slotIndex) {
        const item = this.items[slotIndex];
        if (!item) return;
        
        switch(item.type) {
            case 'health-potion':
                this.player.heal(item.healAmount);
                this.removeItem(slotIndex);
                break;
            case 'mana-potion':
                this.player.mana += item.manaAmount;
                if (this.player.mana > this.player.maxMana) {
                    this.player.mana = this.player.maxMana;
                }
                this.removeItem(slotIndex);
                break;
        }
    }
    
    renderInventoryUI() {
        const grid = document.getElementById('inventory-grid');
        grid.innerHTML = '';
        
        this.items.forEach((item, index) => {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            
            if (item) {
                slot.classList.add('has-item');
                
                const icon = document.createElement('div');
                icon.className = 'item-icon';
                icon.textContent = item.icon || '?';
                
                const count = document.createElement('div');
                count.className = 'item-count';
                count.textContent = item.quantity > 1 ? item.quantity : '';
                
                slot.appendChild(icon);
                slot.appendChild(count);
                
                slot.addEventListener('click', () => {
                    this.useItem(index);
                    this.renderInventoryUI(); // Refresh
                });
            }
            
            grid.appendChild(slot);
        });
    }
}
