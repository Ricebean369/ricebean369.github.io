class InputHandler {
    constructor() {
        this.keys = {};
        this.mousePos = { x: 0, y: 0 };
        this.mouseDown = false;
        
        this.bindings = {
            // Movement
            'w': 'up',
            'ArrowUp': 'up',
            's': 'down',
            'ArrowDown': 'down',
            'a': 'left',
            'ArrowLeft': 'left',
            'd': 'right',
            'ArrowRight': 'right',
            
            // Actions
            ' ': 'attack',
            'j': 'attack',
            'k': 'special',
            'Shift': 'dodge',
            
            // Menu
            'Escape': 'menu',
            'i': 'inventory',
            'm': 'map',
            'Tab': 'quickswap'
        };
        
        this.setupListeners();
    }
    
    setupListeners() {
        // Keyboard
        window.addEventListener('keydown', (e) => {
            const action = this.bindings[e.key];
            if (action) {
                this.keys[action] = true;
                e.preventDefault();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            const action = this.bindings[e.key];
            if (action) {
                this.keys[action] = false;
                e.preventDefault();
            }
        });
        
        // Mouse
        window.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        });
        
        window.addEventListener('mousedown', () => {
            this.mouseDown = true;
        });
        
        window.addEventListener('mouseup', () => {
            this.mouseDown = false;
        });
        
        // Touch (mobile support)
        this.setupTouchControls();
    }
    
    setupTouchControls() {
        let touchStartX = 0;
        let touchStartY = 0;
        
        window.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        window.addEventListener('touchmove', (e) => {
            if (!touchStartX || !touchStartY) return;
            
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            
            const diffX = touchX - touchStartX;
            const diffY = touchY - touchStartY;
            
            // Determine direction
            this.keys.up = diffY < -30;
            this.keys.down = diffY > 30;
            this.keys.left = diffX < -30;
            this.keys.right = diffX > 30;
            
            e.preventDefault();
        });
        
        window.addEventListener('touchend', () => {
            this.keys.up = false;
            this.keys.down = false;
            this.keys.left = false;
            this.keys.right = false;
            touchStartX = 0;
            touchStartY = 0;
        });
    }
    
    isPressed(action) {
        return this.keys[action] || false;
    }
    
    getMovementVector() {
        let x = 0;
        let y = 0;
        
        if (this.keys.up) y -= 1;
        if (this.keys.down) y += 1;
        if (this.keys.left) x -= 1;
        if (this.keys.right) x += 1;
        
        // Normalize diagonal movement
        if (x !== 0 && y !== 0) {
            const length = Math.sqrt(x * x + y * y);
            x /= length;
            y /= length;
        }
        
        return { x, y };
    }
}
