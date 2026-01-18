/**
 * Theme Management Module
 * Handles light/dark mode toggle and persistence
 * Following SOLID principles - Single Responsibility
 */

const ThemeManager = (function() {
    'use strict';
    
    // Private state
    const STORAGE_KEY = 'portfolio-theme';
    const LIGHT_THEME = 'light';
    const DARK_THEME = 'dark';
    
    let currentTheme = LIGHT_THEME;
    let toggleButton = null;
    
    /**
     * Initialize the theme manager
     */
    function init() {
        toggleButton = document.getElementById('theme-toggle');
        
        // Load saved theme or detect system preference
        currentTheme = getSavedTheme() || getSystemTheme();
        applyTheme(currentTheme);
        
        // Bind events
        if (toggleButton) {
            toggleButton.addEventListener('click', toggle);
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleSystemThemeChange);
    }
    
    /**
     * Get saved theme from localStorage
     * @returns {string|null}
     */
    function getSavedTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            console.warn('LocalStorage not available:', e);
            return null;
        }
    }
    
    /**
     * Save theme to localStorage
     * @param {string} theme
     */
    function saveTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            console.warn('Could not save theme preference:', e);
        }
    }
    
    /**
     * Detect system theme preference
     * @returns {string}
     */
    function getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return DARK_THEME;
        }
        return LIGHT_THEME;
    }
    
    /**
     * Apply theme to document
     * @param {string} theme
     */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        currentTheme = theme;
        
        // Update charts if they exist
        if (typeof ChartManager !== 'undefined' && ChartManager.updateTheme) {
            ChartManager.updateTheme(theme);
        }
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme } }));
    }
    
    /**
     * Toggle between light and dark themes
     */
    function toggle() {
        const newTheme = currentTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
        applyTheme(newTheme);
        saveTheme(newTheme);
        
        // Add animation to toggle button
        if (toggleButton) {
            toggleButton.classList.add('animate');
            setTimeout(() => toggleButton.classList.remove('animate'), 300);
        }
    }
    
    /**
     * Handle system theme change
     * @param {MediaQueryListEvent} e
     */
    function handleSystemThemeChange(e) {
        // Only auto-switch if user hasn't set a preference
        if (!getSavedTheme()) {
            applyTheme(e.matches ? DARK_THEME : LIGHT_THEME);
        }
    }
    
    /**
     * Get current theme
     * @returns {string}
     */
    function getTheme() {
        return currentTheme;
    }
    
    /**
     * Check if dark mode is active
     * @returns {boolean}
     */
    function isDarkMode() {
        return currentTheme === DARK_THEME;
    }
    
    // Public API
    return {
        init,
        toggle,
        getTheme,
        isDarkMode
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', ThemeManager.init);
