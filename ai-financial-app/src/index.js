const axios = require('axios');
require('dotenv').config();
const config = require('./config');
const readline = require('readline');
const { GoogleAuth } = require('google-auth-library');

// Create interface for command line input/output
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function getAuthToken() {
    const auth = new GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/cloud-platform'
    });
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    return token.token;
}

async function getMarketCap(ticker) {
    try {
        console.log(`Fetching market cap data for ${ticker}...`);
        
        // Get authentication token
        const token = await getAuthToken();
        
        const endpoint = `https://${config.vertexAI.location}-aiplatform.googleapis.com/v1/projects/${config.vertexAI.projectId}/locations/${config.vertexAI.location}/publishers/google/models/${config.vertexAI.modelId}:generateContent`;
        
        const payload = {
            contents: [{
                role: "user",
                parts: [{
                    text: `What is the current market capitalization of ${ticker} stock? Please provide ONLY the numerical value in billions of dollars with up to 2 decimal places and the currency symbol (e.g., $902.45B). No other text, explanation, or context.`
                }]
            }],
            generationConfig: {
                temperature: 0.1,
                topP: 0.8,
                topK: 40,
                maxOutputTokens: 100,
            }
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        console.log(`Sending request to: ${endpoint}`);

        const response = await axios.post(
            endpoint,
            payload,
            { headers }
        );

        // Log the full response structure for debugging
        console.log("Response structure:", JSON.stringify(response.data, null, 2));

        // Check if response has the expected structure
        if (response.data && 
            response.data.candidates && 
            response.data.candidates[0] && 
            response.data.candidates[0].content && 
            response.data.candidates[0].content.parts) {
            
            // Find a part that has text content
            const textPart = response.data.candidates[0].content.parts.find(part => part.text);
            
            if (textPart && textPart.text) {
                return textPart.text.trim();
            } else {
                // Handle the case where there are parts but no text (e.g., only thoughts)
                console.log("Response contains parts but no text content:", response.data.candidates[0].content.parts);
                throw new Error('No text content in response');
            }
        } else if (response.data && response.data.predictions && response.data.predictions[0]) {
            // Alternative response format
            return response.data.predictions[0].trim();
        } else {
            console.log("Unexpected response format:", JSON.stringify(response.data, null, 2));
            throw new Error('Invalid response format from Vertex AI');
        }
    } catch (error) {
        console.error('Error details:', error.response?.data || error.message);
        throw new Error(`Failed to fetch market cap: ${error.message}`);
    }
}

function askForTicker() {
    rl.question('Enter a stock ticker symbol (or "exit" to quit): ', async (ticker) => {
        ticker = ticker.trim().toUpperCase();
        
        if (ticker.toLowerCase() === 'exit') {
            console.log('Exiting application. Goodbye!');
            rl.close();
            return;
        }
        
        if (!ticker) {
            console.log('Please provide a valid ticker symbol.');
            askForTicker();
            return;
        }

        try {
            const marketCap = await getMarketCap(ticker);
            console.log(`\nThe current market cap for ${ticker} is: ${marketCap}`);
            
            // Ask for another ticker
            console.log('\n----------------------------------------');
            askForTicker();
        } catch (error) {
            console.error('\nError:', error.message);
            console.log('\n----------------------------------------');
            askForTicker();
        }
    });
}

// Main function
function main() {
    console.log('=== Gemini Stock Market Cap Lookup ===');
    console.log('This application uses Google\'s Gemini model to fetch the latest market cap for any stock ticker.');
    console.log('----------------------------------------\n');
    
    askForTicker();
}

// Start the application
main();