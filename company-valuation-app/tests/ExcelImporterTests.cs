using System;
using System.IO;
using Xunit;
using company_valuation_app.Services;

namespace company_valuation_app.tests
{
    public class ExcelImporterTests
    {
        private readonly ExcelImporter _excelImporter;

        public ExcelImporterTests()
        {
            _excelImporter = new ExcelImporter();
        }

        [Fact]
        public void Import_ValidExcelFile_ReturnsFinancialData()
        {
            // Arrange
            var filePath = "path/to/valid/excel/file.xlsx";

            // Act
            var result = _excelImporter.Import(filePath);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<FinancialModel>(result);
        }

        [Fact]
        public void Import_InvalidExcelFile_ThrowsFileNotFoundException()
        {
            // Arrange
            var filePath = "path/to/invalid/excel/file.xlsx";

            // Act & Assert
            Assert.Throws<FileNotFoundException>(() => _excelImporter.Import(filePath));
        }

        [Fact]
        public void Import_ExcelFileWithMissingData_ThrowsFormatException()
        {
            // Arrange
            var filePath = "path/to/excel/file/with/missing/data.xlsx";

            // Act & Assert
            Assert.Throws<FormatException>(() => _excelImporter.Import(filePath));
        }
    }
}