using System;
using System.Windows;
using Microsoft.Win32;
using company_valuation_app.Services;

namespace company_valuation_app.Views
{
    public partial class ImportView : Window
    {
        private readonly ExcelImporter _excelImporter;

        public ImportView()
        {
            InitializeComponent();
            _excelImporter = new ExcelImporter();
        }

        private void ImportButton_Click(object sender, RoutedEventArgs e)
        {
            OpenFileDialog openFileDialog = new OpenFileDialog
            {
                Filter = "Excel Files (*.xls;*.xlsx)|*.xls;*.xlsx",
                Title = "Select Financial Statements Excel File"
            };

            if (openFileDialog.ShowDialog() == true)
            {
                try
                {
                    var financialData = _excelImporter.Import(openFileDialog.FileName);
                    // Proceed with the financial data (e.g., pass it to the valuation calculator)
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"Error importing file: {ex.Message}", "Import Error", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
        }
    }
}