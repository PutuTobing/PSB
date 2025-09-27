/**
 * Sidebar Manager - Projek SR-16
 * Handles sidebar functionality, navigation, and responsive behavior
 */

class SidebarManager {
    constructor() {
        this.sidebar = null;
        this.mobileToggle = null;
        this.overlay = null;
        this.navLinks = [];
        this.currentPage = 'dashboard';
        this.isMobile = window.innerWidth <= 768;
        
        // Bind methods
        this.handleResize = this.handleResize.bind(this);
        this.toggleMobileSidebar = this.toggleMobileSidebar.bind(this);
        this.closeMobileSidebar = this.closeMobileSidebar.bind(this);
        this.handleNavigation = this.handleNavigation.bind(this);
    }

    /**
     * Initialize sidebar manager
     */
    static async init() {
        const manager = new SidebarManager();
        await manager.loadSidebarComponent();
        manager.setupEventListeners();
        manager.setupNavigation();
        manager.checkMobileState();
        return manager;
    }

    /**
     * Load sidebar component from HTML file
     */
    async loadSidebarComponent() {
        try {
            const response = await fetch('../components/sidebar.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const sidebarHTML = await response.text();
            const container = document.getElementById('sidebar-container');
            
            if (!container) {
                throw new Error('Sidebar container not found');
            }
            
            container.innerHTML = sidebarHTML;
            
            // Cache DOM elements
            this.sidebar = document.getElementById('sidebar');
            this.mobileToggle = document.getElementById('mobileMenuToggle');
            this.overlay = document.getElementById('sidebarOverlay');
            this.navLinks = document.querySelectorAll('.nav-link');
            
            console.log('Sidebar component loaded successfully');
            
        } catch (error) {
            console.error('Failed to load sidebar component:', error);
            this.createFallbackSidebar();
        }
    }

    /**
     * Create fallback sidebar if component loading fails
     */
    createFallbackSidebar() {
        const container = document.getElementById('sidebar-container');
        container.innerHTML = `
            <aside class="sidebar" id="sidebar">
                <div class="logo-section">
                    <div class="logo"><img src="../image/btd-logo.png" alt="BTD Logo" style="max-width: 100%; height: auto;"></div>
                    <h1 class="project-title">Projek SR-16</h1>
                    <p class="project-subtitle">Database Login System</p>
                </div>
                <ul class="nav-menu">
                    <li class="nav-item">
                        <a href="#" class="nav-link active" data-page="dashboard">
                            <span class="nav-icon">📊</span>
                            Dashboard
                        </a>
                    </li>
                </ul>
            </aside>
        `;
        
        this.sidebar = document.getElementById('sidebar');
        this.navLinks = document.querySelectorAll('.nav-link');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Mobile menu toggle
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', this.toggleMobileSidebar);
        }

        // Overlay click to close
        if (this.overlay) {
            this.overlay.addEventListener('click', this.closeMobileSidebar);
        }

        // Window resize
        window.addEventListener('resize', this.handleResize);

        // Escape key to close mobile sidebar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobile) {
                this.closeMobileSidebar();
            }
        });

        console.log('Sidebar event listeners setup complete');
    }

    /**
     * Setup navigation functionality
     */
    setupNavigation() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavigation);
        });

        // Set initial active state
        this.setActivePage(this.currentPage);
    }

    /**
     * Handle navigation clicks
     */
    handleNavigation(e) {
        e.preventDefault();
        
        const link = e.currentTarget;
        const page = link.getAttribute('data-page');
        
        if (!page) return;

        // Update active state
        this.setActivePage(page);
        
        // Close mobile sidebar after navigation
        if (this.isMobile) {
            this.closeMobileSidebar();
        }

        // Dispatch navigation event for other components to listen
        const navigationEvent = new CustomEvent('sidebar-navigation', {
            detail: { page, previousPage: this.currentPage }
        });
        document.dispatchEvent(navigationEvent);
        
        this.currentPage = page;
        
        console.log(`Navigated to: ${page}`);
    }

    /**
     * Set active page state
     */
    setActivePage(page) {
        this.navLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === page) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update page title
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            const titles = {
                'dashboard': 'Dashboard',
                'pemasangan': 'Daftar Pemasangan',
                'manajemen-akun': 'Manajemen Akun'
            };
            pageTitle.textContent = titles[page] || 'Dashboard';
        }
    }

    /**
     * Toggle mobile sidebar
     */
    toggleMobileSidebar() {
        if (!this.sidebar) return;

        const isOpen = this.sidebar.classList.contains('mobile-open');
        
        if (isOpen) {
            this.closeMobileSidebar();
        } else {
            this.openMobileSidebar();
        }
    }

    /**
     * Open mobile sidebar
     */
    openMobileSidebar() {
        if (!this.sidebar) return;

        this.sidebar.classList.add('mobile-open');
        if (this.overlay) {
            this.overlay.style.display = 'block';
            setTimeout(() => this.overlay.classList.add('active'), 10);
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close mobile sidebar
     */
    closeMobileSidebar() {
        if (!this.sidebar) return;

        this.sidebar.classList.remove('mobile-open');
        if (this.overlay) {
            this.overlay.classList.remove('active');
            setTimeout(() => {
                if (this.overlay) this.overlay.style.display = 'none';
            }, 300);
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;

        // Close mobile sidebar if switching to desktop
        if (wasMobile && !this.isMobile) {
            this.closeMobileSidebar();
        }

        this.checkMobileState();
    }

    /**
     * Check and apply mobile state
     */
    checkMobileState() {
        if (!this.sidebar) return;

        if (this.isMobile) {
            this.sidebar.classList.add('mobile-hidden');
        } else {
            this.sidebar.classList.remove('mobile-hidden', 'mobile-open');
            if (this.overlay) {
                this.overlay.classList.remove('active');
                this.overlay.style.display = 'none';
            }
            document.body.style.overflow = '';
        }
    }

    /**
     * Get current active page
     */
    getCurrentPage() {
        return this.currentPage;
    }

    /**
     * Navigate to specific page programmatically
     */
    navigateToPage(page) {
        const targetLink = document.querySelector(`[data-page="${page}"]`);
        if (targetLink) {
            targetLink.click();
        }
    }

    /**
     * Add custom navigation handler
     */
    onNavigation(callback) {
        document.addEventListener('sidebar-navigation', callback);
    }

    /**
     * Destroy sidebar manager
     */
    destroy() {
        // Remove event listeners
        if (this.mobileToggle) {
            this.mobileToggle.removeEventListener('click', this.toggleMobileSidebar);
        }
        
        if (this.overlay) {
            this.overlay.removeEventListener('click', this.closeMobileSidebar);
        }
        
        window.removeEventListener('resize', this.handleResize);
        
        this.navLinks.forEach(link => {
            link.removeEventListener('click', this.handleNavigation);
        });

        console.log('Sidebar manager destroyed');
    }
}

// Export for global use
window.SidebarManager = SidebarManager;

// Auto-initialize if in browser environment
if (typeof window !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Will be initialized by the main app
    });
}

console.log('Sidebar Manager loaded');
