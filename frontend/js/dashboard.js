/**
 * Dashboard Application - Projek SR-16
 * Main dashboard functionality, data management, and user interaction
 */

class DashboardApp {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000/api';
        this.updateInterval = null;
        this.userData = null;
        this.isInitialized = false;
        
        // Bind methods
        this.updateDateTime = this.updateDateTime.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.loadUserData = this.loadUserData.bind(this);
        this.loadDashboardStats = this.loadDashboardStats.bind(this);
    }

    /**
     * Initialize dashboard application
     */
    static init() {
        const app = new DashboardApp();
        app.initialize();
        return app;
    }

    /**
     * Initialize application
     */
    async initialize() {
        try {
            console.log('Initializing Dashboard App...');
            
            // Check authentication first
            if (!this.checkAuthentication()) {
                this.redirectToLogin();
                return;
            }

            // Setup event listeners
            this.setupEventListeners();
            
            // Start real-time clock
            this.startClock();
            
            // Load initial data
            await this.loadInitialData();
            
            // Setup auto-refresh
            this.setupAutoRefresh();
            
            // Mark as initialized
            this.isInitialized = true;
            
            console.log('Dashboard App initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize dashboard:', error);
            this.showError('Failed to initialize dashboard');
        }
    }

    /**
     * Check if user is authenticated
     */
    checkAuthentication() {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        
        if (!token || !user) {
            console.log('No authentication found');
            return false;
        }

        try {
            // Basic token validation
            const userData = JSON.parse(user);
            this.userData = userData;
            return true;
        } catch (error) {
            console.error('Invalid user data:', error);
            return false;
        }
    }

    /**
     * Redirect to login page
     */
    redirectToLogin() {
        console.log('Redirecting to login...');
        window.location.href = '/login.html';
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', this.handleLogout);
        }

        // Navigation events from sidebar
        document.addEventListener('sidebar-navigation', (e) => {
            this.handlePageNavigation(e.detail.page);
        });

        // Window visibility change (pause/resume updates)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseUpdates();
            } else {
                this.resumeUpdates();
            }
        });

        console.log('Dashboard event listeners setup complete');
    }

    /**
     * Start real-time clock
     */
    startClock() {
        // Update immediately
        this.updateDateTime();
        
        // Update every second
        this.updateInterval = setInterval(this.updateDateTime, 1000);
    }

    /**
     * Update date and time display
     */
    updateDateTime() {
        const now = new Date();
        
        // Format date
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const dateStr = now.toLocaleDateString('id-ID', dateOptions);
        
        // Format time
        const timeStr = now.toLocaleTimeString('id-ID');
        
        // Update display
        const dateTimeElement = document.getElementById('dateTime');
        if (dateTimeElement) {
            dateTimeElement.textContent = `${dateStr} | ${timeStr}`;
        }
    }

    /**
     * Load initial dashboard data
     */
    async loadInitialData() {
        try {
            // Show loading state
            this.showLoading(true);
            
            // Load user data
            await this.loadUserData();
            
            // Load dashboard statistics
            await this.loadDashboardStats();
            
            // Load recent activity
            await this.loadRecentActivity();
            
            // Hide loading state
            this.showLoading(false);
            
        } catch (error) {
            console.error('Failed to load initial data:', error);
            this.showError('Failed to load dashboard data');
            this.showLoading(false);
        }
    }

    /**
     * Load user data
     */
    async loadUserData() {
        try {
            // For now, use stored user data
            if (this.userData && this.userData.email) {
                const userNameElement = document.getElementById('userName');
                if (userNameElement) {
                    userNameElement.textContent = this.userData.email;
                }
            }

            // TODO: Fetch fresh user data from API
            /*
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${this.apiBaseUrl}/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const userData = await response.json();
                this.userData = userData;
                // Update UI with user data
            }
            */
            
        } catch (error) {
            console.error('Failed to load user data:', error);
            // Use fallback data
            const userNameElement = document.getElementById('userName');
            if (userNameElement) {
                userNameElement.textContent = 'User';
            }
        }
    }

    /**
     * Load dashboard statistics
     */
    async loadDashboardStats() {
        try {
            // TODO: Fetch real data from API
            // For now, use mock data
            const stats = {
                loginSessions: 1,
                accountStatus: 'Active',
                lastLogin: new Date().toLocaleDateString('id-ID')
            };

            // Update UI
            const loginSessionsElement = document.getElementById('loginSessions');
            if (loginSessionsElement) {
                loginSessionsElement.textContent = stats.loginSessions;
            }

            const accountStatusElement = document.getElementById('accountStatus');
            if (accountStatusElement) {
                accountStatusElement.textContent = stats.accountStatus;
            }

            const lastLoginElement = document.getElementById('lastLogin');
            if (lastLoginElement) {
                lastLoginElement.textContent = stats.lastLogin;
            }

            console.log('Dashboard stats loaded');
            
        } catch (error) {
            console.error('Failed to load dashboard stats:', error);
        }
    }

    /**
     * Load recent activity
     */
    async loadRecentActivity() {
        try {
            // TODO: Fetch real activity from API
            const now = new Date();
            const loginTime = now.toLocaleString('id-ID');
            
            // Update login time
            const loginTimeElement = document.getElementById('loginTime');
            if (loginTimeElement) {
                loginTimeElement.textContent = loginTime;
            }

            const accountCreatedElement = document.getElementById('accountCreated');
            if (accountCreatedElement) {
                accountCreatedElement.textContent = 'When you registered';
            }

            console.log('Recent activity loaded');
            
        } catch (error) {
            console.error('Failed to load recent activity:', error);
        }
    }

    /**
     * Handle logout
     */
    async handleLogout() {
        try {
            console.log('Logging out...');
            
            // Call logout API
            const token = localStorage.getItem('authToken');
            
            if (token) {
                try {
                    await fetch(`${this.apiBaseUrl}/logout`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                } catch (apiError) {
                    console.warn('Logout API call failed:', apiError);
                    // Continue with local logout even if API fails
                }
            }

            // Clear local storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            
            // Clear user data
            this.userData = null;
            
            // Stop updates
            this.cleanup();
            
            // Redirect to login
            this.redirectToLogin();
            
        } catch (error) {
            console.error('Logout failed:', error);
            // Force logout even if there's an error
            localStorage.clear();
            this.redirectToLogin();
        }
    }

    /**
     * Handle page navigation
     */
    handlePageNavigation(page) {
        console.log(`Handling navigation to: ${page}`);
        
        // For now, just log the navigation
        // In a full implementation, you would load different content
        // or navigate to different pages
        
        switch (page) {
            case 'dashboard':
                this.loadDashboardStats();
                break;
            case 'pemasangan':
                console.log('Loading Daftar Pemasangan...');
                // TODO: Load pemasangan data
                break;
            case 'manajemen-akun':
                console.log('Loading Manajemen Akun...');
                // TODO: Load account management
                break;
        }
    }

    /**
     * Setup auto-refresh
     */
    setupAutoRefresh() {
        // Refresh data every 5 minutes
        setInterval(() => {
            if (!document.hidden) {
                console.log('Auto-refreshing dashboard data...');
                this.loadDashboardStats();
                this.loadRecentActivity();
            }
        }, 5 * 60 * 1000); // 5 minutes
    }

    /**
     * Pause updates when page is hidden
     */
    pauseUpdates() {
        console.log('Pausing updates (page hidden)');
        // Updates will be paused by visibility check in auto-refresh
    }

    /**
     * Resume updates when page becomes visible
     */
    resumeUpdates() {
        console.log('Resuming updates (page visible)');
        // Update immediately when page becomes visible
        this.updateDateTime();
        this.loadDashboardStats();
    }

    /**
     * Show loading state
     */
    showLoading(show) {
        const loadingElement = document.getElementById('loadingState');
        if (loadingElement) {
            loadingElement.style.display = show ? 'flex' : 'none';
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            
            // Hide error after 5 seconds
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 5000);
        }
    }

    /**
     * Get dashboard stats (for external use)
     */
    getDashboardStats() {
        return {
            loginSessions: document.getElementById('loginSessions')?.textContent || '0',
            accountStatus: document.getElementById('accountStatus')?.textContent || 'Unknown',
            lastLogin: document.getElementById('lastLogin')?.textContent || 'Unknown'
        };
    }

    /**
     * Refresh dashboard data manually
     */
    async refresh() {
        console.log('Manual refresh triggered');
        await this.loadInitialData();
    }

    /**
     * Cleanup function
     */
    cleanup() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        this.isInitialized = false;
        console.log('Dashboard app cleaned up');
    }

    /**
     * Check if app is initialized
     */
    isReady() {
        return this.isInitialized;
    }
}

// Export for global use
window.DashboardApp = DashboardApp;

// Utility functions
const DashboardUtils = {
    /**
     * Format date in Indonesian locale
     */
    formatDate(date) {
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    /**
     * Format time in Indonesian locale
     */
    formatTime(date) {
        return date.toLocaleTimeString('id-ID');
    },

    /**
     * Format datetime for display
     */
    formatDateTime(date) {
        return `${this.formatDate(date)} | ${this.formatTime(date)}`;
    },

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        console.log(`${type.toUpperCase()}: ${message}`);
        // TODO: Implement proper notification system
    }
};

window.DashboardUtils = DashboardUtils;

console.log('Dashboard App loaded');
