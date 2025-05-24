export const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
export const API_KEY = process.env.GEMINI_API_KEY || 'your-gemini-api-key-here';

// Gemini model configuration
export const GEMINI_MODEL = 'gemini-pro';
export const GEMINI_ENDPOINT = `${API_BASE_URL}/models/${GEMINI_MODEL}:generateContent`;

export const PROJECT_ID = process.env.VERTEX_AI_PROJECT_ID || 'your-project-id';
export const LOCATION = process.env.VERTEX_AI_LOCATION || 'us-central1';
export const MODEL_ID = 'gemini-pro';

// Vertex AI endpoint
export const VERTEX_AI_ENDPOINT = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}:generateContent`;

// Authentication token (you'll need to implement token generation)
export const getAccessToken = async () => {
    // This will need to be implemented based on your authentication method
    // Options: Service Account Key, OAuth, Application Default Credentials
    return process.env.VERTEX_AI_ACCESS_TOKEN;
};