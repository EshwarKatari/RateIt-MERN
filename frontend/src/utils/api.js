import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

api.interceptors.response.use(
  res => res.data,
  err => Promise.reject(err.response?.data || { message: 'Network error' })
);

// Companies
export const getCompanies = (params) => api.get('/companies', { params });
export const getCompany = (id) => api.get(`/companies/${id}`);
export const createCompany = (formData) => api.post('/companies', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateCompany = (id, formData) => api.put(`/companies/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteCompany = (id) => api.delete(`/companies/${id}`);

// Reviews
export const getReviews = (params) => api.get('/reviews', { params });
export const createReview = (data) => api.post('/reviews', data);
export const likeReview = (id) => api.post(`/reviews/${id}/like`);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);

export default api;
