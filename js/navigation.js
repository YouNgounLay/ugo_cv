/**
 * Navigation Module
 * Handles header scroll effects, mobile menu, and smooth scrolling
 */

const NavigationManager = (function() {
    'use strict';
    
    // DOM elements
    let header = null;
    let navMenu = null;
    let navToggle = null;
    let navLinks = null;
    
    // State
    const SCROLL_THRESHOLD = 100;
    let isMenuOpen = false;
    
    /**
     * Initialize navigation
     */
    function init() {
        // Cache DOM elements
        header = document.getElementById('header');
        navMenu = document.getElementById('nav-menu');
        navToggle = document.getElementById('nav-toggle');
        navLinks = document.querySelectorAll('.nav__link');
        
        // Bind events
        bindEvents();
        
        // Set initial state
        handleScroll();
        setActiveLink();
    }
    
    /**
     * Bind all event listeners
     */
    function bindEvents() {
        // Scroll events - use shared Utils for throttle/debounce
        window.addEventListener('scroll', Utils.throttle(handleScroll, 100), { passive: true });
        window.addEventListener('scroll', Utils.throttle(setActiveLink, 100), { passive: true });
        
        // Mobile menu toggle
        if (navToggle) {
            navToggle.addEventListener('click', toggleMenu);
        }
        
        // Nav link clicks
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });
        
        // Close menu on outside click
        document.addEventListener('click', handleOutsideClick);
        
        // Close menu on escape key
        document.addEventListener('keydown', handleKeyDown);
        
        // Handle resize - use shared Utils
        window.addEventListener('resize', Utils.debounce(handleResize, 250), { passive: true });
    }
    
    /**
     * Handle scroll event for header styling
     */
    function handleScroll() {
        if (!header) return;
        
        const scrollY = window.scrollY;
        
        if (scrollY > SCROLL_THRESHOLD) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }
    
    /**
     * Set active navigation link based on scroll position
     */
    function setActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 200; // Offset for better UX
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    /**
     * Toggle mobile menu
     */
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        
        if (navMenu) {
            navMenu.classList.toggle('active', isMenuOpen);
        }
        
        if (navToggle) {
            navToggle.classList.toggle('active', isMenuOpen);
            navToggle.setAttribute('aria-expanded', isMenuOpen);
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }
    
    /**
     * Close mobile menu
     */
    function closeMenu() {
        if (!isMenuOpen) return;
        
        isMenuOpen = false;
        
        if (navMenu) {
            navMenu.classList.remove('active');
        }
        
        if (navToggle) {
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
        
        document.body.style.overflow = '';
    }
    
    /**
     * Handle navigation link click
     * @param {Event} e
     */
    function handleNavClick(e) {
        const href = e.currentTarget.getAttribute('href');
        
        if (href.startsWith('#')) {
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu after clicking
            closeMenu();
        }
    }
    
    /**
     * Handle click outside menu
     * @param {Event} e
     */
    function handleOutsideClick(e) {
        if (!isMenuOpen) return;
        
        const isClickInside = navMenu?.contains(e.target) || navToggle?.contains(e.target);
        
        if (!isClickInside) {
            closeMenu();
        }
    }
    
    /**
     * Handle keyboard events
     * @param {KeyboardEvent} e
     */
    function handleKeyDown(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
            navToggle?.focus();
        }
    }
    
    /**
     * Handle window resize
     */
    function handleResize() {
        // Close mobile menu if viewport becomes larger
        if (window.innerWidth > 768 && isMenuOpen) {
            closeMenu();
        }
    }
    
    // Public API
    return {
        init,
        closeMenu
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', NavigationManager.init);
