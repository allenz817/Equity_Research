using System.Windows;

namespace CompanyValuationApp
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new ViewModels.MainViewModel();
        }

        private void ImportButton_Click(object sender, RoutedEventArgs e)
        {
            // Logic to handle file import and trigger valuation calculations
        }

        private void ViewResultsButton_Click(object sender, RoutedEventArgs e)
        {
            // Logic to navigate to results view and display valuation results
        }
    }
}