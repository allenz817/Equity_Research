import React, { useState } from 'react';
import CompanySearch from './CompanySearch';
import FinancialStatements from './FinancialStatements';
import { fetchFinancialStatements } from '../api/gemini';

const Dashboard = () => {
    const [financialData, setFinancialData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (companyIdentifier) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchFinancialStatements(companyIdentifier);
            setFinancialData(data);
        } catch (err) {
            setError('Failed to fetch financial statements. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard">
            <h1>Financial Statements Dashboard</h1>
            <CompanySearch onSearch={handleSearch} />
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            {financialData && <FinancialStatements data={financialData} />}
        </div>
    );
};

export default Dashboard;