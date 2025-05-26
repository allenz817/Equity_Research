# Google Cloud Run Deployment Guide

This guide will help you deploy your Stock Market Cap app to Google Cloud Run.

## Prerequisites

1. Google Cloud SDK installed on your machine
2. Docker installed on your machine
3. Google Cloud project with billing enabled
4. Vertex AI API enabled in your Google Cloud project

## Step 1: Authenticate with Google Cloud

```powershell
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

Replace `YOUR_PROJECT_ID` with your actual Google Cloud project ID.

## Step 2: Build and Push the Docker Image

```powershell
# Navigate to your app directory
cd "path\to\your\ai-financial-app"

# Build the Docker image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/stock-market-cap
```

Replace `YOUR_PROJECT_ID` with your actual Google Cloud project ID.

## Step 3: Deploy to Cloud Run

```powershell
# Create a service account for your app (if not already created)
gcloud iam service-accounts create stock-app-sa --display-name="Stock App Service Account"

# Grant the service account access to Vertex AI
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID `
  --member="serviceAccount:stock-app-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" `
  --role="roles/aiplatform.user"

# Deploy to Cloud Run
gcloud run deploy stock-market-cap `
  --image gcr.io/YOUR_PROJECT_ID/stock-market-cap `
  --platform managed `
  --region us-central1 `
  --allow-unauthenticated `
  --service-account=stock-app-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com `
  --set-env-vars="GOOGLE_CLOUD_PROJECT_ID=YOUR_PROJECT_ID"
```

Replace `YOUR_PROJECT_ID` with your actual Google Cloud project ID.

## Step 4: Set Up Secret for Service Account Key

```powershell
# Create a secret for your service account key
gcloud secrets create gemini-api-key --data-file="PATH_TO_YOUR_SERVICE_ACCOUNT_KEY.json"

# Grant the Cloud Run service account access to the secret
gcloud secrets add-iam-policy-binding gemini-api-key `
  --member="serviceAccount:stock-app-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" `
  --role="roles/secretmanager.secretAccessor"

# Update the Cloud Run service to use the secret
gcloud run services update stock-market-cap `
  --update-secrets="GOOGLE_APPLICATION_CREDENTIALS=/secrets/gemini-key.json:gemini-api-key:latest"
```

Replace:
- `PATH_TO_YOUR_SERVICE_ACCOUNT_KEY.json` with the path to your service account key JSON file
- `YOUR_PROJECT_ID` with your actual Google Cloud project ID

## Step 5: Access Your Deployed App

After deployment, you'll get a URL for your app. Visit this URL to use your Stock Market Cap lookup app.

## Cost Optimization

- The app includes caching to reduce API calls to Vertex AI
- Cloud Run only charges when your app is handling requests
- The app will automatically scale to zero when not in use

### Estimated Costs

- **Cloud Run**: 
  - Free tier: 2 million requests per month, 360,000 GB-seconds of memory, 180,000 vCPU-seconds
  - Beyond free tier: $0.00002400 per vCPU-second, $0.00000250 per GB-second
  - A small app like this will likely stay within free tier for personal use

- **Vertex AI (Gemini API)**:
  - ~$0.00025 per 1K input tokens
  - ~$0.00075 per 1K output tokens
  - Each query uses approximately 60 tokens total (~$0.000019 per query)
  - Caching reduces this cost significantly

- **Total Monthly Estimate**:
  - Low usage (100 queries/day): $0-5 per month
  - Medium usage (1,000 queries/day): $5-15 per month

## Monitoring

- Set up a budget alert in Google Cloud Console
- Monitor your app's performance in Cloud Run dashboard
