import api from './api';

const getFarms = () => api.get('/farms');
const getFarmById = (id) => api.get(`/farms/${id}`);
const createFarm = (payload) => api.post('/farms', payload);
const updateFarm = (id, payload) => api.patch(`/farms/${id}`, payload);
const deleteFarm = (id) => api.delete(`/farms/${id}`);

export default { getFarms, getFarmById, createFarm, updateFarm, deleteFarm };