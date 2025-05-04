import pandas as pd
import numpy as np

def parse_financial_statements(financial_data):
    """
    Parse financial statements from a structured table format
    
    Args:
        financial_data (dict): Dictionary containing DataFrames for each financial statement
        
    Returns:
        dict: Dictionary with structured financial data
    """
    parsed_data = {}
    
    # Process balance sheet
    balance_sheet_df = financial_data['balance_sheet']
    balance_sheet_metrics = extract_metrics_from_table(
        balance_sheet_df,
        {
            'CurrentAssets': ['Current Assets', 'Total Current Assets'],
            'CurrentLiabilities': ['Current Liabilities', 'Total Current Liabilities'],
            'Inventory': ['Inventories', 'Inventory'],
            'TotalAssets': ['Total Assets'],
            'TotalLiabilities': ['Total Liabilities'],
            'ShareholdersEquity': ["Shareholders' Equity", 'Total Equity', "Stockholders' Equity"],
            'Cash': ['Cash and Cash Equivalents', 'Cash'],
            'TotalDebt': ['Long-term Debt', 'Total Debt']
        }
    )
    parsed_data['balance_sheet'] = balance_sheet_metrics
    
    # Process income statement
    income_statement_df = financial_data['income_statement']
    income_statement_metrics = extract_metrics_from_table(
        income_statement_df,
        {
            'NetIncome': ['Net Income'],
            'Revenue': ['Revenue', 'Net Sales'],
            'GrossProfit': ['Gross Profit'],
            'OperatingIncome': ['Operating Income']
        }
    )
    parsed_data['income_statement'] = income_statement_metrics
    
    # Process cash flow statement
    cash_flow_df = financial_data['cash_flow']
    cash_flow_metrics = extract_metrics_from_table(
        cash_flow_df,
        {
            'OperatingCashFlow': ['Cash Flow from Operating Activities', 'Operating Cash Flow'],
            'CapitalExpenditures': ['Capital Expenditures']
        }
    )
    parsed_data['cash_flow'] = cash_flow_metrics
    
    # Print what we found
    print("\nParsed financial metrics:")
    for statement, metrics in parsed_data.items():
        print(f"\n{statement.replace('_', ' ').title()}:")
        for metric, values in metrics.items():
            print(f"  {metric}: {values}")
    
    # Create structured DataFrames from the parsed data
    structured_data = {}
    for statement, metrics in parsed_data.items():
        df = pd.DataFrame(metrics)
        structured_data[statement] = df
        
    return structured_data

def extract_metrics_from_table(df, metric_map):
    """
    Extract metrics from a financial statement table
    
    Args:
        df (DataFrame): Financial statement DataFrame
        metric_map (dict): Mapping of standardized metric names to possible row labels
        
    Returns:
        dict: Dictionary with extracted metrics
    """
    # Skip header rows (usually 3-4 rows before actual data)
    # Find the row with "Item" or similar header
    header_row = None
    for i in range(10):  # Check the first 10 rows
        if i >= len(df):
            break
        if isinstance(df.iloc[i, 0], str) and df.iloc[i, 0].lower() in ['item', 'description', 'account']:
            header_row = i
            break
    
    if header_row is None:
        header_row = 4  # Default to row 5 (zero-indexed as 4) if not found
        
    # Get the data starting from the row after the header
    data = df.iloc[header_row+1:].copy()
    
    # The first column contains the metric names
    data_col = df.columns[0]
    
    # The remaining columns should be years
    year_cols = df.columns[1:4]  # Assuming 3 years of data
    
    # Dictionary to store results
    results = {}
    
    # For each metric we're looking for
    for standard_name, possible_names in metric_map.items():
        # Try to find a matching row
        for name in possible_names:
            matching_rows = data[data[data_col].str.lower() == name.lower()]
            
            if not matching_rows.empty:
                # Extract values for each year
                values = {}
                for i, year_col in enumerate(year_cols):
                    try:
                        # Handle values that might be formatted with commas or parentheses
                        raw_value = matching_rows.iloc[0][year_col]
                        if isinstance(raw_value, str):
                            # Remove commas, handle parentheses for negative numbers
                            clean_value = raw_value.replace(',', '')
                            if '(' in clean_value and ')' in clean_value:
                                clean_value = '-' + clean_value.replace('(', '').replace(')', '')
                            try:
                                values[f'Year{i+1}'] = float(clean_value)
                            except ValueError:
                                values[f'Year{i+1}'] = None
                        else:
                            values[f'Year{i+1}'] = float(raw_value) if pd.notnull(raw_value) else None
                    except:
                        values[f'Year{i+1}'] = None
                        
                results[standard_name] = values
                break
    
    return results