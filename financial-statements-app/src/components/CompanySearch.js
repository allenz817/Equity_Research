import React, { useState } from 'react';
import { fetchFinancialStatements } from '../api/gemini';

const CompanySearch = ({ onSearch }) => {
    const [companyIdentifier, setCompanyIdentifier] = useState('');
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!companyIdentifier) {
            setError('Please enter a company name or identifier.');
            return;
        }
        setError('');
        try {
            const data = await fetchFinancialStatements(companyIdentifier);
            onSearch(data);
        } catch (err) {
            setError('Error fetching financial statements. Please try again.');
        }
    };

    return (
        <div>
            <input
                type="text"
                value={companyIdentifier}
                onChange={(e) => setCompanyIdentifier(e.target.value)}
                placeholder="Enter company name or identifier"
            />
            <button onClick={handleSearch}>Search</button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default CompanySearch;