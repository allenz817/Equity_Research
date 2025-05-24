# Gemini Stock Lookup

This project is a simple application that prompts Gemini in Vertex AI to search for a stock ticker's most recent market cap.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [License](#license)

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
2. Run the application:
   ```
   node src/index.js
   ```
3. Follow the prompts to enter a stock ticker symbol and retrieve the most recent market cap.

## Configuration

The application uses a configuration file located at `src/config.js` to manage API keys and endpoint URLs. Ensure that you have the correct settings before running the application.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.