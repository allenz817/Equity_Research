const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

class ExcelGeneratorService {
    async generateExcelReport(financialData, filename) {
        const workbook = new ExcelJS.Workbook();
        
        // Create worksheets for each financial statement
        this.createIncomeStatementSheet(workbook, financialData.incomeStatement, financialData.period);
        this.createBalanceSheetSheet(workbook, financialData.balanceSheet, financialData.period);
        this.createCashFlowSheet(workbook, financialData.cashFlow, financialData.period);
        
        // Save file
        const outputDir = path.join(__dirname, '../../output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        const sanitizedFilename = filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const outputPath = path.join(outputDir, `${sanitizedFilename}_financial_statements.xlsx`);
        await workbook.xlsx.writeFile(outputPath);
        
        return path.basename(outputPath);
    }

    createIncomeStatementSheet(workbook, data, period) {
        const worksheet = workbook.addWorksheet('Income Statement');
        
        // Add title and period
        worksheet.addRow([`Income Statement - ${period}`]);
        worksheet.getRow(1).font = { bold: true, size: 14 };
        worksheet.addRow([]); // Empty row
        
        // Add headers
        worksheet.addRow(['Item', 'Amount (in millions)']);
        worksheet.getRow(3).font = { bold: true };
        worksheet.getRow(3).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6E6FA' }
        };
        
        // Add data
        Object.entries(data || {}).forEach(([key, value]) => {
            worksheet.addRow([key, value]);
        });
        
        // Format columns
        worksheet.getColumn(1).width = 30;
        worksheet.getColumn(2).width = 20;
        worksheet.getColumn(2).numFmt = '#,##0.00';
        
        // Add borders
        this.addBordersToRange(worksheet, 3, 1, 3 + Object.keys(data || {}).length, 2);
    }

    createBalanceSheetSheet(workbook, data, period) {
        const worksheet = workbook.addWorksheet('Balance Sheet');
        
        // Add title and period
        worksheet.addRow([`Balance Sheet - ${period}`]);
        worksheet.getRow(1).font = { bold: true, size: 14 };
        worksheet.addRow([]); // Empty row
        
        worksheet.addRow(['Item', 'Amount (in millions)']);
        worksheet.getRow(3).font = { bold: true };
        worksheet.getRow(3).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6F3FF' }
        };
        
        Object.entries(data || {}).forEach(([key, value]) => {
            worksheet.addRow([key, value]);
        });
        
        worksheet.getColumn(1).width = 30;
        worksheet.getColumn(2).width = 20;
        worksheet.getColumn(2).numFmt = '#,##0.00';
        
        this.addBordersToRange(worksheet, 3, 1, 3 + Object.keys(data || {}).length, 2);
    }

    createCashFlowSheet(workbook, data, period) {
        const worksheet = workbook.addWorksheet('Cash Flow');
        
        // Add title and period
        worksheet.addRow([`Cash Flow Statement - ${period}`]);
        worksheet.getRow(1).font = { bold: true, size: 14 };
        worksheet.addRow([]); // Empty row
        
        worksheet.addRow(['Item', 'Amount (in millions)']);
        worksheet.getRow(3).font = { bold: true };
        worksheet.getRow(3).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6FFE6' }
        };
        
        Object.entries(data || {}).forEach(([key, value]) => {
            worksheet.addRow([key, value]);
        });
        
        worksheet.getColumn(1).width = 30;
        worksheet.getColumn(2).width = 20;
        worksheet.getColumn(2).numFmt = '#,##0.00';
        
        this.addBordersToRange(worksheet, 3, 1, 3 + Object.keys(data || {}).length, 2);
    }

    addBordersToRange(worksheet, startRow, startCol, endRow, endCol) {
        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                const cell = worksheet.getCell(row, col);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            }
        }
    }
}

module.exports = ExcelGeneratorService;
