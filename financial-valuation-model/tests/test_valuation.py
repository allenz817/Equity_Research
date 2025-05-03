import unittest
from src.models.valuation import ValuationModel
from src.data_processing.excel_reader import read_excel

class TestValuationModel(unittest.TestCase):

    def setUp(self):
        self.data = read_excel('path/to/test_excel_file.xlsx')  # Replace with actual test file path
        self.valuation_model = ValuationModel(self.data)

    def test_valuation_calculation(self):
        expected_valuation = 1000000  # Replace with expected valuation based on test data
        calculated_valuation = self.valuation_model.calculate_valuation()
        self.assertAlmostEqual(calculated_valuation, expected_valuation, places=2)

    def test_financial_ratios(self):
        expected_ratios = {
            'current_ratio': 1.5,  # Replace with expected ratio based on test data
            'debt_to_equity': 0.5   # Replace with expected ratio based on test data
        }
        calculated_ratios = self.valuation_model.calculate_financial_ratios()
        self.assertEqual(calculated_ratios, expected_ratios)

if __name__ == '__main__':
    unittest.main()