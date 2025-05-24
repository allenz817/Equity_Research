const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');
require('dotenv').config();

async function listModels() {
    try {
        const auth = new GoogleAuth({
            scopes: 'https://www.googleapis.com/auth/cloud-platform'
        });
        
        const client = await auth.getClient();
        const token = await client.getAccessToken();
        
        const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
        const location = "us-central1";
        
        const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models`;
        
        const response = await axios.get(endpoint, {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        });
        
        console.log("Available models:");
        response.data.models.forEach(model => {
            console.log(`- ${model.name}`);
        });
    } catch (error) {
        console.error("Error listing models:", error.response?.data || error.message);
    }
}

listModels();