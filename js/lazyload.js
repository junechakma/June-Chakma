/**
 * Lazy Loading Utility
 * Provides fallback for browsers that don't support native lazy loading
 * and adds intersection observer for better control
 */

(function() {
    'use strict';

    // Check if native lazy loading is supported
    const supportsNativeLazyLoading = 'loading' in HTMLImageElement.prototype;

    // Configuration
    const config = {
        rootMargin: '50px 0px',
        threshold: 0.01
    };

    /**
     * Load media element
     */
    function loadMedia(element) {
        if (element.dataset.src) {
            element.src = element.dataset.src;
        }
        if (element.dataset.srcset) {
            element.srcset = element.dataset.srcset;
        }
        if (element.dataset.poster) {
            element.poster = element.dataset.poster;
        }
        element.classList.add('loaded');
        element.removeAttribute('data-src');
        element.removeAttribute('data-srcset');
        element.removeAttribute('data-poster');
    }

    /**
     * Initialize lazy loading with Intersection Observer
     */
    function initIntersectionObserver() {
        const mediaElements = document.querySelectorAll('img[data-src], video[data-src], source[data-src]');

        if (!mediaElements.length) return;

        const mediaObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    loadMedia(element);

                    // For video source elements, load the parent video
                    if (element.tagName === 'SOURCE') {
                        const video = element.closest('video');
                        if (video) {
                            video.load();
                        }
                    }

                    observer.unobserve(element);
                }
            });
        }, config);

        mediaElements.forEach(element => {
            mediaObserver.observe(element);
        });
    }

    /**
     * Fallback for older browsers - load immediately
     */
    function fallbackLoad() {
        const mediaElements = document.querySelectorAll('img[data-src], video[data-src], source[data-src]');
        mediaElements.forEach(element => {
            loadMedia(element);
            if (element.tagName === 'SOURCE') {
                const video = element.closest('video');
                if (video) video.load();
            }
        });
    }

    /**
     * Initialize lazy loading
     */
    function init() {
        if (supportsNativeLazyLoading) {
            // Native lazy loading is supported, but we still need to handle data-src attributes
            // for additional control and fallback scenarios
            const lazyElements = document.querySelectorAll('[data-src]');
            if (lazyElements.length > 0) {
                if ('IntersectionObserver' in window) {
                    initIntersectionObserver();
                } else {
                    fallbackLoad();
                }
            }
        } else if ('IntersectionObserver' in window) {
            // Use Intersection Observer for browsers without native lazy loading
            initIntersectionObserver();
        } else {
            // Fallback for older browsers
            fallbackLoad();
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Re-initialize on dynamic content changes (optional)
    window.lazyLoadInstance = {
        update: init
    };
})();