const express = require('express');
const multer = require('multer');
const extractionController = require('../controllers/extractionController');

const router = express.Router();

// Configure multer for file upload
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});

// Routes
router.post('/financial-data', upload.single('file'), extractionController.extractAndGenerate);
router.get('/download/:filename', extractionController.downloadExcel);
router.get('/status', extractionController.getStatus);

module.exports = router;
