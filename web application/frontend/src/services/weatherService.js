import api from './api';

const getWeatherData = (params = {}) => {
  const queryParams = typeof params === 'string' ? { farmId: params } : params;
  return api.get('/weather', { params: queryParams });
};

const createWeatherData = (payload) => api.post('/weather', payload);
const updateWeatherData = (id, payload) => api.patch(`/weather/${id}`, payload);
const deleteWeatherData = (id) => api.delete(`/weather/${id}`);

export default { getWeatherData, createWeatherData, updateWeatherData, deleteWeatherData };