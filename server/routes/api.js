const express = require('express');
const router = express.Router();
const multer = require('multer');

// Controllers
const uploadController = require('../controllers/uploadController');
const dataController = require('../controllers/dataController');

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/octet-stream',
      'application/zip'
    ];
    
    const allowedExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));
    
    if (allowedMimes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Excel files (.xls, .xlsx) are allowed.'));
    }
  }
});

// ============ UPLOAD ROUTES ============
// Upload Excel file and replace all data
router.post('/upload', upload.single('file'), uploadController.uploadExcel);

// Get upload statistics
router.get('/upload/stats', uploadController.getUploadStats);

// ============ DATA QUERY ROUTES ============
// Get all data (with optional filters)
router.get('/data', dataController.getAllData);

// Get data by category
router.get('/data/category/:category', dataController.getDataByCategory);

// Get aggregated data for charts
router.get('/data/aggregated', dataController.getAggregatedData);

// Get summary statistics
router.get('/data/summary', dataController.getSummaryStats);

// Get trend analysis
router.get('/data/trends', dataController.getTrendAnalysis);

// ============ ADMIN ROUTES ============
// Delete all data (use with caution!)
router.delete('/data/all', dataController.deleteAllData);

// ============ HEALTH CHECK ============
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Sustainability Dashboard API'
  });
});

module.exports = router;