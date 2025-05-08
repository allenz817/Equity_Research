import pandas as pd

def inspect_excel_structure(file_path):
    """
    Inspect the structure of the Excel file to help identify financial statement columns
    
    Args:
        file_path (str): Path to the Excel file
        
    Returns:
        dict: Information about the Excel structure
    """
    try:
        # Get all sheet names
        xl = pd.ExcelFile(file_path)
        sheet_names = xl.sheet_names
        
        structure_info = {
            "file_path": file_path,
            "sheets": sheet_names,
            "columns_by_sheet": {}
        }
        
        # Get column names for each sheet
        for sheet in sheet_names:
            df = pd.read_excel(file_path, sheet_name=sheet)
            structure_info["columns_by_sheet"][sheet] = df.columns.tolist()
        
        return structure_info
        
    except Exception as e:
        print(f"Error inspecting Excel file: {e}")
        return None

def print_excel_structure(structure_info):
    """Print the Excel structure in a readable format"""
    if not structure_info:
        print("No structure information available.")
        return
        
    print(f"\nExcel File: {structure_info['file_path']}")
    print(f"Sheets found: {', '.join(structure_info['sheets'])}")
    
    for sheet_name, columns in structure_info['columns_by_sheet'].items():
        print(f"\nSheet: {sheet_name}")
        print("Columns:")
        for i, col in enumerate(columns):
            print(f"  {i+1}. {col}")