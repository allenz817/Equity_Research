const { VertexAI } = require('@google-cloud/vertexai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIExtractionService {
    constructor() {
        this.useVertexAI = false;
        this.vertexModel = null;
        this.directModel = null;
        
        // Initialize direct Gemini API first (since Vertex AI has access issues)
        if (process.env.GEMINI_API_KEY) {
            try {
                this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                this.directModel = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                console.log('✅ Direct Gemini API initialized successfully');
            } catch (error) {
                console.log('❌ Direct Gemini API initialization failed:', error.message);
            }
        }
        
        // Try Vertex AI as secondary option (currently has model access issues)
        try {
            if (process.env.GOOGLE_CLOUD_PROJECT_ID && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
                this.vertexAI = new VertexAI({
                    project: process.env.GOOGLE_CLOUD_PROJECT_ID,
                    location: 'us-central1'
                });
                
                this.vertexModel = this.vertexAI.getGenerativeModel({
                    model: 'gemini-1.5-flash'
                });
                console.log('✅ Vertex AI initialized (will test access on first use)');
            }
        } catch (error) {
            console.log('❌ Vertex AI initialization failed:', error.message);
        }
        
        // Check if at least one API is available
        if (!this.vertexModel && !this.directModel) {
            throw new Error('❌ Neither Vertex AI nor direct Gemini API could be initialized. Please check your API keys.');
        }
        
        // Use direct API by default to avoid Vertex AI access issues
        if (this.directModel) {
            console.log('🚀 Using Direct Gemini API as primary method');
            this.useVertexAI = false;
        } else if (this.vertexModel) {
            console.log('🚀 Using Vertex AI as primary method');
            this.useVertexAI = true;
        }
    }async extractFinancialData(fileBuffer, fileType, isText = false) {
        try {
            const prompt = `
                Extract financial statement data from this document. 
                Focus on:
                - Income Statement (Revenue, Total Revenue, Cost of Revenue, Gross Profit, Operating Expenses, Operating Income, Net Income, EPS)
                - Balance Sheet (Total Assets, Current Assets, Total Liabilities, Current Liabilities, Shareholders Equity, Cash and Cash Equivalents)
                - Cash Flow Statement (Operating Cash Flow, Investing Cash Flow, Financing Cash Flow, Free Cash Flow)
                
                Return the data in JSON format with this exact structure:
                {
                  "incomeStatement": {
                    "Revenue": number,
                    "Cost of Revenue": number,
                    "Gross Profit": number,
                    "Operating Expenses": number,
                    "Operating Income": number,
                    "Net Income": number,
                    "EPS": number
                  },
                  "balanceSheet": {
                    "Total Assets": number,
                    "Current Assets": number,
                    "Cash and Cash Equivalents": number,
                    "Total Liabilities": number,
                    "Current Liabilities": number,
                    "Shareholders Equity": number
                  },
                  "cashFlow": {
                    "Operating Cash Flow": number,
                    "Investing Cash Flow": number,
                    "Financing Cash Flow": number,
                    "Free Cash Flow": number
                  },
                  "period": "string describing the period (e.g., Q3 2024, FY 2023)"
                }
                
                Extract numerical values only (no currency symbols, convert to millions if needed).
                If a value is not found, use 0.
                Make sure to return valid JSON only.
            `;

            let result;
            
            if (this.useVertexAI) {
                // Use Vertex AI
                if (isText) {
                    const textContent = fileBuffer.toString('utf-8');
                    const request = {
                        contents: [{
                            role: 'user',
                            parts: [{ text: `${prompt}\n\nDocument content:\n${textContent}` }]
                        }]
                    };
                    result = await this.vertexModel.generateContent(request);
                } else if (fileType.startsWith('image/')) {
                    const request = {
                        contents: [{
                            role: 'user',
                            parts: [
                                { text: prompt },
                                {
                                    inlineData: {
                                        data: fileBuffer.toString('base64'),
                                        mimeType: fileType
                                    }
                                }
                            ]
                        }]
                    };
                    result = await this.vertexModel.generateContent(request);
                } else {
                    throw new Error('Unsupported file type for AI processing');
                }
                
                const response = await result.response;
                const text = response.candidates[0].content.parts[0].text;
                return this.parseAIResponse(text);
                
            } else {
                // Use direct Gemini API
                if (isText) {
                    const textContent = fileBuffer.toString('utf-8');
                    result = await this.directModel.generateContent(`${prompt}\n\nDocument content:\n${textContent}`);
                } else if (fileType.startsWith('image/')) {
                    result = await this.directModel.generateContent([
                        prompt,
                        {
                            inlineData: {
                                data: fileBuffer.toString('base64'),
                                mimeType: fileType
                            }
                        }
                    ]);
                } else {
                    throw new Error('Unsupported file type for AI processing');
                }
                
                const response = await result.response;
                const text = response.text();
                return this.parseAIResponse(text);
            }
              } catch (error) {
            console.error('❌ AI extraction error:', error.message);
            
            // If using Vertex AI and it fails, try direct API
            if (this.useVertexAI && this.directModel) {
                console.log('🔄 Vertex AI failed, switching to direct Gemini API...');
                try {
                    // Temporarily switch to direct API for this request
                    const originalUseVertexAI = this.useVertexAI;
                    this.useVertexAI = false;
                    
                    const result = await this.extractFinancialData(fileBuffer, fileType, isText);
                    
                    // Restore original setting
                    this.useVertexAI = originalUseVertexAI;
                    
                    return result;
                } catch (fallbackError) {
                    console.error('❌ Direct API fallback also failed:', fallbackError.message);
                    throw new Error(`Both AI services failed. Vertex AI: ${error.message}, Direct API: ${fallbackError.message}`);
                }
            }
            
            throw new Error(`AI extraction failed: ${error.message}`);
        }
    }

    parseAIResponse(text) {
        try {
            // Clean up the response and extract JSON
            let jsonText = text.trim();
            
            // Remove any markdown code block formatting
            jsonText = jsonText.replace(/```json\s*|\s*```/g, '');
            jsonText = jsonText.replace(/```\s*|\s*```/g, '');
            
            // Find JSON object in the response
            const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return this.validateAndCleanData(parsed);
            }
            
            // Fallback: return empty structure
            return this.getEmptyStructure();
        } catch (error) {
            console.error('JSON parsing error:', error);
            console.log('AI Response text:', text);
            return this.getEmptyStructure();
        }
    }

    validateAndCleanData(data) {
        const cleanedData = {
            incomeStatement: {},
            balanceSheet: {},
            cashFlow: {},
            period: data.period || 'Unknown Period'
        };

        // Clean income statement
        const incomeKeys = ['Revenue', 'Cost of Revenue', 'Gross Profit', 'Operating Expenses', 'Operating Income', 'Net Income', 'EPS'];
        incomeKeys.forEach(key => {
            cleanedData.incomeStatement[key] = this.cleanNumber(data.incomeStatement?.[key]) || 0;
        });

        // Clean balance sheet
        const balanceKeys = ['Total Assets', 'Current Assets', 'Cash and Cash Equivalents', 'Total Liabilities', 'Current Liabilities', 'Shareholders Equity'];
        balanceKeys.forEach(key => {
            cleanedData.balanceSheet[key] = this.cleanNumber(data.balanceSheet?.[key]) || 0;
        });

        // Clean cash flow
        const cashFlowKeys = ['Operating Cash Flow', 'Investing Cash Flow', 'Financing Cash Flow', 'Free Cash Flow'];
        cashFlowKeys.forEach(key => {
            cleanedData.cashFlow[key] = this.cleanNumber(data.cashFlow?.[key]) || 0;
        });

        return cleanedData;
    }

    cleanNumber(value) {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            // Remove currency symbols, commas, and convert to number
            const cleaned = value.replace(/[$,\s]/g, '');
            const num = parseFloat(cleaned);
            return isNaN(num) ? 0 : num;
        }
        return 0;
    }

    getEmptyStructure() {
        return {
            incomeStatement: {
                'Revenue': 0,
                'Cost of Revenue': 0,
                'Gross Profit': 0,
                'Operating Expenses': 0,
                'Operating Income': 0,
                'Net Income': 0,
                'EPS': 0
            },
            balanceSheet: {
                'Total Assets': 0,
                'Current Assets': 0,
                'Cash and Cash Equivalents': 0,
                'Total Liabilities': 0,
                'Current Liabilities': 0,
                'Shareholders Equity': 0
            },
            cashFlow: {
                'Operating Cash Flow': 0,
                'Investing Cash Flow': 0,
                'Financing Cash Flow': 0,
                'Free Cash Flow': 0
            },
            period: 'No data extracted'
        };
    }
}

module.exports = AIExtractionService;
