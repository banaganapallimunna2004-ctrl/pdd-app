const express = require('express');
const { createRecommendation, getRecommendations, updateRecommendation, deleteRecommendation } = require('../controllers/recommendationController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();
router.use(verifyToken);

router.post('/', createRecommendation);
router.get('/', getRecommendations);
router.patch('/:id', updateRecommendation);
router.delete('/:id', deleteRecommendation);

module.exports = router;
