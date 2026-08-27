const express = require('express');
const { getMetrics, getSystemLogs, createLog } = require('../controllers/adminController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
router.use(verifyToken, authorizeRoles('Admin'));

router.get('/metrics', getMetrics);
router.get('/logs', getSystemLogs);
router.post('/logs', createLog);

module.exports = router;
