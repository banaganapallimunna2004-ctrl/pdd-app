import api from './api';

const getReports = () => api.get('/reports');
const getLatestReports = () => api.get('/reports/latest');
const createReport = (payload) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  return api.post('/reports', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

const scanDisease = (payload) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  return api.post('/reports/scan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

const updateReport = (id, payload) => api.patch(`/reports/${id}`, payload);
const deleteReport = (id) => api.delete(`/reports/${id}`);
const exportPdf = () => api.get('/reports/export/pdf', { responseType: 'blob' });
const exportExcel = () => api.get('/reports/export/excel', { responseType: 'blob' });

export default { getReports, getLatestReports, createReport, scanDisease, updateReport, deleteReport, exportPdf, exportExcel };
