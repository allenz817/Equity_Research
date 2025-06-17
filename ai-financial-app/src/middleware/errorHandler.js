const errorHandler = (err, req, res, next) => {
    console.error('Error occurred:', err);

    // Multer errors (file upload)
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            error: 'File too large',
            details: 'Maximum file size is 10MB'
        });
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
            error: 'Invalid file field',
            details: 'Expected field name is "file"'
        });
    }

    if (err.message && err.message.includes('Invalid file type')) {
        return res.status(400).json({
            error: 'Invalid file type',
            details: 'Only PDF, PNG, JPG, and JPEG files are allowed'
        });
    }

    // AI service errors
    if (err.message && err.message.includes('AI extraction failed')) {
        return res.status(500).json({
            error: 'AI processing failed',
            details: 'Unable to extract financial data from the document'
        });
    }

    // File processing errors
    if (err.message && err.message.includes('Failed to process file')) {
        return res.status(500).json({
            error: 'File processing failed',
            details: 'Unable to process the uploaded file'
        });
    }

    // Generic error
    res.status(500).json({
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
};

module.exports = errorHandler;
