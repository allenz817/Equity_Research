import pandas as pd
import numpy as np
from .financial_ratios import FinancialRatios

class ValuationModel:
    """Model for valuing a company based on financial statements"""
    
    def __init__(self, financial_data):
        self.financial_data = financial_data
        self.balance_sheet = financial_data['balance_sheet']
        self.income_statement = financial_data['income_statement']
        self.cash_flow = financial_data['cash_flow']
        self.financial_ratios = FinancialRatios(financial_data)
        self.ratios = self.financial_ratios.calculate_all_ratios()
    
    def _safe_get_value(self, df, column_name, default=0):
        """Safely get a value from a dataframe, handling missing columns"""
        mapped_name = self.financial_ratios.column_map.get(column_name)
        if mapped_name is None:
            return default
        return df[mapped_name].iloc[-1] if not df[mapped_name].empty else default
    
    def calculate_dcf_valuation(self, discount_rate=0.10, growth_rate=0.03, forecast_years=5):
        """
        Calculate Discounted Cash Flow valuation
        
        Args:
            discount_rate (float): The rate used to discount future cash flows
            growth_rate (float): Projected annual growth rate
            forecast_years (int): Number of years to forecast
            
        Returns:
            float: The DCF valuation
        """
        try:
            # Get the most recent free cash flow
            fcf = 0
            free_cash_flow_col = self.financial_ratios.column_map.get('FreeCashFlow')
            
            if free_cash_flow_col is not None:
                fcf = self.cash_flow[free_cash_flow_col].iloc[-1]
            else:
                # Calculate FCF if not directly provided
                operating_cf = self._safe_get_value(self.cash_flow, 'OperatingCashFlow')
                capital_expenditures = self._safe_get_value(self.cash_flow, 'CapitalExpenditures')
                fcf = operating_cf - capital_expenditures
            
            if fcf == 0:
                print("Warning: Free Cash Flow is zero, DCF valuation may not be meaningful")
                
            # Project future cash flows
            future_cash_flows = []
            for year in range(1, forecast_years + 1):
                projected_fcf = fcf * ((1 + growth_rate) ** year)
                future_cash_flows.append(projected_fcf)
            
            # Calculate terminal value (perpetuity method)
            terminal_value = future_cash_flows[-1] * (1 + growth_rate) / (discount_rate - growth_rate)
            future_cash_flows.append(terminal_value)
            
            # Discount the future cash flows to present value
            present_values = []
            for i, cf in enumerate(future_cash_flows):
                present_values.append(cf / ((1 + discount_rate) ** (i + 1)))
            
            # Sum the present values to get the enterprise value
            enterprise_value = sum(present_values)
            
            # Adjust for cash and debt
            cash = self._safe_get_value(self.balance_sheet, 'Cash')
            debt = self._safe_get_value(self.balance_sheet, 'TotalDebt')
            
            # Equity value
            equity_value = enterprise_value + cash - debt
            
            return equity_value
            
        except Exception as e:
            print(f"Error calculating DCF valuation: {e}")
            return 0
    
    def calculate_multiple_valuation(self, pe_multiple=15):
        """
        Calculate valuation based on earnings multiple
        
        Args:
            pe_multiple (float): Price-to-Earnings multiple to use
            
        Returns:
            float: The earnings-based valuation
        """
        try:
            net_income = self._safe_get_value(self.income_statement, 'NetIncome')
            valuation = net_income * pe_multiple
            return valuation
        except Exception as e:
            print(f"Error calculating multiple valuation: {e}")
            return 0
            
    def calculate_asset_based_valuation(self, discount=0.1):
        """
        Calculate simple asset-based valuation
        
        Args:
            discount (float): Discount to apply to book value (for conservatism)
            
        Returns:
            float: Asset-based valuation
        """
        try:
            total_assets = self._safe_get_value(self.balance_sheet, 'TotalAssets')
            total_liabilities = self._safe_get_value(self.balance_sheet, 'TotalLiabilities')
            book_value = total_assets - total_liabilities
            
            # Apply discount for conservatism
            valuation = book_value * (1 - discount)
            return valuation
        except Exception as e:
            print(f"Error calculating asset-based valuation: {e}")
            return 0
    
    def calculate_valuation(self, dcf_weight=0.5, multiple_weight=0.3, asset_weight=0.2):
        """
        Calculate weighted average of different valuation methods
        
        Args:
            dcf_weight (float): Weight to assign to DCF valuation
            multiple_weight (float): Weight to assign to multiple valuation
            asset_weight (float): Weight to assign to asset-based valuation
            
        Returns:
            dict: Dictionary with valuation results
        """
        dcf_val = self.calculate_dcf_valuation()
        multiple_val = self.calculate_multiple_valuation()
        asset_val = self.calculate_asset_based_valuation()
        
        # Weighted average
        weighted_valuation = (
            dcf_val * dcf_weight + 
            multiple_val * multiple_weight + 
            asset_val * asset_weight
        )
        
        # Format results
        results = {
            'DCF Valuation': dcf_val,
            'Earnings Multiple Valuation': multiple_val,
            'Asset-Based Valuation': asset_val,
            'Weighted Valuation': weighted_valuation,
            'Financial Ratios': self.ratios
        }
        
        return results