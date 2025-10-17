// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const heroProfileImage = document.getElementById('hero-profile-image');
    const body = document.body;

    // Profile images for different themes
    const darkModeImage = './Profile.png';
    const lightModeImage = './profile-photo.png';

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Apply the saved theme on page load
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
        if (heroProfileImage) {
            heroProfileImage.src = lightModeImage;
        }
    } else {
        // Dark mode
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        if (heroProfileImage) {
            heroProfileImage.src = darkModeImage;
        }
    }

    // Theme toggle click handler
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('light-mode');

        // Toggle icons and profile image
        if (body.classList.contains('light-mode')) {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
            if (heroProfileImage) {
                heroProfileImage.src = lightModeImage;
            }
            localStorage.setItem('theme', 'light');
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
            if (heroProfileImage) {
                heroProfileImage.src = darkModeImage;
            }
            localStorage.setItem('theme', 'dark');
        }
    });
});
