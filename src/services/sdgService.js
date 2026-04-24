import api from './api';

export default {
  getAll:      ()    => api.get('/sdg').then(r => r.data.data),
  getByNumber: n     => api.get(`/sdg/${n}`).then(r => r.data.data),
  getContent:  (n,p) => api.get(`/sdg/${n}/content`, { params:p }).then(r => r.data),
  getAnalytics:()    => api.get('/sdg/analytics/national').then(r => r.data.data),
};