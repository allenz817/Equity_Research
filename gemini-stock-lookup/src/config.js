require('dotenv').config();

const config = {
    vertexAI: {
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        location: "us-central1",
        modelId: "gemini-2.0-flash"
    }
};

module.exports = config;