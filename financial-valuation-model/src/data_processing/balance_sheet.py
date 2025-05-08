class BalanceSheet:
    def __init__(self, data):
        self.data = data

    def get_total_assets(self):
        return self.data.get('Total Assets', 0)

    def get_total_liabilities(self):
        return self.data.get('Total Liabilities', 0)

    def get_shareholder_equity(self):
        return self.data.get('Shareholder Equity', 0)

    def get_current_assets(self):
        return self.data.get('Current Assets', 0)

    def get_current_liabilities(self):
        return self.data.get('Current Liabilities', 0)

    def get_working_capital(self):
        return self.get_current_assets() - self.get_current_liabilities()