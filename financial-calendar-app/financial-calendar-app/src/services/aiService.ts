import { ApiClient } from '../utils/apiClient';
import { Event, EventCategory, EventImpact } from '../models/Event';

export class AiService {
    private apiClient: ApiClient;
    private readonly AI_MODEL_ENDPOINT = '/api/ai/analyze';
    
    constructor() {
        // Initialize with your AI API endpoint and key
        this.apiClient = new ApiClient('https://your-ai-service.com', process.env.AI_API_KEY || '');
    }

    public async getMarketEvents(): Promise<Event[]> {
        try {
            const response = await this.apiClient.get('/market-events');
            return this.processEvents(response.data);
        } catch (error) {
            console.error('Error fetching market events:', error);
            throw error;
        }
    }

    private processEvents(data: any): Event[] {
        return data.map((item: any) => ({
            id: item.id,
            title: item.title,
            date: new Date(item.date),
            description: item.description,
        }));
    }
    
    async analyzeMarketImpact(eventDescription: string): Promise<{
        category: EventCategory,
        impact: EventImpact,
        relatedSymbols: string[]
    }> {
        try {
            const result = await this.apiClient.post(this.AI_MODEL_ENDPOINT, {
                text: eventDescription,
                analysisType: 'market_impact'
            });
            
            return {
                category: result.category,
                impact: result.impact,
                relatedSymbols: result.relatedSymbols || []
            };
        } catch (error) {
            console.error('Failed to analyze market impact:', error);
            return {
                category: EventCategory.CUSTOM,
                impact: EventImpact.MEDIUM,
                relatedSymbols: []
            };
        }
    }
    
    async generateEventSummary(eventData: Partial<Event>): Promise<string> {
        try {
            const result = await this.apiClient.post(`${this.AI_MODEL_ENDPOINT}/summary`, {
                eventData
            });
            
            return result.summary;
        } catch (error) {
            console.error('Failed to generate event summary:', error);
            return 'No summary available';
        }
    }
    
    async predictMarketReaction(event: Event): Promise<{
        prediction: string,
        confidence: number
    }> {
        try {
            const result = await this.apiClient.post(`${this.AI_MODEL_ENDPOINT}/predict`, {
                event
            });
            
            return {
                prediction: result.prediction,
                confidence: result.confidence
            };
        } catch (error) {
            console.error('Failed to predict market reaction:', error);
            return {
                prediction: 'Unable to predict market reaction',
                confidence: 0
            };
        }
    }
}