export class DateFormatter {
    static formatDate(date: Date): string {
        return date.toLocaleDateString();
    }

    static formatDateTime(date: Date): string {
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    static formatTimeAgo(date: Date): string {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        
        const diffSecs = Math.floor(diffMs / 1000);
        if (diffSecs < 60) {
            return `${diffSecs} seconds ago`;
        }
        
        const diffMins = Math.floor(diffSecs / 60);
        if (diffMins < 60) {
            return `${diffMins} minutes ago`;
        }
        
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) {
            return `${diffHours} hours ago`;
        }
        
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} days ago`;
    }
    
    static getWeekRange(date: Date): { start: Date, end: Date } {
        const startDate = new Date(date);
        startDate.setDate(date.getDate() - date.getDay());
        
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        
        return { start: startDate, end: endDate };
    }
    
    static getMonthRange(date: Date): { start: Date, end: Date } {
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return { start: startDate, end: endDate };
    }
}