import pandas as pd
import numpy as np

class FinancialRatios:
    """Calculate financial ratios from financial statement data"""
    
    def __init__(self, financial_data):
        self.balance_sheet = financial_data['balance_sheet']
        self.income_statement = financial_data['income_statement']
        self.cash_flow = financial_data['cash_flow']
        
        # Print column names to help with debugging
        print("\nBalance Sheet columns:")
        print(self.balance_sheet.columns.tolist())
        print("\nIncome Statement columns:")
        print(self.income_statement.columns.tolist())
        print("\nCash Flow Statement columns:")
        print(self.cash_flow.columns.tolist())
        
        # Set up column name mappings with common alternatives
        self.column_map = {
            # Balance Sheet mappings
            'CurrentAssets': self._find_column(self.balance_sheet, ['CurrentAssets', 'Current Assets', 'Total Current Assets']),
            'CurrentLiabilities': self._find_column(self.balance_sheet, ['CurrentLiabilities', 'Current Liabilities', 'Total Current Liabilities']),
            'Inventory': self._find_column(self.balance_sheet, ['Inventory', 'Inventories', 'Total Inventory']),
            'TotalAssets': self._find_column(self.balance_sheet, ['TotalAssets', 'Total Assets', 'Assets']),
            'TotalLiabilities': self._find_column(self.balance_sheet, ['TotalLiabilities', 'Total Liabilities', 'Liabilities']),
            'ShareholdersEquity': self._find_column(self.balance_sheet, ['ShareholdersEquity', "Shareholders' Equity", 'Total Equity', 'Equity']),
            'Cash': self._find_column(self.balance_sheet, ['Cash', 'Cash and Cash Equivalents']),
            'TotalDebt': self._find_column(self.balance_sheet, ['TotalDebt', 'Total Debt', 'Long-term Debt']),
            
            # Income Statement mappings
            'NetIncome': self._find_column(self.income_statement, ['NetIncome', 'Net Income', 'Profit', 'Net Profit']),
            'Revenue': self._find_column(self.income_statement, ['Revenue', 'Total Revenue', 'Sales', 'Net Sales']),
            
            # Cash Flow mappings
            'FreeCashFlow': self._find_column(self.cash_flow, ['FreeCashFlow', 'Free Cash Flow']),
            'OperatingCashFlow': self._find_column(self.cash_flow, ['OperatingCashFlow', 'Operating Cash Flow', 'Cash Flow from Operations']),
            'CapitalExpenditures': self._find_column(self.cash_flow, ['CapitalExpenditures', 'Capital Expenditures', 'CAPEX'])
        }
        
        # Print the column mappings that were found
        print("\nColumn mappings found:")
        for key, value in self.column_map.items():
            print(f"{key} -> {value}")
    
    def _find_column(self, df, possible_names):
        """Find the first matching column name from a list of possibilities"""
        for name in possible_names:
            if name in df.columns:
                return name
        return None
    
    def _safe_get_value(self, df, column_name, default=0):
        """Safely get a value from a dataframe, handling missing columns"""
        mapped_name = self.column_map.get(column_name)
        if mapped_name is None:
            return default
        return df[mapped_name].iloc[-1] if not df[mapped_name].empty else default
    
    def calculate_liquidity_ratios(self):
        """Calculate liquidity ratios"""
        try:
            current_assets = self._safe_get_value(self.balance_sheet, 'CurrentAssets')
            current_liabilities = self._safe_get_value(self.balance_sheet, 'CurrentLiabilities') 
            inventory = self._safe_get_value(self.balance_sheet, 'Inventory')
            
            if current_liabilities == 0:
                return {'current_ratio': float('inf'), 'quick_ratio': float('inf')}
                
            ratios = {
                'current_ratio': current_assets / current_liabilities if current_liabilities != 0 else float('inf'),
                'quick_ratio': (current_assets - inventory) / current_liabilities if current_liabilities != 0 else float('inf')
            }
            return ratios
        except Exception as e:
            print(f"Error calculating liquidity ratios: {e}")
            return {'current_ratio': 0, 'quick_ratio': 0}
    
    def calculate_profitability_ratios(self):
        """Calculate profitability ratios"""
        try:
            net_income = self._safe_get_value(self.income_statement, 'NetIncome')
            revenue = self._safe_get_value(self.income_statement, 'Revenue')
            total_assets = self._safe_get_value(self.balance_sheet, 'TotalAssets')
            shareholders_equity = self._safe_get_value(self.balance_sheet, 'ShareholdersEquity')
            
            ratios = {
                'return_on_assets': net_income / total_assets if total_assets != 0 else 0,
                'return_on_equity': net_income / shareholders_equity if shareholders_equity != 0 else 0,
                'profit_margin': net_income / revenue if revenue != 0 else 0
            }
            return ratios
        except Exception as e:
            print(f"Error calculating profitability ratios: {e}")
            return {'return_on_assets': 0, 'return_on_equity': 0, 'profit_margin': 0}
    
    def calculate_leverage_ratios(self):
        """Calculate leverage ratios"""
        try:
            total_assets = self._safe_get_value(self.balance_sheet, 'TotalAssets')
            total_liabilities = self._safe_get_value(self.balance_sheet, 'TotalLiabilities')
            shareholders_equity = self._safe_get_value(self.balance_sheet, 'ShareholdersEquity')
            
            ratios = {
                'debt_to_equity': total_liabilities / shareholders_equity if shareholders_equity != 0 else float('inf'),
                'debt_ratio': total_liabilities / total_assets if total_assets != 0 else 0
            }
            return ratios
        except Exception as e:
            print(f"Error calculating leverage ratios: {e}")
            return {'debt_to_equity': 0, 'debt_ratio': 0}
            
    def calculate_all_ratios(self):
        """Calculate all financial ratios"""
        ratios = {}
        ratios.update(self.calculate_liquidity_ratios())
        ratios.update(self.calculate_profitability_ratios())
        ratios.update(self.calculate_leverage_ratios())
        return ratios