var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AiService } from '../services/aiService';
import { MarketDataService } from '../services/marketDataService';
export class Dashboard {
    constructor() {
        this.container = null;
        this.events = [];
        this.aiService = new AiService();
        this.marketDataService = new MarketDataService();
        // Listen for selected events
        document.addEventListener('event-selected', ((e) => {
            this.handleEventSelected(e.detail.event);
        }));
    }
    render(containerId = 'dashboard-container') {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with ID '${containerId}' not found`);
            return;
        }
        this.container.innerHTML = ''; // Clear the container
        // Create dashboard sections
        this.renderUpcomingEvents();
        this.renderHighImpactEvents();
        this.renderSearchSection();
    }
    setEvents(events) {
        this.events = events;
        if (this.container) {
            this.render();
        }
    }
    renderUpcomingEvents() {
        if (!this.container)
            return;
        const section = document.createElement('section');
        section.className = 'dashboard-section upcoming-events';
        const header = document.createElement('h2');
        header.textContent = 'Upcoming Events';
        section.appendChild(header);
        // Get today's events and tomorrow's events
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const endOfTomorrow = new Date(tomorrow);
        endOfTomorrow.setHours(23, 59, 59, 999);
        const upcomingEvents = this.events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today && eventDate <= endOfTomorrow;
        });
        upcomingEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const eventsList = document.createElement('div');
        eventsList.className = 'events-list';
        if (upcomingEvents.length === 0) {
            const noEvents = document.createElement('p');
            noEvents.className = 'no-events';
            noEvents.textContent = 'No upcoming events for the next two days';
            eventsList.appendChild(noEvents);
        }
        else {
            upcomingEvents.slice(0, 5).forEach(event => {
                const eventItem = document.createElement('div');
                eventItem.className = 'event-item';
                const eventTime = document.createElement('span');
                eventTime.className = 'event-time';
                eventTime.textContent = event.date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                const eventTitle = document.createElement('span');
                eventTitle.className = 'event-title';
                eventTitle.textContent = event.title;
                eventItem.appendChild(eventTime);
                eventItem.appendChild(eventTitle);
                eventItem.addEventListener('click', () => this.handleEventSelected(event));
                eventsList.appendChild(eventItem);
            });
            if (upcomingEvents.length > 5) {
                const moreEvents = document.createElement('a');
                moreEvents.className = 'more-events';
                moreEvents.textContent = `+${upcomingEvents.length - 5} more events`;
                moreEvents.href = '#';
                moreEvents.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showAllEvents(upcomingEvents, 'Upcoming Events');
                });
                eventsList.appendChild(moreEvents);
            }
        }
        section.appendChild(eventsList);
        this.container.appendChild(section);
    }
    renderHighImpactEvents() {
        if (!this.container)
            return;
        const section = document.createElement('section');
        section.className = 'dashboard-section high-impact-events';
        const header = document.createElement('h2');
        header.textContent = 'High Impact Events';
        section.appendChild(header);
        // Get high impact events for the next 7 days
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        const highImpactEvents = this.events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today && eventDate <= nextWeek && event.impact === 'high';
        });
        highImpactEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const eventsList = document.createElement('div');
        eventsList.className = 'events-list';
        if (highImpactEvents.length === 0) {
            const noEvents = document.createElement('p');
            noEvents.className = 'no-events';
            noEvents.textContent = 'No high impact events for the next week';
            eventsList.appendChild(noEvents);
        }
        else {
            highImpactEvents.slice(0, 5).forEach(event => {
                const eventItem = document.createElement('div');
                eventItem.className = 'event-item high-impact';
                const eventDate = document.createElement('span');
                eventDate.className = 'event-date';
                eventDate.textContent = event.date.toLocaleDateString();
                const eventTitle = document.createElement('span');
                eventTitle.className = 'event-title';
                eventTitle.textContent = event.title;
                eventItem.appendChild(eventDate);
                eventItem.appendChild(eventTitle);
                eventItem.addEventListener('click', () => this.handleEventSelected(event));
                eventsList.appendChild(eventItem);
            });
            if (highImpactEvents.length > 5) {
                const moreEvents = document.createElement('a');
                moreEvents.className = 'more-events';
                moreEvents.textContent = `+${highImpactEvents.length - 5} more events`;
                moreEvents.href = '#';
                moreEvents.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showAllEvents(highImpactEvents, 'High Impact Events');
                });
                eventsList.appendChild(moreEvents);
            }
        }
        section.appendChild(eventsList);
        this.container.appendChild(section);
    }
    renderSearchSection() {
        if (!this.container)
            return;
        const section = document.createElement('section');
        section.className = 'dashboard-section search-section';
        const header = document.createElement('h2');
        header.textContent = 'Search Events';
        section.appendChild(header);
        const searchForm = document.createElement('form');
        searchForm.className = 'search-form';
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search by keyword, symbol, or company name';
        searchInput.className = 'search-input';
        const searchButton = document.createElement('button');
        searchButton.type = 'submit';
        searchButton.className = 'search-button';
        searchButton.textContent = 'Search';
        searchForm.appendChild(searchInput);
        searchForm.appendChild(searchButton);
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.searchEvents(searchInput.value);
        });
        section.appendChild(searchForm);
        // Add search results container
        const searchResults = document.createElement('div');
        searchResults.className = 'search-results';
        searchResults.id = 'search-results';
        section.appendChild(searchResults);
        this.container.appendChild(section);
    }
    handleEventSelected(event) {
        // Open event details modal
        this.showEventDetails(event);
    }
    showEventDetails(event) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create modal container
            const modalContainer = document.createElement('div');
            modalContainer.className = 'modal-container';
            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';
            const closeButton = document.createElement('button');
            closeButton.className = 'close-button';
            closeButton.textContent = '×';
            closeButton.addEventListener('click', () => {
                document.body.removeChild(modalContainer);
            });
            const title = document.createElement('h2');
            title.textContent = event.title;
            const dateTime = document.createElement('div');
            dateTime.className = 'event-datetime';
            dateTime.textContent = new Date(event.date).toLocaleString();
            const description = document.createElement('p');
            description.className = 'event-description';
            description.textContent = event.description;
            const detailsContainer = document.createElement('div');
            detailsContainer.className = 'event-details';
            // Add category and impact
            const category = document.createElement('div');
            category.className = 'event-category';
            category.innerHTML = `<strong>Category:</strong> ${event.category}`;
            const impact = document.createElement('div');
            impact.className = 'event-impact';
            impact.innerHTML = `<strong>Impact:</strong> <span class="impact-${event.impact.toLowerCase()}">${event.impact}</span>`;
            detailsContainer.appendChild(category);
            detailsContainer.appendChild(impact);
            // Add related symbols if any
            if (event.relatedSymbols && event.relatedSymbols.length > 0) {
                const symbols = document.createElement('div');
                symbols.className = 'related-symbols';
                symbols.innerHTML = `<strong>Related Symbols:</strong> ${event.relatedSymbols.join(', ')}`;
                detailsContainer.appendChild(symbols);
            }
            // Add source if available
            if (event.source) {
                const source = document.createElement('div');
                source.className = 'event-source';
                source.innerHTML = `<strong>Source:</strong> ${event.source}`;
                detailsContainer.appendChild(source);
            }
            // Get AI analysis
            const aiAnalysisContainer = document.createElement('div');
            aiAnalysisContainer.className = 'ai-analysis';
            aiAnalysisContainer.innerHTML = '<h3>AI Analysis</h3><div class="loading">Loading analysis...</div>';
            modalContent.appendChild(closeButton);
            modalContent.appendChild(title);
            modalContent.appendChild(dateTime);
            modalContent.appendChild(description);
            modalContent.appendChild(detailsContainer);
            modalContent.appendChild(aiAnalysisContainer);
            modalContainer.appendChild(modalContent);
            document.body.appendChild(modalContainer);
            // Load AI analysis
            try {
                const analysis = yield this.aiService.predictMarketReaction(event);
                aiAnalysisContainer.innerHTML = `
                <h3>AI Analysis</h3>
                <div class="ai-prediction">
                    <p><strong>Market Prediction:</strong> ${analysis.prediction}</p>
                    <p><strong>Confidence:</strong> ${Math.round(analysis.confidence * 100)}%</p>
                </div>
            `;
            }
            catch (error) {
                aiAnalysisContainer.innerHTML = `
                <h3>AI Analysis</h3>
                <div class="ai-error">
                    <p>Unable to load AI analysis at this time.</p>
                </div>
            `;
            }
        });
    }
    searchEvents(query) {
        if (!query.trim())
            return;
        const searchResultsContainer = document.getElementById('search-results');
        if (!searchResultsContainer)
            return;
        searchResultsContainer.innerHTML = '<div class="loading">Searching...</div>';
        const normalizedQuery = query.toLowerCase().trim();
        const results = this.events.filter(event => event.title.toLowerCase().includes(normalizedQuery) ||
            event.description.toLowerCase().includes(normalizedQuery) ||
            (event.relatedSymbols && event.relatedSymbols.some(s => s.toLowerCase().includes(normalizedQuery))));
        setTimeout(() => {
            searchResultsContainer.innerHTML = '';
            if (results.length === 0) {
                searchResultsContainer.innerHTML = '<p>No events found matching your search.</p>';
                return;
            }
            const resultsList = document.createElement('div');
            resultsList.className = 'results-list';
            results.forEach(event => {
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                const resultDate = document.createElement('div');
                resultDate.className = 'result-date';
                resultDate.textContent = new Date(event.date).toLocaleDateString();
                const resultTitle = document.createElement('div');
                resultTitle.className = 'result-title';
                resultTitle.textContent = event.title;
                resultItem.appendChild(resultDate);
                resultItem.appendChild(resultTitle);
                resultItem.addEventListener('click', () => this.handleEventSelected(event));
                resultsList.appendChild(resultItem);
            });
            searchResultsContainer.appendChild(resultsList);
        }, 500); // Simulate search delay
    }
    showAllEvents(events, title) {
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content events-list-modal';
        const closeButton = document.createElement('button');
        closeButton.className = 'close-button';
        closeButton.textContent = '×';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modalContainer);
        });
        const modalTitle = document.createElement('h2');
        modalTitle.textContent = title;
        const eventsList = document.createElement('div');
        eventsList.className = 'events-list-full';
        events.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            const eventDate = document.createElement('span');
            eventDate.className = 'event-date';
            eventDate.textContent = new Date(event.date).toLocaleDateString();
            const eventTime = document.createElement('span');
            eventTime.className = 'event-time';
            eventTime.textContent = new Date(event.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
            const eventTitle = document.createElement('span');
            eventTitle.className = 'event-title';
            eventTitle.textContent = event.title;
            const impactIndicator = document.createElement('span');
            impactIndicator.className = `impact-indicator impact-${event.impact.toLowerCase()}`;
            eventItem.appendChild(eventDate);
            eventItem.appendChild(eventTime);
            eventItem.appendChild(eventTitle);
            eventItem.appendChild(impactIndicator);
            eventItem.addEventListener('click', () => {
                document.body.removeChild(modalContainer);
                this.handleEventSelected(event);
            });
            eventsList.appendChild(eventItem);
        });
        modalContent.appendChild(closeButton);
        modalContent.appendChild(modalTitle);
        modalContent.appendChild(eventsList);
        modalContainer.appendChild(modalContent);
        document.body.appendChild(modalContainer);
    }
}
//# sourceMappingURL=Dashboard.js.map