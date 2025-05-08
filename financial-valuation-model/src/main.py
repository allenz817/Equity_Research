import pandas as pd
import os
from data_processing.excel_reader import read_excel
from data_processing.excel_inspector import inspect_excel_structure
from data_processing.financial_parser import parse_financial_statements
from models.valuation import ValuationModel

def main():
    while True:
<<<<<<< HEAD
        try:
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
            
=======
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
>>>>>>> 5b0877a4871a2556cfdd38e23975a065892af108
            # Inspect the Excel structure
            print("\nInspecting Excel file structure...")
            structure_info = inspect_excel_structure(excel_file_path)
            if not structure_info:
                print("Error: Could not inspect the Excel file structure.")
                if input("Try again? (y/n): ").lower() != 'y':
                    return
                continue
            
            # Read the financial statements from the Excel file
            financial_data = read_excel(excel_file_path)
            if not financial_data:
                print("Error: Could not read financial statements from the Excel file.")
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

            # Save results to a new Excel file
            output_file_path = os.path.join(os.path.dirname(excel_file_path), "Valuation_Output.xlsx")
            with pd.ExcelWriter(output_file_path, engine='xlsxwriter') as writer:
                # Write financial statements
<<<<<<< HEAD
                write_financial_statements(writer, structured_data)
=======
                for statement, df in structured_data.items():
                    transposed_df = df.transpose()
                    transposed_df.columns = transposed_df.iloc[0]  # Set the first row as column headers
                    transposed_df = transposed_df[1:]  # Remove the first row
                    transposed_df.to_excel(writer, sheet_name=statement.replace('_', ' ').title())
>>>>>>> 5b0877a4871a2556cfdd38e23975a065892af108
                
                # Write detailed valuation model
                write_valuation_model(writer, valuation_model, valuation_result)
            
            # Streamlined terminal output
            print("\nProcessing complete!")
            print(f"Parsed financial statements and valuation results have been saved to: {output_file_path}")
<<<<<<< HEAD
=======
            print("\nValuation Summary:")
            print(f"  DCF Valuation: ${valuation_result['DCF Valuation']:,.2f}")
            print(f"  Earnings Multiple Valuation: ${valuation_result['Earnings Multiple Valuation']:,.2f}")
            print(f"  Asset-Based Valuation: ${valuation_result['Asset-Based Valuation']:,.2f}")
            print(f"  Weighted Valuation: ${valuation_result['Weighted Valuation']:,.2f}")
            
>>>>>>> 5b0877a4871a2556cfdd38e23975a065892af108
            break
            
        except Exception as e:
            print(f"\nAn unexpected error occurred: {str(e)}")
            import traceback
            traceback.print_exc()
            if input("\nTry again? (y/n): ").lower() != 'y':
                return

<<<<<<< HEAD
def write_financial_statements(writer, structured_data):
    """
    Write all financial statements (Income Statement, Balance Sheet, Cash Flow Statement) to the Excel file.
    
    Args:
        writer (ExcelWriter): The Excel writer object.
        structured_data (dict): Parsed financial data for each statement.
    """
    for statement_name, df in structured_data.items():
        # Reset the index to ensure the statement items are preserved as a column
        df = df.reset_index()
        df.rename(columns={'index': 'Item'}, inplace=True)  # Rename the index column to "Item"
        
        # Transpose the DataFrame to match the desired format
        transposed_df = df.set_index('Item').transpose()
        
        # Add the financial years as the first row
        years_row = pd.DataFrame([transposed_df.index.tolist()], columns=transposed_df.columns)
        transposed_df = pd.concat([years_row, transposed_df], ignore_index=True)
        
        # Write the transposed DataFrame to the Excel file
        transposed_df.to_excel(writer, sheet_name=statement_name.replace('_', ' ').title(), index=False, header=True)

=======
>>>>>>> 5b0877a4871a2556cfdd38e23975a065892af108
def write_valuation_model(writer, valuation_model, valuation_result):
    """
    Write detailed valuation model to the Excel file.
    
    Args:
        writer (ExcelWriter): The Excel writer object.
        valuation_model (ValuationModel): The valuation model object.
        valuation_result (dict): The valuation results.
    """
    # Write DCF Valuation
    dcf_data = valuation_model.get_dcf_details()
    
    # Write DCF Assumptions and Summary
    dcf_assumptions = pd.DataFrame.from_dict(dcf_data['Assumptions'], orient='index', columns=['Value'])
    dcf_assumptions.to_excel(writer, sheet_name="DCF Valuation", startrow=0, index=True, header=True)
    
    dcf_summary = pd.DataFrame({
        'Metric': ['Free Cash Flow', 'Terminal Value', 'Discounted Terminal Value', 'Enterprise Value', 'Cash', 'Debt', 'Equity Value'],
        'Value': [
            dcf_data['Free Cash Flow'],
            dcf_data['Terminal Value'],
            dcf_data['Discounted Terminal Value'],
            dcf_data['Enterprise Value'],
            dcf_data['Cash'],
            dcf_data['Debt'],
            dcf_data['Equity Value']
        ]
    })
    dcf_summary.to_excel(writer, sheet_name="DCF Valuation", startrow=len(dcf_assumptions) + 3, index=False, header=True)
    
    # Write DCF Future Cash Flows
    dcf_future_cash_flows = pd.DataFrame(dcf_data['Future Cash Flows'])
    dcf_future_cash_flows.to_excel(writer, sheet_name="DCF Valuation", startrow=len(dcf_assumptions) + len(dcf_summary) + 6, index=False, header=True)
    
    # Write Multiple Valuation
    multiple_data = valuation_model.get_multiple_details()
    multiple_assumptions = pd.DataFrame.from_dict(multiple_data['Assumptions'], orient='index', columns=['Value'])
    multiple_assumptions.to_excel(writer, sheet_name="Multiple Valuation", startrow=0, index=True, header=True)
    
    multiple_summary = pd.DataFrame({
        'Metric': ['Net Income', 'Valuation'],
        'Value': [
            multiple_data['Net Income'],
            multiple_data['Valuation']
        ]
    })
    multiple_summary.to_excel(writer, sheet_name="Multiple Valuation", startrow=len(multiple_assumptions) + 3, index=False, header=True)
    
    # Write Asset-Based Valuation
    asset_data = valuation_model.get_asset_based_details()
    asset_assumptions = pd.DataFrame.from_dict(asset_data['Assumptions'], orient='index', columns=['Value'])
    asset_assumptions.to_excel(writer, sheet_name="Asset-Based Valuation", startrow=0, index=True, header=True)
    
    asset_summary = pd.DataFrame({
        'Metric': ['Total Assets', 'Total Liabilities', 'Book Value', 'Valuation'],
        'Value': [
            asset_data['Total Assets'],
            asset_data['Total Liabilities'],
            asset_data['Book Value'],
            asset_data['Valuation']
        ]
    })
    asset_summary.to_excel(writer, sheet_name="Asset-Based Valuation", startrow=len(asset_assumptions) + 3, index=False, header=True)
    
    # Write Summary
    summary_df = pd.DataFrame.from_dict(valuation_result, orient='index', columns=['Value'])
    summary_df.to_excel(writer, sheet_name="Valuation Summary", index=True, header=True)

if __name__ == "__main__":
    main()