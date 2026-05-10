import api from './axiosInstance';

/** Strip null / undefined / empty-string values before sending to API */
const clean = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== '' && v !== null && v !== undefined
    )
  );

export const propertiesApi = {
  getAll: (params) => api.get('/properties', { params: clean(params) }),
  getFeatured: () => api.get('/properties/featured'),
  getById: (id) => api.get(`/properties/${id}`),
  getSimilar: (id) => api.get(`/properties/${id}/similar`),
  getMyListings: (params) => api.get('/properties/my-listings', { params: clean(params) }),
  create: (data) =>
    api.post('/properties', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, data) =>
    api.put(`/properties/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/properties/${id}`),
  sendInquiry: (id, data) => api.post(`/properties/${id}/inquire`, data),
};
