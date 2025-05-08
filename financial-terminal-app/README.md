# Financial Data Analysis Application

This project is a financial data analysis application that retrieves and processes financial data using the `yfinance` library. It provides a command-line interface and a web interface for users to interact with the application and access financial metrics for various companies.

## Project Structure

```
finance_data_app/
├── src/
│   ├── __init__.py
│   ├── main.py
│   ├── api/
│   │   ├── __init__.py
│   │   └── yahoo_finance.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── company.py
│   │   └── financial_data.py
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── formatters.py
│   │   └── calculators.py
│   └── views/
│       ├── __init__.py
│       ├── cli.py
│       └── web.py
├── tests/
│   ├── __init__.py
│   ├── test_api.py
│   └── test_models.py
├── requirements.txt
├── setup.py
└── README.md
```

## Installation

To install the required dependencies, run the following command:

```
pip install -r requirements.txt
```

## Usage

### Command-Line Interface

To run the application using the command-line interface, execute the following command:

```
python src/main.py
```

### Web Interface

To access the web interface, run the application and navigate to `http://localhost:5000` in your web browser.

## Features

- Retrieve financial data for specified companies using the `yfinance` library.
- Calculate and display various financial metrics, including P/E ratios, dividend yields, and more.
- Interactive command-line and web interfaces for user interaction.

## Examples

1. Retrieve financial data for a specific company:
   - Command: `python src/views/cli.py --ticker AAPL`
   
2. Access the web interface to view financial data:
   - Open your web browser and go to `http://localhost:5000`.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.