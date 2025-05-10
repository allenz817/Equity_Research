import { Event } from '../models/Event';
import { EventCard } from './EventCard';
import { DateFormatter } from '../utils/dateFormatter';

export class Calendar {
    private events: Event[] = [];
    private currentView: 'day' | 'week' | 'month' = 'week';
    private selectedDate: Date = new Date();
    private container: HTMLElement | null = null;
    
    constructor() {
        this.container = document.getElementById('calendar-container');
    }
    
    public render(containerId: string = 'calendar-container'): void {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with ID '${containerId}' not found`);
            return;
        }
        
        this.container.innerHTML = ''; // Clear the container
        
        // Create the calendar header with navigation controls
        const header = document.createElement('div');
        header.className = 'calendar-header';
        
        const title = document.createElement('h2');
        title.className = 'calendar-title';
        title.textContent = this.getCalendarTitle();
        
        const navigation = document.createElement('div');
        navigation.className = 'calendar-navigation';
        
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '← Previous';
        prevBtn.addEventListener('click', () => this.navigatePrevious());
        
        const todayBtn = document.createElement('button');
        todayBtn.textContent = 'Today';
        todayBtn.addEventListener('click', () => this.navigateToday());
        
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next →';
        nextBtn.addEventListener('click', () => this.navigateNext());
        
        navigation.appendChild(prevBtn);
        navigation.appendChild(todayBtn);
        navigation.appendChild(nextBtn);
        
        // View controls
        const viewControls = document.createElement('div');
        viewControls.className = 'view-controls';
        
        const dayViewBtn = document.createElement('button');
        dayViewBtn.textContent = 'Day';
        dayViewBtn.className = this.currentView === 'day' ? 'active' : '';
        dayViewBtn.addEventListener('click', () => this.setView('day'));
        
        const weekViewBtn = document.createElement('button');
        weekViewBtn.textContent = 'Week';
        weekViewBtn.className = this.currentView === 'week' ? 'active' : '';
        weekViewBtn.addEventListener('click', () => this.setView('week'));
        
        const monthViewBtn = document.createElement('button');
        monthViewBtn.textContent = 'Month';
        monthViewBtn.className = this.currentView === 'month' ? 'active' : '';
        monthViewBtn.addEventListener('click', () => this.setView('month'));
        
        viewControls.appendChild(dayViewBtn);
        viewControls.appendChild(weekViewBtn);
        viewControls.appendChild(monthViewBtn);
        
        header.appendChild(title);
        header.appendChild(navigation);
        header.appendChild(viewControls);
        
        this.container.appendChild(header);
        
        // Create calendar grid
        const calendarGrid = document.createElement('div');
        calendarGrid.className = `calendar-grid calendar-${this.currentView}`;
        
        if (this.currentView === 'day') {
            this.renderDayView(calendarGrid);
        } else if (this.currentView === 'week') {
            this.renderWeekView(calendarGrid);
        } else {
            this.renderMonthView(calendarGrid);
        }
        
        this.container.appendChild(calendarGrid);
    }
    
    public updateEvents(events: Event[]): void {
        this.events = events;
        if (this.container) {
            this.render();
        }
    }
    
    private renderDayView(container: HTMLElement): void {
        const dayStart = new Date(this.selectedDate);
        dayStart.setHours(0, 0, 0, 0);
        
        const dayEnd = new Date(this.selectedDate);
        dayEnd.setHours(23, 59, 59, 999);
        
        const dayEvents = this.events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= dayStart && eventDate <= dayEnd;
        });
        
        // Sort events by date
        dayEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        const dayColumn = document.createElement('div');
        dayColumn.className = 'day-column';
        
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = DateFormatter.formatDate(this.selectedDate);
        dayColumn.appendChild(dayHeader);
        
        if (dayEvents.length === 0) {
            const noEvents = document.createElement('div');
            noEvents.className = 'no-events';
            noEvents.textContent = 'No events for this day';
            dayColumn.appendChild(noEvents);
        } else {
            dayEvents.forEach(event => {
                const eventCard = new EventCard(event);
                dayColumn.appendChild(eventCard.render());
            });
        }
        
        container.appendChild(dayColumn);
    }
    
    private renderWeekView(container: HTMLElement): void {
        const { start: weekStart, end: weekEnd } = DateFormatter.getWeekRange(this.selectedDate);
        
        // Create day columns for each day of the week
        for (let day = 0; day < 7; day++) {
            const currentDate = new Date(weekStart);
            currentDate.setDate(weekStart.getDate() + day);
            
            const dayColumn = document.createElement('div');
            dayColumn.className = 'day-column';
            
            const isCurrentDay = currentDate.toDateString() === new Date().toDateString();
            const isSelectedDay = currentDate.toDateString() === this.selectedDate.toDateString();
            
            if (isCurrentDay) {
                dayColumn.classList.add('current-day');
            }
            
            if (isSelectedDay) {
                dayColumn.classList.add('selected-day');
            }
            
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = currentDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
            
            dayColumn.appendChild(dayHeader);
            
            const dayStart = new Date(currentDate);
            dayStart.setHours(0, 0, 0, 0);
            
            const dayEnd = new Date(currentDate);
            dayEnd.setHours(23, 59, 59, 999);
            
            const dayEvents = this.events.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= dayStart && eventDate <= dayEnd;
            });
            
            dayEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
            if (dayEvents.length === 0) {
                const noEvents = document.createElement('div');
                noEvents.className = 'no-events';
                noEvents.textContent = 'No events';
                dayColumn.appendChild(noEvents);
            } else {
                dayEvents.forEach(event => {
                    const eventCard = new EventCard(event);
                    dayColumn.appendChild(eventCard.render());
                });
            }
            
            // Make the day column clickable to switch to day view
            dayColumn.addEventListener('click', (e) => {
                if (e.target === dayColumn || e.target === dayHeader) {
                    this.selectedDate = new Date(currentDate);
                    this.setView('day');
                }
            });
            
            container.appendChild(dayColumn);
        }
    }
    
    private renderMonthView(container: HTMLElement): void {
        const { start: monthStart, end: monthEnd } = DateFormatter.getMonthRange(this.selectedDate);
        
        // Create header row with day names
        const daysHeader = document.createElement('div');
        daysHeader.className = 'days-header';
        
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(dayName => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-name';
            dayHeader.textContent = dayName;
            daysHeader.appendChild(dayHeader);
        });
        
        container.appendChild(daysHeader);
        
        // Find the first day of the month
        const firstDayOfMonth = monthStart.getDay();
        
        // Calculate total days to display (including leading/trailing days)
        const totalDays = 42; // 6 rows of 7 days
        
        for (let i = 0; i < totalDays; i++) {
            const dayOffset = i - firstDayOfMonth;
            const currentDate = new Date(monthStart);
            currentDate.setDate(monthStart.getDate() + dayOffset);
            
            const dayCell = document.createElement('div');
            dayCell.className = 'month-day';
            
            if (currentDate.getMonth() !== monthStart.getMonth()) {
                dayCell.classList.add('other-month');
            }
            
            const isCurrentDay = currentDate.toDateString() === new Date().toDateString();
            const isSelectedDay = currentDate.toDateString() === this.selectedDate.toDateString();
            
            if (isCurrentDay) {
                dayCell.classList.add('current-day');
            }
            
            if (isSelectedDay) {
                dayCell.classList.add('selected-day');
            }
            
            const dateNumber = document.createElement('div');
            dateNumber.className = 'date-number';
            dateNumber.textContent = currentDate.getDate().toString();
            dayCell.appendChild(dateNumber);
            
            // Find events for this day
            const dayStart = new Date(currentDate);
            dayStart.setHours(0, 0, 0, 0);
            
            const dayEnd = new Date(currentDate);
            dayEnd.setHours(23, 59, 59, 999);
            
            const dayEvents = this.events.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= dayStart && eventDate <= dayEnd;
            });
            
            if (dayEvents.length > 0) {
                const eventIndicator = document.createElement('div');
                eventIndicator.className = 'event-indicator';
                
                if (dayEvents.length <= 3) {
                    dayEvents.forEach(event => {
                        const indicator = document.createElement('div');
                        indicator.className = `event-dot impact-${event.impact.toLowerCase()}`;
                        indicator.title = event.title;
                        eventIndicator.appendChild(indicator);
                    });
                } else {
                    const moreIndicator = document.createElement('div');
                    moreIndicator.className = 'event-more';
                    moreIndicator.textContent = `${dayEvents.length} events`;
                    eventIndicator.appendChild(moreIndicator);
                }
                
                dayCell.appendChild(eventIndicator);
            }
            
            // Make the day cell clickable
            dayCell.addEventListener('click', () => {
                this.selectedDate = new Date(currentDate);
                this.setView('day');
            });
            
            container.appendChild(dayCell);
        }
    }
    
    private getCalendarTitle(): string {
        if (this.currentView === 'day') {
            return this.selectedDate.toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } else if (this.currentView === 'week') {
            const { start, end } = DateFormatter.getWeekRange(this.selectedDate);
            return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
        } else {
            return this.selectedDate.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long'
            });
        }
    }
    
    private navigatePrevious(): void {
        if (this.currentView === 'day') {
            this.selectedDate.setDate(this.selectedDate.getDate() - 1);
        } else if (this.currentView === 'week') {
            this.selectedDate.setDate(this.selectedDate.getDate() - 7);
        } else {
            this.selectedDate.setMonth(this.selectedDate.getMonth() - 1);
        }
        this.render();
    }
    
    private navigateToday(): void {
        this.selectedDate = new Date();
        this.render();
    }
    
    private navigateNext(): void {
        if (this.currentView === 'day') {
            this.selectedDate.setDate(this.selectedDate.getDate() + 1);
        } else if (this.currentView === 'week') {
            this.selectedDate.setDate(this.selectedDate.getDate() + 7);
        } else {
            this.selectedDate.setMonth(this.selectedDate.getMonth() + 1);
        }
        this.render();
    }
    
    private setView(view: 'day' | 'week' | 'month'): void {
        this.currentView = view;
        this.render();
    }
    
    private addEventListeners(): void {
        // Add event listeners for navigation and event clicking
        const prevBtn = this.container?.querySelector('.prev-month');
        const nextBtn = this.container?.querySelector('.next-month');
        
        prevBtn?.addEventListener('click', () => {
            console.log('Previous month clicked');
            // Implement month navigation
        });
        
        nextBtn?.addEventListener('click', () => {
            console.log('Next month clicked');
            // Implement month navigation
        });
        
        // Event delegation for event clicks
        this.container?.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('event-indicator')) {
                const eventId = target.dataset.eventId;
                if (eventId) {
                    console.log('Event clicked:', eventId);
                    // Handle event click
                }
            }
        });
    }
}