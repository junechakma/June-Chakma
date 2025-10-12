/**
 * Floating Bubble with Mouse Repel Effect
 * Creates a floating bubble that moves away from the mouse cursor
 */

(function() {
    'use strict';

    const config = {
        bubbleText: 'Vibe Code',
        repelDistance: 200, // Distance at which bubble starts to repel
        moveSpeed: 0.25, // Speed of repel movement (0-1)
        floatSpeed: 2000, // Duration of floating animation in ms
        floatDistance: 30, // Max distance to float in pixels
    };

    let bubble = null;
    let bubblePos = { x: 0, y: 0 };
    let bubbleVelocity = { x: 0, y: 0 };
    let targetPos = { x: 0, y: 0 };
    let mousePos = { x: -1000, y: -1000 };
    let animationFrameId = null;
    let initialPos = { x: 0, y: 0 };
    let floatOffset = { x: 0, y: 0 };
    let floatTime = 0;
    let heroSection = null;
    let heroBounds = { top: 0, bottom: 0, left: 0, right: 0 };

    function updateHeroBounds() {
        heroSection = document.querySelector('.hero');
        if (heroSection) {
            const rect = heroSection.getBoundingClientRect();
            heroBounds = {
                top: rect.top + window.scrollY,
                bottom: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                right: rect.right + window.scrollX
            };
        }
    }

    function createBubble() {
        // Get hero section bounds
        updateHeroBounds();

        if (!heroSection) {
            console.warn('Hero section not found');
            return;
        }

        // Create bubble element
        bubble = document.createElement('div');
        bubble.className = 'floating-bubble';
        bubble.textContent = config.bubbleText;

        // Add to body
        document.body.appendChild(bubble);

        // Set initial random position within hero section (avoiding edges)
        const margin = 100;
        const heroWidth = heroBounds.right - heroBounds.left;
        const heroHeight = heroBounds.bottom - heroBounds.top;

        initialPos.x = heroBounds.left + margin + Math.random() * (heroWidth - 2 * margin - bubble.offsetWidth);
        initialPos.y = heroBounds.top + margin + Math.random() * (heroHeight - 2 * margin - bubble.offsetHeight);

        bubblePos.x = initialPos.x;
        bubblePos.y = initialPos.y;
        targetPos.x = initialPos.x;
        targetPos.y = initialPos.y;

        updateBubblePosition();
    }

    function updateBubblePosition() {
        if (!bubble) return;

        bubble.style.left = bubblePos.x + 'px';
        bubble.style.top = bubblePos.y + 'px';
    }

    function calculateRepelForce() {
        // Calculate distance from mouse to bubble center
        const bubbleCenter = {
            x: bubblePos.x + bubble.offsetWidth / 2,
            y: bubblePos.y + bubble.offsetHeight / 2
        };

        const dx = bubbleCenter.x - mousePos.x;
        const dy = bubbleCenter.y - mousePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.repelDistance && distance > 0) {
            // Calculate repel force (stronger when closer)
            const force = (config.repelDistance - distance) / config.repelDistance;

            // Normalize direction and apply force
            const dirX = dx / distance;
            const dirY = dy / distance;

            return {
                x: dirX * force * 180,
                y: dirY * force * 180
            };
        }

        return { x: 0, y: 0 };
    }

    function animate(timestamp) {
        if (!bubble) return;

        // Update float time
        floatTime += 16; // Approximate ms per frame

        // Calculate gentle floating motion
        floatOffset.x = Math.sin(floatTime / config.floatSpeed) * config.floatDistance;
        floatOffset.y = Math.cos(floatTime / (config.floatSpeed * 1.3)) * config.floatDistance;

        // Calculate repel force
        const repelForce = calculateRepelForce();

        // Set target position (initial + float + repel)
        targetPos.x = initialPos.x + floatOffset.x + repelForce.x;
        targetPos.y = initialPos.y + floatOffset.y + repelForce.y;

        // Keep bubble within hero section bounds
        const margin = 20;
        targetPos.x = Math.max(heroBounds.left + margin, Math.min(heroBounds.right - bubble.offsetWidth - margin, targetPos.x));
        targetPos.y = Math.max(heroBounds.top + margin, Math.min(heroBounds.bottom - bubble.offsetHeight - margin, targetPos.y));

        // Smooth movement towards target (easing)
        bubbleVelocity.x += (targetPos.x - bubblePos.x) * config.moveSpeed;
        bubbleVelocity.y += (targetPos.y - bubblePos.y) * config.moveSpeed;

        // Apply damping
        bubbleVelocity.x *= 0.85;
        bubbleVelocity.y *= 0.85;

        // Update position
        bubblePos.x += bubbleVelocity.x;
        bubblePos.y += bubbleVelocity.y;

        updateBubblePosition();

        animationFrameId = requestAnimationFrame(animate);
    }

    function handleMouseMove(e) {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    }

    function handleTouchMove(e) {
        if (e.touches.length > 0) {
            mousePos.x = e.touches[0].clientX;
            mousePos.y = e.touches[0].clientY;
        }
    }

    function handleMouseLeave() {
        // Move mouse position far away
        mousePos.x = -1000;
        mousePos.y = -1000;
    }

    function handleResize() {
        // Update hero section bounds on resize
        updateHeroBounds();

        // Recalculate initial position within hero section
        const margin = 100;
        const heroWidth = heroBounds.right - heroBounds.left;
        const heroHeight = heroBounds.bottom - heroBounds.top;

        // Keep initial position within new hero bounds
        initialPos.x = Math.max(heroBounds.left + margin, Math.min(heroBounds.right - margin - (bubble ? bubble.offsetWidth : 0), initialPos.x));
        initialPos.y = Math.max(heroBounds.top + margin, Math.min(heroBounds.bottom - margin - (bubble ? bubble.offsetHeight : 0), initialPos.y));
    }

    function handleScroll() {
        // Update hero bounds on scroll to maintain accurate positioning
        updateHeroBounds();

        // Hide bubble when scrolled past hero section
        if (!bubble) return;

        const scrollY = window.scrollY;
        if (scrollY > heroBounds.bottom) {
            bubble.style.opacity = '0';
        } else {
            bubble.style.opacity = '1';
        }
    }

    function init() {
        createBubble();

        if (!bubble) return;

        // Add event listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchmove', handleTouchMove, { passive: true });
        document.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Start animation
        animationFrameId = requestAnimationFrame(animate);
    }

    function destroy() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);

        if (bubble && bubble.parentNode) {
            bubble.parentNode.removeChild(bubble);
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose destroy method for cleanup if needed
    window.floatingBubble = {
        destroy: destroy
    };
})();
