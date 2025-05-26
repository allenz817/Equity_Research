// Test utility to directly call the Vertex AI API and display the response
require('dotenv').config();
const axios = require('axios');
const { GoogleAuth } = require('google-auth-library');
const config = require('./config');

async function getAuthToken() {
    try {
        console.log("Getting authentication token...");
        console.log("Project ID:", process.env.GOOGLE_CLOUD_PROJECT_ID);
        console.log("Credentials path:", process.env.GOOGLE_APPLICATION_CREDENTIALS);
        
        const auth = new GoogleAuth({
            scopes: 'https://www.googleapis.com/auth/cloud-platform'
        });
        const client = await auth.getClient();
        const token = await client.getAccessToken();
        console.log("Token obtained successfully");
        return token.token;
    } catch (error) {
        console.error("Auth error:", error.message);
        throw error;
    }
}

async function testGeminiAPI(ticker) {
    try {
        console.log(`Testing Gemini API with ticker: ${ticker}`);
        
        // Get authentication token
        const token = await getAuthToken();
        
        const endpoint = `https://${config.vertexAI.location}-aiplatform.googleapis.com/v1/projects/${config.vertexAI.projectId}/locations/${config.vertexAI.location}/publishers/google/models/${config.vertexAI.modelId}:generateContent`;
        
        const payload = {
            contents: [{
                role: "user",
                parts: [{
                    text: `Provide the current market capitalization and share price of ${ticker} stock. ` +
                    "Format your response as a valid JSON object with these exact keys: " +
                    "{ " +
                    '  "marketCap": "the market cap with currency symbol", ' +
                    '  "sharePrice": "the current share price with currency symbol", ' +
                    '  "timestamp": "current date and time" ' +
                    "} " +
                    "Only return the JSON object with no additional text or explanation."
                }]
            }],
            generationConfig: {
                temperature: 0.1,
                topP: 0.8,
                topK: 40,
                maxOutputTokens: 200,
            }
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        console.log("Sending request to:", endpoint);

        const response = await axios.post(
            endpoint,
            payload,
            { headers }
        );

        console.log("\n=== FULL RESPONSE ===");
        console.log(JSON.stringify(response.data, null, 2));
        
        if (response.data && 
            response.data.candidates && 
            response.data.candidates[0] && 
            response.data.candidates[0].content && 
            response.data.candidates[0].content.parts) {
            
            const textPart = response.data.candidates[0].content.parts.find(part => part.text);
            
            if (textPart && textPart.text) {
                console.log("\n=== RAW TEXT RESPONSE ===");
                console.log(textPart.text);
                
                try {
                    // Try to parse the response as JSON
                    const jsonMatch = textPart.text.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        const jsonStr = jsonMatch[0];
                        console.log("\n=== EXTRACTED JSON ===");
                        console.log(jsonStr);
                        
                        const data = JSON.parse(jsonStr);
                        console.log("\n=== PARSED JSON ===");
                        console.log(data);
                    }
                } catch (error) {
                    console.error("Failed to parse JSON:", error.message);
                }
            }
        }
        
        console.log("\n=== TEST COMPLETE ===");
        
    } catch (error) {
        console.error("API Test Error:", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        }
    }
}

// Get ticker from command line or use default
const ticker = process.argv[2] || "AAPL";
testGeminiAPI(ticker);
