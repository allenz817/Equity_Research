import os
import json
from dotenv import load_dotenv
from google.cloud import aiplatform
from vertexai.preview.generative_models import GenerativeModel

# Load environment variables from .env file
load_dotenv()

# Configure Google Cloud authentication
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT")
LOCATION = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")

# Initialize Vertex AI
aiplatform.init(project=PROJECT_ID, location=LOCATION)

def fetch_stock_data_with_gemini(ticker):
    """Use Gemini via Vertex AI to fetch financial data for a given ticker"""
    
    try:
        # Initialize the model - using the fully qualified model name
        model = GenerativeModel("gemini-1.5-pro")  # Updated model name format
        
        prompt = f"""
        Please provide the current financial information for {ticker} stock.
        Include:
        - Current price and price change ($ and %)
        - Market cap
        - P/E ratio
        - Latest revenue and net profit (trailing twelve months)
        - Trading volume
        - 52-week range
        - Dividend yield (if applicable)
        - EPS (TTM)
        - Beta
        - Recent performance (1M, 3M, YTD, 1Y returns)

        Return the information AS JSON ONLY with the following structure:
        {{
            "company_name": "string",
            "current_price": "string with $ symbol",
            "price_change": "string with $ and % change",
            "market_cap": "string",
            "pe_ratio": "string or number",
            "revenue_ttm": "string",
            "net_profit_ttm": "string",
            "trading_volume": "string",
            "week_52_range": "string",
            "dividend_yield": "string with %",
            "eps_ttm": "string",
            "beta": "number",
            "performance": {{
                "1m": "string with %",
                "3m": "string with %",
                "ytd": "string with %",
                "1y": "string with %"
            }}
        }}

        If any data is not available, include the field with "N/A" as the value. No explanations or markdown, JUST the JSON.
        """
        
        response = model.generate_content(prompt)
        # Extract the text from the response
        response_text = response.text
        
        # Sometimes Gemini might include markdown code blocks, so let's clean that
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
            
        # Parse the JSON
        stock_data = json.loads(response_text)
        return stock_data
    except Exception as e:
        raise Exception(f"Error processing Vertex AI response: {str(e)}")

def display_stock_data(data):
    """Display the stock data in a formatted way"""
    print("\n" + "="*50)
    print(f"Company: {data.get('company_name', 'N/A')}")
    print("="*50)
    
    print(f"Current Price: {data.get('current_price', 'N/A')}")
    print(f"Price Change: {data.get('price_change', 'N/A')}")
    print(f"Market Cap: {data.get('market_cap', 'N/A')}")
    print(f"P/E Ratio: {data.get('pe_ratio', 'N/A')}")
    print(f"Revenue (TTM): {data.get('revenue_ttm', 'N/A')}")
    print(f"Net Profit (TTM): {data.get('net_profit_ttm', 'N/A')}")
    print(f"Trading Volume: {data.get('trading_volume', 'N/A')}")
    print(f"52-Week Range: {data.get('week_52_range', 'N/A')}")
    print(f"Dividend Yield: {data.get('dividend_yield', 'N/A')}")
    print(f"EPS (TTM): {data.get('eps_ttm', 'N/A')}")
    print(f"Beta: {data.get('beta', 'N/A')}")
    
    # Display performance metrics
    print("\nPerformance:")
    performance = data.get('performance', {})
    print(f"  1 Month: {performance.get('1m', 'N/A')}")
    print(f"  3 Months: {performance.get('3m', 'N/A')}")
    print(f"  Year-to-Date: {performance.get('ytd', 'N/A')}")
    print(f"  1 Year: {performance.get('1y', 'N/A')}")

def main():
    print("Welcome to the Financial Data App!")
    print("Using Vertex AI with Gemini to fetch real-time financial information")
    
    while True:
        ticker = input("\nEnter the stock ticker symbol (e.g., AAPL, MSFT) or 'q' to quit: ")
        
        if ticker.lower() == 'q':
            print("Exiting application. Thank you!")
            break
            
        if not ticker:
            print("Please enter a valid ticker symbol.")
            continue
        
        try:
            print(f"\nFetching financial data for {ticker}...")
            stock_data = fetch_stock_data_with_gemini(ticker)
            display_stock_data(stock_data)
            
        except Exception as e:
            print(f"Error retrieving data for {ticker}: {e}")

if __name__ == "__main__":
    main()