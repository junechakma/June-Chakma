// Interactive glowing dot pattern background for hero section only
document.addEventListener('DOMContentLoaded', () => {
    // Get the hero section
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return; // Exit if hero section doesn't exist
    
    // Create canvas element for the dot pattern
    const canvas = document.createElement('canvas');
    canvas.id = 'dot-pattern-canvas';
    
    // Set canvas styles
    Object.assign(canvas.style, {
        position: 'absolute', // Changed from fixed to absolute for hero section
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1, // Above background but below content
        pointerEvents: 'none' // Allow interactions with elements below
    });
    
    // Add canvas to the hero section
    heroSection.insertBefore(canvas, heroSection.firstChild);
    
    // Get canvas context
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match hero section
    const setCanvasSize = () => {
        const heroRect = heroSection.getBoundingClientRect();
        canvas.width = heroRect.width;
        canvas.height = heroRect.height;
    };
    
    // Initial size setup
    setCanvasSize();
    
    // Update canvas size on window resize
    window.addEventListener('resize', setCanvasSize);
    
    // Dot pattern configuration
    const config = {
        dotSize: 1, // Smaller dots
        dotSpacing: 20, // More congested dot pattern
        dotColor: '#A9CAE3', // Using accent color from CSS
        glowRadius: 180, // Slightly larger glow radius for subtlety
        glowIntensity: 0.5, // Less intense glow
        mouseX: 0,
        mouseY: 0,
        mouseRadius: 250, // Larger radius for slower transition
        // Animation smoothing
        currentMouseX: 0,
        currentMouseY: 0,
        easing: 0.05 // Lower value = slower movement (0.01 to 0.1 range)
    };
    
    // Track mouse position relative to hero section
    heroSection.addEventListener('mousemove', (e) => {
        // Get hero section's position
        const heroRect = heroSection.getBoundingClientRect();
        
        // Calculate mouse position relative to the hero section
        const relativeX = e.clientX - heroRect.left;
        const relativeY = e.clientY - heroRect.top;
        
        // Just store the target position, actual movement will be smoothed
        config.mouseX = relativeX;
        config.mouseY = relativeY;
    });
    
    // Reset mouse position when leaving hero section
    heroSection.addEventListener('mouseleave', () => {
        // Move cursor position off-canvas to hide effect when not hovering
        config.mouseX = -1000;
        config.mouseY = -1000;
    });
    
    // Draw the dot pattern
    function drawDotPattern() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Smooth mouse movement with easing
        config.currentMouseX += (config.mouseX - config.currentMouseX) * config.easing;
        config.currentMouseY += (config.mouseY - config.currentMouseY) * config.easing;
        
        // Calculate number of dots based on spacing
        const columns = Math.ceil(canvas.width / config.dotSpacing);
        const rows = Math.ceil(canvas.height / config.dotSpacing);
        
        // Draw dots
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                // Calculate dot position
                const x = i * config.dotSpacing;
                const y = j * config.dotSpacing;
                
                // Calculate distance from mouse using the smoothed position
                const dx = config.currentMouseX - x;
                const dy = config.currentMouseY - y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Calculate dot size and opacity based on distance from mouse
                let size = config.dotSize;
                let opacity = 0.15; // Lower base opacity for more subtlety
                
                if (distance < config.mouseRadius) {
                    // Increase size and opacity for dots near the cursor (more subtle)
                    const factor = 1 - distance / config.mouseRadius;
                    size = config.dotSize + (factor * 2); // Smaller size increase
                    opacity = 0.15 + (factor * config.glowIntensity);
                }
                
                // Draw the dot
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(169, 202, 227, ${opacity})`; // Using accent color with variable opacity
                ctx.fill();
                
                // Add glow effect for dots near cursor
                if (distance < config.glowRadius) {
                    const glowFactor = 1 - distance / config.glowRadius;
                    const glowSize = size + (glowFactor * 8); // Smaller glow
                    
                    // Create radial gradient for glow
                    const gradient = ctx.createRadialGradient(x, y, size, x, y, glowSize);
                    gradient.addColorStop(0, `rgba(169, 202, 227, ${glowFactor * 0.3})`);
                    gradient.addColorStop(1, 'rgba(169, 202, 227, 0)');
                    
                    ctx.beginPath();
                    ctx.arc(x, y, glowSize, 0, Math.PI * 2);
                    ctx.fillStyle = gradient;
                    ctx.fill();
                }
            }
        }
        
        // Request next animation frame
        requestAnimationFrame(drawDotPattern);
    }
    
    // Start the animation
    drawDotPattern();
});
