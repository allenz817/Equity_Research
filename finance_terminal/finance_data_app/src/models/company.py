class Company:
    def __init__(self, ticker: str, name: str):
        self.ticker = ticker
        self.name = name

    def __repr__(self):
        return f"Company(ticker='{self.ticker}', name='{self.name}')"