class IncomeStatement:
    def __init__(self, data):
        self.data = data

    def get_revenue(self):
        return self.data.get('Revenue', 0)

    def get_net_income(self):
        return self.data.get('Net Income', 0)

    def get_gross_profit(self):
        return self.data.get('Gross Profit', 0)

    def get_operating_income(self):
        return self.data.get('Operating Income', 0)

    def get_ebitda(self):
        return self.data.get('EBITDA', 0)

    def get_expenses(self):
        return self.data.get('Total Expenses', 0)

    def get_income_statement_summary(self):
        return {
            'Revenue': self.get_revenue(),
            'Net Income': self.get_net_income(),
            'Gross Profit': self.get_gross_profit(),
            'Operating Income': self.get_operating_income(),
            'EBITDA': self.get_ebitda(),
            'Total Expenses': self.get_expenses()
        }