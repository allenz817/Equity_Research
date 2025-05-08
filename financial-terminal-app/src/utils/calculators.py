def calculate_pe_ratio(current_price, earnings_per_share):
    if earnings_per_share == 0:
        return float('inf')  # Avoid division by zero
    return current_price / earnings_per_share

def calculate_dividend_yield(dividend_per_share, current_price):
    if current_price == 0:
        return 0  # Avoid division by zero
    return dividend_per_share / current_price

def calculate_return_on_equity(net_income, shareholder_equity):
    if shareholder_equity == 0:
        return float('inf')  # Avoid division by zero
    return net_income / shareholder_equity

def calculate_current_ratio(current_assets, current_liabilities):
    if current_liabilities == 0:
        return float('inf')  # Avoid division by zero
    return current_assets / current_liabilities

def calculate_debt_to_equity_ratio(total_liabilities, shareholder_equity):
    if shareholder_equity == 0:
        return float('inf')  # Avoid division by zero
    return total_liabilities / shareholder_equity