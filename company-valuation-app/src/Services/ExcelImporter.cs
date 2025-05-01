using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using OfficeOpenXml;
using YourNamespace.Models; // Adjust the namespace as necessary

namespace YourNamespace.Services
{
    public class ExcelImporter
    {
        public FinancialModel ImportFinancialData(string filePath)
        {
            var financialModel = new FinancialModel();

            using (var package = new ExcelPackage(new FileInfo(filePath)))
            {
                var balanceSheet = ImportBalanceSheet(package);
                var incomeStatement = ImportIncomeStatement(package);
                var cashFlowStatement = ImportCashFlowStatement(package);

                financialModel.BalanceSheet = balanceSheet;
                financialModel.IncomeStatement = incomeStatement;
                financialModel.CashFlowStatement = cashFlowStatement;
            }

            return financialModel;
        }

        private BalanceSheet ImportBalanceSheet(ExcelPackage package)
        {
            var worksheet = package.Workbook.Worksheets["BalanceSheet"];
            var balanceSheet = new BalanceSheet
            {
                Assets = worksheet.Cells["B2"].GetValue<decimal>(),
                Liabilities = worksheet.Cells["B3"].GetValue<decimal>(),
                Equity = worksheet.Cells["B4"].GetValue<decimal>()
            };
            return balanceSheet;
        }

        private IncomeStatement ImportIncomeStatement(ExcelPackage package)
        {
            var worksheet = package.Workbook.Worksheets["IncomeStatement"];
            var incomeStatement = new IncomeStatement
            {
                Revenue = worksheet.Cells["B2"].GetValue<decimal>(),
                Expenses = worksheet.Cells["B3"].GetValue<decimal>(),
                NetIncome = worksheet.Cells["B4"].GetValue<decimal>()
            };
            return incomeStatement;
        }

        private CashFlowStatement ImportCashFlowStatement(ExcelPackage package)
        {
            var worksheet = package.Workbook.Worksheets["CashFlowStatement"];
            var cashFlowStatement = new CashFlowStatement
            {
                OperatingActivities = worksheet.Cells["B2"].GetValue<decimal>(),
                InvestingActivities = worksheet.Cells["B3"].GetValue<decimal>(),
                FinancingActivities = worksheet.Cells["B4"].GetValue<decimal>()
            };
            return cashFlowStatement;
        }
    }
}