// Particle system for hero section
class ParticleSystem {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Default options
        this.options = {
            particleCount: options.particleCount || 50,
            particleColor: options.particleColor || '#ffffff',
            particleSize: options.particleSize || { min: 1, max: 3 },
            particleSpeed: options.particleSpeed || { min: 0.2, max: 0.8 },
            lineColor: options.lineColor || 'rgba(255, 255, 255, 0.2)',
            lineThreshold: options.lineThreshold || 150,
            mouseInteraction: options.mouseInteraction !== undefined ? options.mouseInteraction : true,
            mouseRadius: options.mouseRadius || 120
        };
        
        this.particles = [];
        this.mousePosition = { x: null, y: null };
        
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    init() {
        // Set canvas size to match parent
        this.resize();
        
        // Create particles
        this.createParticles();
    }
    
    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.offsetWidth;
        this.canvas.height = parent.offsetHeight;
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: this.randomBetween(this.options.particleSize.min, this.options.particleSize.max),
                speedX: this.randomBetween(-this.options.particleSpeed.max, this.options.particleSpeed.max),
                speedY: this.randomBetween(-this.options.particleSpeed.max, this.options.particleSpeed.max),
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }
    
    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
        
        if (this.options.mouseInteraction) {
            this.canvas.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mousePosition.x = e.clientX - rect.left;
                this.mousePosition.y = e.clientY - rect.top;
            });
            
            this.canvas.addEventListener('mouseleave', () => {
                this.mousePosition.x = null;
                this.mousePosition.y = null;
            });
            
            // Touch support for mobile
            this.canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const rect = this.canvas.getBoundingClientRect();
                this.mousePosition.x = e.touches[0].clientX - rect.left;
                this.mousePosition.y = e.touches[0].clientY - rect.top;
            });
            
            this.canvas.addEventListener('touchend', () => {
                this.mousePosition.x = null;
                this.mousePosition.y = null;
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.updateParticles();
        this.drawParticles();
        this.connectParticles();
        
        requestAnimationFrame(() => this.animate());
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // Move particles
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -1;
            }
            
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -1;
            }
            
            // Mouse interaction
            if (this.options.mouseInteraction && this.mousePosition.x !== null) {
                const dx = particle.x - this.mousePosition.x;
                const dy = particle.y - this.mousePosition.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.options.mouseRadius) {
                    const force = (this.options.mouseRadius - distance) / this.options.mouseRadius;
                    const angle = Math.atan2(dy, dx);
                    
                    particle.x += Math.cos(angle) * force * 2;
                    particle.y += Math.sin(angle) * force * 2;
                }
            }
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.options.particleColor;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        });
    }
    
    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.options.lineThreshold) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = this.options.lineColor;
                    this.ctx.globalAlpha = 1 - (distance / this.options.lineThreshold);
                    this.ctx.stroke();
                    this.ctx.globalAlpha = 1;
                }
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        // Create canvas element
        const canvas = document.createElement('canvas');
        canvas.classList.add('particle-canvas');
        
        // Insert canvas as the first child of hero section
        heroSection.insertBefore(canvas, heroSection.firstChild);
        
        // Initialize particle system
        new ParticleSystem(canvas, {
            particleCount: 80,
            particleColor: '#ffffff',
            particleSize: { min: 1, max: 3 },
            particleSpeed: { min: 0.1, max: 0.5 },
            lineColor: 'rgba(255, 255, 255, 0.15)',
            lineThreshold: 150,
            mouseRadius: 120
        });
    }
});
