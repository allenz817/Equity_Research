import { VERTEX_AI_ENDPOINT, getAccessToken } from '../../config/api.config.js';

export const fetchFinancialStatements = async (companySymbol) => {
    try {
        const prompt = `Please provide the latest financial statements for ${companySymbol}. Include:
        - Income Statement (Revenue, Net Income, EPS)
        - Balance Sheet (Total Assets, Total Liabilities, Shareholders Equity)
        - Cash Flow Statement (Operating Cash Flow, Free Cash Flow)
        
        Return the data in JSON format with the structure:
        {
            "company": "${companySymbol}",
            "incomeStatement": {
                "revenue": "value",
                "netIncome": "value",
                "eps": "value"
            },
            "balanceSheet": {
                "totalAssets": "value",
                "totalLiabilities": "value",
                "shareholdersEquity": "value"
            },
            "cashFlowStatement": {
                "operatingCashFlow": "value",
                "freeCashFlow": "value"
            }
        }`;

        const accessToken = await getAccessToken();
        
        const response = await fetch(VERTEX_AI_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    role: 'user',
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.1,
                    topP: 0.8,
                    topK: 40,
                    maxOutputTokens: 2048,
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid response format from Vertex AI');
        }
        
        const content = data.candidates[0].content.parts[0].text;
        
        // Parse JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        
        throw new Error('No valid JSON found in response');
    } catch (error) {
        console.error('Error fetching financial statements:', error);
        throw error;
    }
};