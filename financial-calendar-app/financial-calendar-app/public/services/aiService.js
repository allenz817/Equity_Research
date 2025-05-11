var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiClient } from '../utils/apiClient';
import { EventCategory, EventImpact } from '../models/Event';
export class AiService {
    constructor() {
        this.AI_MODEL_ENDPOINT = '/api/ai/analyze';
        // Initialize with your AI API endpoint and key
        this.apiClient = new ApiClient('https://your-ai-service.com', process.env.AI_API_KEY || '');
    }
    getMarketEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.apiClient.get('/market-events');
                return this.processEvents(response.data);
            }
            catch (error) {
                console.error('Error fetching market events:', error);
                throw error;
            }
        });
    }
    processEvents(data) {
        return data.map((item) => ({
            id: item.id,
            title: item.title,
            date: new Date(item.date),
            description: item.description,
        }));
    }
    analyzeMarketImpact(eventDescription) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.apiClient.post(this.AI_MODEL_ENDPOINT, {
                    text: eventDescription,
                    analysisType: 'market_impact'
                });
                return {
                    category: result.category,
                    impact: result.impact,
                    relatedSymbols: result.relatedSymbols || []
                };
            }
            catch (error) {
                console.error('Failed to analyze market impact:', error);
                return {
                    category: EventCategory.CUSTOM,
                    impact: EventImpact.MEDIUM,
                    relatedSymbols: []
                };
            }
        });
    }
    generateEventSummary(eventData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.apiClient.post(`${this.AI_MODEL_ENDPOINT}/summary`, {
                    eventData
                });
                return result.summary;
            }
            catch (error) {
                console.error('Failed to generate event summary:', error);
                return 'No summary available';
            }
        });
    }
    predictMarketReaction(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.apiClient.post(`${this.AI_MODEL_ENDPOINT}/predict`, {
                    event
                });
                return {
                    prediction: result.prediction,
                    confidence: result.confidence
                };
            }
            catch (error) {
                console.error('Failed to predict market reaction:', error);
                return {
                    prediction: 'Unable to predict market reaction',
                    confidence: 0
                };
            }
        });
    }
}
//# sourceMappingURL=aiService.js.map