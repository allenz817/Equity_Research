using System;

namespace CompanyValuationApp.Models
{
    public class FinancialModel
    {
        public BalanceSheet BalanceSheet { get; set; }
        public IncomeStatement IncomeStatement { get; set; }
        public CashFlowStatement CashFlowStatement { get; set; }

        public FinancialModel(BalanceSheet balanceSheet, IncomeStatement incomeStatement, CashFlowStatement cashFlowStatement)
        {
            BalanceSheet = balanceSheet;
            IncomeStatement = incomeStatement;
            CashFlowStatement = cashFlowStatement;
        }

        public decimal CalculateNetWorth()
        {
            return BalanceSheet.Assets - BalanceSheet.Liabilities;
        }

        public decimal CalculateEBIT()
        {
            return IncomeStatement.Revenue - IncomeStatement.Expenses;
        }

        public decimal CalculateFreeCashFlow()
        {
            return CashFlowStatement.OperatingActivities - CashFlowStatement.InvestingActivities;
        }

        public decimal CalculateValuation()
        {
            // Placeholder for a more complex valuation calculation
            return CalculateNetWorth() + CalculateEBIT() + CalculateFreeCashFlow();
        }
    }
}