import api from './api';

const chat = (payload) => api.post('/ai/chat', payload);

export default { chat };