export const validateCompanyIdentifier = (identifier) => {
    const regex = /^[A-Za-z0-9]+$/; // Allow alphanumeric characters only
    return regex.test(identifier);
};

export const validateFinancialData = (data) => {
    if (!data || typeof data !== 'object') {
        return false;
    }
    // Add more validation rules as needed
    return true;
};