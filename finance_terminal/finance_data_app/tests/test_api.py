import pytest
from src.api.yahoo_finance import get_stock_data

def test_get_stock_data_valid_ticker():
    ticker = "AAPL"
    data = get_stock_data(ticker)
    assert data is not None
    assert "currentPrice" in data
    assert "marketCap" in data
    assert "peRatio" in data

def test_get_stock_data_invalid_ticker():
    ticker = "INVALID"
    data = get_stock_data(ticker)
    assert data is None

def test_get_stock_data_empty_ticker():
    ticker = ""
    data = get_stock_data(ticker)
    assert data is None

def test_get_stock_data_format():
    ticker = "MSFT"
    data = get_stock_data(ticker)
    assert isinstance(data, dict)
    assert "price" in data
    assert "marketCap" in data
    assert "peRatio" in data
    assert "revenue" in data
    assert "netIncome" in data
    assert "tradingVolume" in data
    assert "fiftyTwoWeekRange" in data
    assert "dividendYield" in data
    assert "eps" in data
    assert "beta" in data
    assert "returns" in data
    assert "timestamp" in data