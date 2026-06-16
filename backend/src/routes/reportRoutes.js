const express = require('express');
const multer = require('multer');
const { createReport, getReports, getLatestReports, exportPdf, exportExcel, updateReport, deleteReport } = require('../controllers/reportController');
const { scanDisease } = require('../controllers/scanController');
const { verifyToken } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      callback(new Error('Only image files are allowed.'));
      return;
    }
    callback(null, true);
  },
});
const router = express.Router();

router.use(verifyToken);
router.post('/scan', upload.single('image'), scanDisease);
router.post('/', upload.single('image'), createReport);
router.get('/', getReports);
router.get('/latest', getLatestReports);
router.get('/export/pdf', exportPdf);
router.get('/export/excel', exportExcel);
router.patch('/:id', updateReport);
router.delete('/:id', deleteReport);

module.exports = router;
