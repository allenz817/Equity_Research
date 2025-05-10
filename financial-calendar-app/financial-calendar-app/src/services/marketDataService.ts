import axios from 'axios';
import { MarketData } from '../models/MarketData';
import { ApiClient } from '../utils/apiClient';
import { Event, EventCategory, EventImpact } from '../models/Event';
import { EarningsData, EconomicData } from '../models/MarketData';

export class MarketDataService {
    private apiClient: ApiClient;
    private readonly MARKET_DATA_API = 'https://financial-data-api.com';
    private readonly API_KEY = process.env.MARKET_DATA_API_KEY || '';
    private apiUrl: string;

    constructor() {
        this.apiClient = new ApiClient(this.MARKET_DATA_API, this.API_KEY);
        this.apiUrl = 'https://api.example.com/marketdata'; // Replace with actual API URL
    }

    public async fetchMarketData(symbol: string): Promise<MarketData> {
        try {
            const response = await axios.get(`${this.apiUrl}?symbol=${symbol}`);
            return response.data as MarketData;
        } catch (error) {
            console.error('Error fetching market data:', error);
            throw new Error('Failed to fetch market data');
        }
    }

    public async fetchAllMarketData(symbols: string[]): Promise<MarketData[]> {
        const promises = symbols.map(symbol => this.fetchMarketData(symbol));
        return Promise.all(promises);
    }

    async getUpcomingEarnings(startDate: Date, endDate: Date): Promise<Event[]> {
        try {
            const earningsData: EarningsData[] = await this.apiClient.get('/earnings', {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            });
            
            return earningsData.map(data => this.earningsToEvent(data));
        } catch (error) {
            console.error('Failed to fetch upcoming earnings:', error);
            return [];
        }
    }
    
    async getEconomicCalendar(startDate: Date, endDate: Date): Promise<Event[]> {
        try {
            const economicData: EconomicData[] = await this.apiClient.get('/economic-calendar', {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            });
            
            return economicData.map(data => this.economicDataToEvent(data));
        } catch (error) {
            console.error('Failed to fetch economic calendar:', error);
            return [];
        }
    }
    
    async getIPOs(startDate: Date, endDate: Date): Promise<Event[]> {
        try {
            const ipoData: any[] = await this.apiClient.get('/ipos', {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            });
            
            return ipoData.map(ipo => ({
                id: `ipo-${ipo.symbol}`,
                title: `IPO: ${ipo.companyName} (${ipo.symbol})`,
                description: `Initial Public Offering for ${ipo.companyName}. Expected price range: $${ipo.priceRangeLow} - $${ipo.priceRangeHigh}`,
                date: new Date(ipo.expectedDate),
                category: EventCategory.IPO,
                impact: EventImpact.HIGH,
                relatedSymbols: [ipo.symbol],
                source: 'Market Data API'
            }));
        } catch (error) {
            console.error('Failed to fetch IPOs:', error);
            return [];
        }
    }
    
    async getAllEvents(startDate: Date, endDate: Date): Promise<Event[]> {
        try {
            const response = await this.apiClient.get(`/events?start=${startDate.toISOString()}&end=${endDate.toISOString()}`);
            return this.processEvents(response.data || []);
        } catch (error) {
            console.error('Failed to fetch market events:', error);
            return [];
        }
    }
    
    private processEvents(data: any[]): Event[] {
        return data.map(item => ({
            id: item.id || String(Math.random()),
            title: item.title || 'Unnamed Event',
            date: new Date(item.date),
            description: item.description || '',
            category: item.category,
            impact: item.impact,
            relatedSymbols: item.relatedSymbols || []
        }));
    }
    
    private earningsToEvent(earnings: EarningsData): Event {
        return {
            id: `earnings-${earnings.symbol}-${earnings.fiscalQuarter}-${earnings.fiscalYear}`,
            title: `Earnings: ${earnings.companyName} (${earnings.symbol})`,
            description: `${earnings.companyName} reports ${earnings.fiscalQuarter} ${earnings.fiscalYear} earnings. Estimated EPS: $${earnings.estimatedEPS.toFixed(2)}`,
            date: new Date(earnings.reportDate),
            category: EventCategory.EARNINGS,
            impact: EventImpact.HIGH,
            relatedSymbols: [earnings.symbol],
            source: 'Market Data API'
        };
    }
    
    private economicDataToEvent(data: EconomicData): Event {
        const impact = data.importance === 'high' ? EventImpact.HIGH : 
                       data.importance === 'medium' ? EventImpact.MEDIUM : EventImpact.LOW;
                       
        return {
            id: `economic-${data.indicator}-${data.releaseDate.toISOString()}`,
            title: `${data.indicator} (${data.country})`,
            description: `${data.indicator} for ${data.period}. Forecast: ${data.forecast}, Previous: ${data.previous}`,
            date: new Date(data.releaseDate),
            category: EventCategory.ECONOMIC_DATA,
            impact: impact,
            relatedSymbols: [],
            source: 'Market Data API'
        };
    }
}