import unittest
from src.models.company import Company
from src.models.financial_data import FinancialData

class TestCompany(unittest.TestCase):
    def setUp(self):
        self.company = Company(ticker="AAPL", name="Apple Inc.")

    def test_company_initialization(self):
        self.assertEqual(self.company.ticker, "AAPL")
        self.assertEqual(self.company.name, "Apple Inc.")

class TestFinancialData(unittest.TestCase):
    def setUp(self):
        self.financial_data = FinancialData(
            ticker="AAPL",
            current_price=150.00,
            market_cap="2.5T",
            pe_ratio=28.5,
            revenue="365.82B",
            net_income="94.68B",
            trading_volume="100M",
            dividend_yield="0.6%",
            eps=5.61,
            beta=1.20
        )

    def test_financial_data_initialization(self):
        self.assertEqual(self.financial_data.ticker, "AAPL")
        self.assertEqual(self.financial_data.current_price, 150.00)
        self.assertEqual(self.financial_data.market_cap, "2.5T")
        self.assertEqual(self.financial_data.pe_ratio, 28.5)
        self.assertEqual(self.financial_data.revenue, "365.82B")
        self.assertEqual(self.financial_data.net_income, "94.68B")
        self.assertEqual(self.financial_data.trading_volume, "100M")
        self.assertEqual(self.financial_data.dividend_yield, "0.6%")
        self.assertEqual(self.financial_data.eps, 5.61)
        self.assertEqual(self.financial_data.beta, 1.20)

if __name__ == '__main__':
    unittest.main()