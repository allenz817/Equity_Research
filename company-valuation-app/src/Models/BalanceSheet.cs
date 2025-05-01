using System;

namespace CompanyValuationApp.Models
{
    public class BalanceSheet
    {
        public decimal TotalAssets { get; set; }
        public decimal TotalLiabilities { get; set; }
        public decimal ShareholderEquity { get; set; }

        public BalanceSheet(decimal totalAssets, decimal totalLiabilities, decimal shareholderEquity)
        {
            TotalAssets = totalAssets;
            TotalLiabilities = totalLiabilities;
            ShareholderEquity = shareholderEquity;
        }

        public override string ToString()
        {
            return $"Balance Sheet:\nTotal Assets: {TotalAssets}\nTotal Liabilities: {TotalLiabilities}\nShareholder Equity: {ShareholderEquity}";
        }
    }
}