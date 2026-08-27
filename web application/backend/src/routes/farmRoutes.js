const express = require('express');
const { createFarm, getFarms, getFarmById, updateFarm, removeFarm } = require('../controllers/farmController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();
router.use(verifyToken);

router.post('/', createFarm);
router.get('/', getFarms);
router.get('/:id', getFarmById);
router.patch('/:id', updateFarm);
router.delete('/:id', removeFarm);

module.exports = router;
