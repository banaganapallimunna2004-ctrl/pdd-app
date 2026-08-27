const express = require('express');
const { createRecommendation, getRecommendations, updateRecommendation, deleteRecommendation } = require('../controllers/recommendationController');
const { verifyToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Public / Mobile recommendation list
router.get('/', optionalAuth, getRecommendations);

// Protected management endpoints
router.use(verifyToken);
router.post('/', createRecommendation);
router.patch('/:id', updateRecommendation);
router.delete('/:id', deleteRecommendation);

module.exports = router;

