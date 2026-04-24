import api from './api';

const requestService = {

  /* ─── Public ───────────────────────────────────────────── */

  // GET /requests  (returns verified requests for public browse)
  getAll: (params = {}) =>
    api.get('/requests', { params })
       .then(r => r.data)
       .catch(err => {
         console.error('[requestService.getAll]', err?.response?.status, err?.response?.data?.message);
         throw err;
       }),

  // GET /requests/:id
  getById: (id) =>
    api.get(`/requests/${id}`)
       .then(r => r.data?.data ?? r.data),

  // GET /requests/featured
  getFeatured: (limit = 6) =>
    api.get('/requests/featured', { params: { limit } })
       .then(r => r.data?.data || [])
       .catch(() => []),

  /* ─── Auth-protected ───────────────────────────────────── */

  // GET /requests/my  — requester's own requests
  getMine: (params = {}) =>
    api.get('/requests/my', { params })
       .then(r => r.data)
       .catch(() =>
         // fallback if backend uses /me instead of /my
         api.get('/requests/me', { params }).then(r => r.data)
       ),

  // POST /requests  — create new request (multipart)
  create: (formData) =>
    api.post('/requests', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data?.data ?? r.data),

  // PATCH /requests/:id  — update (multipart)
  update: (id, formData) =>
    api.patch(`/requests/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data?.data ?? r.data),

  // POST /requests/:id/progress
  addProgress: (id, formData) =>
    api.post(`/requests/${id}/progress`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data?.data ?? r.data),

  // GET /funding/case/:id/history
  getFunding: (requestId, params = {}) =>
    api.get(`/funding/case/${requestId}/history`, { params })
       .then(r => r.data)
       .catch(() => ({ data: [] })),
};

export default requestService;


// import api from './api';

// const requestService = {
//   // PUBLIC — get verified requests
//   getAll: (params = {}) =>
//     api.get('/requests/stats', { params })
//        .then(r => r.data)
//        .catch(err => {
//          console.error('[requestService.getAll]', err?.response?.status, err?.response?.data);
//          throw err;
//        }),

//   // PUBLIC — single request
//   getById: (id) =>
//     api.get(`/requests/${id}`)
//        .then(r => r.data?.data || r.data),

//   // PUBLIC — featured requests
//   getFeatured: (limit = 6) =>
//     api.get('/requests/featured', { params: { limit } })
//        .then(r => r.data?.data || [])
//        .catch(() => []),

//   // AUTH — requester's own requests
//   getMine: (params = {}) =>
//     api.get('/requests/my', { params })
//        .then(r => r.data)
//        .catch(async () => {
//          // Try alternative endpoint
//          return api.get('/requests/me', { params }).then(r => r.data);
//        }),

//   // AUTH — create request
//   create: (formData) =>
//     api.post('/requests', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     }).then(r => r.data?.data || r.data),

//   // AUTH — add progress update
//   addProgress: (id, formData) =>
//     api.post(`/requests/${id}/progress`, formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     }).then(r => r.data?.data || r.data),

//   // Funding history for a case
//   getFunding: (requestId, params = {}) =>
//     api.get(`/funding/case/${requestId}/history`, { params })
//        .then(r => r.data)
//        .catch(() => ({ data: [] })),
// };

// export default requestService;