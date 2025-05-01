using System.ComponentModel;

namespace CompanyValuationApp.ViewModels
{
    public class ValuationResultViewModel : INotifyPropertyChanged
    {
        private string _valuationResult;
        public string ValuationResult
        {
            get { return _valuationResult; }
            set
            {
                _valuationResult = value;
                OnPropertyChanged(nameof(ValuationResult));
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;

        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        public ValuationResultViewModel()
        {
            // Initialize properties or load default values if necessary
        }

        public void UpdateValuationResult(string result)
        {
            ValuationResult = result;
        }
    }
}