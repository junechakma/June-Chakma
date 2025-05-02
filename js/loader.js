// Loader animation script
document.addEventListener('DOMContentLoaded', function() {
    // Get the loader container
    const loaderContainer = document.querySelector('.loader-container');
    
    // Hide the loader when the page is fully loaded
    window.addEventListener('load', function() {
        // Add a small delay to ensure animations are visible
        setTimeout(function() {
            loaderContainer.classList.add('hidden');
            
            // Remove the loader from the DOM after transition completes
            setTimeout(function() {
                loaderContainer.style.display = 'none';
            }, 500); // Match this to the transition duration in CSS
        }, 800); // Show loader for at least 800ms for visual effect
    });
});
