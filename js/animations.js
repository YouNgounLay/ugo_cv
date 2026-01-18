/**
 * Scroll Animations Module
 * Handles reveal animations on scroll using Intersection Observer
 */

const AnimationManager = (function() {
    'use strict';
    
    // Configuration
    const config = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    let observer = null;
    
    /**
     * Initialize animation observer
     */
    function init() {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            showAllElements();
            return;
        }
        
        setupObserver();
        observeElements();
        animateSkillBars();
    }
    
    /**
     * Set up Intersection Observer
     */
    function setupObserver() {
        observer = new IntersectionObserver(handleIntersection, {
            threshold: config.threshold,
            rootMargin: config.rootMargin
        });
    }
    
    /**
     * Handle intersection events
     * @param {IntersectionObserverEntry[]} entries
     */
    function handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.dataset.delay || 0;
                
                setTimeout(() => {
                    element.classList.add('animated');
                    
                    // Trigger skill bar animations if present
                    if (element.querySelector('.skill-item__progress')) {
                        animateProgressBars(element);
                    }
                    
                    // Trigger counter animations if present
                    if (element.querySelector('.counter')) {
                        animateCounters(element);
                    }
                }, delay);
                
                // Unobserve after animation
                observer.unobserve(element);
            }
        });
    }
    
    /**
     * Observe all animated elements
     */
    function observeElements() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        animatedElements.forEach(element => {
            observer.observe(element);
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
     * Animate skill bars when they come into view
     */
    function animateSkillBars() {
        const skillsSection = document.getElementById('skills');
        
        if (!skillsSection) return;
        
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBars = skillsSection.querySelectorAll('.skill-item__progress');
                    
                    progressBars.forEach((bar, index) => {
                        const targetWidth = bar.dataset.progress || 0;
                        
                        setTimeout(() => {
                            bar.style.width = `${targetWidth}%`;
                        }, index * 100);
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
     * Animate a number from start to end
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
            
            // Easing function (ease-out)
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
     */
    function createParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            createParticle(container);
        }
    }
    
    /**
     * Create a single particle
     * @param {HTMLElement} container
     */
    function createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 10;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            bottom: -20px;
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
        `;
        
        container.appendChild(particle);
    }
    
    /**
     * Add stagger animation to children
     * @param {string} selector
     */
    function addStaggerAnimation(selector) {
        const containers = document.querySelectorAll(selector);
        
        containers.forEach(container => {
            const staggerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        staggerObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            staggerObserver.observe(container);
        });
    }
    
    // Public API
    return {
        init,
        animateCounters,
        createParticles,
        addStaggerAnimation
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    AnimationManager.init();
    AnimationManager.createParticles();
});
