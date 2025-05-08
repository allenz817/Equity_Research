import argparse
from src.api.yahoo_finance import get_financial_data

def main():
    parser = argparse.ArgumentParser(description="Retrieve financial data for a specified company.")
    parser.add_argument('ticker', type=str, help='The stock ticker symbol of the company (e.g., AAPL, MSFT)')
    
    args = parser.parse_args()
    
    try:
        data = get_financial_data(args.ticker)
        print(f"Financial data for {args.ticker}:")
        print(data)
    except Exception as e:
        print(f"Error retrieving data for {args.ticker}: {e}")

if __name__ == "__main__":
    main()