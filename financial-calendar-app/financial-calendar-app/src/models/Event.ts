export enum EventCategory {
    EARNINGS = 'earnings',
    ECONOMIC = 'economic',
    FED = 'fed',
    IPO = 'ipo',
    DIVIDEND = 'dividend',
    CONFERENCE = 'conference',
    CUSTOM = 'custom'
}

export enum EventImpact {
    HIGH = 'high',
    MEDIUM = 'medium',
    LOW = 'low'
}

export interface Event {
    id: string;
    title: string;
    date: Date;
    description: string;
    category?: EventCategory;
    impact?: EventImpact;
    relatedSymbols?: string[];
    summary?: string;
}