import api from './api';

const walletService = {

  // Admin — list all wallets  GET /wallets/admin/list  or  GET /wallets
  getAllWallets: (params = {}) =>
    api.get('/wallets/admin/list', { params })
       .then(r => r.data)
       .catch(() =>
         // fallback if backend uses plain /wallets
         api.get('/wallets', { params })
            .then(r => r.data)
            .catch(() => ({ data: [], pagination: { total: 0, page: 1, pages: 0 } }))
       ),

  // GET /wallets/my  — current user's wallet
  getMyWallet: () =>
    api.get('/wallets/my')
       .then(r => r.data?.data ?? r.data)
       .catch(() => null),

  // GET /wallets/case/:id
  getCaseWallet: (id) =>
    api.get(`/wallets/case/${id}`)
       .then(r => r.data?.data ?? r.data)
       .catch(() => null),

  // GET /wallets/project/:id
  getProjectWallet: (id) =>
    api.get(`/wallets/project/${id}`)
       .then(r => r.data?.data ?? r.data)
       .catch(() => null),

  // POST /wallets/:id/allocate
  allocate: (id, body) =>
    api.post(`/wallets/${id}/allocate`, body)
       .then(r => r.data),

  // POST /wallets/:id/expend
  expend: (id, body) =>
    api.post(`/wallets/${id}/expend`, body)
       .then(r => r.data),

  // PATCH /wallets/:id/freeze
  freeze: (id, reason = '') =>
    api.patch(`/wallets/${id}/freeze`, { reason })
       .then(r => r.data),

  // PATCH /wallets/:id/unfreeze
  unfreeze: (id) =>
    api.patch(`/wallets/${id}/unfreeze`)
       .then(r => r.data),
};

export default walletService;

// import api from './api';

// const walletService = {
//   getMyWallet:      ()       => api.get('/wallets/my').then(r => r.data?.data || r.data),
//   getCaseWallet:    (id)     => api.get(`/wallets/case/${id}`).then(r => r.data?.data),
//   getProjectWallet: (id)     => api.get(`/wallets/projects/${id}`).then(r => r.data?.data),
//   getAllWallets:     (p = {}) => api.get('/wallets', { params: p }).then(r => r.data),
//   allocate:         (id, body) => api.post(`/wallets/${id}/allocate`, body).then(r => r.data),
//   expend:           (id, body) => api.post(`/wallets/${id}/expend`, body).then(r => r.data),
// };

// export default walletService;