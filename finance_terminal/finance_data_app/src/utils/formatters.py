def format_currency(value):
    """Format a numeric value as currency."""
    return f"${value:,.2f}"

def format_percentage(value):
    """Format a numeric value as a percentage."""
    return f"{value:.2f}%"

def format_financial_data(data):
    """Format financial data for display."""
    formatted_data = {
        "Market Cap": format_currency(data.get("marketCap", "N/A")),
        "P/E Ratio": data.get("peRatio", "N/A"),
        "Revenue": format_currency(data.get("revenue", "N/A")),
        "Net Income": format_currency(data.get("netIncome", "N/A")),
        "Trading Volume": data.get("tradingVolume", "N/A"),
        "52-Week Range": data.get("fiftyTwoWeekRange", "N/A"),
        "Dividend Yield": format_percentage(data.get("dividendYield", "N/A")),
        "EPS": data.get("eps", "N/A"),
        "Beta": data.get("beta", "N/A"),
    }
    return formatted_data