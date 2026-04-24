import api from './api';

const notifService = {
  getAll: async (params = {}) => {
    const res = await api.get('/notifications', { params });
    // Return the whole data object so caller can pick shape
    return res.data.data || res.data;
  },
  markRead: async (id) => {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data.data;
  },
  markAll: async () => {
    await api.patch('/notifications/read-all');
  },
};

export default notifService;