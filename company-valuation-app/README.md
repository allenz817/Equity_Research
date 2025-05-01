# Company Valuation App

This application allows users to generate a valuation model for a company by importing financial statements from an Excel file. The app processes three key financial statements: the balance sheet, income statement, and cash flow statement, and provides valuation metrics based on the imported data.

## Features

- Import financial data from Excel files.
- Process and analyze balance sheets, income statements, and cash flow statements.
- Generate valuation reports based on the financial data.
- User-friendly interface for easy navigation and data input.

## Getting Started

### Prerequisites

- .NET 5.0 or later
- WPF (Windows Presentation Foundation) framework
- Excel file containing the financial statements in the required format

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/company-valuation-app.git
   ```
2. Navigate to the project directory:
   ```
   cd company-valuation-app
   ```
3. Restore the project dependencies:
   ```
   dotnet restore
   ```

### Running the Application

To run the application, use the following command:
```
dotnet run --project Company.Valuation.csproj
```

### Usage

1. Launch the application.
2. Navigate to the import view.
3. Upload your Excel file containing the financial statements.
4. View the valuation results in the results view.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for details.