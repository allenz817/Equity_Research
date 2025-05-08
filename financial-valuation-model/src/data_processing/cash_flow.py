class CashFlow:
    def __init__(self, cash_flow_data):
        self.cash_flow_data = cash_flow_data

    def get_operating_cash_flow(self):
        return self.cash_flow_data.get('Operating Cash Flow', 0)

    def get_investing_cash_flow(self):
        return self.cash_flow_data.get('Investing Cash Flow', 0)

    def get_financing_cash_flow(self):
        return self.cash_flow_data.get('Financing Cash Flow', 0)

    def get_net_cash_flow(self):
        return self.get_operating_cash_flow() + self.get_investing_cash_flow() + self.get_financing_cash_flow()