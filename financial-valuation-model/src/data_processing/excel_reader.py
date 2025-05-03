import pandas as pd
import os

def read_excel(file_path):
    """
    Read financial statements from an Excel file.
    
    The Excel file should have separate sheets for:
    - Balance Sheet
    - Income Statement
    - Cash Flow Statement
    
    Returns:
        dict: Dictionary containing DataFrames for each financial statement
    """
    try:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"The file {file_path} does not exist.")
            
        # Get all sheet names
        xl = pd.ExcelFile(file_path)
        sheet_names = xl.sheet_names
        
        # Define sheet name variations to look for
        sheet_variations = {
            'balance_sheet': ['BalanceSheet', 'Balance Sheet', 'Balance_Sheet'],
            'income_statement': ['IncomeStatement', 'Income Statement', 'Income_Statement'], 
            'cash_flow': ['CashFlowStatement', 'Cash Flow Statement', 'Cash Flow']
        }
        
        # Find matching sheet names
        found_sheets = {}
        for key, variations in sheet_variations.items():
            for sheet in sheet_names:
                if sheet in variations or any(v.lower() == sheet.lower() for v in variations):
                    found_sheets[key] = sheet
                    break
            
            if key not in found_sheets:
                print(f"Warning: Could not find sheet for {key}. Available sheets: {sheet_names}")
        
        # Read each sheet into a DataFrame
        financial_data = {}
        for key, sheet in found_sheets.items():
            financial_data[key] = pd.read_excel(file_path, sheet_name=sheet)
        
        # Make sure we have all required sheets
        if len(financial_data) == 3:
            print(f"Successfully loaded financial statements from {file_path}")
            return financial_data
        else:
            missing = set(sheet_variations.keys()) - set(financial_data.keys())
            print(f"Error: Missing required sheets: {missing}")
            print(f"Available sheets: {sheet_names}")
            return None
        
    except Exception as e:
        print(f"Error reading Excel file: {e}")
        return None