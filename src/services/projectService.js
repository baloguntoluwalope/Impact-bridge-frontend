import api from './api';

const projectService = {
  getAll: (params = {}) =>
    api.get('/projects', { params })
       .then(r => r.data)
       .catch(err => {
         console.error('[projectService.getAll]', err?.response?.status, err?.response?.data);
         throw err;
       }),

  getById: (id) =>
    api.get(`/projects/${id}`)
       .then(r => r.data?.data || r.data),

  getMine: (params = {}) =>
    api.get('/projects/me', { params })
       .then(r => r.data)
       .catch(async () => {
         return api.get('/projects/my', { params }).then(r => r.data);
       }),

  create: (formData) =>
    api.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data?.data || r.data),
};

export default projectService;