import yfinance as yf
import pandas as pd
from tabulate import tabulate

class StockMetrics:
    def __init__(self, stocks):
        self.stocks = stocks
        self.metrics = self._retrieve_metrics()

    def _retrieve_metrics(self):
        metrics = []
        for stock in self.stocks:
            ticker = stock['ticker']
            stock_info = yf.Ticker(ticker)
            stock_hist = stock_info.history(start='2024-01-01', end='2024-12-31', interval='1d')
            cur_price = stock_hist['Close'].iloc[-1]
            year_high = stock_hist['Close'].max()
            cur_price_pct = (cur_price / year_high) * 100 if year_high != 'N/A' else 'N/A'
            
            ltm_rev = stock_info.info.get('totalRevenue', 'N/A')
            ltm_ebitda = stock_info.info.get('ebitda', 'N/A')
            ltm_profit = stock_info.info.get('netIncomeToCommon', 'N/A')

            metrics.append({
                'Company': stock['name'],
                'Ticker': ticker,
                'Market Cap': stock_info.info.get('marketCap', 'N/A'),
                'Enterprise Value': stock_info.info.get('enterpriseValue', 'N/A'),
                'Last Price': cur_price,
                '52 Week High': year_high,
                'Current Price %': cur_price_pct,
                'EBITDA': ltm_ebitda,
                'Net Profit': ltm_profit,
                'Revenue': ltm_rev
            })
        return metrics

    def display_metrics(self):
        df_metrics = pd.DataFrame(self.metrics)
        #print(df_metrics)
        print(tabulate(df_metrics, headers='keys'))

    def metrics_to_csv(self, filename):
        df_metrics = pd.DataFrame(self.metrics)
        df_metrics.to_csv(filename, index=False)

# Example usage:
if __name__ == "__main__":
    sheet = 'NM'
    df = pd.read_excel('comps_table.xlsx', sheet_name = sheet)
    stocks = df[['Ticker', 'Company name (EN)']].rename(columns={'Ticker': 'ticker', 'Company name (EN)': 'name'}).to_dict('records')
    stock_metrics = StockMetrics(stocks)
    #stock_metrics.display_metrics()
    stock_metrics.metrics_to_csv(f'stock_metrics_{sheet}.csv')
