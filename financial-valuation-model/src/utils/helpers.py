def validate_excel_file(file_path):
    # Function to validate the Excel file format
    if not file_path.endswith('.xlsx'):
        raise ValueError("File must be an Excel (.xlsx) file.")
    return True

def format_currency(value):
    # Function to format a number as currency
    return "${:,.2f}".format(value)

def calculate_growth_rate(current_value, previous_value):
    # Function to calculate the growth rate
    if previous_value == 0:
        return float('inf')  # Avoid division by zero
    return (current_value - previous_value) / previous_value

def extract_year_from_date(date):
    # Function to extract the year from a date
    return date.year if date else None