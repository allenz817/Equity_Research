using System;

namespace CompanyValuationApp.Models
{
    public class CashFlowStatement
    {
        public decimal OperatingActivities { get; set; }
        public decimal InvestingActivities { get; set; }
        public decimal FinancingActivities { get; set; }

        public decimal NetCashFlow => OperatingActivities + InvestingActivities + FinancingActivities;

        public CashFlowStatement(decimal operatingActivities, decimal investingActivities, decimal financingActivities)
        {
            OperatingActivities = operatingActivities;
            InvestingActivities = investingActivities;
            FinancingActivities = financingActivities;
        }
    }
}