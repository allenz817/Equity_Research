import yfinance as yf
import matplotlib.pyplot as plt
import pandas as pd

# Define the stock ticker symbol and the time period
stocks = [
    {'ticker':'^HSI', 'name':'Hang Seng Index' },
    {'ticker':'513060.SS', 'name':'Hang Seng Healthcare' },
    {'ticker':'6078.hk', 'name':'Hygeia Healthcare' },
    {'ticker':'1951.hk', 'name':'Jinxin Fertility' },
    {'ticker':'600763.SS', 'name':'Topchoice Medical' },
    {'ticker':'000516.SZ', 'name':'XiAn International Medical' },
]
start_date = '2024-01-01'
end_date = '2024-12-31'

# Retrieve the historical stock data
stock_data = {}
for stock in stocks:
    stock_data[stock['ticker']] = yf.download(stock['ticker'], start=start_date, end=end_date)

# Plot the closing prices
plt.figure(figsize=(12, 4))
for stock in stocks:
    ticker = stock['ticker']
    name = stock['name']
    norm_prices = stock_data[ticker]['Close'] / stock_data[ticker]['Close'].iloc[0] * 100
    perc_change = ((stock_data[ticker]['Close'].iloc[-1] - stock_data[ticker]['Close'].iloc[0]) / stock_data[ticker]['Close'].iloc[0]) * 100
    
    if ticker == '^HSI' or ticker == '513060.SS': 
        plt.plot(stock_data[ticker].index, norm_prices, label=f'{name}', linestyle='--', linewidth=4) 
    else: 
        plt.plot(stock_data[ticker].index, norm_prices, label=f'{name}')
    
    plt.text(stock_data[ticker].index[-1], norm_prices.iloc[-1], f'{perc_change.iloc[-1]:.1f}%', fontsize=10, verticalalignment='center')

plt.xlabel('Date')
plt.ylabel('Indexed CLosing Price')
plt.title('Historical Indexed Closing Prices and YTD Price Change')
plt.legend()
plt.grid(True)
plt.show()
