// This file processes the data retrieved from the Gemini API. 
// It exports a function `parseFinancialData` that formats the raw data into a usable structure.

export const parseFinancialData = (data) => {
    if (!data || !data.financials) {
        throw new Error("Invalid data format");
    }

    return data.financials.map(statement => ({
        year: statement.year,
        revenue: statement.revenue,
        netIncome: statement.netIncome,
        assets: statement.assets,
        liabilities: statement.liabilities,
        equity: statement.equity,
    }));
};