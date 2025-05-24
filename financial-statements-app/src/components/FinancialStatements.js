import React, { useEffect, useState } from 'react';
import { fetchFinancialStatements } from '../api/gemini';
import { parseFinancialData } from '../api/financialData';

const FinancialStatements = ({ companyId }) => {
    const [financialData, setFinancialData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getFinancialStatements = async () => {
            try {
                setLoading(true);
                const data = await fetchFinancialStatements(companyId);
                const parsedData = parseFinancialData(data);
                setFinancialData(parsedData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (companyId) {
            getFinancialStatements();
        }
    }, [companyId]);

    if (loading) {
        return <div>Loading financial statements...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!financialData) {
        return <div>No financial data available.</div>;
    }

    return (
        <div>
            <h2>Financial Statements</h2>
            <table>
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Revenue</th>
                        <th>Net Income</th>
                        <th>Assets</th>
                        <th>Liabilities</th>
                    </tr>
                </thead>
                <tbody>
                    {financialData.map((statement) => (
                        <tr key={statement.year}>
                            <td>{statement.year}</td>
                            <td>{statement.revenue}</td>
                            <td>{statement.netIncome}</td>
                            <td>{statement.assets}</td>
                            <td>{statement.liabilities}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FinancialStatements;