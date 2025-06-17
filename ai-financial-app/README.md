# Financial Statement Extractor

This application uses Google's Gemini AI to extract financial statement data from uploaded documents (PDFs, images) and generates formatted Excel reports containing Income Statement, Balance Sheet, and Cash Flow data.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [License](#license)

## Features

- 📄 **Multi-format Support**: Upload PDFs, PNG, JPG, JPEG files
- 🤖 **AI-Powered Extraction**: Uses Google Gemini AI to extract financial data
- 📊 **Excel Generation**: Automatically creates formatted Excel reports
- 💻 **Modern Web Interface**: Drag-and-drop file upload with real-time preview
- 🔍 **Data Validation**: Intelligent parsing and validation of extracted data
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/financial-statement-extractor.git
   cd financial-statement-extractor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env file with your Gemini API key
   ```

## Usage

1. **Start the application**:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

2. **Open your browser** to `http://localhost:3000`

3. **Upload a document**:
   - Drag and drop or click to browse
   - Select PDF or image files containing financial statements
   - Maximum file size: 10MB

4. **Extract data**:
   - Click "Extract Financial Data"
   - AI will analyze the document and extract financial information
   - Preview the results in organized tables

5. **Download Excel report**:
   - Click "Download Excel Report" to get formatted spreadsheet
   - Report includes separate sheets for Income Statement, Balance Sheet, and Cash Flow

## Configuration

Create a `.env` file with the following variables:

```env
# Required: Google Gemini API Key
GEMINI_API_KEY=your-gemini-api-key-here

# Optional: Server configuration
PORT=3000
NODE_ENV=development
```

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

## API Endpoints

### Extract Financial Data
```
POST /api/extract/financial-data
Content-Type: multipart/form-data

Body: file (PDF, PNG, JPG, JPEG)
Response: {
  "success": true,
  "data": {
    "incomeStatement": {...},
    "balanceSheet": {...},
    "cashFlow": {...},
    "period": "Q3 2024"
  },
  "excelFile": "filename.xlsx"
}
```

### Download Excel Report
```
GET /api/extract/download/:filename
Response: Excel file download
```

### Check API Status
```
GET /api/extract/status
Response: {
  "status": "active",
  "message": "Financial Statement Extractor API is running"
}
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to Google Cloud Run.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.