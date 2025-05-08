class FinancialData:
    def __init__(self, ticker):
        self.ticker = ticker
        self.data = None

    def fetch_data(self):
        import yfinance as yf
        self.data = yf.Ticker(self.ticker).info

    def get_price(self):
        if self.data:
            return self.data.get('currentPrice', 'N/A')
        return 'N/A'

    def get_market_cap(self):
        if self.data:
            return self.data.get('marketCap', 'N/A')
        return 'N/A'

    def get_pe_ratio(self):
        if self.data:
            return self.data.get('trailingPE', 'N/A')
        return 'N/A'

    def get_revenue(self):
        if self.data:
            return self.data.get('totalRevenue', 'N/A')
        return 'N/A'

    def get_net_income(self):
        if self.data:
            return self.data.get('netIncomeToCommon', 'N/A')
        return 'N/A'

    def get_trading_volume(self):
        if self.data:
            return self.data.get('volume', 'N/A')
        return 'N/A'

    def get_fifty_two_week_range(self):
        if self.data:
            return self.data.get('fiftyTwoWeekRange', 'N/A')
        return 'N/A'

    def get_dividend_yield(self):
        if self.data:
            return self.data.get('dividendYield', 'N/A')
        return 'N/A'

    def get_eps(self):
        if self.data:
            return self.data.get('trailingEps', 'N/A')
        return 'N/A'

    def get_beta(self):
        if self.data:
            return self.data.get('beta', 'N/A')
        return 'N/A'

    def get_recent_performance(self):
        if self.data:
            return {
                "oneMonth": self.data.get('oneMonthReturn', 'N/A'),
                "threeMonth": self.data.get('threeMonthReturn', 'N/A'),
                "ytd": self.data.get('ytdReturn', 'N/A'),
                "oneYear": self.data.get('oneYearReturn', 'N/A'),
            }
        return {
            "oneMonth": 'N/A',
            "threeMonth": 'N/A',
            "ytd": 'N/A',
            "oneYear": 'N/A',
        }