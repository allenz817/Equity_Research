using System.Windows;
using System.Windows.Controls;
using Company.Valuation.ViewModels;

namespace Company.Valuation.Views
{
    public partial class ResultsView : UserControl
    {
        public ResultsView()
        {
            InitializeComponent();
            this.DataContext = new ValuationResultViewModel();
        }

        private void OnExportReportClick(object sender, RoutedEventArgs e)
        {
            // Logic to export the valuation report
        }
    }
}