const axios = require('axios');
require('dotenv').config();
const config = require('./config');
const express = require('express');
const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Create Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Simple in-memory cache
const cache = {};
const CACHE_TTL = 3600000; // 1 hour in milliseconds

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

async function getMarketCapWithCache(ticker) {
    // Check if we have a fresh cached value
    if (cache[ticker] && cache[ticker].timestamp > Date.now() - CACHE_TTL) {
        console.log("Using cached result for " + ticker);
        return cache[ticker].value;
    }
    
    // Otherwise, fetch from API
    const marketCap = await getMarketCap(ticker);
    
    // Update cache
    cache[ticker] = {
        value: marketCap,
        timestamp: Date.now()
    };
    
    return marketCap;
}

async function getMarketCap(ticker) {
    try {
        console.log("Fetching market data for " + ticker);
        
        // Get authentication token
        const token = await getAuthToken();
        
        const endpoint = "https://" + config.vertexAI.location + "-aiplatform.googleapis.com/v1/projects/" + config.vertexAI.projectId + "/locations/" + config.vertexAI.location + "/publishers/google/models/" + config.vertexAI.modelId + ":generateContent";
        
        const payload = {
            contents: [{
                role: "user",
                parts: [{
                    text: "What is the current market capitalization and share price of " + ticker + "? Format your response in plain text with just the numbers. For example: Market Cap: $2.5 trillion, Share Price: $180.95"
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
            'Authorization': 'Bearer ' + token
        };

        console.log("Sending request to: " + endpoint);

        const response = await axios.post(
            endpoint,
            payload,
            { headers }
        );

        // Log the full response structure for debugging
        console.log("Response structure:", JSON.stringify(response.data, null, 2));

        // Process different response formats
        if (response.data && 
            response.data.candidates && 
            response.data.candidates[0] && 
            response.data.candidates[0].content && 
            response.data.candidates[0].content.parts) {
            
            console.log("Response has expected structure with candidates");
            
            // Find a part that has text content
            const textPart = response.data.candidates[0].content.parts.find(part => part.text);
            
            if (textPart && textPart.text) {
                const textResponse = textPart.text.trim();
                console.log("Raw text response:", textResponse);
                
                try {
                    // Try to parse the response as JSON
                    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        const jsonStr = jsonMatch[0];
                        console.log("Extracted JSON string:", jsonStr);
                        const data = JSON.parse(jsonStr);
                        
                        // Validate the required fields
                        if (data.marketCap && data.sharePrice && data.timestamp) {
                            console.log("Successfully parsed valid JSON with all fields");
                            return data;
                        } else {
                            console.log("JSON response missing required fields:", data);
                            // Return a partial response if possible
                            return { 
                                marketCap: data.marketCap || "N/A",
                                sharePrice: data.sharePrice || "N/A",
                                timestamp: data.timestamp || new Date().toLocaleString()
                            };
                        }
                    } else {
                        console.log("Response doesn't contain JSON, treating as plain text");
                        // If it's not JSON, just return the text response for backward compatibility
                        return { 
                            marketCap: textResponse,
                            sharePrice: "N/A",
                            timestamp: new Date().toLocaleString()
                        };
                    }
                } catch (parseError) {
                    console.log("Failed to parse JSON from response:", parseError.message);
                    return { 
                        marketCap: textResponse,
                        sharePrice: "N/A",
                        timestamp: new Date().toLocaleString()
                    };
                }
            } else if (response.data.candidates[0].content.parts.find(part => part.thought)) {
                // Handle the case where there's only thought content
                console.log("Response contains only thought content");
                throw new Error('Model returned only thinking process, no usable response');
            } else {
                // Handle other unexpected content formats
                console.log("Response contains parts but no text content:", response.data.candidates[0].content.parts);
                throw new Error('No text content in response');
            }
        } else if (response.data && response.data.predictions && response.data.predictions[0]) {
            // Alternative response format
            return {
                marketCap: response.data.predictions[0].trim(),
                sharePrice: "N/A",
                timestamp: new Date().toLocaleString()
            };
        } else {
            console.log("Unexpected response format:", JSON.stringify(response.data, null, 2));
            throw new Error('Invalid response format from Vertex AI');
        }
    } catch (error) {
        console.error('Error details:', error.response?.data || error.message);
        throw new Error('Failed to fetch market cap: ' + error.message);
    }
}

// API endpoint to get market cap
app.get('/api/marketcap/:ticker', async (req, res) => {
    try {
        const ticker = req.params.ticker.toUpperCase();
        if (!ticker) {
            return res.status(400).json({ error: 'Ticker symbol is required' });
        }
        
        const marketCap = await getMarketCapWithCache(ticker);
        res.json({ ticker, marketCap });
    } catch (error) {
        console.error('Server Error:', error.message, error.stack);
        res.status(500).json({ error: error.message });
    }
});

// Serve HTML files without template literals
app.get('/', (req, res) => {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Stock Market Cap Lookup</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
            line-height: 1.6;
        }
        h1 { 
            color: #333;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        .container {
            background: #f9f9f9;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        input[type="text"] {
            padding: 8px;
            width: 200px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        button {
            background: #4285f4;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background: #3367d6;
        }
        .result { 
            margin-top: 20px; 
            font-size: 24px;
            font-weight: bold;
        }
        .loading {
            color: #666;
        }
        .error {
            color: #d32f2f;
        }
        .details {
            margin-top: 10px;
            font-size: 16px;
            color: #666;
        }
        .details p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <h1>Stock Market Cap Lookup</h1>
    <div class="container">
        <p>Enter a stock ticker symbol to get its current market capitalization.</p>
        <form id="lookup-form">
            <input type="text" id="ticker" placeholder="Enter ticker (e.g., AAPL)" required>
            <button type="submit">Get Market Cap</button>
        </form>
        <div class="result" id="result"></div>
        <div class="details" id="details"></div>
    </div>
    
    <script>
        document.getElementById('lookup-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const ticker = document.getElementById('ticker').value.trim();
            if (!ticker) return;
            
            const resultElement = document.getElementById('result');
            const detailsElement = document.getElementById('details');
            resultElement.className = 'result loading';
            resultElement.textContent = 'Loading...';
            detailsElement.textContent = '';
            
            fetch('/api/marketcap/' + ticker)
                .then(function(response) {
                    if (!response.ok) {
                        return response.json().then(function(errorData) {
                            throw new Error('Failed to fetch data: ' + errorData.error);
                        }).catch(function() {
                            throw new Error('Failed to fetch data: ' + response.status);
                        });
                    }
                    return response.json();
                })
                .then(function(data) {
                    resultElement.className = 'result';
                    
                    // Add debugging
                    console.log("Response data:", JSON.stringify(data));
                    
                    // Check if marketCap is already the object or if it's nested
                    const marketCapInfo = typeof data.marketCap === 'object' ? data.marketCap : data.marketCap;
                    
                    resultElement.textContent = 'The current market cap for ' + data.ticker + ' is: ' + 
                        (marketCapInfo.marketCap || marketCapInfo);
                    
                    // Only show details if we have them
                    if (marketCapInfo.sharePrice && marketCapInfo.timestamp) {
                        detailsElement.innerHTML = 
                            '<p>Share Price: ' + marketCapInfo.sharePrice + '</p>' +
                            '<p>Last Updated: ' + marketCapInfo.timestamp + '</p>';
                    } else {
                        detailsElement.innerHTML = '<p>Last Updated: ' + new Date().toLocaleString() + '</p>';
                    }
                })
                .catch(function(error) {
                    resultElement.className = 'result error';
                    resultElement.textContent = 'Error: ' + error.message;
                    detailsElement.textContent = '';
                });
        });
    </script>
</body>
</html>
    `;
    
    res.send(htmlContent);
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log("=== Gemini Stock Market Cap Lookup ===");
    console.log("Server running on port " + PORT);
    console.log("Local access: http://localhost:" + PORT);
    
    // Get the machine's IP address
    let ipAddress = "YOUR_IP_ADDRESS";
    try {
        const interfaces = os.networkInterfaces();
        // Find the first non-internal IPv4 address
        for (const name of Object.keys(interfaces)) {
            for (const iface of interfaces[name]) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    ipAddress = iface.address;
                    break;
                }
            }
            if (ipAddress !== "YOUR_IP_ADDRESS") break;
        }
    } catch (err) {
        console.log("Could not determine IP address:", err.message);
    }
    
    console.log("Network access: http://" + ipAddress + ":" + PORT);
});