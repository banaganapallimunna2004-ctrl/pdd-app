import api from './api';

const getMetrics = () => api.get('/admin/metrics');
const getSystemLogs = () => api.get('/admin/logs');
const createLog = (payload) => api.post('/admin/logs', payload);

export default { getMetrics, getSystemLogs, createLog };