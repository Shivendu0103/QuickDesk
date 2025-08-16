import { api } from './api';

export const adminAPI = {
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),
  
  // User management
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
  updateUserStatus: (id, is_active) => api.patch(`/admin/users/${id}/status`, { is_active }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};
