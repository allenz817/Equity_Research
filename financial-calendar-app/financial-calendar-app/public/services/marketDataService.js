var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import { ApiClient } from '../utils/apiClient';
import { EventCategory, EventImpact } from '../models/Event';
export class MarketDataService {
    constructor() {
        this.MARKET_DATA_API = 'https://financial-data-api.com';
        this.API_KEY = process.env.MARKET_DATA_API_KEY || '';
        this.apiClient = new ApiClient(this.MARKET_DATA_API, this.API_KEY);
        this.apiUrl = 'https://api.example.com/marketdata'; // Replace with actual API URL
    }
    fetchMarketData(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios.get(`${this.apiUrl}?symbol=${symbol}`);
                return response.data;
            }
            catch (error) {
                console.error('Error fetching market data:', error);
                throw new Error('Failed to fetch market data');
            }
        });
    }
    fetchAllMarketData(symbols) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = symbols.map(symbol => this.fetchMarketData(symbol));
            return Promise.all(promises);
        });
    }
    getUpcomingEarnings(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const earningsData = yield this.apiClient.get('/earnings', {
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0]
                });
                return earningsData.map(data => this.earningsToEvent(data));
            }
            catch (error) {
                console.error('Failed to fetch upcoming earnings:', error);
                return [];
            }
        });
    }
    getEconomicCalendar(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const economicData = yield this.apiClient.get('/economic-calendar', {
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0]
                });
                return economicData.map(data => this.economicDataToEvent(data));
            }
            catch (error) {
                console.error('Failed to fetch economic calendar:', error);
                return [];
            }
        });
    }
    getIPOs(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ipoData = yield this.apiClient.get('/ipos', {
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
            }
            catch (error) {
                console.error('Failed to fetch IPOs:', error);
                return [];
            }
        });
    }
    getAllEvents(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.apiClient.get(`/events?start=${startDate.toISOString()}&end=${endDate.toISOString()}`);
                return this.processEvents(response.data || []);
            }
            catch (error) {
                console.error('Failed to fetch market events:', error);
                return [];
            }
        });
    }
    processEvents(data) {
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
    earningsToEvent(earnings) {
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
    economicDataToEvent(data) {
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
//# sourceMappingURL=marketDataService.js.map