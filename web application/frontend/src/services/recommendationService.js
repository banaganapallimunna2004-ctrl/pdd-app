import api from './api';

const getRecommendations = (farmId) => api.get('/recommendations', { params: farmId ? { farmId } : {} });
const createRecommendation = (payload) => api.post('/recommendations', payload);
const updateRecommendation = (id, payload) => api.patch(`/recommendations/${id}`, payload);
const deleteRecommendation = (id) => api.delete(`/recommendations/${id}`);

export default { getRecommendations, createRecommendation, updateRecommendation, deleteRecommendation };