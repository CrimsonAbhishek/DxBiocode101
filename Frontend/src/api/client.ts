import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Response interceptor for error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.error || 'Network error. Please try again.';
    return Promise.reject(new Error(msg));
  }
);

export default api;

// Typed API calls
export const submitQuote = (data: object) => api.post('/quotes', data);
export const submitContact = (data: object) => api.post('/contact', data);
export const submitTraining = (data: object) => api.post('/training', data);
export const submitCareer = (formData: FormData) =>
  api.post('/careers', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
