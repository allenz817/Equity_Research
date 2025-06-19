const AIExtractionService = require('../services/aiExtractionService');
const ExcelGeneratorService = require('../services/excelGeneratorService');
const FileProcessor = require('../utils/fileProcessor');
const path = require('path');

class ExtractionController {
    async extractAndGenerate(req, res) {
        try {
            const aiService = new AIExtractionService();
            const excelService = new ExcelGeneratorService();
            const fileProcessor = new FileProcessor();

            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const { buffer, mimetype, originalname } = req.file;
            
            console.log(`Processing file: ${originalname}, type: ${mimetype}, size: ${fileProcessor.getFileSize(buffer)}MB`);
            
            // Validate file type
            if (!fileProcessor.validateFileType(mimetype)) {
                return res.status(400).json({ error: 'Unsupported file type. Please upload PDF, PNG, JPG, or JPEG files.' });
            }
            
            // Process file based on type
            const processedFile = await fileProcessor.processFile(buffer, mimetype);
            
            // Extract financial data using AI
            console.log('Extracting financial data with AI...');
            const financialData = await aiService.extractFinancialData(
                processedFile.buffer, 
                processedFile.mimeType || mimetype, 
                processedFile.isText
            );
            
            // Generate Excel file
            console.log('Generating Excel report...');
            const excelFileName = await excelService.generateExcelReport(
                financialData, 
                originalname.split('.')[0]
            );
            
            res.json({
                success: true,
                data: financialData,
                excelFile: excelFileName,
                message: 'Financial statements extracted successfully'
            });
            
        } catch (error) {
            console.error('Extraction error:', error);
            res.status(500).json({ 
                error: 'Failed to extract financial statements',
                details: error.message 
            });
        }
    }

    async downloadExcel(req, res) {
        try {
            const { filename } = req.params;
            const filePath = path.join(__dirname, '../../output', filename);
            
            // Check if file exists
            const fs = require('fs');
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ error: 'File not found' });
            }
            
            res.download(filePath, filename, (err) => {
                if (err) {
                    console.error('Download error:', err);
                    res.status(500).json({ error: 'Download failed' });
                }
            });
        } catch (error) {
            console.error('Download error:', error);
            res.status(500).json({ error: 'Download failed' });
        }
    }

    async getStatus(req, res) {
        res.json({
            status: 'active',
            message: 'Financial Statement Extractor API is running',
            endpoints: {
                extract: '/api/extract/financial-data',
                download: '/api/extract/download/:filename'
            }
        });
    }
}

module.exports = new ExtractionController();
