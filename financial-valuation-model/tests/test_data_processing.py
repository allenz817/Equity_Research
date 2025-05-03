import unittest
from src.data_processing.excel_reader import read_excel
from src.data_processing.balance_sheet import BalanceSheet
from src.data_processing.income_statement import IncomeStatement
from src.data_processing.cash_flow import CashFlow

class TestDataProcessing(unittest.TestCase):

    def setUp(self):
        self.test_file = 'path/to/test_excel_file.xlsx'  # Replace with actual test file path
        self.data = read_excel(self.test_file)
        self.balance_sheet = BalanceSheet(self.data['balance_sheet'])
        self.income_statement = IncomeStatement(self.data['income_statement'])
        self.cash_flow = CashFlow(self.data['cash_flow'])

    def test_balance_sheet_processing(self):
        self.assertIsNotNone(self.balance_sheet)
        self.assertTrue(hasattr(self.balance_sheet, 'assets'))
        self.assertTrue(hasattr(self.balance_sheet, 'liabilities'))

    def test_income_statement_processing(self):
        self.assertIsNotNone(self.income_statement)
        self.assertTrue(hasattr(self.income_statement, 'revenue'))
        self.assertTrue(hasattr(self.income_statement, 'net_income'))

    def test_cash_flow_processing(self):
        self.assertIsNotNone(self.cash_flow)
        self.assertTrue(hasattr(self.cash_flow, 'operating_cash_flow'))
        self.assertTrue(hasattr(self.cash_flow, 'investing_cash_flow'))

if __name__ == '__main__':
    unittest.main()