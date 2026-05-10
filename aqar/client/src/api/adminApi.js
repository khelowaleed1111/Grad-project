import api from './axiosInstance';

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  changeUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAllListings: (params) => api.get('/admin/listings', { params }),
  getPendingListings: () => api.get('/admin/listings/pending'),
  approveListing: (id) => api.put(`/admin/listings/${id}/approve`),
  rejectListing: (id) => api.delete(`/admin/listings/${id}`),
  toggleFeature: (id) => api.put(`/admin/listings/${id}/feature`),
};
