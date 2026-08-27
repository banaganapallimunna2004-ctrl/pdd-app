const express = require('express');
const multer = require('multer');
const { createReport, getReports, getLatestReports, exportPdf, exportExcel, updateReport, deleteReport } = require('../controllers/reportController');
const { scanDisease } = require('../controllers/scanController');
const { verifyToken, optionalAuth } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!file || !file.mimetype) {
      return callback(null, true);
    }
    if (!file.mimetype.startsWith('image/')) {
      return callback(new Error('Only image files are allowed.'));
    }
    callback(null, true);
  },
});
const router = express.Router();

// Disease scan endpoint (Accessible from both Web and Mobile app)
router.post('/scan', optionalAuth, upload.single('image'), scanDisease);

// Protected report management endpoints
router.use(verifyToken);
router.post('/', upload.single('image'), createReport);
router.get('/', getReports);
router.get('/latest', getLatestReports);
router.get('/export/pdf', exportPdf);
router.get('/export/excel', exportExcel);
router.patch('/:id', updateReport);
router.delete('/:id', deleteReport);

module.exports = router;
