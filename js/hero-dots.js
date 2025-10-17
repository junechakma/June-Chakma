// Hero Dot Pattern Background
document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-background');

    // Create canvas for dots
    const canvas = document.createElement('canvas');
    canvas.classList.add('hero-dots-canvas');
    heroBackground.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let dots = [];
    let mouse = { x: null, y: null, radius: 150 };

    // Set canvas size
    function setCanvasSize() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
        initDots();
    }

    // Initialize dots in a grid pattern
    function initDots() {
        dots = [];
        const spacing = 30; // Space between dots
        const cols = Math.floor(canvas.width / spacing);
        const rows = Math.floor(canvas.height / spacing);

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                dots.push({
                    x: i * spacing + spacing / 2,
                    y: j * spacing + spacing / 2,
                    baseX: i * spacing + spacing / 2,
                    baseY: j * spacing + spacing / 2,
                    size: 2,
                    baseSize: 2
                });
            }
        }
    }

    // Track mouse position
    hero.addEventListener('mousemove', function(e) {
        const rect = hero.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    hero.addEventListener('mouseleave', function() {
        mouse.x = null;
        mouse.y = null;
    });

    // Check if light mode is active
    function isLightMode() {
        return document.body.classList.contains('light-mode');
    }

    // Animate dots
    function animate() {
        if (!isLightMode()) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            requestAnimationFrame(animate);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        dots.forEach(dot => {
            // Calculate distance from mouse
            let dx = mouse.x - dot.x;
            let dy = mouse.y - dot.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // Highlight dots near mouse
            if (distance < mouse.radius && mouse.x !== null) {
                let force = (mouse.radius - distance) / mouse.radius;

                // Add slight repulsion effect
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let maxRepulsion = 10;

                dot.x = dot.baseX - forceDirectionX * force * maxRepulsion;
                dot.y = dot.baseY - forceDirectionY * force * maxRepulsion;
            } else {
                // Return to original position
                dot.x += (dot.baseX - dot.x) * 0.1;
                dot.y += (dot.baseY - dot.y) * 0.1;
            }

            // Draw dot
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);

            // Color based on distance from mouse
            if (distance < mouse.radius && mouse.x !== null) {
                let opacity = 1 - (distance / mouse.radius);
                ctx.fillStyle = `rgba(59, 130, 246, ${0.4 + opacity * 0.6})`;
            } else {
                ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
            }

            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    // Initialize
    setCanvasSize();
    animate();

    // Resize handler
    window.addEventListener('resize', setCanvasSize);

    // Re-initialize when theme changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                if (isLightMode()) {
                    canvas.style.display = 'block';
                } else {
                    canvas.style.display = 'none';
                }
            }
        });
    });

    observer.observe(document.body, { attributes: true });

    // Set initial visibility
    canvas.style.display = isLightMode() ? 'block' : 'none';
});
