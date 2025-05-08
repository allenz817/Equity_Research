from flask import Flask, render_template, request
from src.api.yahoo_finance import get_financial_data

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/financials', methods=['POST'])
def financials():
    ticker = request.form.get('ticker')
    data = get_financial_data(ticker)
    return render_template('financials.html', data=data)

if __name__ == '__main__':
    app.run(debug=True)