# Gemini Stock Market Cap Lookup

This project is a web application that uses Google's Gemini AI model in Vertex AI to search for a stock ticker's most recent market capitalization.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [License](#license)

## Features

- Simple web interface for entering stock ticker symbols
- Uses Google's Gemini AI to retrieve current market cap data
- Implements caching to reduce API calls and costs
- Can be deployed on Google Cloud Run for reliable hosting

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/gemini-stock-lookup.git
   ```
2. Navigate to the project directory:
   ```
   cd gemini-stock-lookup
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Create a `.env` file in the root directory and add your API keys and other necessary environment variables. Refer to the `.env.example` for the required variables.
2. Start the web server:
   ```
   node src/index.js
   ```
3. Open your browser to `http://localhost:8080`
4. Enter a stock ticker symbol in the form and click "Get Market Cap"

## Configuration

The application uses a configuration file located at `src/config.js` to manage API keys and endpoint URLs. Ensure that you have the correct settings before running the application.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to Google Cloud Run.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.