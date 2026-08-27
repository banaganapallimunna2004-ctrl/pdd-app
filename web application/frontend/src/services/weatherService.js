import api from './api';

const getWeatherData = (farmId) => api.get('/weather', { params: farmId ? { farmId } : {} });
const createWeatherData = (payload) => api.post('/weather', payload);
const updateWeatherData = (id, payload) => api.patch(`/weather/${id}`, payload);
const deleteWeatherData = (id) => api.delete(`/weather/${id}`);

export default { getWeatherData, createWeatherData, updateWeatherData, deleteWeatherData };