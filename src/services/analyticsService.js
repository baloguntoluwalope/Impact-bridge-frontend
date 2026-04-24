import api from './api';

const analyticsService = {
  platform: () => api.get('/analytics/platform').then(r => r.data?.data || r.data).catch(() => ({})),
  trends:   (months = 12) => api.get('/analytics/trends', { params: { months } }).then(r => r.data?.data || []).catch(() => []),
  sdgDist:  () => api.get('/analytics/sdg-distribution').then(r => r.data?.data || []).catch(() => []),
  regional: () => api.get('/analytics/regional').then(r => r.data?.data || []).catch(() => []),
};

export default analyticsService;