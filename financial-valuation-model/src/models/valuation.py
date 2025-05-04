import pandas as pd
import numpy as np
from .financial_ratios import FinancialRatios

class ValuationModel:
    """Model for valuing a company based on financial statements"""
    
    def __init__(self, financial_data, structured_data=None):
        self.financial_data = financial_data
        self.structured_data = structured_data
        self.balance_sheet = financial_data['balance_sheet']
        self.income_statement = financial_data['income_statement']
        self.cash_flow = financial_data['cash_flow']
        
        # Use ratios class only if structured data is available
        if structured_data:
            self.ratios = self.calculate_ratios()
        else:
            self.ratios = {}
    
    def calculate_ratios(self):
        """Calculate key financial ratios"""
        ratios = {}
        
        try:
            # Get the most recent values
            bs = self.structured_data['balance_sheet']
            is_data = self.structured_data['income_statement']
            
            # Liquidity ratios
            if 'CurrentAssets' in bs and 'CurrentLiabilities' in bs:
                current_assets = bs['CurrentAssets'].get('Year1', 0)
                current_liabilities = bs['CurrentLiabilities'].get('Year1', 0)
                inventory = bs.get('Inventory', {}).get('Year1', 0)
                
                if current_liabilities != 0:
                    ratios['current_ratio'] = current_assets / current_liabilities
                    ratios['quick_ratio'] = (current_assets - inventory) / current_liabilities
                else:
                    ratios['current_ratio'] = float('inf')
                    ratios['quick_ratio'] = float('inf')
            
            # Profitability ratios
            if 'NetIncome' in is_data and 'Revenue' in is_data:
                net_income = is_data['NetIncome'].get('Year1', 0)
                revenue = is_data['Revenue'].get('Year1', 0)
                
                if revenue != 0:
                    ratios['profit_margin'] = net_income / revenue
                else:
                    ratios['profit_margin'] = 0
                    
                if 'TotalAssets' in bs and bs['TotalAssets'].get('Year1', 0) != 0:
                    ratios['return_on_assets'] = net_income / bs['TotalAssets'].get('Year1', 0)
                else:
                    ratios['return_on_assets'] = 0
                    
                if 'ShareholdersEquity' in bs and bs['ShareholdersEquity'].get('Year1', 0) != 0:
                    ratios['return_on_equity'] = net_income / bs['ShareholdersEquity'].get('Year1', 0)
                else:
                    ratios['return_on_equity'] = 0
            
            # Leverage ratios
            if 'TotalLiabilities' in bs and 'TotalAssets' in bs:
                total_liabilities = bs['TotalLiabilities'].get('Year1', 0)
                total_assets = bs['TotalAssets'].get('Year1', 0)
                shareholders_equity = bs.get('ShareholdersEquity', {}).get('Year1', 0)
                
                if shareholders_equity != 0:
                    ratios['debt_to_equity'] = total_liabilities / shareholders_equity
                else:
                    ratios['debt_to_equity'] = float('inf')
                    
                if total_assets != 0:
                    ratios['debt_ratio'] = total_liabilities / total_assets
                else:
                    ratios['debt_ratio'] = 0
                
        except Exception as e:
            print(f"Error calculating ratios: {e}")
            
        return ratios
    
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
            if not self.structured_data:
                return 0
                
            cash_flow = self.structured_data['cash_flow']
            balance_sheet = self.structured_data['balance_sheet']
            
            # Get the most recent operating cash flow
            operating_cf = cash_flow.get('OperatingCashFlow', {}).get('Year1', 0)
            capital_exp = cash_flow.get('CapitalExpenditures', {}).get('Year1', 0)
            
            # Calculate free cash flow
            fcf = operating_cf - abs(capital_exp)
            
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
            cash = balance_sheet.get('Cash', {}).get('Year1', 0)
            debt = balance_sheet.get('TotalDebt', {}).get('Year1', 0)
            
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
            if not self.structured_data:
                return 0
                
            income_statement = self.structured_data['income_statement']
            net_income = income_statement.get('NetIncome', {}).get('Year1', 0)
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
            if not self.structured_data:
                return 0
                
            balance_sheet = self.structured_data['balance_sheet']
            total_assets = balance_sheet.get('TotalAssets', {}).get('Year1', 0)
            total_liabilities = balance_sheet.get('TotalLiabilities', {}).get('Year1', 0)
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