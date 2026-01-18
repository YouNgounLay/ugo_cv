/**
 * Charts Module
 * Handles all Chart.js chart creation and management
 */

const ChartManager = (function() {
    'use strict';
    
    // Store chart instances
    const charts = {};
    
    // Chart colors
    const colors = {
        primary: '#3b82f6',
        secondary: '#22c55e',
        accent: '#8b5cf6',
        orange: '#f97316',
        cyan: '#06b6d4',
        pink: '#ec4899',
        gray: '#6b7280'
    };
    
    // Get theme-aware colors
    function getThemeColors() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        return {
            textColor: isDark ? '#9ca3af' : '#4b5563',
            gridColor: isDark ? '#374151' : '#e5e7eb',
            backgroundColor: isDark ? '#1f2937' : '#ffffff'
        };
    }
    
    /**
     * Initialize all charts
     */
    function init() {
        // Set global Chart.js defaults
        setChartDefaults();
        
        // Initialize charts
        initHeroChart();
        initProjectCharts();
        
        // Listen for theme changes
        window.addEventListener('themeChange', updateTheme);
    }
    
    /**
     * Set global Chart.js defaults
     */
    function setChartDefaults() {
        const themeColors = getThemeColors();
        
        Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
        Chart.defaults.color = themeColors.textColor;
        Chart.defaults.responsive = true;
        Chart.defaults.maintainAspectRatio = false;
        
        // Animation defaults
        Chart.defaults.animation = {
            duration: 1000,
            easing: 'easeOutQuart'
        };
    }
    
    /**
     * Initialize hero section chart
     */
    function initHeroChart() {
        const ctx = document.getElementById('heroChart');
        if (!ctx) return;
        
        const themeColors = getThemeColors();
        
        charts.hero = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['SQL', 'Python', 'Power BI', 'Tableau', 'Excel'],
                datasets: [{
                    data: [30, 25, 20, 15, 10],
                    backgroundColor: [
                        colors.primary,
                        colors.secondary,
                        colors.accent,
                        colors.orange,
                        colors.cyan
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            color: themeColors.textColor
                        }
                    },
                    tooltip: {
                        backgroundColor: themeColors.backgroundColor,
                        titleColor: themeColors.textColor,
                        bodyColor: themeColors.textColor,
                        borderColor: themeColors.gridColor,
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                return ` ${context.label}: ${context.parsed}%`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true
                }
            }
        });
    }
    
    /**
     * Initialize project preview charts
     */
    function initProjectCharts() {
        initProjectChart1();
        initProjectChart2();
        initProjectChart3();
        initProjectChart4();
    }
    
    function initProjectChart1() {
        const ctx = document.getElementById('projectChart1');
        if (!ctx) return;
        
        const themeColors = getThemeColors();
        
        charts.project1 = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Sales',
                    data: [30, 45, 35, 50, 40, 60],
                    borderColor: colors.primary,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: colors.primary,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: false
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    function initProjectChart2() {
        const ctx = document.getElementById('projectChart2');
        if (!ctx) return;
        
        charts.project2 = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Customers',
                    data: [
                        { x: 10, y: 20 }, { x: 15, y: 25 }, { x: 20, y: 15 },
                        { x: 25, y: 35 }, { x: 30, y: 30 }, { x: 35, y: 45 },
                        { x: 40, y: 35 }, { x: 45, y: 50 }, { x: 50, y: 40 },
                        { x: 55, y: 55 }, { x: 60, y: 45 }, { x: 65, y: 60 }
                    ],
                    backgroundColor: colors.secondary,
                    pointRadius: 6
                }]
            },
            options: {
                scales: {
                    x: { display: false },
                    y: { display: false }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
    
    function initProjectChart3() {
        const ctx = document.getElementById('projectChart3');
        if (!ctx) return;
        
        const data = [12, 19, 15, 25];
        const total = data.reduce((a, b) => a + b, 0);
        const percentages = data.map(v => ((v / total) * 100).toFixed(0));
        const themeColors = getThemeColors();
        
        charts.project3 = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                datasets: [{
                    label: 'Revenue',
                    data: data,
                    backgroundColor: [
                        colors.primary,
                        colors.secondary,
                        colors.accent,
                        colors.orange
                    ],
                    borderRadius: 8
                }]
            },
            options: {
                scales: {
                    x: { display: false },
                    y: { display: false, max: Math.max(...data) * 1.25 }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: context => ` ${context.parsed.y}K (${percentages[context.dataIndex]}%)`
                        }
                    }
                }
            },
            plugins: [{
                id: 'percentageLabels',
                afterDatasetsDraw: (chart) => {
                    const ctx = chart.ctx;
                    chart.data.datasets.forEach((dataset, datasetIndex) => {
                        const meta = chart.getDatasetMeta(datasetIndex);
                        meta.data.forEach((bar, index) => {
                            const percent = percentages[index];
                            ctx.save();
                            ctx.fillStyle = themeColors.textColor;
                            ctx.font = 'bold 11px Inter, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            ctx.fillText(`${percent}%`, bar.x, bar.y - 5);
                            ctx.restore();
                        });
                    });
                }
            }]
        });
    }
    
    function initProjectChart4() {
        const ctx = document.getElementById('projectChart4');
        if (!ctx) return;
        
        charts.project4 = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Assets', 'Liabilities', 'Equity'],
                datasets: [{
                    data: [45, 30, 25],
                    backgroundColor: [colors.primary, colors.accent, colors.secondary],
                    borderWidth: 0
                }]
            },
            options: {
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
    
    /**
     * Update chart themes
     */
    function updateTheme() {
        const themeColors = getThemeColors();
        
        // Update Chart.js defaults
        Chart.defaults.color = themeColors.textColor;
        
        // Update each chart
        Object.values(charts).forEach(chart => {
            if (chart.options.plugins?.legend?.labels) {
                chart.options.plugins.legend.labels.color = themeColors.textColor;
            }
            
            if (chart.options.plugins?.tooltip) {
                chart.options.plugins.tooltip.backgroundColor = themeColors.backgroundColor;
                chart.options.plugins.tooltip.titleColor = themeColors.textColor;
                chart.options.plugins.tooltip.bodyColor = themeColors.textColor;
                chart.options.plugins.tooltip.borderColor = themeColors.gridColor;
            }
            
            if (chart.options.scales?.x) {
                chart.options.scales.x.grid = { color: themeColors.gridColor };
                chart.options.scales.x.ticks = { color: themeColors.textColor };
            }
            
            if (chart.options.scales?.y) {
                chart.options.scales.y.grid = { color: themeColors.gridColor };
                chart.options.scales.y.ticks = { color: themeColors.textColor };
            }
            
            chart.update('none');
        });
    }
    
    /**
     * Get chart instance by name
     * @param {string} name
     * @returns {Chart|undefined}
     */
    function getChart(name) {
        return charts[name];
    }
    
    /**
     * Add a new chart to the manager
     * @param {string} name
     * @param {Chart} chart
     */
    function addChart(name, chart) {
        charts[name] = chart;
    }
    
    /**
     * Destroy a chart
     * @param {string} name
     */
    function destroyChart(name) {
        if (charts[name]) {
            charts[name].destroy();
            delete charts[name];
        }
    }
    
    // Public API
    return {
        init,
        updateTheme,
        getChart,
        addChart,
        destroyChart,
        colors,
        getThemeColors
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', ChartManager.init);
