using System;
using System.IO;

namespace CompanyValuationApp.Services
{
    public class ReportGenerator
    {
        public void GenerateReport(string filePath, string reportContent)
        {
            if (string.IsNullOrEmpty(filePath) || string.IsNullOrEmpty(reportContent))
            {
                throw new ArgumentException("File path and report content cannot be null or empty.");
            }

            try
            {
                File.WriteAllText(filePath, reportContent);
            }
            catch (Exception ex)
            {
                // Handle exceptions (e.g., log the error)
                throw new InvalidOperationException("Failed to generate report.", ex);
            }
        }

        public string CreateValuationSummary(string companyName, decimal valuation)
        {
            return $"Valuation Report for {companyName}\n" +
                   $"-----------------------------------\n" +
                   $"Estimated Valuation: {valuation:C}\n" +
                   $"Generated on: {DateTime.Now}\n";
        }
    }
}