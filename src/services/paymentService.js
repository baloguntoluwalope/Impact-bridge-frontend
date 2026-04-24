import api from './api';
import { v4 as uuid } from 'uuid';

const paymentService = {
  // Initiate payment — generates idempotency key automatically
  initiate: (payload) =>
    api.post('/payments/initiate', payload, {
      headers: { 'X-Idempotency-Key': uuid() },
    }).then(r => r.data?.data || r.data),

  // Verify payment after redirect
  verify: (reference) =>
    api.get(`/payments/verify/${reference}`).then(r => r.data?.data || r.data),

  // Donor's payment history
  history: (params = {}) =>
    api.get('/payments/history', { params })
       .then(r => r.data?.data || r.data)
       .catch(() => []),

  // Admin — all payments
  adminList: (params = {}) =>
    api.get('/admin/payments', { params }).then(r => r.data),
};

export default paymentService;