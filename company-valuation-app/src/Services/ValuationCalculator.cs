using System;
using System.Collections.Generic;
using System.Linq;
using Company.Valuation.Models;

namespace Company.Valuation.Services
{
    public class ValuationCalculator
    {
        private readonly FinancialModel _financialModel;

        public ValuationCalculator(FinancialModel financialModel)
        {
            _financialModel = financialModel;
        }

        public decimal CalculateDiscountedCashFlow(decimal discountRate, int forecastYears)
        {
            decimal totalDCF = 0;
            for (int i = 1; i <= forecastYears; i++)
            {
                decimal cashFlow = _financialModel.CashFlowStatement.OperatingCashFlow; // Simplified for example
                totalDCF += cashFlow / (decimal)Math.Pow((1 + (double)discountRate), i);
            }
            return totalDCF;
        }

        public decimal CalculateNetAssetValue()
        {
            return _financialModel.BalanceSheet.TotalAssets - _financialModel.BalanceSheet.TotalLiabilities;
        }

        public decimal CalculateEarningsValuation()
        {
            return _financialModel.IncomeStatement.NetIncome * 10; // Example multiplier
        }

        public decimal CalculateOverallValuation(decimal discountRate, int forecastYears)
        {
            decimal dcf = CalculateDiscountedCashFlow(discountRate, forecastYears);
            decimal nav = CalculateNetAssetValue();
            decimal earningsValuation = CalculateEarningsValuation();

            return (dcf + nav + earningsValuation) / 3; // Average of the three methods
        }
    }
}