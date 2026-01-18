/**
 * Shared Utilities Module
 * Contains common helper functions to avoid duplication (DRY principle)
 */

const Utils = (function() {
    'use strict';

    /**
     * Throttle function execution
     * Limits how often a function can be called
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     */
    function throttle(func, limit) {
        let inThrottle;
        let lastResult;
        return function(...args) {
            if (!inThrottle) {
                lastResult = func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
            return lastResult;
        };
    }

    /**
     * Debounce function execution
     * Delays execution until after a pause in calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    /**
     * Request Idle Callback polyfill
     * Executes callback when browser is idle
     * @param {Function} callback - Function to execute
     * @param {Object} options - Options object
     */
    function requestIdleCallback(callback, options = {}) {
        if ('requestIdleCallback' in window) {
            return window.requestIdleCallback(callback, options);
        }
        // Fallback for browsers without requestIdleCallback
        const timeout = options.timeout || 1;
        return setTimeout(() => {
            callback({
                didTimeout: false,
                timeRemaining: () => Math.max(0, 50)
            });
        }, timeout);
    }

    /**
     * Cancel idle callback
     * @param {number} id - Callback ID to cancel
     */
    function cancelIdleCallback(id) {
        if ('cancelIdleCallback' in window) {
            window.cancelIdleCallback(id);
        } else {
            clearTimeout(id);
        }
    }

    /**
     * Check if element is in viewport
     * @param {HTMLElement} element - Element to check
     * @param {number} threshold - Visibility threshold (0-1)
     * @returns {boolean} Whether element is visible
     */
    function isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        const vertInView = (rect.top <= windowHeight * (1 - threshold)) && 
                          ((rect.top + rect.height) >= windowHeight * threshold);
        const horInView = (rect.left <= windowWidth * (1 - threshold)) && 
                         ((rect.left + rect.width) >= windowWidth * threshold);
        
        return vertInView && horInView;
    }

    /**
     * Create a single reusable IntersectionObserver
     * Avoids creating multiple observers for similar tasks
     * @param {Function} callback - Callback for intersections
     * @param {Object} options - Observer options
     * @returns {IntersectionObserver} Observer instance
     */
    function createObserver(callback, options = {}) {
        const defaultOptions = {
            threshold: 0.1,
            rootMargin: '0px'
        };
        return new IntersectionObserver(callback, { ...defaultOptions, ...options });
    }

    /**
     * Lazy load images using IntersectionObserver
     * @param {string} selector - Selector for images to lazy load
     */
    function lazyLoadImages(selector = 'img[data-src]') {
        const images = document.querySelectorAll(selector);
        
        if (images.length === 0) return;

        const imageObserver = createObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '50px 0px' });

        images.forEach(img => imageObserver.observe(img));
    }

    /**
     * Format number with locale-specific formatting
     * @param {number} num - Number to format
     * @param {Object} options - Intl.NumberFormat options
     * @returns {string} Formatted number
     */
    function formatNumber(num, options = {}) {
        return new Intl.NumberFormat('en-US', options).format(num);
    }

    /**
     * Format currency
     * @param {number} amount - Amount to format
     * @param {string} currency - Currency code
     * @returns {string} Formatted currency
     */
    function formatCurrency(amount, currency = 'USD') {
        return formatNumber(amount, { style: 'currency', currency });
    }

    /**
     * Check if user prefers reduced motion
     * @returns {boolean} Whether reduced motion is preferred
     */
    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * Check if device is likely touch-based
     * @returns {boolean} Whether device supports touch
     */
    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    // Public API
    return {
        throttle,
        debounce,
        requestIdleCallback,
        cancelIdleCallback,
        isInViewport,
        createObserver,
        lazyLoadImages,
        formatNumber,
        formatCurrency,
        prefersReducedMotion,
        isTouchDevice
    };
})();

// Export for module systems if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
