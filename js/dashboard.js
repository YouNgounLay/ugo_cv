/**
 * Dashboard Module
 * Interactive Customer Revenue Performance Dashboard
 */

const DashboardManager = (function() {
    'use strict';
    
    // Dashboard state
    const state = {
        period: 'ytd',
        isLoading: false,
        charts: {},
        currentPage: 1,
        itemsPerPage: 10,
        sortColumn: null,
        sortDirection: 'asc',
        searchQuery: ''
    };
    
    // Sample data (in real app, this would come from an API)
    const data = {
        ytd: {
            revenue: 2400000,
            customers: 1247,
            orders: 3892,
            avgOrderValue: 617,
            revenueChange: 12.5,
            customersChange: 8.3,
            ordersChange: 15.2,
            avgChange: -2.1
        },
        q4: {
            revenue: 850000,
            customers: 456,
            orders: 1289,
            avgOrderValue: 659,
            revenueChange: 18.2,
            customersChange: 12.1,
            ordersChange: 22.4,
            avgChange: 3.5
        },
        q3: {
            revenue: 720000,
            customers: 398,
            orders: 1156,
            avgOrderValue: 623,
            revenueChange: 10.1,
            customersChange: 5.8,
            ordersChange: 11.3,
            avgChange: -1.2
        },
        q2: {
            revenue: 580000,
            customers: 312,
            orders: 987,
            avgOrderValue: 588,
            revenueChange: 8.7,
            customersChange: 6.2,
            ordersChange: 9.8,
            avgChange: -2.8
        },
        q1: {
            revenue: 450000,
            customers: 281,
            orders: 860,
            avgOrderValue: 523,
            revenueChange: 5.3,
            customersChange: 3.1,
            ordersChange: 7.5,
            avgChange: -4.2
        }
    };
    
    const monthlyRevenue = {
        ytd: [180, 220, 195, 240, 210, 260, 235, 280, 250, 290, 275, 320],
        q4: [275, 290, 285, 320],
        q3: [235, 250, 245, 280],
        q2: [195, 210, 200, 240],
        q1: [150, 180, 170, 195]
    };
    
    const regionData = {
        labels: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'],
        values: [35, 28, 22, 10, 5]
    };
    
    const segmentData = {
        labels: ['Enterprise', 'SMB', 'Startup', 'Individual'],
        values: [45, 30, 15, 10]
    };
    
    const productsData = {
        labels: ['Analytics Pro', 'Dashboard Suite', 'Report Builder', 'Data Connector', 'Viz Toolkit'],
        values: [850, 620, 480, 350, 280]
    };
    
    // Transaction data
    const transactions = generateTransactions(50);
    
    /**
     * Generate sample transaction data
     */
    function generateTransactions(count) {
        const customers = ['Acme Corp', 'TechStart Inc', 'Global Solutions', 'DataDrive LLC', 'InnovateTech', 'CloudFirst', 'DigitalEdge', 'SmartBiz', 'FutureTech', 'NextGen Inc'];
        const products = ['Analytics Pro', 'Dashboard Suite', 'Report Builder', 'Data Connector', 'Viz Toolkit'];
        const statuses = ['completed', 'pending', 'processing', 'cancelled'];
        
        return Array.from({ length: count }, (_, i) => ({
            id: `ORD-${String(1000 + i).padStart(4, '0')}`,
            customer: customers[Math.floor(Math.random() * customers.length)],
            product: products[Math.floor(Math.random() * products.length)],
            amount: Math.floor(Math.random() * 5000) + 500,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        }));
    }
    
    /**
     * Initialize dashboard
     */
    function init() {
        bindEvents();
        initCharts();
        renderTable();
        updateKPIs();
    }
    
    /**
     * Bind event listeners
     */
    function bindEvents() {
        // Period selector
        const dateRange = document.getElementById('dateRange');
        if (dateRange) {
            dateRange.addEventListener('change', handlePeriodChange);
        }
        
        // Refresh button
        const refreshBtn = document.getElementById('refreshDashboard');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', handleRefresh);
        }
        
        // Chart type toggle
        document.querySelectorAll('.chart-card__btn[data-chart-type]').forEach(btn => {
            btn.addEventListener('click', handleChartTypeToggle);
        });
        
        // Table search - use shared Utils.debounce
        const searchInput = document.getElementById('tableSearch');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce(handleSearch, 300));
        }
        
        // Table sorting
        document.querySelectorAll('.data-table__th[data-sort]').forEach(th => {
            th.addEventListener('click', handleSort);
        });
        
        // KPI card interactions
        document.querySelectorAll('.kpi-card').forEach(card => {
            card.addEventListener('click', handleKPIClick);
        });
        
        // Listen for theme changes
        window.addEventListener('themeChange', updateChartThemes);
    }
    
    /**
     * Initialize dashboard charts
     */
    function initCharts() {
        initRevenueTrendChart();
        initRegionChart();
        initSegmentChart();
        initProductsChart();
    }
    
    /**
     * Initialize revenue trend chart
     */
    function initRevenueTrendChart() {
        const ctx = document.getElementById('revenueTrendChart');
        if (!ctx) return;
        
        const themeColors = ChartManager.getThemeColors();
        
        state.charts.revenueTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Revenue ($K)',
                    data: monthlyRevenue[state.period],
                    borderColor: ChartManager.colors.primary,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: ChartManager.colors.primary,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    x: {
                        grid: {
                            color: themeColors.gridColor,
                            drawBorder: false
                        },
                        ticks: {
                            color: themeColors.textColor
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: themeColors.gridColor,
                            drawBorder: false
                        },
                        ticks: {
                            color: themeColors.textColor,
                            callback: value => `$${value}K`
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: themeColors.backgroundColor,
                        titleColor: themeColors.textColor,
                        bodyColor: themeColors.textColor,
                        borderColor: themeColors.gridColor,
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: context => `Revenue: $${context.parsed.y}K`
                        }
                    }
                }
            }
        });
        
        ChartManager.addChart('revenueTrend', state.charts.revenueTrend);
    }
    
    /**
     * Initialize region chart
     */
    function initRegionChart() {
        const ctx = document.getElementById('regionChart');
        if (!ctx) return;
        
        const themeColors = ChartManager.getThemeColors();
        
        state.charts.region = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: regionData.labels,
                datasets: [{
                    data: regionData.values,
                    backgroundColor: [
                        ChartManager.colors.primary,
                        ChartManager.colors.secondary,
                        ChartManager.colors.accent,
                        ChartManager.colors.orange,
                        ChartManager.colors.cyan
                    ],
                    borderWidth: 0,
                    hoverOffset: 8
                }]
            },
            options: {
                cutout: '65%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: themeColors.backgroundColor,
                        titleColor: themeColors.textColor,
                        bodyColor: themeColors.textColor,
                        borderColor: themeColors.gridColor,
                        borderWidth: 1,
                        callbacks: {
                            label: context => ` ${context.label}: ${context.parsed}%`
                        }
                    }
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const index = elements[0].index;
                        showRegionDetails(regionData.labels[index]);
                    }
                }
            }
        });
        
        // Render custom legend
        renderRegionLegend();
        
        ChartManager.addChart('region', state.charts.region);
    }
    
    /**
     * Render region chart legend
     */
    function renderRegionLegend() {
        const legendContainer = document.getElementById('regionLegend');
        if (!legendContainer) return;
        
        const colors = [
            ChartManager.colors.primary,
            ChartManager.colors.secondary,
            ChartManager.colors.accent,
            ChartManager.colors.orange,
            ChartManager.colors.cyan
        ];
        
        legendContainer.innerHTML = regionData.labels.map((label, i) => `
            <div class="legend-item" data-region="${label}">
                <span class="legend-item__color" style="background: ${colors[i]}"></span>
                <span class="legend-item__label">${label}</span>
                <span class="legend-item__value">${regionData.values[i]}%</span>
            </div>
        `).join('');
        
        // Add click handlers
        legendContainer.querySelectorAll('.legend-item').forEach(item => {
            item.addEventListener('click', () => {
                showRegionDetails(item.dataset.region);
            });
        });
    }
    
    /**
     * Initialize segment chart
     */
    function initSegmentChart() {
        const ctx = document.getElementById('segmentChart');
        if (!ctx) return;
        
        const themeColors = ChartManager.getThemeColors();
        
        state.charts.segment = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: segmentData.labels,
                datasets: [{
                    data: segmentData.values,
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.7)',
                        'rgba(34, 197, 94, 0.7)',
                        'rgba(139, 92, 246, 0.7)',
                        'rgba(249, 115, 22, 0.7)'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            color: themeColors.textColor
                        }
                    },
                    tooltip: {
                        backgroundColor: themeColors.backgroundColor,
                        titleColor: themeColors.textColor,
                        bodyColor: themeColors.textColor,
                        borderColor: themeColors.gridColor,
                        borderWidth: 1,
                        callbacks: {
                            label: context => ` ${context.label}: ${context.parsed.r}%`
                        }
                    }
                },
                scales: {
                    r: {
                        display: false
                    }
                }
            }
        });
        
        ChartManager.addChart('segment', state.charts.segment);
    }
    
    /**
     * Initialize products chart
     */
    function initProductsChart() {
        const ctx = document.getElementById('productsChart');
        if (!ctx) return;
        
        const themeColors = ChartManager.getThemeColors();
        const total = productsData.values.reduce((a, b) => a + b, 0);
        const percentages = productsData.values.map(v => ((v / total) * 100).toFixed(1));
        
        state.charts.products = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: productsData.labels,
                datasets: [{
                    label: 'Revenue ($K)',
                    data: productsData.values,
                    backgroundColor: [
                        ChartManager.colors.primary,
                        ChartManager.colors.secondary,
                        ChartManager.colors.accent,
                        ChartManager.colors.orange,
                        ChartManager.colors.cyan
                    ],
                    borderRadius: 8,
                    barThickness: 40
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                        max: Math.max(...productsData.values) * 1.15,
                        grid: {
                            color: themeColors.gridColor,
                            drawBorder: false
                        },
                        ticks: {
                            color: themeColors.textColor,
                            callback: value => `$${value}K`
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: themeColors.textColor
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: themeColors.backgroundColor,
                        titleColor: themeColors.textColor,
                        bodyColor: themeColors.textColor,
                        borderColor: themeColors.gridColor,
                        borderWidth: 1,
                        callbacks: {
                            label: context => ` Revenue: $${context.parsed.x}K (${percentages[context.dataIndex]}%)`
                        }
                    }
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const index = elements[0].index;
                        showProductDetails(productsData.labels[index]);
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
                            const value = dataset.data[index];
                            const percent = percentages[index];
                            ctx.save();
                            ctx.fillStyle = themeColors.textColor;
                            ctx.font = '600 12px Inter, sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(`${percent}%`, bar.x + 8, bar.y);
                            ctx.restore();
                        });
                    });
                }
            }]
        });
        
        ChartManager.addChart('products', state.charts.products);
    }
    
    /**
     * Update KPI values
     */
    function updateKPIs() {
        const periodData = data[state.period];
        
        animateValue('kpiRevenue', periodData.revenue, '$', '', true);
        animateValue('kpiCustomers', periodData.customers);
        animateValue('kpiOrders', periodData.orders);
        animateValue('kpiAvg', periodData.avgOrderValue, '$');
        
        updateChangeIndicator('.kpi-card--revenue .kpi-card__change', periodData.revenueChange);
        updateChangeIndicator('.kpi-card--customers .kpi-card__change', periodData.customersChange);
        updateChangeIndicator('.kpi-card--orders .kpi-card__change', periodData.ordersChange);
        updateChangeIndicator('.kpi-card--avg .kpi-card__change', periodData.avgChange);
    }
    
    /**
     * Animate a value change
     */
    function animateValue(elementId, target, prefix = '', suffix = '', formatLarge = false) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const start = 0;
        const duration = 1000;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (target - start) * easeOut);
            
            let displayValue;
            if (formatLarge && current >= 1000000) {
                displayValue = `${prefix}${(current / 1000000).toFixed(1)}M${suffix}`;
            } else if (formatLarge && current >= 1000) {
                displayValue = `${prefix}${(current / 1000).toFixed(0)}K${suffix}`;
            } else {
                displayValue = `${prefix}${current.toLocaleString()}${suffix}`;
            }
            
            element.textContent = displayValue;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    /**
     * Update change indicator
     */
    function updateChangeIndicator(selector, value) {
        const element = document.querySelector(selector);
        if (!element) return;
        
        const isPositive = value >= 0;
        element.className = `kpi-card__change kpi-card__change--${isPositive ? 'positive' : 'negative'}`;
        element.innerHTML = `
            <span class="kpi-card__arrow">${isPositive ? '↑' : '↓'}</span> ${Math.abs(value)}%
        `;
    }
    
    /**
     * Handle period change
     */
    function handlePeriodChange(e) {
        state.period = e.target.value;
        updateKPIs();
        updateCharts();
    }
    
    /**
     * Handle refresh button click
     */
    function handleRefresh() {
        const btn = document.getElementById('refreshDashboard');
        if (!btn || state.isLoading) return;
        
        state.isLoading = true;
        btn.classList.add('loading');
        
        // Simulate data refresh
        setTimeout(() => {
            updateKPIs();
            updateCharts();
            
            state.isLoading = false;
            btn.classList.remove('loading');
        }, 1000);
    }
    
    /**
     * Handle chart type toggle
     */
    function handleChartTypeToggle(e) {
        const btn = e.currentTarget;
        const chartType = btn.dataset.chartType;
        
        // Update active state
        btn.parentElement.querySelectorAll('.chart-card__btn').forEach(b => {
            b.classList.remove('active');
        });
        btn.classList.add('active');
        
        // Destroy and recreate chart with new type
        if (state.charts.revenueTrend) {
            const themeColors = ChartManager.getThemeColors();
            
            // Get current data (make a copy)
            const labels = [...state.charts.revenueTrend.data.labels];
            const dataValues = [...state.charts.revenueTrend.data.datasets[0].data];
            
            // Destroy old chart first
            state.charts.revenueTrend.destroy();
            state.charts.revenueTrend = null;
            
            // Also remove from ChartManager
            ChartManager.destroyChart('revenueTrend');
            
            // Get canvas element after destroying the chart
            const canvas = document.getElementById('revenueTrendChart');
            if (!canvas) return;
            
            // Prepare dataset based on chart type
            const dataset = {
                label: 'Revenue ($K)',
                data: dataValues,
                borderColor: ChartManager.colors.primary,
                pointBackgroundColor: ChartManager.colors.primary,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: chartType === 'line' ? 4 : 0,
                pointHoverRadius: chartType === 'line' ? 6 : 0
            };
            
            if (chartType === 'bar') {
                dataset.backgroundColor = ChartManager.colors.primary;
                dataset.borderRadius = 6;
                dataset.fill = false;
            } else {
                dataset.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                dataset.fill = true;
                dataset.tension = 0.4;
            }
            
            // Create new chart with new type (use requestAnimationFrame to ensure canvas is ready)
            requestAnimationFrame(() => {
                state.charts.revenueTrend = new Chart(canvas, {
                    type: chartType,
                    data: {
                        labels: labels,
                        datasets: [dataset]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: {
                            intersect: false,
                            mode: 'index'
                        },
                        scales: {
                            x: {
                                grid: {
                                    color: themeColors.gridColor,
                                    drawBorder: false
                                },
                                ticks: {
                                    color: themeColors.textColor
                                }
                            },
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: themeColors.gridColor,
                                    drawBorder: false
                                },
                                ticks: {
                                    color: themeColors.textColor,
                                    callback: value => `$${value}K`
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                backgroundColor: themeColors.backgroundColor,
                                titleColor: themeColors.textColor,
                                bodyColor: themeColors.textColor,
                                borderColor: themeColors.gridColor,
                                borderWidth: 1,
                                displayColors: false,
                                callbacks: {
                                    label: context => `Revenue: $${context.parsed.y}K`
                                }
                            }
                        }
                    }
                });
                
                ChartManager.addChart('revenueTrend', state.charts.revenueTrend);
            });
        }
    }

    /**
     * Update all charts
     */
    function updateCharts() {
        const chartData = monthlyRevenue[state.period];
        
        if (state.charts.revenueTrend) {
            // Update labels based on period
            let labels;
            if (state.period === 'ytd') {
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            } else {
                labels = ['Month 1', 'Month 2', 'Month 3', 'Month 4'];
            }
            
            state.charts.revenueTrend.data.labels = labels;
            state.charts.revenueTrend.data.datasets[0].data = chartData;
            state.charts.revenueTrend.update();
        }
    }
    
    /**
     * Update chart themes
     */
    function updateChartThemes() {
        const themeColors = ChartManager.getThemeColors();
        
        Object.values(state.charts).forEach(chart => {
            if (chart.options.scales?.x) {
                chart.options.scales.x.grid.color = themeColors.gridColor;
                chart.options.scales.x.ticks.color = themeColors.textColor;
            }
            
            if (chart.options.scales?.y) {
                chart.options.scales.y.grid.color = themeColors.gridColor;
                chart.options.scales.y.ticks.color = themeColors.textColor;
            }
            
            if (chart.options.plugins?.legend?.labels) {
                chart.options.plugins.legend.labels.color = themeColors.textColor;
            }
            
            if (chart.options.plugins?.tooltip) {
                chart.options.plugins.tooltip.backgroundColor = themeColors.backgroundColor;
                chart.options.plugins.tooltip.titleColor = themeColors.textColor;
                chart.options.plugins.tooltip.bodyColor = themeColors.textColor;
                chart.options.plugins.tooltip.borderColor = themeColors.gridColor;
            }
            
            chart.update('none');
        });
    }
    
    /**
     * Render transaction table
     */
    function renderTable() {
        const tbody = document.getElementById('transactionTable');
        if (!tbody) return;
        
        let filteredData = [...transactions];
        
        // Apply search filter
        if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase();
            filteredData = filteredData.filter(t => 
                t.id.toLowerCase().includes(query) ||
                t.customer.toLowerCase().includes(query) ||
                t.product.toLowerCase().includes(query)
            );
        }
        
        // Apply sorting
        if (state.sortColumn) {
            filteredData.sort((a, b) => {
                let aVal = a[state.sortColumn];
                let bVal = b[state.sortColumn];
                
                if (typeof aVal === 'string') {
                    aVal = aVal.toLowerCase();
                    bVal = bVal.toLowerCase();
                }
                
                if (aVal < bVal) return state.sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return state.sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }
        
        // Update total count
        const totalEl = document.getElementById('tableTotal');
        if (totalEl) {
            totalEl.textContent = filteredData.length;
        }
        
        // Paginate
        const start = (state.currentPage - 1) * state.itemsPerPage;
        const paginatedData = filteredData.slice(start, start + state.itemsPerPage);
        
        // Update count
        const countEl = document.getElementById('tableCount');
        if (countEl) {
            countEl.textContent = paginatedData.length;
        }
        
        // Render rows
        tbody.innerHTML = paginatedData.map(t => `
            <tr>
                <td>${t.id}</td>
                <td>${t.customer}</td>
                <td>${t.product}</td>
                <td>$${t.amount.toLocaleString()}</td>
                <td>
                    <span class="status-badge status-badge--${t.status}">
                        <span class="status-badge__dot"></span>
                        ${t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                    </span>
                </td>
            </tr>
        `).join('');
        
        // Render pagination
        renderPagination(filteredData.length);
    }
    
    /**
     * Render pagination controls
     */
    function renderPagination(totalItems) {
        const container = document.getElementById('tablePagination');
        if (!container) return;
        
        const totalPages = Math.ceil(totalItems / state.itemsPerPage);
        
        let html = `
            <button class="pagination-btn" ${state.currentPage === 1 ? 'disabled' : ''} data-page="prev">←</button>
        `;
        
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= state.currentPage - 1 && i <= state.currentPage + 1)) {
                html += `<button class="pagination-btn ${i === state.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            } else if (i === state.currentPage - 2 || i === state.currentPage + 2) {
                html += `<span class="pagination-dots">...</span>`;
            }
        }
        
        html += `
            <button class="pagination-btn" ${state.currentPage === totalPages ? 'disabled' : ''} data-page="next">→</button>
        `;
        
        container.innerHTML = html;
        
        // Bind click handlers
        container.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = btn.dataset.page;
                if (page === 'prev') {
                    state.currentPage = Math.max(1, state.currentPage - 1);
                } else if (page === 'next') {
                    state.currentPage = Math.min(totalPages, state.currentPage + 1);
                } else {
                    state.currentPage = parseInt(page);
                }
                renderTable();
            });
        });
    }
    
    /**
     * Handle table search
     */
    function handleSearch(e) {
        state.searchQuery = e.target.value;
        state.currentPage = 1;
        renderTable();
    }
    
    /**
     * Handle table sorting
     */
    function handleSort(e) {
        const th = e.currentTarget;
        const column = th.dataset.sort;
        
        // Update sort direction
        if (state.sortColumn === column) {
            state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            state.sortColumn = column;
            state.sortDirection = 'asc';
        }
        
        // Update UI
        document.querySelectorAll('.data-table__th').forEach(header => {
            header.removeAttribute('data-sort-dir');
        });
        th.setAttribute('data-sort-dir', state.sortDirection);
        
        renderTable();
    }
    
    /**
     * Handle KPI card click
     */
    function handleKPIClick(e) {
        const card = e.currentTarget;
        const type = card.classList.contains('kpi-card--revenue') ? 'revenue' :
                     card.classList.contains('kpi-card--customers') ? 'customers' :
                     card.classList.contains('kpi-card--orders') ? 'orders' : 'avg';
        
        // Add visual feedback
        card.classList.add('clicked');
        setTimeout(() => card.classList.remove('clicked'), 200);
        
        // Could show a detailed modal or drill-down view
        console.log(`KPI clicked: ${type}`);
    }
    
    /**
     * Show region details (interactive feature)
     */
    function showRegionDetails(region) {
        console.log(`Region clicked: ${region}`);
        // Could open a modal with detailed region data
    }
    
    /**
     * Show product details (interactive feature)
     */
    function showProductDetails(product) {
        console.log(`Product clicked: ${product}`);
        // Could open a modal with detailed product data
    }
    
    // Public API
    return {
        init,
        updateKPIs,
        updateCharts,
        renderTable
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', DashboardManager.init);
