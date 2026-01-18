/**
 * Scroll Animations Module
 * Handles reveal animations on scroll using Intersection Observer
 * Optimized for performance with single observer pattern
 */

const AnimationManager = (function() {
    'use strict';
    
    // Configuration
    const config = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Single shared observer instance (performance optimization)
    let mainObserver = null;
    let skillObserver = null;
    let particlesInterval = null;
    let isParticlesVisible = false;
    
    /**
     * Initialize animation observer
     */
    function init() {
        // Check for reduced motion preference
        if (Utils.prefersReducedMotion()) {
            showAllElements();
            return;
        }
        
        setupObserver();
        observeElements();
        setupSkillsObserver();
    }
    
    /**
     * Set up single Intersection Observer (reuse pattern)
     */
    function setupObserver() {
        mainObserver = new IntersectionObserver(handleIntersection, {
            threshold: config.threshold,
            rootMargin: config.rootMargin
        });
    }
    
    /**
     * Handle intersection events with batched processing
     * @param {IntersectionObserverEntry[]} entries
     */
    function handleIntersection(entries) {
        // Use requestAnimationFrame for smoother animations
        requestAnimationFrame(() => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const delay = parseInt(element.dataset.delay, 10) || 0;
                    
                    if (delay > 0) {
                        setTimeout(() => animateElement(element), delay);
                    } else {
                        animateElement(element);
                    }
                    
                    // Unobserve after animation
                    mainObserver.unobserve(element);
                }
            });
        });
    }
    
    /**
     * Animate a single element
     * @param {HTMLElement} element
     */
    function animateElement(element) {
        element.classList.add('animated');
        
        // Trigger skill bar animations if present
        const progressBars = element.querySelectorAll('.skill-item__progress');
        if (progressBars.length > 0) {
            animateProgressBars(element);
        }
        
        // Trigger counter animations if present
        const counters = element.querySelectorAll('.counter');
        if (counters.length > 0) {
            animateCounters(element);
        }
    }
    
    /**
     * Observe all animated elements
     */
    function observeElements() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        animatedElements.forEach(element => {
            mainObserver.observe(element);
        });
    }
    
    /**
     * Show all elements without animation (for reduced motion)
     */
    function showAllElements() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        animatedElements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'none';
        });
    }
    
    /**
     * Animate progress bars within a container
     * @param {HTMLElement} container
     */
    function animateProgressBars(container) {
        const progressBars = container.querySelectorAll('.skill-item__progress');
        
        progressBars.forEach(bar => {
            const targetWidth = bar.dataset.progress || 0;
            bar.style.width = `${targetWidth}%`;
        });
    }
    
    /**
     * Set up skills section observer (single instance)
     */
    function setupSkillsObserver() {
        const skillsSection = document.getElementById('skills');
        
        if (!skillsSection) return;
        
        skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBars = skillsSection.querySelectorAll('.skill-item__progress');
                    
                    // Use requestAnimationFrame for smoother animations
                    requestAnimationFrame(() => {
                        progressBars.forEach((bar, index) => {
                            const targetWidth = bar.dataset.progress || 0;
                            
                            setTimeout(() => {
                                bar.style.width = `${targetWidth}%`;
                            }, index * 100);
                        });
                    });
                    
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        skillObserver.observe(skillsSection);
    }
    
    /**
     * Animate counter elements
     * @param {HTMLElement} container
     */
    function animateCounters(container) {
        const counters = container.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target, 10);
            const duration = parseInt(counter.dataset.duration, 10) || 2000;
            const prefix = counter.dataset.prefix || '';
            const suffix = counter.dataset.suffix || '';
            
            animateValue(counter, 0, target, duration, prefix, suffix);
        });
    }
    
    /**
     * Animate a number from start to end using requestAnimationFrame
     * @param {HTMLElement} element
     * @param {number} start
     * @param {number} end
     * @param {number} duration
     * @param {string} prefix
     * @param {string} suffix
     */
    function animateValue(element, start, end, duration, prefix = '', suffix = '') {
        const startTime = performance.now();
        const difference = end - start;
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out cubic)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + difference * easeOut);
            
            element.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    /**
     * Create particle animation in hero section
     * Optimized: Only runs when hero section is visible
     */
    function createParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        
        // Check for reduced motion
        if (Utils.prefersReducedMotion()) return;
        
        const particleCount = 15; // Reduced from 20 for better performance
        
        // Create particles only when visible
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isParticlesVisible) {
                    isParticlesVisible = true;
                    // Create initial particles
                    for (let i = 0; i < particleCount; i++) {
                        createParticle(container);
                    }
                } else if (!entry.isIntersecting && isParticlesVisible) {
                    isParticlesVisible = false;
                    // Clear particles when not visible to save resources
                    container.innerHTML = '';
                }
            });
        }, { threshold: 0 });
        
        heroObserver.observe(container.closest('.hero') || container);
    }
    
    /**
     * Create a single particle with optimized CSS
     * @param {HTMLElement} container
     */
    function createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 8 + 4; // Slightly smaller
        const left = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 12;
        
        // Use transform instead of individual properties for better performance
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            bottom: -20px;
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
            will-change: transform, opacity;
        `;
        
        container.appendChild(particle);
    }
    
    /**
     * Add stagger animation to children
     * Uses single observer for efficiency
     * @param {string} selector
     */
    function addStaggerAnimation(selector) {
        const containers = document.querySelectorAll(selector);
        
        if (containers.length === 0) return;
        
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(() => {
                        entry.target.classList.add('animated');
                    });
                    staggerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        containers.forEach(container => {
            staggerObserver.observe(container);
        });
    }
    
    /**
     * Cleanup function to remove observers
     */
    function cleanup() {
        if (mainObserver) {
            mainObserver.disconnect();
            mainObserver = null;
        }
        if (skillObserver) {
            skillObserver.disconnect();
            skillObserver = null;
        }
        if (particlesInterval) {
            clearInterval(particlesInterval);
            particlesInterval = null;
        }
    }
    
    // Public API
    return {
        init,
        animateCounters,
        createParticles,
        addStaggerAnimation,
        cleanup
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    AnimationManager.init();
    // Use requestIdleCallback for non-critical animations
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            AnimationManager.createParticles();
        }, { timeout: 2000 });
    } else {
        setTimeout(() => {
            AnimationManager.createParticles();
        }, 100);
    }
});

// Cleanup on page unload
window.addEventListener('unload', AnimationManager.cleanup);
