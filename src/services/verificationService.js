import api from './api';

const verificationService = {

  /* ── Request verification ─────────────────────────────── */
  reqStats:  ()            => api.get('/verification/stats').then(r => r.data?.data || r.data).catch(() => ({})),
  reqQueue:  (params = {}) => api.get('/requests', { params }).then(r => r.data),

  setUnderReview: (id)       => api.patch(`/verification/${id}/review`).then(r => r.data),
  verifyReq:      (id, body) => api.post(`/verification/${id}/verify`,    body).then(r => r.data),
  rejectReq:      (id, body) => api.post(`/verification/${id}/reject`,    body).then(r => r.data),
  moreInfoReq:    (id, body) => api.post(`/verification/${id}/more-info`, body).then(r => r.data),

  /* ── Project verification ─────────────────────────────── */
  projStats:  ()            => api.get('/verification/stats').then(r => r.data?.data || r.data).catch(() => ({})),
  projQueue:  (params = {}) => api.get('/verification/queue', { params }).then(r => r.data),

  approveProj:  (id, body) => api.post(`/verification/${id}/approve`,   body).then(r => r.data),
  rejectProj:   (id, body) => api.post(`/verification/projects/${id}/reject`,    body).then(r => r.data),
  moreInfoProj: (id, body) => api.post(`/verification/projects/${id}/more-info`, body).then(r => r.data),
};

export default verificationService;