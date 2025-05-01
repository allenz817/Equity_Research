using System;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows.Input;

namespace CompanyValuationApp.ViewModels
{
    public class MainViewModel : INotifyPropertyChanged
    {
        private string _excelFilePath;
        private string _valuationResult;

        public string ExcelFilePath
        {
            get => _excelFilePath;
            set
            {
                _excelFilePath = value;
                OnPropertyChanged();
            }
        }

        public string ValuationResult
        {
            get => _valuationResult;
            set
            {
                _valuationResult = value;
                OnPropertyChanged();
            }
        }

        public ICommand ImportCommand { get; }
        public ICommand CalculateValuationCommand { get; }

        public MainViewModel()
        {
            ImportCommand = new RelayCommand(ImportExcelFile);
            CalculateValuationCommand = new RelayCommand(CalculateValuation);
        }

        private void ImportExcelFile()
        {
            // Logic to open file dialog and set ExcelFilePath
        }

        private void CalculateValuation()
        {
            // Logic to calculate valuation based on the imported Excel file
        }

        public event PropertyChangedEventHandler PropertyChanged;

        protected void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }

    public class RelayCommand : ICommand
    {
        private readonly Action _execute;
        private readonly Func<bool> _canExecute;

        public RelayCommand(Action execute, Func<bool> canExecute = null)
        {
            _execute = execute;
            _canExecute = canExecute;
        }

        public event EventHandler CanExecuteChanged;

        public bool CanExecute(object parameter) => _canExecute == null || _canExecute();

        public void Execute(object parameter) => _execute();

        public void RaiseCanExecuteChanged() => CanExecuteChanged?.Invoke(this, EventArgs.Empty);
    }
}