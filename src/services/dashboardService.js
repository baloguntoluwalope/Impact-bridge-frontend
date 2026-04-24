import api from './api';

export default {
  admin:      ()  => api.get('/dashboards/admin').then(r => r.data.data),
  donor:      ()  => api.get('/dashboards/donor').then(r => r.data.data),
  ngo:        ()  => api.get('/dashboards/ngo').then(r => r.data.data),
  government: st  => api.get('/dashboards/government', { params:{ state:st } }).then(r => r.data.data),
  platform:   ()  => api.get('/analytics/platform').then(r => r.data.data),
};