import pandas as pd
import os
from data_processing.excel_reader import read_excel
from data_processing.excel_inspector import inspect_excel_structure, print_excel_structure
from data_processing.financial_parser import parse_financial_statements
from models.valuation import ValuationModel
from ui.app import App

def main():
    while True:
        # Get user input for the Excel file path
        excel_file_path = input("Please enter the path to the Excel file containing the financial statements: ")
        
        # Remove quotes if present
        excel_file_path = excel_file_path.strip('"\'')
        
        # Validate file path
        if not os.path.exists(excel_file_path):
            print(f"Error: File '{excel_file_path}' does not exist.")
            if input("Try again? (y/n): ").lower() != 'y':
                return
            continue
            
        # Check file extension
        _, ext = os.path.splitext(excel_file_path)
        if ext.lower() not in ['.xlsx', '.xls']:
            print(f"Error: File must be an Excel file (.xlsx or .xls). You provided: {ext}")
            if input("Try again? (y/n): ").lower() != 'y':
                return
            continue
        
        try:
            # First, inspect the Excel structure
            print("\nInspecting Excel file structure...")
            structure_info = inspect_excel_structure(excel_file_path)
            if structure_info:
                print_excel_structure(structure_info)
                print("\nVerifying that expected sheets exist...")
                
                # Define sheet name variations to look for
                sheet_variations = {
                    'balance_sheet': ['BalanceSheet', 'Balance Sheet', 'Balance_Sheet'],
                    'income_statement': ['IncomeStatement', 'Income Statement', 'Income_Statement'], 
                    'cash_flow': ['CashFlowStatement', 'Cash Flow Statement', 'Cash Flow']
                }
                
                sheet_map = {}
                all_sheets_present = True
                
                for key, variations in sheet_variations.items():
                    found = False
                    for sheet in structure_info['sheets']:
                        if sheet in variations or any(v.lower() == sheet.lower() for v in variations):
                            sheet_map[key] = sheet
                            found = True
                            print(f"Found {key} sheet: '{sheet}'")
                            break
                    
                    if not found:
                        print(f"Warning: Could not find {key} sheet. Expected one of: {variations}")
                        all_sheets_present = False
                
                if not all_sheets_present:
                    print(f"\nWarning: Some required sheets are missing. The application expects:")
                    for key, variations in sheet_variations.items():
                        print(f"- {key}: any of {variations}")
                    print("\nAvailable sheets: " + ", ".join(structure_info['sheets']))
                    if input("\nContinue anyway? (y/n): ").lower() != 'y':
                        continue
            
            # Read the financial statements from the Excel file
            financial_data = read_excel(excel_file_path)
            if not financial_data:
                if input("Try again? (y/n): ").lower() != 'y':
                    return
                continue
                
            # Parse the financial data to extract metrics
            print("\nParsing financial data...")
            structured_data = parse_financial_statements(financial_data)
            
            # Initialize the valuation model with the structured data
            valuation_model = ValuationModel(financial_data, structured_data)

            # Generate the valuation
            valuation_result = valuation_model.calculate_valuation()

            # Display the valuation result
            print("\nValuation Result:")
            print(f"DCF Valuation: ${valuation_result['DCF Valuation']:,.2f}")
            print(f"Earnings Multiple Valuation: ${valuation_result['Earnings Multiple Valuation']:,.2f}")
            print(f"Asset-Based Valuation: ${valuation_result['Asset-Based Valuation']:,.2f}")
            print(f"Weighted Valuation: ${valuation_result['Weighted Valuation']:,.2f}")
            
            # Display financial ratios
            print("\nFinancial Ratios:")
            for name, value in valuation_result['Financial Ratios'].items():
                print(f"{name.replace('_', ' ').title()}: {value:.4f}")
            
            # Start the user interface
            print("\nLaunching graphical interface...")
            app = App()
            app.run()
            break
            
        except Exception as e:
            print(f"\nAn unexpected error occurred: {str(e)}")
            import traceback
            traceback.print_exc()
            if input("\nTry again? (y/n): ").lower() != 'y':
                return

if __name__ == "__main__":
    main()