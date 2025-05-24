export const formatCurrency = (amount) => {
    if (isNaN(amount)) {
        return '';
    }
    return `$${parseFloat(amount).toFixed(2)}`;
};

export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};