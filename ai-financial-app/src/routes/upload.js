const express = require('express');
const router = express.Router();

// Basic upload route for future extensions
router.get('/status', (req, res) => {
    res.json({
        status: 'active',
        message: 'Upload service is running'
    });
});

module.exports = router;
