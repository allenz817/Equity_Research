var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Calendar } from './components/Calendar';
import { Dashboard } from './components/Dashboard';
import { AiService } from './services/aiService';
import { MarketDataService } from './services/marketDataService';
class App {
    constructor() {
        this.events = [];
        this.currentView = 'calendar'; // calendar or dashboard
        this.loadingIndicator = null;
        this.aiService = new AiService();
        this.marketDataService = new MarketDataService();
        this.calendar = new Calendar();
        this.dashboard = new Dashboard();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setupLoadingIndicator();
            this.setupRouting();
            yield this.loadEvents();
            this.renderComponents();
        });
    }
    setupLoadingIndicator() {
        this.loadingIndicator = document.createElement('div');
        this.loadingIndicator.className = 'loading-indicator';
        this.loadingIndicator.textContent = 'Loading...';
        document.body.appendChild(this.loadingIndicator);
    }
    loadEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.showLoading(true);
                // Get date range for current month and next month
                const today = new Date();
                const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                const endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);
                this.events = yield this.marketDataService.getAllEvents(startDate, endDate);
                this.showLoading(false);
            }
            catch (error) {
                console.error('Failed to load events:', error);
                this.showError('Failed to load events. Please try again later.');
                this.showLoading(false);
            }
        });
    }
    setupRouting() {
        // Get navigation elements
        const calendarNav = document.getElementById('nav-calendar');
        const dashboardNav = document.getElementById('nav-dashboard');
        if (calendarNav) {
            calendarNav.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo('calendar');
            });
        }
        if (dashboardNav) {
            dashboardNav.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo('dashboard');
            });
        }
        // Check URL hash for initial routing
        const hash = window.location.hash.substring(1);
        if (hash === 'dashboard') {
            this.currentView = 'dashboard';
        }
        // Add hash change listener
        window.addEventListener('hashchange', () => {
            const newHash = window.location.hash.substring(1);
            if (newHash === 'calendar' || newHash === 'dashboard') {
                this.navigateTo(newHash);
            }
        });
    }
    navigateTo(view) {
        this.currentView = view;
        window.location.hash = view;
        this.renderComponents();
        this.updateNavActive();
    }
    updateNavActive() {
        // Update active navigation
        const calendarNav = document.getElementById('nav-calendar');
        const dashboardNav = document.getElementById('nav-dashboard');
        if (calendarNav && dashboardNav) {
            if (this.currentView === 'calendar') {
                calendarNav.classList.add('active');
                dashboardNav.classList.remove('active');
            }
            else {
                dashboardNav.classList.add('active');
                calendarNav.classList.remove('active');
            }
        }
    }
    renderComponents() {
        // Get container elements
        const calendarContainer = document.getElementById('calendar-container');
        const dashboardContainer = document.getElementById('dashboard-container');
        if (!calendarContainer || !dashboardContainer) {
            console.error('Container elements not found');
            return;
        }
        // Toggle visibility based on current view
        if (this.currentView === 'calendar') {
            calendarContainer.style.display = 'block';
            dashboardContainer.style.display = 'none';
            this.calendar.updateEvents(this.events);
            this.calendar.render();
        }
        else {
            calendarContainer.style.display = 'none';
            dashboardContainer.style.display = 'block';
            this.dashboard.setEvents(this.events);
            this.dashboard.render();
        }
        this.updateNavActive();
    }
    showLoading(show) {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = show ? 'flex' : 'none';
        }
    }
    showError(message) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-notification';
        errorContainer.textContent = message;
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-error';
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(errorContainer);
        });
        errorContainer.appendChild(closeBtn);
        document.body.appendChild(errorContainer);
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            if (document.body.contains(errorContainer)) {
                document.body.removeChild(errorContainer);
            }
        }, 5000);
    }
}
// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.initialize();
});
//# sourceMappingURL=app.js.map