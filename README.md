# Equity Research Toolkit

A collection of financial analysis tools featuring an AI-powered stock lookup application.

## 🚀 AI Financial App

Web application that uses Google's Gemini AI to fetch real-time stock market data.

### Quick Start
```bash
cd ai-financial-app
npm install
npm start
```

Access at: http://localhost:8080

### Features
- Real-time market cap and share price lookup
- AI-powered via Google Vertex AI (Gemini 2.0)
- 1-hour caching to reduce API costs
- Network accessible for sharing

### Setup
Create `.env` file:
```
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
```

### Deployment
See [`ai-financial-app/DEPLOYMENT.md`](ai-financial-app/DEPLOYMENT.md) for Google Cloud Run deployment.

## 📊 Other Tools
- `comps_table.v1.py` - Comparables analysis
- `price_chart.py` - Stock visualization  
- `ss/YF_Scraping_Basic.ipynb` - Yahoo Finance scraping
- `poe-financialterminal/` - Web terminal interfaces

## Tech Stack
Node.js • Express • Google Vertex AI • Python • Jupyter
