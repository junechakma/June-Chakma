/**
 * Project Filter Tabs
 * Filters projects by category (All, Websites, Apps)
 */

(function() {
    'use strict';

    function initProjectFilter() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const projectItems = document.querySelectorAll('.grid-item');

        if (!tabButtons.length || !projectItems.length) return;

        // Filter projects based on category
        function filterProjects(category) {
            projectItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                if (category === 'all') {
                    // Show all items
                    item.style.display = '';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else if (itemCategory === category) {
                    // Show matching items
                    item.style.display = '';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    // Hide non-matching items
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        }

        // Handle tab button clicks
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));

                // Add active class to clicked button
                this.classList.add('active');

                // Get filter category
                const filterCategory = this.getAttribute('data-filter');

                // Filter projects
                filterProjects(filterCategory);
            });
        });

        // Initialize with all projects visible
        filterProjects('all');
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProjectFilter);
    } else {
        initProjectFilter();
    }
})();
