// Parallax and animation effects for portfolio
document.addEventListener('DOMContentLoaded', () => {
    // Elements that will have parallax effect
    const heroSection = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroBackground = document.querySelector('.hero-background');
    
    // Subtle animations for page elements
    const animateOnScroll = () => {
        // Elements to animate on scroll
        const animatedElements = document.querySelectorAll('.grid-item, .credential-item, .about-content, .contact-section');
        
        animatedElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate-in');
            }
        });
    };
    
    // Parallax effect on mouse move for hero section
    if (heroSection && heroContent && heroBackground) {
        heroSection.addEventListener('mousemove', (e) => {
            // Get mouse position
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            // Apply subtle movement to hero content
            heroContent.style.transform = `translate(${mouseX * -20}px, ${mouseY * -20}px)`;
            
            // Move background in opposite direction for parallax effect
            heroBackground.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px)`;
        });
        
        // Reset position when mouse leaves
        heroSection.addEventListener('mouseleave', () => {
            heroContent.style.transform = 'translate(0, 0)';
            heroBackground.style.transform = 'translate(0, 0)';
        });
    }
    
    // Parallax effect on scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        // Parallax effect for hero section on scroll
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrollPosition * 0.4}px)`;
        }
        
        // Slow-moving parallax effect for corner icons
        const cornerIcons = document.querySelector('.corner-icons');
        if (cornerIcons) {
            // Move at 30% of scroll speed (0.3 ratio)
            const slowScrollY = scrollPosition * 0.3;
            cornerIcons.style.transform = `translateY(${slowScrollY}px)`;
        }
        
        // Animate elements as they come into view
        animateOnScroll();
    });
    
    // Initial check for elements in view
    animateOnScroll();
    
    // Smooth hover effects for project items
    const projectItems = document.querySelectorAll('.grid-item');
    
    projectItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.classList.add('hover-effect');
        });
        
        item.addEventListener('mouseleave', () => {
            item.classList.remove('hover-effect');
        });
    });
});
