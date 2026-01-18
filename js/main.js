/**
 * Main Application Module
 * Initializes all components and handles global functionality
 */

const App = (function() {
    'use strict';
    
    /**
     * Initialize the application
     */
    function init() {
        initProjectFilters();
        initProjectModal();
        initContactForm();
        initLazyLoading();
    }
    
    /**
     * Initialize project filters
     */
    function initProjectFilters() {
        const filters = document.querySelectorAll('.projects__filter');
        const projects = document.querySelectorAll('.project-card');
        
        filters.forEach(filter => {
            filter.addEventListener('click', () => {
                // Update active filter
                filters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
                
                const category = filter.dataset.filter;
                
                // Filter projects
                projects.forEach(project => {
                    const projectCategory = project.dataset.category;
                    
                    if (category === 'all' || projectCategory === category) {
                        project.style.display = '';
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        project.style.opacity = '0';
                        project.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            project.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    /**
     * Initialize project modal
     */
    function initProjectModal() {
        const modal = document.getElementById('projectModal');
        const modalBody = document.getElementById('modalBody');
        const projectButtons = document.querySelectorAll('.project-card__btn');
        
        if (!modal || !modalBody) return;
        
        // Project data
        const projectData = {
            sales: {
                title: 'Sales Performance Dashboard',
                description: `
                    <p>A comprehensive sales analytics dashboard that provides real-time insights 
                    into sales performance across multiple dimensions including time, geography, 
                    and product categories.</p>
                    <h4>Key Features:</h4>
                    <ul>
                        <li>Real-time KPI tracking with YoY comparisons</li>
                        <li>Interactive drill-down capabilities</li>
                        <li>Geographic heat maps for regional analysis</li>
                        <li>Forecasting with predictive analytics</li>
                        <li>Mobile-responsive design</li>
                    </ul>
                    <h4>Technologies Used:</h4>
                    <p>Power BI, SQL Server, DAX, Power Query, Azure Analysis Services</p>
                    <h4>Impact:</h4>
                    <p>Reduced reporting time by 75% and enabled data-driven decision making 
                    that contributed to a 15% increase in sales efficiency.</p>
                `,
                image: '📊'
            },
            customer: {
                title: 'Customer Segmentation Analysis',
                description: `
                    <p>Advanced customer analytics project using RFM (Recency, Frequency, Monetary) 
                    analysis and machine learning clustering to identify distinct customer segments.</p>
                    <h4>Key Features:</h4>
                    <ul>
                        <li>RFM scoring and segmentation</li>
                        <li>K-Means clustering for behavior patterns</li>
                        <li>Customer lifetime value prediction</li>
                        <li>Churn risk identification</li>
                        <li>Personalization recommendations</li>
                    </ul>
                    <h4>Technologies Used:</h4>
                    <p>Python, Pandas, Scikit-learn, Matplotlib, Seaborn, Jupyter</p>
                    <h4>Impact:</h4>
                    <p>Identified 5 distinct customer segments, enabling targeted marketing 
                    campaigns that improved conversion rates by 23%.</p>
                `,
                image: '👥'
            },
            market: {
                title: 'Market Trend Analysis',
                description: `
                    <p>Interactive visualization platform for analyzing market trends, competitive 
                    landscape, and industry benchmarks to support strategic planning.</p>
                    <h4>Key Features:</h4>
                    <ul>
                        <li>Dynamic trend visualization</li>
                        <li>Competitor benchmarking</li>
                        <li>Market share analysis</li>
                        <li>Sentiment analysis integration</li>
                        <li>Scenario modeling</li>
                    </ul>
                    <h4>Technologies Used:</h4>
                    <p>Tableau, SQL, Python, Web Scraping, NLP</p>
                    <h4>Impact:</h4>
                    <p>Provided executive leadership with actionable market intelligence, 
                    supporting strategic decisions worth $2M+ in new market opportunities.</p>
                `,
                image: '📈'
            },
            financial: {
                title: 'Financial Analytics Dashboard',
                description: `
                    <p>Enterprise-grade financial reporting dashboard with real-time data integration, 
                    budget variance analysis, and automated forecasting capabilities.</p>
                    <h4>Key Features:</h4>
                    <ul>
                        <li>P&L and Balance Sheet visualization</li>
                        <li>Budget vs Actual variance analysis</li>
                        <li>Cash flow forecasting</li>
                        <li>What-if scenario modeling</li>
                        <li>Automated report distribution</li>
                    </ul>
                    <h4>Technologies Used:</h4>
                    <p>Power BI, Azure Synapse, Python, DAX, Power Automate</p>
                    <h4>Impact:</h4>
                    <p>Automated monthly close reporting, reducing processing time from 
                    5 days to 4 hours and improving forecast accuracy by 18%.</p>
                `,
                image: '💰'
            }
        };
        
        // Open modal
        projectButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const projectKey = btn.dataset.project;
                const project = projectData[projectKey];
                
                if (project) {
                    modalBody.innerHTML = `
                        <div class="modal__project">
                            <div class="modal__project-icon">${project.image}</div>
                            <h3 class="modal__project-title">${project.title}</h3>
                            <div class="modal__project-content">
                                ${project.description}
                            </div>
                        </div>
                    `;
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        // Close modal
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        modal.querySelector('.modal__close')?.addEventListener('click', closeModal);
        modal.querySelector('.modal__overlay')?.addEventListener('click', closeModal);
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }
    
    /**
     * Initialize contact form
     */
    function initContactForm() {
        const form = document.getElementById('contactForm');
        
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            submitBtn.innerHTML = '✓ Message Sent!';
            submitBtn.classList.add('btn--success');
            
            // Reset form
            form.reset();
            
            // Reset button after delay
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('btn--success');
            }, 3000);
        });
        
        // Input validation feedback
        const inputs = form.querySelectorAll('.form-input, .form-textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.validity.valid && input.value) {
                    input.classList.add('valid');
                    input.classList.remove('invalid');
                } else if (!input.validity.valid) {
                    input.classList.add('invalid');
                    input.classList.remove('valid');
                }
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('invalid') && input.validity.valid) {
                    input.classList.remove('invalid');
                    input.classList.add('valid');
                }
            });
        });
    }
    
    /**
     * Initialize lazy loading for images
     */
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }
    
    // Public API
    return {
        init
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);

// Add some additional modal styles dynamically
const modalStyles = `
    .modal__project {
        text-align: center;
    }
    
    .modal__project-icon {
        font-size: 4rem;
        margin-bottom: var(--space-4);
    }
    
    .modal__project-title {
        font-size: var(--text-2xl);
        margin-bottom: var(--space-6);
        color: var(--text-primary);
    }
    
    .modal__project-content {
        text-align: left;
    }
    
    .modal__project-content h4 {
        font-size: var(--text-lg);
        margin: var(--space-6) 0 var(--space-3);
        color: var(--text-primary);
    }
    
    .modal__project-content p {
        color: var(--text-secondary);
        line-height: var(--leading-relaxed);
    }
    
    .modal__project-content ul {
        list-style: disc;
        padding-left: var(--space-6);
        color: var(--text-secondary);
    }
    
    .modal__project-content li {
        margin-bottom: var(--space-2);
    }
    
    .form-input.valid,
    .form-textarea.valid {
        border-color: var(--color-success);
    }
    
    .form-input.invalid,
    .form-textarea.invalid {
        border-color: var(--color-error);
    }
    
    .btn--success {
        background: var(--color-success) !important;
    }
    
    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: #ffffff;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }
`;

// Inject modal styles
const styleSheet = document.createElement('style');
styleSheet.textContent = modalStyles;
document.head.appendChild(styleSheet);
