import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from '../src/components/Dashboard.js';
import Layout from '../src/components/Layout.js';
import { fetchFinancialStatements } from '../src/api/gemini.js';

const App = () => {
    return (
        <Router>
            <Layout>
                <Switch>
                    <Route path="/" exact component={Dashboard} />
                </Switch>
            </Layout>
        </Router>
    );
};

class FinancialStatementsApp {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const fetchBtn = document.getElementById('fetchBtn');
        const companySymbol = document.getElementById('companySymbol');

        fetchBtn.addEventListener('click', () => this.handleFetch());
        companySymbol.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleFetch();
            }
        });
    }

    async handleFetch() {
        const symbol = document.getElementById('companySymbol').value.trim().toUpperCase();
        
        if (!symbol) {
            this.showError('Please enter a company symbol');
            return;
        }

        this.showLoading(true);
        this.hideError();
        this.hideResults();

        try {
            const data = await fetchFinancialStatements(symbol);
            this.displayResults(data);
        } catch (error) {
            this.showError(`Error fetching data: ${error.message}`);
        } finally {
            this.showLoading(false);
        }
    }

    displayResults(data) {
        this.displayIncomeStatement(data.incomeStatement);
        this.displayBalanceSheet(data.balanceSheet);
        this.displayCashFlow(data.cashFlowStatement);
        this.showResults();
    }

    displayIncomeStatement(data) {
        const container = document.getElementById('incomeStatement');
        container.innerHTML = this.formatFinancialData(data);
    }

    displayBalanceSheet(data) {
        const container = document.getElementById('balanceSheet');
        container.innerHTML = this.formatFinancialData(data);
    }

    displayCashFlow(data) {
        const container = document.getElementById('cashFlowStatement');
        container.innerHTML = this.formatFinancialData(data);
    }

    formatFinancialData(data) {
        if (!data) return '<p class="text-gray-500">No data available</p>';
        
        return Object.entries(data)
            .map(([key, value]) => `
                <div class="flex justify-between py-2 border-b">
                    <span class="font-medium">${this.formatLabel(key)}:</span>
                    <span>${this.formatValue(value)}</span>
                </div>
            `).join('');
    }

    formatLabel(label) {
        return label.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    formatValue(value) {
        if (typeof value === 'number') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value);
        }
        return value;
    }

    showLoading(show) {
        document.getElementById('loading').classList.toggle('hidden', !show);
    }

    showResults() {
        document.getElementById('results').classList.remove('hidden');
    }

    hideResults() {
        document.getElementById('results').classList.add('hidden');
    }

    showError(message) {
        const errorDiv = document.getElementById('error');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }

    hideError() {
        document.getElementById('error').classList.add('hidden');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FinancialStatementsApp();
});

export default App;