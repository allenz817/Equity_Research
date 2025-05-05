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
            'OperatingCashFlow': ['Cash Flow from Operating Activities', 'Operating Cash Flow', 'Net Cash from Operating Activities'],
            'CapitalExpenditures': ['Capital Expenditures', 'CapEx', 'Purchases of Property and Equipment']
        }
    )
    parsed_data['cash_flow'] = cash_flow_metrics

    # Debug: Print parsed cash flow metrics
    print("\nParsed Cash Flow Metrics:")
    print(cash_flow_metrics)
    
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
    Extract metrics from a financial statement table and align years dynamically.
    
    Args:
        df (DataFrame): Financial statement DataFrame
        metric_map (dict): Mapping of standardized metric names to possible row labels
        
    Returns:
        dict: Dictionary with extracted metrics, using actual years as keys
    """
    # Detect the header row containing the year information
    header_row = None
    for i in range(10):  # Check the first 10 rows
        if i >= len(df):
            break
        if isinstance(df.iloc[i, 1], str) and "20" in df.iloc[i, 1]:  # Look for a year-like string
            header_row = i
            break
    
    if header_row is None:
        raise ValueError("Could not detect the header row containing year information.")
    
    # Rename columns using the detected header row
    df.columns = df.iloc[header_row]
    df = df.iloc[header_row + 1:].reset_index(drop=True)
    
    # The first column contains the metric names
    data_col = df.columns[0]
    
    # Dynamically detect the year columns and sort them in ascending order
    year_cols = []
    for col in df.columns[1:]:
        try:
            # Attempt to parse the column name as a date
            year = pd.to_datetime(col, errors='coerce').year
            if pd.notnull(year):
                year_cols.append((col, year))
        except:
            continue
    
    # Sort the year columns by the year value
    year_cols = sorted(year_cols, key=lambda x: x[1])  # Sort by year (ascending)
    sorted_year_cols = [col[0] for col in year_cols]  # Extract the column names in sorted order
    sorted_years = [col[1] for col in year_cols]  # Extract the actual years
    
    # Dictionary to store results
    results = {}
    
    # For each metric we're looking for
    for standard_name, possible_names in metric_map.items():
        # Try to find a matching row
        for name in possible_names:
            matching_rows = df[df[data_col].str.lower() == name.lower()]
            
            if not matching_rows.empty:
                # Extract values for each year
                values = {}
                for i, year_col in enumerate(sorted_year_cols):
                    try:
                        # Handle values that might be formatted with commas or parentheses
                        raw_value = matching_rows.iloc[0][year_col]
                        if isinstance(raw_value, str):
                            # Remove commas, handle parentheses for negative numbers
                            clean_value = raw_value.replace(',', '')
                            if '(' in clean_value and ')' in clean_value:
                                clean_value = '-' + clean_value.replace('(', '').replace(')', '')
                            try:
                                values[sorted_years[i]] = float(clean_value)
                            except ValueError:
                                values[sorted_years[i]] = None
                        else:
                            values[sorted_years[i]] = float(raw_value) if pd.notnull(raw_value) else None
                    except:
                        values[sorted_years[i]] = None
                        
                results[standard_name] = values
                break
    
    return results