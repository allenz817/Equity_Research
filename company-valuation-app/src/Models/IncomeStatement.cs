using System;

namespace CompanyValuationApp.Models
{
    public class IncomeStatement
    {
        public decimal Revenue { get; set; }
        public decimal Expenses { get; set; }
        public decimal NetIncome => Revenue - Expenses;

        public IncomeStatement(decimal revenue, decimal expenses)
        {
            Revenue = revenue;
            Expenses = expenses;
        }
    }
}