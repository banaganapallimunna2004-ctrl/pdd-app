import api from './api';

const createSensorReading = (payload) => api.post('/sensors', payload);
const getSensorHistory = (farmId) => api.get('/sensors', { params: { farmId } });
const getLatestSensors = () => api.get('/sensors/latest');

export default { createSensorReading, getSensorHistory, getLatestSensors };