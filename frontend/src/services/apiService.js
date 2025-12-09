import api from './api';

// Student Authentication
export const registerStudent = (data) => api.post('/auth/student/register', data);
export const loginStudent = (data) => api.post('/auth/student/login', data);

// Vendor Authentication
export const registerVendor = (data) => api.post('/auth/vendor/register', data);
export const loginVendor = (data) => api.post('/auth/vendor/login', data);

// Student APIs
export const getAvailableVendors = () => api.get('/student/vendors');
export const getVendorDetails = (id) => api.get(`/student/vendors/${id}`);
export const getVendorMenu = (vendorId) => api.get(`/student/menu/${vendorId}`);
export const placeOrder = (data) => api.post('/student/orders', data);
export const getStudentOrders = (page = 1) => api.get(`/student/orders?page=${page}`);
export const resubmitTransactionId = (orderId, transactionId) =>
  api.patch(`/student/orders/${orderId}/resubmit`, { transactionId });
export const cancelOrder = (orderId) => api.delete(`/student/orders/${orderId}`);
export const completeOrder = (orderId) => api.patch(`/student/orders/${orderId}/complete`);
export const submitReview = (data) => api.post('/student/reviews', data);
export const getVendorReviews = (vendorId, page = 1) =>
  api.get(`/student/vendors/${vendorId}/reviews?page=${page}`);

// Vendor APIs
export const getVendorStats = () => api.get('/vendor/stats');
export const getMenuItems = () => api.get('/vendor/menu');
export const addMenuItem = (formData) =>
  api.post('/vendor/menu', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const updateMenuItem = (id, formData) =>
  api.patch(`/vendor/menu/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const deleteMenuItem = (id) => api.delete(`/vendor/menu/${id}`);
export const updateAvailability = (data) => api.patch('/vendor/availability', data);
export const getVendorOrders = (page = 1) => api.get(`/vendor/orders?page=${page}`);
export const verifyOrder = (orderId, action, rejectionReason) =>
  api.patch(`/vendor/orders/${orderId}/verify`, { action, rejectionReason });
export const updateOrderStatus = (orderId, status) =>
  api.patch(`/vendor/orders/${orderId}/status`, { status });
export const getVendorReviewsList = (page = 1) => api.get(`/vendor/reviews?page=${page}`);
