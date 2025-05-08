from yfinance import Ticker

def get_stock_data(ticker_symbol):
    ticker = Ticker(ticker_symbol)
    stock_info = ticker.info
    return {
        "ticker": ticker_symbol,
        "name": stock_info.get("longName", "N/A"),
        "price": {
            "current": stock_info.get("currentPrice", "N/A"),
            "change": stock_info.get("regularMarketChange", "N/A"),
            "changePercent": stock_info.get("regularMarketChangePercent", "N/A"),
            "currency": stock_info.get("currency", "N/A")
        },
        "marketCap": stock_info.get("marketCap", "N/A"),
        "peRatio": stock_info.get("trailingPE", "N/A"),
        "revenue": stock_info.get("totalRevenue", "N/A"),
        "netIncome": stock_info.get("netIncomeToCommon", "N/A"),
        "tradingVolume": stock_info.get("volume", "N/A"),
        "fiftyTwoWeekRange": stock_info.get("fiftyTwoWeekRange", "N/A"),
        "dividendYield": stock_info.get("dividendYield", "N/A"),
        "eps": stock_info.get("trailingEps", "N/A"),
        "beta": stock_info.get("beta", "N/A"),
        "returns": {
            "oneMonth": stock_info.get("oneYearTarget", "N/A"),  # Placeholder for actual return calculations
            "threeMonth": "N/A",  # Placeholder for actual return calculations
            "ytd": "N/A",  # Placeholder for actual return calculations
            "oneYear": "N/A"  # Placeholder for actual return calculations
        },
        "timestamp": stock_info.get("regularMarketTime", "N/A")
    }