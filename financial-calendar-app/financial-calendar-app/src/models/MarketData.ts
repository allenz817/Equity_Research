export interface MarketData {
    symbol: string;
    name: string;
    currentPrice: number;
    changePercent: number;
    lastUpdated: Date;
}

export interface EarningsData {
    companyName: string;
    symbol: string;
    fiscalQuarter: string;
    fiscalYear: string;
    reportDate: Date;
    estimatedEPS: number;
    actualEPS?: number;
    surprise?: number;
}

export interface EconomicData {
    indicator: string;
    period: string;
    actual?: number;
    forecast?: number;
    previous?: number;
    country: string;
    releaseDate: Date;
    importance: 'high' | 'medium' | 'low';
}